const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Listing = sequelize.define('Listing', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  category: {
    type: DataTypes.ENUM('property_sell', 'property_rent', 'furniture', 'services', 'materials', 'electronics', 'vehicles'),
    allowNull: false,
  },
  subCategory: { type: DataTypes.STRING },
  price: { type: DataTypes.DECIMAL(15, 2) },
  priceType: { type: DataTypes.ENUM('fixed', 'negotiable', 'per_month', 'per_sqft', 'per_unit', 'per_kg', 'hourly', 'project_based'), defaultValue: 'fixed' },
  location: { type: DataTypes.STRING },
  city: { type: DataTypes.STRING },
  state: { type: DataTypes.STRING },
  pincode: { type: DataTypes.STRING },
  images: { type: DataTypes.JSON, defaultValue: [] },
  
  // Property specific
  bedrooms: { type: DataTypes.INTEGER },
  bathrooms: { type: DataTypes.INTEGER },
  area: { type: DataTypes.DECIMAL(10, 2) },
  areaUnit: { type: DataTypes.ENUM('sqft', 'sqmt', 'acre', 'bigha'), defaultValue: 'sqft' },
  propertyAge: { type: DataTypes.STRING },
  facing: { type: DataTypes.STRING },
  floor: { type: DataTypes.INTEGER },
  totalFloors: { type: DataTypes.INTEGER },
  parking: { type: DataTypes.STRING },
  furnishing: { type: DataTypes.STRING },
  
  // Materials/Furniture/Electronics/Vehicles specific
  brand: { type: DataTypes.STRING },
  model: { type: DataTypes.STRING },
  condition: { type: DataTypes.ENUM('new', 'like_new', 'good', 'fair', 'needs_repair'), defaultValue: 'new' },
  warranty: { type: DataTypes.STRING },
  quantity: { type: DataTypes.INTEGER },
  unit: { type: DataTypes.STRING },
  year: { type: DataTypes.STRING },
  
  // Services specific
  serviceType: { type: DataTypes.STRING },
  experience: { type: DataTypes.STRING },
  availability: { type: DataTypes.STRING },
  serviceArea: { type: DataTypes.STRING },
  certifications: { type: DataTypes.TEXT },
  languages: { type: DataTypes.STRING },
  minPrice: { type: DataTypes.DECIMAL(15, 2) },
  maxPrice: { type: DataTypes.DECIMAL(15, 2) },
  
  // Vehicle specific
  kmDriven: { type: DataTypes.INTEGER },
  fuelType: { type: DataTypes.STRING },
  transmission: { type: DataTypes.STRING },
  owners: { type: DataTypes.STRING },
  
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
