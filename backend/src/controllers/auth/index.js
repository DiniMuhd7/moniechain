const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const { goodResponse, badResponse } = require("../../utils/response");
const increaseInventory = require("../../utils/increaseInventory");
const sendNotification = require("../../utils/sendNotification");

const registerUser = async (req, res) => {
  const { fullName, email, password, country, language, avatar } = req.body;

  if (!password || !email || !fullName || !email.trim() || !fullName.trim()) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const normalizedEmail = email.trim().toLowerCase();

  const userExists = await User.findOne({ email: normalizedEmail });
  //  const userExists = await User.isThisEmailInUse(email);
  if (userExists) {
    return badResponse(
      res,
      "User already exists",
      {},
      409
    );
  }

  try {
    const user = await User.create({
      fullName,
      email: normalizedEmail,
      password,
      country,
      language,
      avatar,
    });

    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      user.tokens = [{ token, signedAt: Date.now().toString() }];
      await user.save();
      return goodResponse(
        res,
        "User created successfully, Login to continue",
        {
          user: {
            fullName: user.fullName,
            email: user.email,
            userType: user.userType,
            score: user.score,
            usdBalance: user.usdBalance,
            country: user.country,
            language: user.language,
            avatar: user.avatar || "",
          },
          token,
        },
        201
      );
    } else {
      console.log("Something went wrong while creating user");
      return badResponse(
        res,
        "Invalid user data",
        { error: error.message },
        200
      );
    }
  } catch (error) {
    console.log("error", error);
    return badResponse(res, "Error occured", { error: error.message }, 500);
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return badResponse(res, "All fields are required", {}, 400);
  }
  const user = await User.findOne({ email: email.trim().toLowerCase() });
  if (user && (await user.comparePassword(password))) {
    if (user.status !== "active") {
      return badResponse(res, "This account is inactive", {}, 403);
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    let oldTokens = user.tokens || [];

    if (oldTokens.length) {
      oldTokens = oldTokens.filter((t) => {
        const timeDiff = (Date.now() - parseInt(t.signedAt)) / 1000;
        if (timeDiff < 86400) {
          return t;
        }
      });
    }
    // 💡 Add daily login points logic
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of the day

    let lastLoginDate = user.lastLoginDate
      ? new Date(user.lastLoginDate)
      : null;

    if (!lastLoginDate || lastLoginDate < today) {
      // pointsToAdd = 10;
      //user.points = (user.points || 0) + pointsToAdd;
      lastLoginDate = new Date(); // update login date
      await increaseInventory(user._id, "Pesticide", 20);
      await increaseInventory(user._id, "Fertilizer", 20);
      await increaseInventory(user._id, "Water", 20);
      await sendNotification(user._id, "Daily Login Gift");
    }

    await User.findByIdAndUpdate(user._id, {
      tokens: [...oldTokens, { token, signedAt: Date.now().toString() }],
      lastLoginDate,
    });
    const userInfo = {
      fullName: user.fullName,
      email: user.email,
      userType: user.userType,
      score: user.score,
      usdBalance: user.usdBalance,
      country: user.country,
      language: user.language,
      isPremium: user.isPremium,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      avatar: user.avatar ? user.avatar : "",
      notification_token: user.notification_token
        ? user.notification_token
        : "",
    };
    return goodResponse(
      res,
      "Login successfully",
      { user: userInfo, token },
      200
    );
  } else {
    return badResponse(res, "Invalid credentials", {}, 401);
  }
};

const signOut = async (req, res) => {
  if (req.headers && req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return badResponse(res, "Authorization fail!", {}, 401);
    }

    const tokens = req.user.tokens;

    const newTokens = tokens.filter((t) => t.token !== token);

    await User.findByIdAndUpdate(req.user._id, { tokens: newTokens });
    return goodResponse(res, "SIgn out successfully", {}, 200);
  }
};

const getTokens = async (req, res) => {
  const users = await User.find({});

  return res.json({
    usersList: users.map((user) => ({
      id: user._id,
      name: user.fullName,
      email: user.email,
      notification_token: user.notification_token,
    })),
    tokenList: users.map((user) => user.notification_token),
    success: true,
    message: "Users list generated successfully!!!",
  });
};

module.exports = { registerUser, loginUser, signOut, getTokens };
