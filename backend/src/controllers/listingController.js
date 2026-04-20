const { Op } = require('sequelize');
const Listing = require('../models/Listing');
const User = require('../models/User');
const { uploadToCloudinary } = require('../middleware/upload');

exports.createListing = async (req, res) => {
  try {
    const images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const url = await uploadToCloudinary(file.buffer);
        images.push(url);
      }
    }
    const listing = await Listing.create({ ...req.body, images, userId: req.user.id });
    res.status(201).json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getListings = async (req, res) => {
  try {
    const { category, city, minPrice, maxPrice, subCategory, search, page = 1, limit = 12 } = req.query;
    const where = { status: 'active' };
    if (category) where.category = category;
    if (city) where.city = { [Op.like]: `%${city}%` };
    if (subCategory) where.subCategory = subCategory;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = minPrice;
      if (maxPrice) where.price[Op.lte] = maxPrice;
    }
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { location: { [Op.like]: `%${search}%` } },
        { city: { [Op.like]: `%${search}%` } },
      ];
    }
    const offset = (page - 1) * limit;
    const { count, rows } = await Listing.findAndCountAll({
      where,
      include: [{ model: User, as: 'seller', attributes: ['id', 'name', 'phone', 'avatar', 'isVerified'] }],
      order: [['isFeatured', 'DESC'], ['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
    res.json({ listings: rows, total: count, pages: Math.ceil(count / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getListing = async (req, res) => {
  try {
    const listing = await Listing.findByPk(req.params.id, {
      include: [{ model: User, as: 'seller', attributes: ['id', 'name', 'phone', 'avatar', 'isVerified'] }],
    });
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    await listing.increment('views');
    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateListing = async (req, res) => {
  try {
    const listing = await Listing.findByPk(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Not found' });
    if (listing.userId !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });
    await listing.update(req.body);
    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findByPk(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Not found' });
    if (listing.userId !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });
    await listing.destroy();
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getFeatured = async (req, res) => {
  try {
    const listings = await Listing.findAll({
      where: { isFeatured: true, status: 'active' },
      include: [{ model: User, as: 'seller', attributes: ['id', 'name', 'avatar', 'isVerified'] }],
      limit: 8,
      order: [['createdAt', 'DESC']],
    });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
