const Message = require('../models/Message');
const User = require('../models/User');
const { Op } = require('sequelize');

exports.getConversations = async (req, res) => {
  try {
    const messages = await Message.findAll({
      where: { [Op.or]: [{ senderId: req.user.id }, { receiverId: req.user.id }] },
      include: [
        { model: User, as: 'sender', attributes: ['id', 'name', 'avatar'] },
        { model: User, as: 'receiver', attributes: ['id', 'name', 'avatar'] },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, message, listingId } = req.body;
    const msg = await Message.create({ senderId: req.user.id, receiverId, message, listingId });
    res.status(201).json(msg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
