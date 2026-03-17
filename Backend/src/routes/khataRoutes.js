const express = require('express');
const router  = express.Router();
const {
  getAllKhata, getKhataById, createKhata, updateKhata,
  addTransaction, deleteTransaction, deleteKhata, getKhataStats,
} = require('../controllers/khataController');
const { protect }   = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');
const { validate, khataSchema, transactionSchema } = require('../utils/validate');

router.use(protect);

router.get('/stats',                       adminOnly,                          getKhataStats);
router.get('/',                                                                getAllKhata);
router.get('/:id',                                                             getKhataById);
router.post('/',                           adminOnly, validate(khataSchema),   createKhata);
router.put('/:id',                         adminOnly,                          updateKhata);
router.delete('/:id',                      adminOnly,                          deleteKhata);
router.post('/:id/transaction',            adminOnly, validate(transactionSchema), addTransaction);
router.delete('/:id/transaction/:txId',    adminOnly,                          deleteTransaction);

module.exports = router;
