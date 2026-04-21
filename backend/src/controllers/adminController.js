const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Listing = require('../models/Listing');
const Review = require('../models/Review');
const Message = require('../models/Message');
const { Op } = require('sequelize');

// Admin login — credentials from .env
exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;
  if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ message: 'Invalid admin credentials' });
  }
  const token = jwt.sign({ role: 'admin', email }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ token, admin: { email, role: 'admin', name: 'Admin' } });
};

// Dashboard stats
exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalListings = await Listing.count();
    const activeListings = await Listing.count({ where: { status: 'active' } });
    const totalReviews = await Review.count();
    const totalMessages = await Message.count();
    const recentUsers = await User.findAll({ order: [['createdAt', 'DESC']], limit: 5, attributes: { exclude: ['password'] } });
    const recentListings = await Listing.findAll({ order: [['createdAt', 'DESC']], limit: 5, include: [{ model: User, as: 'seller', attributes: ['name', 'email'] }] });
    const categoryStats = await Listing.findAll({
      attributes: ['category', [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']],
      group: ['category'],
    });
    const monthlyStats = await Listing.findAll({
      attributes: [
        [require('sequelize').fn('DATE_FORMAT', require('sequelize').col('createdAt'), '%Y-%m'), 'month'],
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      group: [require('sequelize').fn('DATE_FORMAT', require('sequelize').col('createdAt'), '%Y-%m')],
      order: [[require('sequelize').fn('DATE_FORMAT', require('sequelize').col('createdAt'), '%Y-%m'), 'DESC']],
      limit: 12
    });
    res.json({ totalUsers, totalListings, activeListings, totalReviews, totalMessages, recentUsers, recentListings, categoryStats, monthlyStats });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const where = {};
    if (search) where[Op.or] = [{ name: { [Op.like]: `%${search}%` } }, { email: { [Op.like]: `%${search}%` } }];
    const { count, rows } = await User.findAndCountAll({ where, attributes: { exclude: ['password'] }, order: [['createdAt', 'DESC']], limit: parseInt(limit), offset: (page - 1) * limit });
    res.json({ users: rows, total: count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Verify / ban user
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await user.update(req.body);
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.destroy({ where: { id: req.params.id } });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all listings
exports.getListings = async (req, res) => {
  try {
    const { search, category, page = 1, limit = 20 } = req.query;
    const where = {};
    if (category) where.category = category;
    if (search) where[Op.or] = [{ title: { [Op.like]: `%${search}%` } }, { city: { [Op.like]: `%${search}%` } }];
    const { count, rows } = await Listing.findAndCountAll({
      where, order: [['createdAt', 'DESC']], limit: parseInt(limit), offset: (page - 1) * limit,
      include: [{ model: User, as: 'seller', attributes: ['id', 'name', 'email'] }],
    });
    res.json({ listings: rows, total: count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Feature / verify / delete listing
exports.updateListing = async (req, res) => {
  try {
    const listing = await Listing.findByPk(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Not found' });
    await listing.update(req.body);
    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteListing = async (req, res) => {
  try {
    await Listing.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Listing deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Reviews
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      order: [['createdAt', 'DESC']], limit: 50,
      include: [{ model: User, as: 'reviewer', attributes: ['name', 'email'] }],
    });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    await Review.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===== NEW ADMIN FUNCTIONS =====

// Create listing as admin
exports.createListing = async (req, res) => {
  try {
    const images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const url = await require('../middleware/upload').uploadToCloudinary(file.buffer);
        images.push(url);
      }
    }
    
    const listingData = {
      ...req.body,
      images,
      userId: req.body.userId || 1, // Default to admin user
      status: 'active',
      isFeatured: req.body.isFeatured === 'true' || req.body.isFeatured === true,
      isVerified: req.body.isVerified === 'true' || req.body.isVerified === true || true // Admin-created listings are auto-verified
    };
    
    // Parse amenities if it's a string
    if (typeof listingData.amenities === 'string') {
      try {
        listingData.amenities = JSON.parse(listingData.amenities);
      } catch (e) {
        listingData.amenities = [];
      }
    }
    
    // Convert numeric fields
    if (listingData.price) listingData.price = parseFloat(listingData.price);
    if (listingData.bedrooms) listingData.bedrooms = parseInt(listingData.bedrooms);
    if (listingData.bathrooms) listingData.bathrooms = parseInt(listingData.bathrooms);
    if (listingData.area) listingData.area = parseFloat(listingData.area);
    if (listingData.quantity) listingData.quantity = parseInt(listingData.quantity);
    if (listingData.floor) listingData.floor = parseInt(listingData.floor);
    if (listingData.totalFloors) listingData.totalFloors = parseInt(listingData.totalFloors);
    if (listingData.kmDriven) listingData.kmDriven = parseInt(listingData.kmDriven);
    if (listingData.minPrice) listingData.minPrice = parseFloat(listingData.minPrice);
    if (listingData.maxPrice) listingData.maxPrice = parseFloat(listingData.maxPrice);
    
    console.log('Creating listing with data:', listingData);
    
    const listing = await Listing.create(listingData);
    const fullListing = await Listing.findByPk(listing.id, {
      include: [{ model: User, as: 'seller', attributes: ['id', 'name', 'email'] }]
    });
    
    console.log('Created listing:', fullListing.toJSON());
    res.status(201).json(fullListing);
  } catch (err) {
    console.error('Admin create listing error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Get all messages for admin oversight
exports.getMessages = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const where = {};
    if (search) {
      where[Op.or] = [
        { content: { [Op.like]: `%${search}%` } }
      ];
    }
    const { count, rows } = await Message.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: (page - 1) * limit,
      include: [
        { model: User, as: 'sender', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'receiver', attributes: ['id', 'name', 'email'] },
        { model: Listing, attributes: ['id', 'title', 'category'] }
      ]
    });
    res.json({ messages: rows, total: count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Send message as admin to any user
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, listingId, content } = req.body;
    const message = await Message.create({
      senderId: 1, // Admin user ID (you may need to adjust this)
      receiverId,
      listingId,
      content,
      isRead: false
    });
    const fullMessage = await Message.findByPk(message.id, {
      include: [
        { model: User, as: 'sender', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'receiver', attributes: ['id', 'name', 'email'] },
        { model: Listing, attributes: ['id', 'title'] }
      ]
    });
    res.status(201).json(fullMessage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete message
exports.deleteMessage = async (req, res) => {
  try {
    await Message.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Message deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Bulk operations
exports.bulkUpdateListings = async (req, res) => {
  try {
    const { listingIds, updates } = req.body;
    await Listing.update(updates, { where: { id: { [Op.in]: listingIds } } });
    res.json({ message: `Updated ${listingIds.length} listings` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.bulkDeleteListings = async (req, res) => {
  try {
    const { listingIds } = req.body;
    await Listing.destroy({ where: { id: { [Op.in]: listingIds } } });
    res.json({ message: `Deleted ${listingIds.length} listings` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Advanced user management
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, phone, isVerified = true } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      isVerified,
      createdBy: 'admin'
    });
    const { password: _, ...userWithoutPassword } = user.toJSON();
    res.status(201).json(userWithoutPassword);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// System settings and configuration
exports.getSystemSettings = async (req, res) => {
  try {
    // This could be expanded to include actual system settings from a settings table
    const settings = {
      siteName: 'NestBazaar',
      allowRegistration: true,
      requireEmailVerification: false,
      maxListingsPerUser: 50,
      featuredListingPrice: 99,
      categories: [
        'Apartments', 'Houses', 'Villas', 'Plots', 'Commercial',
        'Furniture', 'Electronics', 'Vehicles', 'Services'
      ],
      cities: [
        'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata',
        'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'
      ]
    };
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateSystemSettings = async (req, res) => {
  try {
    // In a real app, you'd save these to a database
    const settings = req.body;
    res.json({ message: 'Settings updated successfully', settings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Analytics and reports
exports.getAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const userGrowth = await User.findAll({
      attributes: [
        [require('sequelize').fn('DATE', require('sequelize').col('createdAt')), 'date'],
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      where: dateFilter,
      group: [require('sequelize').fn('DATE', require('sequelize').col('createdAt'))],
      order: [[require('sequelize').fn('DATE', require('sequelize').col('createdAt')), 'ASC']]
    });

    const listingGrowth = await Listing.findAll({
      attributes: [
        [require('sequelize').fn('DATE', require('sequelize').col('createdAt')), 'date'],
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      where: dateFilter,
      group: [require('sequelize').fn('DATE', require('sequelize').col('createdAt'))],
      order: [[require('sequelize').fn('DATE', require('sequelize').col('createdAt')), 'ASC']]
    });

    const topCategories = await Listing.findAll({
      attributes: [
        'category',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      where: dateFilter,
      group: ['category'],
      order: [[require('sequelize').fn('COUNT', require('sequelize').col('id')), 'DESC']],
      limit: 10
    });

    res.json({ userGrowth, listingGrowth, topCategories });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
