const express = require("express");
const app = express();
const io = require("socketio");
const path = require("path");
const cors = require("cors");
const corsOption = require("./config/corsOptions");
const { logger } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const connect = require("./config/conDB");
const PORT = 5000;
const mongoose = require("mongoose");
require("dotenv").config();

app.use(logger);

connect();

app.use(cors(corsOption));
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));

app.use("/api", require("./routes/api/auth"));
app.use("/api", require("./routes/api/user"));
app.use("/api", require("./routes/api/chat"));

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
  });
});
