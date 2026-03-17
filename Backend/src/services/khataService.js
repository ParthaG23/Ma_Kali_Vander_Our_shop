const Khata = require('../models/Khata');

/**
 * Get aggregated khata stats.
 * Used by admin dashboard.
 */
const getKhataStats = async () => {
  const [stats] = await Khata.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id:            null,
        totalCustomers: { $sum: 1 },
        totalBaki:      { $sum: '$totalBaki' },
        highBaki:       { $sum: { $cond: [{ $gt: ['$totalBaki', 500] }, 1, 0] } },
        cleared:        { $sum: { $cond: [{ $lte: ['$totalBaki', 0] }, 1, 0] } },
        pending:        { $sum: { $cond: [{ $gt: ['$totalBaki', 0] }, 1, 0] } },
      },
    },
    { $project: { _id: 0 } },
  ]);
  return stats || { totalCustomers: 0, totalBaki: 0, highBaki: 0, cleared: 0, pending: 0 };
};

module.exports = { getKhataStats };
