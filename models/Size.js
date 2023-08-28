import mongoose from "mongoose";

const sizeSchema = mongoose.Schema({
  quantity: {
    type: Number,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  selled: {
    type: Number,
  },
});

export default mongoose.model("size", sizeSchema);
