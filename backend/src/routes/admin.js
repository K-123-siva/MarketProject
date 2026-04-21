const router = require('express').Router();
const adminAuth = require('../middleware/adminAuth');
const { upload } = require('../middleware/upload');
const {
  adminLogin, getStats, getUsers, updateUser, deleteUser, createUser,
  getListings, updateListing, deleteListing, createListing,
  bulkUpdateListings, bulkDeleteListings,
  getReviews, deleteReview,
  getMessages, sendMessage, deleteMessage,
  getSystemSettings, updateSystemSettings,
  getAnalytics
} = require('../controllers/adminController');

// Auth
router.post('/login', adminLogin);

// Dashboard
router.get('/stats', adminAuth, getStats);
router.get('/analytics', adminAuth, getAnalytics);

// User management
router.get('/users', adminAuth, getUsers);
router.post('/users', adminAuth, createUser);
router.put('/users/:id', adminAuth, updateUser);
router.delete('/users/:id', adminAuth, deleteUser);

// Listing management
router.get('/listings', adminAuth, getListings);
router.post('/listings', adminAuth, upload.array('images', 10), createListing);
router.put('/listings/:id', adminAuth, updateListing);
router.delete('/listings/:id', adminAuth, deleteListing);
router.put('/listings/bulk-update', adminAuth, bulkUpdateListings);
router.delete('/listings/bulk-delete', adminAuth, bulkDeleteListings);

// Review management
router.get('/reviews', adminAuth, getReviews);
router.delete('/reviews/:id', adminAuth, deleteReview);

// Message management
router.get('/messages', adminAuth, getMessages);
router.post('/messages', adminAuth, sendMessage);
router.delete('/messages/:id', adminAuth, deleteMessage);

// System settings
router.get('/settings', adminAuth, getSystemSettings);
router.put('/settings', adminAuth, updateSystemSettings);

module.exports = router;
