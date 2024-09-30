const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.protect = (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Not authorized" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("Token verification error:", err);
      return res.status(401).json({ message: "Token invalid" });
    }
    // Assuming decoded contains userId or id field from token payload
    req.user = decoded.id; // Adjust the field based on your token structure
    next();
  });
};
