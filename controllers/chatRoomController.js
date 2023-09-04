const Chat = require("../model/Chat");
const User = require("../model/User");
const mongoose = require("mongoose");
const checkId = require("../config/checkId");
const Message = require("../model/Message");

const getChatRooms = async (_req, res) => {
  try {
    const chatRooms = await Chat.find().populate(["senderId", "receiverId"]);
    if (chatRooms.length === 0)
      return res
        .status(204)
        .json({ message: "There is no existing Chat Rooms" });
    return res.status(200).json({ chatRooms });
  } catch (err) {
    console.log(err);
  }
};

const createChatRoom = async (req, res) => {
  const { senderId, receiverId } = req.body;

  if (!senderId)
    return res.status(400).json({ message: "SenderId is required" });
  if (!receiverId)
    return res.status(400).json({ message: "ReceiverId is required" });

  if (!checkId(senderId))
    return res.status(400).json({ message: "SenderId is not valid", senderId });
  if (!checkId(receiverId))
    return res
      .status(400)
      .json({ message: "ReceiverId is not valid", receiverId });

  const user1 = await User.findOne({ _id: senderId }).exec();
  const user2 = await User.findOne({ _id: receiverId }).exec();

  if (!user1)
    return res.status(404).json({ message: `User id ${senderId} not found` });

  if (!user2)
    return res.status(404).json({ message: `User id ${receiverId} not found` });

  const chatRoom =
    (await Chat.findOne({ senderId, receiverId }).exec()) ||
    (await Chat.findOne({ senderId: receiverId, receiverId: senderId }).exec());

  if (chatRoom) {
    const messages = await Message.find({ chatRoomId: chatRoom._id });
    return res.status(200).json({ chatRoom, messages });
  }

  const newChat = new Chat({
    senderId,
    receiverId,
  });
  const result = await newChat.save();
  return res.status(201).json({ result, messages: [] });
};

module.exports = { createChatRoom, getChatRooms };
