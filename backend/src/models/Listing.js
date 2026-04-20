const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Listing = sequelize.define('Listing', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  category: {
    type: DataTypes.ENUM('property_sell', 'property_rent', 'furniture', 'services', 'materials'),
    allowNull: false,
  },
  subCategory: { type: DataTypes.STRING },
  price: { type: DataTypes.DECIMAL(15, 2) },
  priceType: { type: DataTypes.ENUM('fixed', 'negotiable', 'per_month', 'per_sqft'), defaultValue: 'fixed' },
  location: { type: DataTypes.STRING },
  city: { type: DataTypes.STRING },
  state: { type: DataTypes.STRING },
  pincode: { type: DataTypes.STRING },
  images: { type: DataTypes.JSON, defaultValue: [] },
  bedrooms: { type: DataTypes.INTEGER },
  bathrooms: { type: DataTypes.INTEGER },
  area: { type: DataTypes.DECIMAL(10, 2) },
  areaUnit: { type: DataTypes.ENUM('sqft', 'sqmt', 'acre'), defaultValue: 'sqft' },
  amenities: { type: DataTypes.JSON, defaultValue: [] },
  isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
  isFeatured: { type: DataTypes.BOOLEAN, defaultValue: false },
  status: { type: DataTypes.ENUM('active', 'sold', 'rented', 'inactive'), defaultValue: 'active' },
  views: { type: DataTypes.INTEGER, defaultValue: 0 },
  userId: { type: DataTypes.INTEGER, allowNull: false },
});

Listing.belongsTo(User, { foreignKey: 'userId', as: 'seller' });
User.hasMany(Listing, { foreignKey: 'userId' });

module.exports = Listing;
