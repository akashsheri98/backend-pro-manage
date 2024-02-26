const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    try {
        // const reqHeader = req.header("Authorization").split(" ");
        // const token = reqHeader[1];
        const token = req.cookies.token;
        console.log(token);
        if (!token) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decode);
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