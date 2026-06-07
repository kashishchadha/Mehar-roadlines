require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const shipmentRoutes = require('./routes/shipmentRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/shipments', shipmentRoutes);
app.use('/api/inquiries', inquiryRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'UP', message: 'Mehar Roadlines API is active' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
