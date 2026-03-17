const express = require('express');
const router  = express.Router();
const { getAllUsers, getUserById, updateUserRole, toggleUserActive, deleteUser } = require('../controllers/userController');
const { protect }   = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

router.use(protect, adminOnly);

router.get('/',                       getAllUsers);
router.get('/:id',                    getUserById);
router.put('/:id/role',               updateUserRole);
router.put('/:id/toggle-active',      toggleUserActive);
router.delete('/:id',                 deleteUser);

module.exports = router;
