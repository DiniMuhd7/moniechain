const jwt = require("jsonwebtoken");
const User = require("../models/User");
const protect = async (req, res, next) => {
  const authorization = req.get("authorization");
  const [scheme, token] = authorization ? authorization.split(/\s+/, 2) : [];

  // Keep JWT as a supported scheme while accepting the standard Bearer scheme.
  if (!token || !["Bearer", "JWT"].includes(scheme)) {
    return res.status(401).json({ success: false, message: "Authorization token is required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.status !== "active") {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    // A signed-out token must not remain usable until its JWT expiry.
    if (!user.tokens.some((entry) => entry.token === token)) {
      return res.status(401).json({ success: false, message: "Session is no longer valid" });
    }

    req.user = user;
    return next();
  } catch (error) {
    const message = error.name === "TokenExpiredError" ? "Session expired, sign in again" : "Invalid authorization token";
    return res.status(401).json({ success: false, message });
  }
};

module.exports = { protect };
