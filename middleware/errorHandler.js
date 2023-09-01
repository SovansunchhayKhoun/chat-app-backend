const { logEvent } = require('./logger')
const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')

const errorHandler = (err, req, res, next) => {
  const messageItem = `${err.name}: ${err.message}\t${req.method}\t${req.headers.origin}\t${req.url}`
  logEvent(messageItem, 'errLog.log')

  console.log(err.stack)

  const status = req.statusCode ?? 500

  res.status(status)
  res.json({ message: err.message })
}

module.exports = errorHandler