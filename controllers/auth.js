import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";

export const register = async (req, res, next) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(req.body.password, salt);
  try {
    const user = new User({
      ...req.body,
      password: hash,
    });
    const { password, ...others } = user._doc;

    await user.save();
    res.status(200).json({
      status: 200,
      others,
    });
  } catch (error) {
    next(error);
  }
};

const generateTokens = (payload) => {
  //createJWT
  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN, {
    expiresIn: "1h",
  });
  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN, {
    expiresIn: "30d",
  });

  return {
    accessToken,
    refreshToken,
  };
};
export const login = async (req, res, next) => {
  const email = req.body.email;

  try {
    const user = await User.findOne({
      email: email,
    });
    if (!user) {
      return next(createError(404, "User not exist"));
    }

    const compare = await bcrypt.compare(req.body.password, user.password);
    if (!compare) {
      next(createError(401, "Email or Password not Exist"));
    }
    const { password, ...others } = user._doc;
    console.log("🚀 ~ file: auth.js:51 ~ login ~ user:", user);
    const tokens = generateTokens({
      id: user._id,
      role: user.isAdmin,
    });
    console.log("🚀 ~ file: auth.js:51 ~ login ~ tokens:", tokens);
    res.json({
      status: 200,
      ...others,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    next(createError(401, "Token not Exist"));
  }

  try {
    const refreshTokenUser = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN
    );

    if (!refreshTokenUser) {
      next(createError(403, "Token not authorization"));
    }

    const accessToken = await jwt.sign(
      { id: refreshTokenUser.id, role: refreshTokenUser.role },
      process.env.ACCESS_TOKEN,
      { expiresIn: "1h" }
    );
    res.status(200).json({
      status: 200,
      accessToken: accessToken,
    });
  } catch (error) {
    next(error);
  }
};
