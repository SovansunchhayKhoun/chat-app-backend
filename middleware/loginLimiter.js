const rateLimit = require('express-rate-limit')
const { logEvent } = require('./logger')

const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: {
    message: 'Too many login attempts from this IP, pleaase try again after 60s',
    handler: (req, res, next, options) => {
      logEvent(`Too many requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log')
      res.status(options.statusCode).send(options.message)
    }
  },
  standardHeaders: true,
  legacyHeaders: false
})

module.exports = loginLimiter