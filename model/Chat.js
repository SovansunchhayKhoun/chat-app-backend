const mongoose = require('mongoose')
const chatSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.ObjectId,
    required: 'Please specify sender _id',
    ref: 'User'
  },
  receiverId: {
    type: mongoose.Schema.ObjectId,
    required: 'Please specify receiver _id',
    ref: 'User'
  }
}, {
  timestamps: true
})

module.exports = mongoose.model("Chat", chatSchema)