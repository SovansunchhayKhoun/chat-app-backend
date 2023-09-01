const { default: mongoose, mongo } = require('mongoose')
const User = require('../model/User')
const bcrypt = require('bcrypt')

const getUsers = async (req, res) => {
  try {
    const users = await User.find()
    if (users.length === 0)
      return res.status(204).json({ message: 'No users found' })
    return res.json(users)
  } catch (err) {
    console.log(err)
  }
}

const updateUser = async (req, res) => {
  // validate if id is passed
  if (!req?.body?.id) {
    return res.status(400).json({ message: 'ID parameter is required' })
  }
  const { id, firstname, lastname, password, username } = req.body
  const isValidID = mongoose.Types.ObjectId.isValid(id) // check if id is valid
  if (isValidID) {
    const user = await User.findOne({ _id: id }).exec()
    if (!user)
      return res
        .status(204)
        .json({ message: `User with the ID: ${id} doesn't exist.` })
    try {
      
      const result = await user.updateOne(
        {
          firstname: firstname?.trim(),
          lastname: lastname?.trim(),
          password: password && bcrypt.hashSync(password?.trim(), 10),
          username: username?.trim()
        },
        {
          runValidators: true
        }
      )
      return res.json(result)
    } catch (err) {
      console.log(err)
      return res.status(400).json(err.errors)
    }
  } else {
    return res.status(400).json({ message: 'Invalid User id' })
  }
}

const deleteUser = async (req, res) => {
  try {
    if (!req?.body?.id)
      return res.status(400).json({ message: 'ID param is required' })
    const { id } = req.body

    const user = await User.findOne({ _id: id }).exec()

    if (!user)
      return res
        .status(204)
        .json({ message: `User with the ID: ${id} doesn't exist.` })

    const result = await user.deleteOne({ _id: id })

    return res.status(200).json(result)
  } catch (err) {
    console.log(err)
  }
}

const getUser = async (req, res) => {
  try {
    if (!req?.params?.id)
      return res.status(400).json({ message: 'ID param is required' })
    const { id } = req.params

    const isValid = mongoose.Types.ObjectId.isValid(id)
    if (isValid) {
      const user = await User.findOne({ _id: id }).exec()

      if (!user)
        return res
          .status(204)
          .json({ message: `User with the ID: ${id} doesn't exist.` })

      return res.status(200).json(user)
    } else {
      return res.status(400).json({ error: 'Invalid ID parameter.' })
    }
  } catch (err) {
    console.log(err)
  }
}

module.exports = { getUsers, getUser, updateUser, deleteUser }
