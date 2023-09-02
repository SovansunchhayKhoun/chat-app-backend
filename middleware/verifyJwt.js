const jwt = require('jsonwebtoken')

const verifyJwt = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization

  if(!authHeader)  return res.status(403).json({ message: "Forbidden" })

  const token = authHeader.split(' ')[1]
  
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
    if(err) return res.status(403).json({ message: "Forbidden" })
    req.user = decoded.user
    next()
  })
}

module.exports = verifyJwt