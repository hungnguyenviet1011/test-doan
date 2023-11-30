import Category from "../models/Category.js";
import slugify from "slugify";
import Product from "../models/Product.js";

export const createCategory = async (req, res, next) => {
  if (req.body.name) {
    req.body.slug = slugify(req.body.name, {
      lower: true,
    });
  }
  const category = new Category(req.body);
  try {
    await category.save();
    res.status(200).json({
      status: 200,
      message: "Category create successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  const categoryId = req.params.id;
  if (req.body.name) {
    req.body.slug = slugify(req.body.name, {
      lower: true,
    });
  }
  try {
    await Category.findByIdAndUpdate(
      categoryId,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json("Update category success");
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  const categoryId = req.params.id;
  try {
    await Category.findByIdAndDelete(categoryId).then((item) => {
      console.log(item);
      item.products.map(async (product) => {
        try {
          await Product.deleteMany({ _id: product });
        } catch (error) {
          next(error);
        }
      });
    });
    res.status(200).json("Delete successfully completed");
  } catch (error) {
    next(error);
  }
};

export const getCategoryBySlug = async (req, res, next) => {
  const categorySlug = req.params.slug;
  console.log(
    "🚀 ~ file: categories.js:32 ~ getCategoryBySlug ~ categorySlug:",
    categorySlug
  );

  try {
    const category = await Category.findOne({ slug: categorySlug });
    console.log(
      "🚀 ~ file: categories.js:71 ~ getCategoryBySlug ~ category:",
      category
    );
    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req, res, next) => {
  const { ...others } = req.query;
  console.log("🚀 ~ file: categories.js:47 ~ getCategories ~ others:", others);
  try {
    const categories = await Category.find({
      ...others,
    });
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};
