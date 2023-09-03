const { format } = require('date-fns')
const { v4: uuid } = require('uuid')
const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')

const logEvent = async (message, logFileName) => {
  const date = format(new Date, "yyyy/MM/dd\tHH:mm:ss")
  const messageItem = `${uuid()}\t${date}\t${message}\n`

  const logPath = path.join(__dirname, '..', 'logs')
  const filePath = path.join(__dirname, '..', 'logs', logFileName)
  try {
    if(!fs.existsSync(logPath)) {
      await fsPromises.mkdir(logPath)
    }
    await fsPromises.appendFile(filePath, messageItem)
  } catch (err) {
    console.log(err)
  }
}

const logger = (req, res, next) => {
  const message = `${req.method}\t${req.headers.origin}\t${req.url}`
  logEvent(message, 'reqLog.log')
  // console.log(message)
  next()
}

module.exports = { logger, logEvent }