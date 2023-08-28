import Product from "../models/Product.js";
import Category from "../models/Category.js";
import slugify from "slugify";
import mongoose from "mongoose";

export const createProduct = async (req, res, next) => {
  const categoryId = req.body.categories;
  console.log(
    "🚀 ~ file: products.js:8 ~ createProduct ~ categories:",
    req.body.size
  );

  if (req.body.title) {
    req.body.slug = slugify(req.body.title, {
      lower: true,
    });
  }

  try {
    // const sizeItem = Promise.all(
    //   req.body.size.map(async (size) => {
    //     let sizeOne = new Size({
    //       size: size.size,
    //       quantity: size.quantity,
    //     });
    //     sizeOne = await sizeOne.save();

    //     return sizeOne._id;
    //   })
    // );

    // const sizeDB = await sizeItem;

    const product = new Product({
      ...req.body,
      // size: sizeDB,
    });
    const productDB = await product.save();
    try {
      await Category.findByIdAndUpdate(categoryId, {
        $push: { products: product._id },
      });
    } catch (error) {
      next(error);
    }
    res.status(200).json({ status: 200, productDB });
  } catch (error) {
    next(error);
  }
};
export const updateProduct = async (req, res, next) => {
  const slugProduct = req.params.slug;
  try {
    // if (req.body.size) {
    //   req.body.size.map(async (item) => {
    //     console.log(
    //       "🚀 ~ file: products.js:57 ~ req.body.size.map ~ item:",
    //       item
    //     );
    //     return await Size.updateMany(
    //       { _id: item._id },
    //       { $set: { quantity: item.quantity } },
    //       { new: true }
    //     );
    //   });
    // }
    const updateProduct = await Product.findOneAndUpdate(
      {
        slug: slugProduct,
      },
      { $set: req.body },
      { new: true }
    ).populate("size");
    res.status(200).json({
      status: 200,
      updateProduct,
    });
  } catch (error) {
    next(error);
  }
};

// deleteProducts chưa hoàn thành
export const deleteProduct = async (req, res, next) => {
  const idProduct = req.params.id;
  try {
    await Product.findByIdAndRemove(idProduct).then((productItem) => {
      console.log(
        "🚀 ~ file: products.js:73 ~ awaitProduct.findByIdAndDelete ~ product:",
        productItem
      );
      productItem?.categories.map(async (categories) => {
        const item = await Category.aggregate([
          {
            $match: { _id: { $in: [categories] } },
          },
          {
            $unwind: "$products",
          },
          { $match: { products: { $eq: idProduct } } },
        ]);
        console.log(
          "🚀 ~ file: products.js:94 ~ productItem?.categories.map ~ item:",
          item
        );
        console.log(
          "🚀 ~ file: products.js:105 ~ productItem?.categories.map ~ categories:",
          categories
        );

        const DB = await Category.updateMany(
          {},
          { $pull: { products: item.products } },
          { multi: true }
        );
        console.log(
          "🚀 ~ file: products.js:108 ~ productItem?.categories.map ~ DB:",
          DB
        );
        res.status(200).json(DB);
      });
    });
  } catch (error) {
    next(error);
  }
};
export const getProduct = async (req, res, next) => {
  const slugProduct = req.params.slug;
  try {
    const product = await Product.findOne({ slug: slugProduct }).populate(
      "size"
    );
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};
export const getProductParams = async (req, res, next) => {
  const { ...otthers } = req.query;
  console.log(
    "🚀 ~ file: products.js:69 ~ getProductParams ~ otthers:",
    otthers
  );

  try {
    const products = await Product.find({
      ...otthers,
    });

    return res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};
export const getProducts = async (req, res, next) => {
  let categories = new mongoose.Types.ObjectId(req.query.categories);
  console.log(
    "🚀 ~ file: products.js:107 ~ getProducts ~ categories:",
    typeof categories
  );
  const newProduct = req.query.new;
  console.log(
    "🚀 ~ file: products.js:70 ~ getProducts ~ newProduct:",
    typeof newProduct
  );
  const min = parseInt(req.query.min) || 1;
  const max = parseInt(req.query.max) || 999999999;
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
    let query;
    if (req.query.categories) {
      query = Product.aggregate([
        {
          $match: {
            categories: categories,
            price: { $gt: min, $lt: max },
          },
        },
        {
          $lookup: {
            from: "categories",
            localField: "categories",
            foreignField: "_id",
            as: "categories",
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
            price: { $gt: min, $lt: max },
          },
        },
        {
          $lookup: {
            from: "categories",
            localField: "categories",
            foreignField: "_id",
            as: "categories",
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

    console.log("🚀 ~ file: products.js:173 ~ getProducts ~ query:", query);
    // const test = await Product.populate(query, {
    //   path: "categories",
    //   model: categories,
    // });

    const product = await query;
    res.status(200).json({
      metaData: product[0].metaData,
      data: product[0].data,
    });
  } catch (error) {
    next(error);
  }
};

export const searchProduct = async (req, res, next) => {
  const search = req.query.search || "";
  const min = parseInt(req.query.min) || 1;
  const max = parseInt(req.query.max) || 99999999;
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
