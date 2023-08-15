import jwt from "jsonwebtoken";
import { createError } from "./error.js";
export const verifyToken = async (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    next(createError(401, "Token not exsit"));
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    next(createError(401, "Token not exsit"));
  }
  try {
    const user = jwt.verify(token, process.env.ACCESS_TOKEN);
    console.log("🚀 ~ file: verifyToken.js:14 ~ verifyToken ~ user:", user);
    // jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
    //   console.log(
    //     "🚀 ~ file: verifyToken.js:14 ~ jwt.verify ~ user:",
    //     req.user
    //   );
    if (!user) {
      return next(createError(403, "Token invalid!"));
    }
    req.user = user;
    next();
    // });
  } catch (error) {
    next(error);
  }
};

export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role) {
      next();
    } else {
      return next(createError(403, "You are not authorization"));
    }
  });
};
