const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: 'Firstname is required!',
    minLengthLength: [2, 'Invalid firstname: {MINLENGTH} letters minimum'],
    maxLength: [64, 'Firstname must not exceed {MAXLENGTH} letters'],
    validate: {
      validator: v => v.length >= 2 && v.length <= 64,
      message: props => `Invalid firstname: 2 letters minimum and 64 letters maximum`
    }
  },
  lastname: {
    type: String,
    required: 'Lastname is required!',
    minLength: [2, 'Invalid lastname: {MINLENGTH} letters minimum'],
    maxLength: [64, 'Lastname must not exceed {MAXLENGTH} letters'],
    validate: {
      validator: v => v.length >= 2 && v.length <=64,
      message: props => `Invalid lastname: 2 letters minimum and 64 letters maximum`
    }
  },
  username: {
    type: String,
    required: 'Username is required!',
    minLength: [4, 'Invalid username: {MINLENGTH} letters minimum'],
    maxLength: [64, 'Username must not exceed {MAXLENGTH} letters'],
    validate: {
      validator: v => v.length >= 4 && v.length <=64,
      message: props => `Invalid username: 4 letters minimum and 64 letters maximum`
    }
  },
  password: {
    type: String,
    required: 'Password is required!',
    minLength: [8, 'Invalid password: {MINLENGTH} letters minimum'],
    maxLength: [64, 'Password must not exceed {MAXLENGTH} letters'],
    validate: {
      validator: v => v.length >= 8 && v.length <=64,
      message: props => `Invalid password: 8 letters minimum and 64 letters maximum`
    }
  },
  refreshToken: String,
}, {timestamps: true})

module.exports = mongoose.model('User', userSchema)