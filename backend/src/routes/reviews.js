const router = require('express').Router();
const { addReview, getReviews } = require('../controllers/reviewController');
const auth = require('../middleware/auth');

router.get('/:listingId', getReviews);
router.post('/', auth, addReview);

module.exports = router;
