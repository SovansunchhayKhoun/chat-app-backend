const allowedOrigins = [
  'http://localhost:5000',
  'http://localhost:3000',
  process.env.APP_URL,
  process.env.CLIENT_URL
]

module.exports =  allowedOrigins