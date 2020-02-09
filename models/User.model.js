const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required:[true, 'Username must be unique!'],
      unique: true
    },
    passwordHash: {
      type: String,
    },
    email: {
      type: String,
      required:[true, 'Email must be unique!'],
      unique: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = model('User', userSchema);