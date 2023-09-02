const Chat = require("../model/Chat");
const User = require("../model/User");
const mongoose = require("mongoose");
const checkId = require("../config/checkId");

const getChatRooms = async (req, res) => {
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
  if (!senderId || !receiverId)
    return res
      .status(400)
      .json({ message: "Please provide a senderId and a receiverId" });

  const isValidSenderId = mongoose.Types.ObjectId.isValid(senderId);
  const isValidReceiverId = mongoose.Types.ObjectId.isValid(receiverId);

  if (isValidSenderId && isValidReceiverId) {
    const user1 = await User.findOne({ _id: senderId }).exec();
    const user2 = await User.findOne({ _id: receiverId }).exec();

    if (!user2)
      return res
        .status(404)
        .json({ message: `User id ${receiverId} not found` });

    if (!user1)
      return res.status(404).json({ message: `User id ${senderId} not found` });

    const duplicateChat =
      (await Chat.findOne({ senderId, receiverId }).exec()) ||
      (await Chat.findOne({
        senderId: receiverId,
        receiverId: senderId,
      }).exec());

    if (!duplicateChat) {
      const newChat = new Chat({
        senderId,
        receiverId,
      });
      await newChat.save();
      return res.status(201).json({ newChat });
    } else {
      let chat = await Chat.findOne({ senderId, receiverId }).exec();
      if (!chat)
        chat = await Chat.findOne({
          senderId: receiverId,
          receiverId: senderId,
        }).exec();
      return res.status(409).json({ chat });
    }
  } else {
    return res.status(404).json({
      message: "Provided sender/receiver IDs are not valid",
      senderId,
      receiverId,
    });
  }
};

const getChatRoom = async (req, res) => {
  const { senderId, receiverId } = req.body;
  if (!senderId)
    return res.status(400).json({ message: "SenderId is required" });
  if (!receiverId)
    return res.status(400).json({ message: "ReceiverId is required" });

  if(!checkId(senderId)) return res.status(400).json({ message: "SenderId is not valid", senderId });
  if(!checkId(receiverId)) return res.status(400).json({ message: "ReceiverId is not valid", receiverId });

  const chatRoom =
    (await Chat.findOne({ senderId, receiverId }).exec()) ||
    (await Chat.findOne({ senderId: receiverId, receiverId: senderId }).exec());

  if (!chatRoom) await createChatRoom(req, res);

  return res.status(200).json({ chatRoom });
};

module.exports = { createChatRoom, getChatRooms, getChatRoom };
