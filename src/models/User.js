const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UsersSchema = new Schema({
  googleId: String,
  email: {
    type: String,
    requiered: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    trim: true
  }
})

module.exports = mongoose.model('Users', UsersSchema)
