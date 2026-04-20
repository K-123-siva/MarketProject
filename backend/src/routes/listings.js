const router = require('express').Router();
const { createListing, getListings, getListing, updateListing, deleteListing, getFeatured } = require('../controllers/listingController');
const auth = require('../middleware/auth');
const { upload } = require('../middleware/upload');

router.get('/', getListings);
router.get('/featured', getFeatured);
router.get('/:id', getListing);
router.post('/', auth, upload.array('images', 10), createListing);
router.put('/:id', auth, updateListing);
router.delete('/:id', auth, deleteListing);

module.exports = router;
