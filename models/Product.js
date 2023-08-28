import mongoose from "mongoose";
const { Schema } = mongoose;

const productSchema = new Schema(
  {
    title: {
      type: String,
      require: true,
      unique: true,
    },
    price: {
      type: Number,
      require: true,
    },
    desc: {
      type: String,
      require: true,
    },
    new: {
      type: Boolean,
      default: true,
    },
    size: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "size",
      },
    ],
    images: {
      type: [String],
    },
    quantity: {
      type: Number,
    },
    thumbnail: {
      type: String,
    },
    original_price: {
      type: Number,
    },
    feature: {
      type: Boolean,
      default: false,
    },
    slug: {
      type: String,
      unique: true,
    },
    origin: {
      type: String,
      required: true,
    },
    material: {
      type: String,
      required: true,
    },
    color: {
      type: [String],
      require: true,
    },
    categories: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "categories",
    },
    selled: {
      type: Number,
    },
  },
  { timestamps: true }
);

export default mongoose.model("product", productSchema);
