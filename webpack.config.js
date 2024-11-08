const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development', // atau 'production'
  entry: './client-web.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true, // Membersihkan folder dist setiap build baru
  },
  module: {
    rules: [
      // Rule untuk meng-handle file CSS
      {
        test: /\.css$/i, // Cocokkan file dengan ekstensi .css
        use: ['style-loader', 'css-loader'], // Gunakan loader untuk CSS
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html', // Masukkan file HTML utama
    }),
  ],
};
