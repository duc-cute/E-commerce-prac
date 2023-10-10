/** @format */

const asyncHandler = require("express-async-handler");
const Product = require("../models/product");
const slugifyVietnamese = require("../ultils/slugifyVietnamese");
const createProduct = asyncHandler(async (req, res) => {
  if (Object.keys(req.body).length === 0) throw new Error("Missing inputs");
  if (req.body && req.body.title)
    req.body.slug = slugifyVietnamese(req.body.title);
  const newProduct = await Product.create(req.body);
  return res.status(200).json({
    success: newProduct ? true : false,
    newProduct: newProduct ? newProduct : "Can't not create new product",
  });
});

const getProduct = asyncHandler(async (req, res) => {
  const { uid } = req.params;
  const product = await Product.findById({ _id: uid });
  return res.status(200).json({
    success: product ? true : false,
    product: product ? product : "Can't find product",
  });
});
const getProducts = asyncHandler(async (req, res) => {
  const queryObj = { ...req.query };
  const excludedFields = ["page", "sort", "limit", "fields"];
  excludedFields.forEach((el) => delete queryObj[el]); //Delete fields unnecessary in query object

  //Format Query to order to in correct syntax mongoose
  let queryString = JSON.stringify(queryObj);
  queryString = queryString.replace(
    /\b(gte|gt|lte|lt)\b/g,
    (match) => `$${match}`
  );
  const formatQueries = JSON.parse(queryString);

  //Filtering
  if (queryObj?.title)
    formatQueries.title = { $regex: queryObj.title, $options: "i" };

  try {
    let query = Product.find(formatQueries);

    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    }

    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    }
    //Paginate
    const limit = req.query.limit || process.env.LIMIT_PAGE;
    const page = req.query.page || 1;
    const skip = (page - 1) * limit;
    query.skip(skip).limit(limit);

    const products = await query;
    const countProducts = await Product.countDocuments(formatQueries);

    return res.status(200).json({
      success: products ? true : false,
      products: products ? products : "Can't find product",
      counts: countProducts,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
});
const updateProduct = asyncHandler(async (req, res) => {
  const { uid } = req.params;
  if (Object.keys(req.body).length === 0) throw new Error("Missing inputs");
  const updateProduct = await Product.findByIdAndUpdate(
    { _id: uid },
    req.body,
    { new: true }
  );
  return res.status(200).json({
    success: updateProduct ? true : false,
    updateProduct: updateProduct ? updateProduct : "Can't not update product",
  });
});
const deleteProduct = asyncHandler(async (req, res) => {
  const { uid } = req.params;
  const deleteProduct = await Product.findByIdAndDelete({ _id: uid });
  return res.status(200).json({
    success: deleteProduct ? true : false,
    deleteProduct: deleteProduct ? deleteProduct : "Can't not delete product",
  });
});
const ratings = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, comment, pid } = req.body;
  if (!star || !pid) throw new Error("Missing inputs");
  const ratingProduct = await Product.findById(pid);
  const alreadyProduct = ratingProduct?.ratings?.find(
    (el) => el.postBy.toString() === _id
  );
  if (alreadyProduct) {
    await Product.updateOne(
      {
        ratings: { $elemMatch: alreadyProduct },
      },
      {
        $set: { "ratings.$.star": star, "ratings.$.comment": comment },
      }
    );
  } else {
    await Product.findByIdAndUpdate(
      pid,
      {
        $push: { ratings: { star, comment, postBy: _id } },
      },
      { new: true }
    );
  }
  const updatedProduct = await Product.findByIdAndUpdate(pid);
  const ratingCount = updatedProduct.ratings.length;
  const sumRating = updatedProduct.ratings.reduce(
    (sum, rating) => sum + +rating.star,
    0
  );
  updatedProduct.totalRating = Math.round((sumRating * 10) / ratingCount) / 10;
  await updatedProduct.save();
  return res.status(200).json({
    success: true,
    updatedProduct,
  });
});
module.exports = {
  createProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  ratings,
};
