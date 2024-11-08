const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Load protobuf
const PROTO_PATH = path.join(__dirname, 'user.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const userProto = grpc.loadPackageDefinition(packageDefinition).user;

// Initialize SQLite database
const dbPath = path.join(__dirname, 'users.db'); // Menggunakan file database
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    // Membuat tabel jika belum ada
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE
    )`);
});

// Implement gRPC methods
const createUser = (call, callback) => {
    const { name, email } = call.request;
    db.run(`INSERT INTO users (name, email) VALUES (?, ?)`, [name, email], function (err) {
        if (err) {
            return callback({ code: grpc.status.INTERNAL, details: err.message });
        }
        callback(null, { message: `User created with ID: ${this.lastID}` });
    });
};

const getUser = (call, callback) => {
    db.get(`SELECT * FROM users WHERE id = ?`, [call.request.id], (err, row) => {
        if (err) {
            return callback({ code: grpc.status.NOT_FOUND, details: err.message });
        }
        callback(null, row);
    });
};

const getAllUsers = (call, callback) => {
    db.all(`SELECT * FROM users`, [], (err, rows) => {
        if (err) {
            return callback({ code: grpc.status.INTERNAL, details: err.message });
        }
        callback(null, { users: rows });
    });
};

const updateUser = (call, callback) => {
    const { id, name, email } = call.request;
    db.run(`UPDATE users SET name = ?, email = ? WHERE id = ?`, [name, email, id], function (err) {
        if (err) {
            return callback({ code: grpc.status.INTERNAL, details: err.message });
        }
        callback(null, { message: 'User updated successfully' });
    });
};

const deleteUser = (call, callback) => {
    db.run(`DELETE FROM users WHERE id = ?`, [call.request.id], function (err) {
        if (err) {
            return callback({ code: grpc.status.INTERNAL, details: err.message });
        }
        callback(null, { message: 'User deleted successfully' });
    });
};

// Start gRPC server
const server = new grpc.Server();
server.addService(userProto.UserService.service, {
    CreateUser: createUser,
    GetUser: getUser,
    UpdateUser: updateUser,
    DeleteUser: deleteUser,
    GetAllUsers: getAllUsers,
});

const PORT = 9090;
server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), () => {
    server.start();
    console.log(`Server running at http://localhost:${PORT}`);
});
