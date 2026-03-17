const asyncHandler = require('express-async-handler');
const Product      = require('../models/Product');

/**
 * @desc   Get all active products (with optional search + category filter)
 * @route  GET /api/products
 * @access Private
 */
const getProducts = asyncHandler(async (req, res) => {
  const { search, category, lowStock } = req.query;

  const filter = { isActive: true };
  if (search)   filter.name     = { $regex: search.trim(), $options: 'i' };
  if (category) filter.category = category.trim();
  if (lowStock === 'true') filter.stock = { $lt: 5 };

  const products = await Product.find(filter).sort({ name: 1 }).lean();
  res.json({ success: true, count: products.length, data: products });
});

/**
 * @desc   Get single product
 * @route  GET /api/products/:id
 * @access Private
 */
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id, isActive: true });
  if (!product) { res.status(404); throw new Error('Product not found'); }
  res.json({ success: true, data: product });
});

/**
 * @desc   Create product
 * @route  POST /api/products
 * @access Admin
 */
const createProduct = asyncHandler(async (req, res) => {
  const { name, category, price, stock, unit } = req.body;

  const exists = await Product.findOne({ name: { $regex: `^${name.trim()}$`, $options: 'i' }, isActive: true });
  if (exists) { res.status(409); throw new Error(`Product "${name}" already exists`); }

  const product = await Product.create({ name: name.trim(), category, price, stock, unit });
  res.status(201).json({ success: true, data: product });
});

/**
 * @desc   Update product
 * @route  PUT /api/products/:id
 * @access Admin
 */
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id, isActive: true });
  if (!product) { res.status(404); throw new Error('Product not found'); }

  const allowed = ['name', 'category', 'price', 'stock', 'unit'];
  allowed.forEach((field) => {
    if (req.body[field] !== undefined) product[field] = req.body[field];
  });

  await product.save();
  res.json({ success: true, data: product });
});

/**
 * @desc   Soft-delete product
 * @route  DELETE /api/products/:id
 * @access Admin
 */
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id, isActive: true });
  if (!product) { res.status(404); throw new Error('Product not found'); }
  product.isActive = false;
  await product.save();
  res.json({ success: true, data: { message: `"${product.name}" removed from catalog` } });
});

/**
 * @desc   Get product categories list
 * @route  GET /api/products/categories
 * @access Private
 */
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Product.distinct('category', { isActive: true });
  res.json({ success: true, data: categories.sort() });
});

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct, getCategories };
