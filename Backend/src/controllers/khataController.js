const asyncHandler = require('express-async-handler');
const Khata        = require('../models/Khata');
const logger       = require('../utils/logger');

/**
 * @desc   Get all active khata entries (summary — no transactions)
 * @route  GET /api/khata
 * @access Private
 */
const getAllKhata = asyncHandler(async (req, res) => {
  const { search, sortBy = 'customerName', order = 'asc' } = req.query;

  const filter = { isActive: true };
  if (search) filter.customerName = { $regex: search.trim(), $options: 'i' };

  const sortOrder = order === 'desc' ? -1 : 1;
  const allowedSort = ['customerName', 'totalBaki', 'updatedAt', 'createdAt'];
  const sortField = allowedSort.includes(sortBy) ? sortBy : 'customerName';

  const khatas = await Khata.find(filter)
    .select('customerName phone address totalBaki updatedAt createdAt')
    .sort({ [sortField]: sortOrder })
    .lean();

  res.json({ success: true, count: khatas.length, data: khatas });
});

/**
 * @desc   Get single khata with full transaction history
 * @route  GET /api/khata/:id
 * @access Private
 */
const getKhataById = asyncHandler(async (req, res) => {
  const khata = await Khata.findOne({ _id: req.params.id, isActive: true })
    .populate('transactions.createdBy', 'name email')
    .populate('createdBy', 'name');

  if (!khata) {
    res.status(404);
    throw new Error('Khata entry not found');
  }

  res.json({ success: true, data: khata });
});

/**
 * @desc   Create new khata entry
 * @route  POST /api/khata
 * @access Admin
 */
const createKhata = asyncHandler(async (req, res) => {
  const { customerName, phone, address } = req.body;

  // Prevent duplicate customer names (case-insensitive)
  const existing = await Khata.findOne({
    customerName: { $regex: `^${customerName.trim()}$`, $options: 'i' },
    isActive: true,
  });
  if (existing) {
    res.status(409);
    throw new Error(`A customer named "${customerName}" already exists`);
  }

  const khata = await Khata.create({
    customerName: customerName.trim(),
    phone:        (phone || '').trim(),
    address:      (address || '').trim(),
    createdBy:    req.user._id,
  });

  logger.info(`Khata created: ${customerName} by ${req.user.email}`);
  res.status(201).json({ success: true, data: khata });
});

/**
 * @desc   Update khata customer info
 * @route  PUT /api/khata/:id
 * @access Admin
 */
const updateKhata = asyncHandler(async (req, res) => {
  const khata = await Khata.findOne({ _id: req.params.id, isActive: true });
  if (!khata) { res.status(404); throw new Error('Khata entry not found'); }

  const { customerName, phone, address } = req.body;

  // Check for duplicate name if changing
  if (customerName && customerName.trim().toLowerCase() !== khata.customerName.toLowerCase()) {
    const exists = await Khata.findOne({
      customerName: { $regex: `^${customerName.trim()}$`, $options: 'i' },
      isActive: true,
      _id: { $ne: khata._id },
    });
    if (exists) { res.status(409); throw new Error(`Customer "${customerName}" already exists`); }
    khata.customerName = customerName.trim();
  }

  if (phone    !== undefined) khata.phone   = phone.trim();
  if (address  !== undefined) khata.address = address.trim();

  await khata.save();
  res.json({ success: true, data: khata });
});

/**
 * @desc   Add a transaction (debit/credit) to a khata
 * @route  POST /api/khata/:id/transaction
 * @access Admin
 */
const addTransaction = asyncHandler(async (req, res) => {
  const { type, amount, note, date } = req.body;

  const khata = await Khata.findOne({ _id: req.params.id, isActive: true });
  if (!khata) { res.status(404); throw new Error('Khata entry not found'); }

  khata.transactions.push({
    type,
    amount: Number(amount),
    note:   (note || '').trim(),
    date:   date ? new Date(date) : new Date(),
    createdBy: req.user._id,
  });

  khata.recalcBaki();
  await khata.save();

  logger.info(`Transaction added: ${type} ₹${amount} on ${khata.customerName} by ${req.user.email}`);
  res.status(201).json({ success: true, data: khata });
});

/**
 * @desc   Delete a specific transaction from a khata
 * @route  DELETE /api/khata/:id/transaction/:txId
 * @access Admin
 */
const deleteTransaction = asyncHandler(async (req, res) => {
  const khata = await Khata.findOne({ _id: req.params.id, isActive: true });
  if (!khata) { res.status(404); throw new Error('Khata entry not found'); }

  const txIndex = khata.transactions.findIndex(
    (t) => t._id.toString() === req.params.txId
  );
  if (txIndex === -1) { res.status(404); throw new Error('Transaction not found'); }

  khata.transactions.splice(txIndex, 1);
  khata.recalcBaki();
  await khata.save();

  res.json({ success: true, data: { message: 'Transaction deleted', khata } });
});

/**
 * @desc   Soft-delete a khata entry
 * @route  DELETE /api/khata/:id
 * @access Admin
 */
const deleteKhata = asyncHandler(async (req, res) => {
  const khata = await Khata.findOne({ _id: req.params.id, isActive: true });
  if (!khata) { res.status(404); throw new Error('Khata entry not found'); }

  khata.isActive = false;
  await khata.save();

  logger.info(`Khata soft-deleted: ${khata.customerName} by ${req.user.email}`);
  res.json({ success: true, data: { message: `${khata.customerName} removed from khata book` } });
});

/**
 * @desc   Get khata stats (admin dashboard)
 * @route  GET /api/khata/stats
 * @access Admin
 */
const getKhataStats = asyncHandler(async (req, res) => {
  const [stats] = await Khata.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id:            null,
        totalCustomers: { $sum: 1 },
        totalBaki:      { $sum: '$totalBaki' },
        highBaki:       { $sum: { $cond: [{ $gt: ['$totalBaki', 500] }, 1, 0] } },
        cleared:        { $sum: { $cond: [{ $lte: ['$totalBaki', 0] }, 1, 0] } },
      },
    },
    { $project: { _id: 0 } },
  ]);

  res.json({ success: true, data: stats || { totalCustomers: 0, totalBaki: 0, highBaki: 0, cleared: 0 } });
});

module.exports = {
  getAllKhata,
  getKhataById,
  createKhata,
  updateKhata,
  addTransaction,
  deleteTransaction,
  deleteKhata,
  getKhataStats,
};
