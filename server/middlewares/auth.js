const jwt = require("jsonwebtoken");

const createTokenVerifier = (strict = false) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      if (strict && req.params.userId !== req.user.userId) {
        return res.status(401).json({ message: "Unauthorized Access" });
      }
      // console.log(req.user);
      next();
    } catch (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
  };
};

exports.verifyToken = createTokenVerifier(false); // No userId match required
exports.private_verifyToken = createTokenVerifier(true); // Enforce userId match
