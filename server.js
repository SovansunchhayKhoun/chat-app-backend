const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const cors = require("cors");
const corsOption = require("./config/corsOptions");
const { logger } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const api = require('./config/api')
const connect = require("./config/conDB");
require("dotenv").config();
const PORT = 5000;
const mongoose = require("mongoose");

connect();
app.use(logger);
app.use(cors(corsOption));
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(api)

app.use("/api", require("./routes/api/auth"));
app.use("/api", require("./routes/api/user"));
app.use("/api", require("./routes/api/chat"));

app.use(errorHandler);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:5000', process.env.CLIENT_URL, process.env.APP_URL],
    methods: ["POST", "GET", "PUT", "DELETE"],
  },
});

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  io.on("connection", (socket) => {
    socket.on("send_message", (data) => {
      console.log(data);
      socket.broadcast.emit("receive_message", data);
    });
  });

  server.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
  });
});
