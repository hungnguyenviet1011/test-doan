import Product from "../models/Product.js";
import Category from "../models/Category.js";
import slugify from "slugify";

export const createProduct = async (req, res, next) => {
  const categoryId = req.body.categories;

  if (req.body.title) {
    req.body.slug = slugify(req.body.title, {
      lower: true,
    });
  }
  console.log(
    "🚀 ~ file: products.js:10 ~ createProduct ~ req.body.slug:",
    req.body.slug
  );
  const product = new Product(req.body);
  try {
    const productDB = await product.save();
    try {
      await Category.findByIdAndUpdate(categoryId, {
        $push: { products: product._id },
      });
    } catch (error) {
      next(error);
    }
    res.status(200).json(productDB);
  } catch (error) {
    next(error);
  }
};
export const updateProduct = async (req, res, next) => {
  const slugProduct = req.params.slug;
  try {
    const updateProduct = await Product.findOneAndUpdate(
      {
        slug: slugProduct,
      },
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updateProduct);
  } catch (error) {
    next(error);
  }
};

// deleteProducts chưa hoàn thành
export const deleteProduct = async (req, res, next) => {
  const idProduct = req.params.id;
  try {
    await Product.findByIdAndDelete(idProduct);
    res.status(200).json("Delete Product success");
  } catch (error) {
    next(error);
  }
};
export const getProduct = async (req, res, next) => {
  const slugProduct = req.params.slug;
  try {
    const product = await Product.findOne({ slug: slugProduct });
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};
export const getProducts = async (req, res, next) => {
  const { min, max, categories } = req.query;
  const limit = parseInt(req.query.limit) || 9;
  const page = parseInt(req.query.page) || 1;
  let sort = req.query.sort;
  console.log("🚀 ~ file: products.js:71 ~ getProducts ~ sort:", sort);

  try {
    req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

    let sortBy = {};
    if (sort[1]) {
      if (sort[1] === "asc") {
        sortBy[sort[0]] = 1;
      }
      if (sort[1] === "desc") {
        sortBy[sort[0]] = -1;
      }
    } else {
      sortBy[sort[0]] = 1;
    }
    console.log("🚀 ~ file: products.js:77 ~ getProducts ~ sortBy:");
    let lop = parseInt(sortBy.title);
    console.log("🚀 ~ file: products.js:84 ~ getProducts ~ lop:", lop);
    console.log("🚀 ~ file: products.js:87 ~ getProducts ~ sortBy:", sortBy);

    let query;
    if (req.query.categories) {
      query = Product.aggregate([
        {
          $match: {
            categories: categories,
            price: { $gt: min || 1, $lt: max || 9999999 },
          },
        },
        {
          $facet: {
            metaData: [
              {
                $count: "totalDocuments",
              },
            ],
            data: [
              {
                $skip: (page - 1) * limit,
              },
              {
                $limit: limit,
              },
              {
                $sort: sortBy,
              },
            ],
          },
        },
      ]);
    } else {
      query = Product.aggregate([
        {
          $match: {
            price: { $gt: min || 1, $lt: max || 9999999 },
          },
        },
        {
          $facet: {
            metaData: [
              {
                $count: "totalDocuments",
              },
            ],
            data: [
              {
                $skip: (page - 1) * limit,
              },
              {
                $limit: limit,
              },
              {
                $sort: sortBy,
              },
            ],
          },
        },
      ]);
    }

    const product = await query;
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

export const searchProduct = async (req, res, next) => {
  const search = req.query.search || "";
  const min = parseInt(req.query.min) || 1;
  const max = parseInt(req.query.max) || 999999;
  let sort = req.query.sort;
  try {
    req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

    let sortBy = {};
    if (sort[1]) {
      sortBy[sort[0]] = sort[1];
    } else {
      sortBy[sort[0]] = "asc";
    }
    const products = await Product.find({
      title: { $regex: new RegExp(search, "i") },
      price: { $gt: min, $lt: max },
    }).sort(sortBy);
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};
