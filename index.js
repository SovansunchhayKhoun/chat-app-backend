const express = require("express");
const app = express();
const router = express.Router();
const serverless = require("serverless-http");
const http = require("http");
require("dotenv").config();
const { Server } = require("socket.io");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 5000;
const corsOption = require("./config/corsOptions");
const { logger } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const connect = require("./config/conDB");

connect();
app.use(logger);
app.use(cors(corsOption));
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));

router.get("/", (_req, res) => {
  return res
    .status(200)
    .send(
      `"Api is running on ${process.env.PORT}, Client URL ${process.env.CLIENT_URL}"`
    );
});
router.use(require("./routes/api/auth"));
router.use(require("./routes/api/user"));
router.use(require("./routes/api/chat"));

app.use("/api", router);
app.use(errorHandler);

const server = http.createServer(app);
console.log(process.env.PORT);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:5000",
      process.env.CLIENT_URL,
      process.env.PORT,
    ],
    methods: ["POST", "GET", "PUT", "DELETE"],
  },
});

io.on("connection", (socket) => {
  socket.on("send_message", (data) => {
    socket.broadcast.emit("receive_message", data);
  });
});

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  server.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
  });
});

module.exports.handler = serverless(server);
