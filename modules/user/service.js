const { MD5, AES } = require("crypto-js");

module.exports = {
  encrypt_password: function (password) {
    let hashed = MD5(password.toString()).toString();
    let encrypted = AES.encrypt(
      hashed,
      process.env.PASSWORDS_SECRET
    ).toString();

    return encrypted;
  },

  compare_passwords: function (password, encrypted_password) {
    if (!password || !encrypted_password) return false;

    let decrypted_hash = AES.decrypt(
      encrypted_password,
      process.env.PASSWORDS_SECRET
    ).toString(Utf8);
    let hashed = MD5(password.toString()).toString();

    if (decrypted_hash == hashed) {
      return true;
    }

    return false;
  },
};
