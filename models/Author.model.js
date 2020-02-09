const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const authorSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    nationality: String,
    birthday: Date,
    pictureUrl: String
  },
  {
    // keeps record when is created and updated
    timestamps: true
  }
);

// const Author = model('Author', authorSchema);
// module.exports = Author;

module.exports = model('Author', authorSchema);
