const mongoose = require("mongoose");
const { format } = require("date-fns");
const timeSent = format(new Date(), "yyyy/MM/dd HH:mm:ss");

const ObjectId = mongoose.Schema.ObjectId;

const messageSchema = new mongoose.Schema(
  {
    chatRoomId: {
      type: ObjectId,
      required: "Chat Room needs to be specified",
      ref: "Chat",
    },
    senderId: {
      type: ObjectId,
      required: "Please specify a sender",
      ref: "User",
      // validate: {
      //   validator: (value) => value ,
      //   message: "Please specify a sender",
      // },
    },
    receiverId: {
      type: ObjectId,
      required: "Please specify a receiver",
      ref: "User",
      // validate: {
      //   validator: (value) => value === "",
      //   message: "Please specify a receiver",
      // },
    },
    messageContent: {
      type: String,
      minLength: [1, "Message needs to be at least {MINLENGTH} letter long"],
      maxLength: [1000, "Message cannot exceed {MAXLENGTH} letter"],
      // validate: {
      //   validator: (value) => {
      //     value = value.replace(/\s/g, "");
      //     if (value.length > 1 && value.length <= 1000) return true;
      //     return false;
      //   },
      //   message: ({value}) => {
      //     if (value.length < 1)
      //       return "Message needs to be at least 1 letter long";
      //     if (value.length > 1000) return "Message cannot exceed 1000 letter";
      //   },
      // },
    },
    isRead: {
      type: Boolean,
      default: 0,
    },
    timeSent: {
      type: String,
      default: timeSent,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Message", messageSchema);
