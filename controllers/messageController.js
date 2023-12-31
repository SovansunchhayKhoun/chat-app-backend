const Message = require("../model/Message");
const User = require("../model/User");
const Chat = require("../model/Chat");
const checkId = require("../config/checkId");

const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().populate("chatRoomId");
    if (messages.length === 0)
      return res.status(204).json({ message: "No messages found" });

    return res.status(200).json({ messages });
  } catch (err) {
    console.log(err);
  }
};

const getChatRoomMessages = async (req, res) => {
  const { chatRoomId } = req.params;
  if (!chatRoomId)
    return res.status(400).json({ message: "ChatRoomId param is requiredd" });

  if (!checkId(chatRoomId))
    return res.status(400).json({ message: "Invalid ChatRoomId" });

  try {
    const messages = await Message.find({ chatRoomId }).populate([
      "chatRoomId",
    ]);
    if (messages.length === 0)
      return res
        .status(204)
        .json({ message: `No existing messages in ChatRoom ${chatRoomId}` });
    return res.status(200).json({ messages });
  } catch (err) {
    console.log(err);
  }
};

const createMessage = async (req, res) => {
  const { messageContent, senderId, receiverId, chatRoomId, timeSent } =
    req.body;
  try {
    if (messageContent.trim() === "")
      return res.status(400).json({ message: "messageContent is required" });
    if (!senderId)
      return res.status(400).json({ message: "senderId is required" });
    if (!receiverId)
      return res.status(400).json({ message: "receiverId is required" });
    if (!chatRoomId)
      return res.status(400).json({ message: "chatroomId is required" });
    if (!timeSent)
      return res.status(400).json({ message: "timeSent is required" });

    if (!checkId(senderId))
      return res.status(400).json({ message: "senderId is invalid" });
    if (!checkId(receiverId))
      return res.status(400).json({ message: "receiverId is invalid" });
    if (!checkId(chatRoomId))
      return res.status(400).json({ message: "chatRoomId is invalid" });

    const isReceiver = await User.findOne({ _id: receiverId }).exec();
    const isSender = await User.findOne({ _id: senderId }).exec();
    const isChatRoom = await Chat.findOne({ _id: chatRoomId }).exec();

    if (!isReceiver)
      return res.status(404).json({ message: "Unknown receiver", receiverId });
    if (!isSender)
      return res.status(404).json({ message: "Unknown sender", senderId });
    if (!isChatRoom)
      return res.status(404).json({ message: "Unknown chatroom", chatRoomId });

    const newMessage = new Message({
      messageContent,
      senderId,
      receiverId,
      chatRoomId,
      timeSent
    });

    const result = await newMessage.save();
    const chatRoomMsg = await Message.find({ chatRoomId });
    return res.status(201).json({ message: result, chatRoomMsg });
  } catch (err) {
    console.log(err);
  }
};

module.exports = { createMessage, getChatRoomMessages, getMessages };
