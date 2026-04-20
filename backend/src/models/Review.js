const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Listing = require('./Listing');

const Review = sequelize.define('Review', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  rating: { type: DataTypes.INTEGER, allowNull: false },
  comment: { type: DataTypes.TEXT },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  listingId: { type: DataTypes.INTEGER, allowNull: false },
});

Review.belongsTo(User, { foreignKey: 'userId', as: 'reviewer' });
Review.belongsTo(Listing, { foreignKey: 'listingId' });

module.exports = Review;
