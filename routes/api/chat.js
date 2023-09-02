const express = require("express");
const router = express.Router();
const chatRoomController = require("../../controllers/chatRoomController");
const verifyJwt = require("../../middleware/verifyJwt");
const messageController = require("../../controllers/messageController");

// router.use(verifyJwt)
router
  .route("/chat-rooms")
  .get(chatRoomController.getChatRooms)
  .post(chatRoomController.createChatRoom);

router.route("/chat-room").post(chatRoomController.getChatRoom);

router
  .route("/messages")
  .get(messageController.getMessages)
  .post(messageController.createMessage);

router
  .route("/chat-messages/:chatRoomId")
  .get(messageController.getChatRoomMessages);

module.exports = router;
