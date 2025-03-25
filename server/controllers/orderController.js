// server/controllers/orderController.js
const Order = require('../models/orderModel');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;
    
    console.log('Creating new order for user:', req.user._id);
    
    if (!orderItems || orderItems.length === 0) {
      console.log('No order items provided');
      return res.status(400).json({ message: 'No order items' });
    }
    
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      taxPrice,
      shippingPrice,
      totalPrice,
    });
    
    const createdOrder = await order.save();
    console.log('Order created successfully:', createdOrder._id);
    
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    console.log('Fetching order by ID:', req.params.id);
    
    const order = await Order.findById(req.params.id).populate(
      'user',
      'username email'
    );
    
    if (order) {
      // Check if the order belongs to the user or the user is an admin
      if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
        console.log('Unauthorized order access attempt');
        return res.status(401).json({ message: 'Not authorized to view this order' });
      }
      
      res.json(order);
    } else {
      console.log('Order not found:', req.params.id);
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req, res) => {
  try {
    console.log('Updating order to paid:', req.params.id);
    
    const order = await Order.findById(req.params.id);
    
    if (order) {
      // Only allow the user who created the order or an admin to mark it as paid
      if (order.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
        return res.status(401).json({ message: 'Not authorized to update this order' });
      }
      
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer.email_address,
      };
      
      const updatedOrder = await order.save();
      console.log('Order payment updated successfully');
      
      res.json(updatedOrder);
    } else {
      console.log('Order not found for payment update:', req.params.id);
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error('Error updating order payment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    console.log('Fetching orders for user:', req.user._id);
    
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    console.log('Admin fetching all orders');
    
    const orders = await Order.find({})
      .populate('user', 'id username email')
      .sort({ createdAt: -1 }); // Sort by newest first
      
    res.json(orders);
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = async (req, res) => {
  try {
    console.log('Admin updating order to delivered:', req.params.id);
    
    const order = await Order.findById(req.params.id);
    
    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      
      const updatedOrder = await order.save();
      console.log('Order delivery status updated successfully');
      
      res.json(updatedOrder);
    } else {
      console.log('Order not found for delivery update:', req.params.id);
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error('Error updating order delivery status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getAllOrders,
  updateOrderToDelivered
};