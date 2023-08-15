import Category from "../models/Category.js";

export const createCategory = async (req, res, next) => {
  if (req.body.name) {
    req.body.slug = slugify(req.body.name, {
      lower: true,
    });
  }
  const category = new Category(req.body);
  try {
    await category.save();
    res.status(200).json("Category create success");
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  const categoryId = req.params.id;
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

export const deleteCategory = async (req, res, next) => {};

export const getCategoryBySlug = async (req, res, next) => {
  const categorySlug = req.params.slug;
  console.log(
    "🚀 ~ file: categories.js:32 ~ getCategoryBySlug ~ categorySlug:",
    categorySlug
  );

  try {
    const category = await Category.findOne({ slug: categorySlug });
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
