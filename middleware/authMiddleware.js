// authMiddleware.js
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {

    const token = req.headers.authorization.split(" ")[1] || req.cookies.token;

    console.log(token);
    
    if (!token) {
      return res.status(401).json({ message: "Unauthorized access" });
    }
   
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.body.userId = decode.userId;
    if (!decode) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = verifyToken;
