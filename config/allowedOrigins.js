const allowedOrigins = [
  'http://localhost:5000',
  'http://localhost:3000',
  process.env.PORT,
  process.env.CLIENT_URL,
]

module.exports =  allowedOrigins