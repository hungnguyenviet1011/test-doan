import mongoose from "mongoose";

const orderItemSchema = mongoose.Schema({
  quantity: {
    type: Number,
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
  },
  size: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
});

export default mongoose.model("orderItem", orderItemSchema);
