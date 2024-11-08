import { UserServiceClient } from './generated/user_grpc_web_pb.js';
import { User, UserId, Empty } from './generated/user_pb.js';
import displayUsers from './src/template/displayUsers.js';
import displayUpdates from './src/template/displayUpdate.js';
const client = new UserServiceClient('http://localhost:8080');
import './src/style/main.css';

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  document
    .getElementById('create-user-btn')
    .addEventListener('click', createUser);

  displayUpdates('', '', '', updateUser);
  document.getElementById('reset').addEventListener('click', () => {
    document.getElementById('name-update').value = '';
    document.getElementById('email-update').value = '';

    document.getElementById('name-input').value = '';
    document.getElementById('email-input').value = '';
  });
  getAllUsers();
});

// Fungsi untuk membuat pengguna baru
async function createUser() {
  const name = document.getElementById('name-input').value;
  const email = document.getElementById('email-input').value;

  const user = new User();
  user.setName(name);
  user.setEmail(email);

  try {
    const response = await new Promise((resolve, reject) => {
      client.createUser(user, {}, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      });
    });
    console.log('User created:', response.toObject());
    // Setelah berhasil membuat pengguna, langsung ambil semua pengguna
    getAllUsers();
    addSuccess();

    document.getElementById('name-input').value = '';
    document.getElementById('email-input').value = '';
  } catch (error) {
    console.error('Error creating user:', error);
  }
}

// Fungsi untuk mengambil pengguna berdasarkan ID
async function getUser(idUser) {
  const userId = new UserId();
  userId.setId(idUser);

  try {
    const user = await new Promise((resolve, reject) => {
      client.getUser(userId, {}, (err, user) => {
        if (err) {
          reject(err);
        } else {
          resolve(user);
        }
      });
    });
    const userUpdate = user.toObject();
    displayUpdates(
      userUpdate.id,
      userUpdate.name,
      userUpdate.email,
      updateUser
    );
  } catch (error) {
    console.error('Error getting user:', error);
  }
}

// Fungsi untuk memperbarui pengguna
async function updateUser(idInput, nameInput, emailInput) {
  const user = new User();
  user.setId(idInput);
  user.setName(nameInput);
  user.setEmail(emailInput);

  try {
    const response = await new Promise((resolve, reject) => {
      client.updateUser(user, {}, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      });
    });
    getAllUsers();
    updateSuccess();

    document.getElementById('name-update').value = '';
    document.getElementById('email-update').value = '';
  } catch (error) {
    console.error('Error updating user:', error);
  }
}

// Fungsi untuk menghapus pengguna
async function deleteUser(idUser) {
  const userId = new UserId();
  userId.setId(idUser);

  try {
    const response = await new Promise((resolve, reject) => {
      client.deleteUser(userId, {}, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      });
    });
    getAllUsers();
    deleteSuccess();
  } catch (error) {
    console.error('Error deleting user:', error);
  }
}

// Fungsi untuk mengambil semua pengguna
async function getAllUsers() {
  try {
    const userList = await new Promise((resolve, reject) => {
      client.getAllUsers(new Empty(), {}, (err, userList) => {
        if (err) {
          reject(err);
        } else {
          resolve(userList.getUsersList());
        }
      });
    });

    displayUsers(userList);
    buttonItem();
    showUpdateNumber();
  } catch (error) {
    console.error('Error getting all users:', error);
  }
}

const buttonItem = () => {
  document.querySelectorAll('.delete').forEach((button) => {
    button.addEventListener('click', (event) => {
      const idUser = event.target.getAttribute('data-id');
      deleteUser(idUser);
    });
  });
};

const showUpdateNumber = () => {
  document.querySelectorAll('.data-item').forEach((button) => {
    button.addEventListener('click', (event) => {
      const idUser = event.target.getAttribute('data-id');
      getUser(idUser);
    });
  });
};

const addSuccess = () => {
  const add = document.getElementById('addSuccess');
  add.style.display = 'block';

  setTimeout(() => {
    add.style.display = 'none';
  }, 3000); // Waktu tampil dalam milidetik
};

const updateSuccess = () => {
  const update = document.getElementById('updateSuccess');
  update.style.display = 'block';

  setTimeout(() => {
    update.style.display = 'none';
  }, 3000); // Waktu tampil dalam milidetik
};

const deleteSuccess = () => {
  const del = document.getElementById('deleteSuccess');
  del.style.display = 'block';

  setTimeout(() => {
    del.style.display = 'none';
  }, 3000); // Waktu tampil dalam milidetik
};
