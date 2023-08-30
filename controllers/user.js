import User from "../models/User.js";
import { createError } from "../utils/error.js";
import bcrypt from "bcryptjs";

export const updateUser = async (req, res, next) => {
  const userId = req.params.id;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: req.body },
      { new: true }
    );
    return res.status(200).json({
      status: 200,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  const userId = req.params.id;
  try {
    await User.findByIdAndDelete(userId);

    return res.status(200).json({
      status: 200,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(createError(404, "User not exist"));
    }
    res.status(200).json({
      status: 200,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({
      status: 200,
      users,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserStats = async (req, res, next) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    const stats = await User.aggregate([
      {
        $match: { createdAt: { $gte: lastYear } },
      },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);
    res.status(200).json({
      status: 200,
      stats,
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  const id = req.body.id;
  const password = req.body.password;
  const oldPassword = req.body.oldPassword;
  console.log(
    "🚀 ~ file: user.js:103 ~ resetPassword ~ oldPassword:",
    oldPassword
  );
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  console.log("🚀 ~ file: user.js:104 ~ resetPassword ~ hash:", hash);

  try {
    if (oldPassword) {
      const DB = await User.find({
        _id: id,
        password: oldPassword,
      });
      console.log("🚀 ~ file: user.js:113 ~ resetPassword ~ DB:", DB);
      // if (DB) {
      //   const userDB = await User.findByIdAndUpdate(id, {
      //     password: hash,
      //   });
      //   return res.status(200).json(userDB);
      // } else {
      //   return next(createError(401, "Old password not match"));
      // }
    }
  } catch (error) {
    next(error);
  }
};
