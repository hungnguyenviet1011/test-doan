import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    lastName: {
      type: String,
      require: true,
    },
    firstName: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    phoneNumber: {
      type: String,
      require: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("user", userSchema);
