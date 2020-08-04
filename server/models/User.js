const mongoose = require('mongoose');
const encryption = require('../util/encryption');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: Schema.Types.String,
    required: true
  },
  hashedPassword: {
    type: Schema.Types.String,
    required: true
  },
  username: {
    type: Schema.Types.String,
    required: true
  },
  salt: {
    type: Schema.Types.String,
    required: true
  },
  likedProductsIds: [{
    type: Schema.Types.Array
  }]
});

userSchema.method({
  authenticate: function (password) {
    const currentHashedPass = encryption.generateHashedPassword(this.salt, password);

    return currentHashedPass === this.hashedPassword;
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;