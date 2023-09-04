// YOUR_BASE_DIRECTORY/netlify/functions/api.ts

const serverless = require("serverless-http");
const express = require("express");

const api = express();
const apiHandler = serverless(api)

const router = express.Router();
router.get("/hello", (req, res) => res.send("Hello World!"));

api.use("/api/", router);

module.exports = apiHandler
