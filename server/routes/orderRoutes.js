// server/routes/orderRoutes.js (updated)
const express = require('express');
const router = express.Router();
const { 
  createOrder, 
  getOrderById, 
  updateOrderToPaid, 
  getMyOrders,
  getAllOrders,
  updateOrderToDelivered
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

// Regular user routes
router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/pay', protect, updateOrderToPaid);

// Admin routes - add these
router.get('/', protect, admin, getAllOrders);
router.put('/:id/deliver', protect, admin, updateOrderToDelivered);

module.exports = router;