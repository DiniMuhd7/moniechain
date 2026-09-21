const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { parseAuthorizationHeader } = require("../utils/parseAuthorizationHeader");

const protect = async (req, res, next) => {
  const token = parseAuthorizationHeader(req.get("authorization"));
  if (!token) {
    return res.status(401).json({ success: false, message: "Authorization token required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || !user.tokens.some((entry) => entry.token === token)) {
      return res.status(401).json({ success: false, message: "Session is no longer valid" });
    }
    req.user = user;
    return next();
  } catch (error) {
    const message = error.name === "TokenExpiredError" ? "Session expired, try sign in" : "Invalid authorization token";
    return res.status(401).json({ success: false, message });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user.userType !== "admin") {
    return res.status(403).json({ success: false, message: "Admins only" });
  }
  return next();
};

module.exports = { protect, requireAdmin };
