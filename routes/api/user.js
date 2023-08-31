const express = require('express')
const userController = require('../../controllers/userController')
const router = express.Router()

router.route('/users')
  .get(userController.getUsers)
  .post(userController.createUser)
  .put(userController.updateUser)
  .delete(userController.deleteUser)
  
router.get('/users/:id', userController.getUser)  
module.exports = router
