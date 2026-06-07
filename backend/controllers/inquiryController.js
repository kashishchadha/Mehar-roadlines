const Inquiry = require('../models/Inquiry');

exports.createInquiry = async (req, res) => {
  try {
    const { name, phone, origin, destination, message } = req.body;
    
    if (!name || !phone) {
      return res.status(400).json({ message: 'Name and Phone Number are required.' });
    }

    const newInquiry = new Inquiry({
      name,
      phone,
      origin,
      destination,
      message
    });

    await newInquiry.save();
    res.status(201).json({ message: 'Inquiry submitted successfully!', inquiry: newInquiry });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
