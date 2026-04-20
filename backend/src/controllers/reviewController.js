const Review = require('../models/Review');
const User = require('../models/User');

exports.addReview = async (req, res) => {
  try {
    const { listingId, rating, comment } = req.body;
    const review = await Review.create({ listingId, rating, comment, userId: req.user.id });
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { listingId: req.params.listingId },
      include: [{ model: User, as: 'reviewer', attributes: ['id', 'name', 'avatar'] }],
      order: [['createdAt', 'DESC']],
    });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
