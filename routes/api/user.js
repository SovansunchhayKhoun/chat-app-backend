const express = require('express')
const userController = require('../../controllers/userController')
const router = express.Router()
const verifyJwt = require('../../middleware/verifyJwt')

router.use(verifyJwt)

router.route('/users')
  .get(userController.getUsers)
  .put(userController.updateUser)
  .delete(userController.deleteUser)

router.get('/users/:id', userController.getUser)  
module.exports = router
