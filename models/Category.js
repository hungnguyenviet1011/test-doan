import mongoose from "mongoose";
const { Schema } = mongoose;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    products: {
      type: [String],
    },
    slug: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("categories", categorySchema);
