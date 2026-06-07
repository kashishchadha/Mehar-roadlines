require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const Shipment = require('./models/Shipment');
const Inquiry = require('./models/Inquiry');

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes

// 1. Get All Shipments (for Admin Dashboard)
app.get('/api/shipments', async (req, res) => {
  try {
    const shipments = await Shipment.find().sort({ createdAt: -1 });
    res.json(shipments);
  } catch (error) {
    console.error(`Error fetching all shipments: ${error.message}`);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 2a. Check Tracking ID Availability
app.get('/api/shipments/check-id/:trackingId', async (req, res) => {
  try {
    const { trackingId } = req.params;
    const shipment = await Shipment.findOne({
      trackingId: { $regex: new RegExp(`^${trackingId.trim()}$`, 'i') }
    });
    res.json({ available: !shipment });
  } catch (error) {
    console.error(`Error checking tracking ID: ${error.message}`);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 2. Get Shipment by Tracking ID (Case-Insensitive)
app.get('/api/shipments/:trackingId', async (req, res) => {
  try {
    const { trackingId } = req.params;
    const shipment = await Shipment.findOne({
      trackingId: { $regex: new RegExp(`^${trackingId.trim()}$`, 'i') }
    });

    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found. Please verify your tracking ID.' });
    }

    res.json(shipment);
  } catch (error) {
    console.error(`Error fetching shipment: ${error.message}`);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 3. Create a New Shipment (Admin Create Flow)
app.post('/api/shipments', async (req, res) => {
  try {
    const {
      trackingId: customTrackingId,
      shipmentType,
      customerName,
      phone,
      originCity,
      originState,
      destinationCity,
      destinationState,
      shipmentDate,
      expectedDeliveryDate,
      cargoDescription,
      weight,
      packagesCount,
      specialInstructions,
      routePoints,
      driverName
    } = req.body;

    if (!customerName || !phone || !originCity || !destinationCity) {
      return res.status(400).json({ message: 'Customer Name, Phone, Origin, and Destination are required.' });
    }

    // Determine and validate tracking ID
    let trackingId = customTrackingId ? customTrackingId.trim() : '';
    if (trackingId) {
      const existing = await Shipment.findOne({
        trackingId: { $regex: new RegExp(`^${trackingId}$`, 'i') }
      });
      if (existing) {
        return res.status(400).json({ message: 'Tracking ID is already in use.' });
      }
    } else {
      trackingId = `MR-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    }

    const getFormattedDate = () => {
      const date = new Date();
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ', ' + 
             date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    const steps = [
      { id: 'booked', label: 'Booked', icon: 'check', date: getFormattedDate(), done: true, active: false, pending: false },
      { id: 'dispatched', label: 'Dispatched', icon: 'check', date: 'Pending', done: false, active: false, pending: true },
      { id: 'transit', label: 'In Transit', icon: 'local_shipping', date: 'Pending', done: false, active: false, pending: true },
      { id: 'delivered', label: 'Delivered', icon: 'home', date: 'Pending', done: false, active: false, pending: true }
    ];

    const driver = {
      name: driverName ? driverName.trim() : 'Sarabjit Singh',
      photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwsl3zo4ZQrhUQ-4y0ut7mGYIB73kG7EWLiKcaWjkzAiRgEuWBgz3fvQbCd6yhsSYPn2jjVFd7Iy14ifn6mhfjAOqejTw6U7nqs6WMJjWek8F9JWfeyZ6iIN31YIulfDgM8unp7MFYxTKm0L9Y5gHlvqCoXYvW4EAqnCv783DhzHz99DxEVIA0Jt67vo6y8J4jpGRgEXBTW-IozCAO3j8LJX0CGAjC_J2ecvQCEi1oNsu38_L46hohgtKHEy4IUeeTlrAG0tU08xBb',
      phone: '+91 98765 43210',
      whatsapp: '919876543210'
    };

    const vehicleNo = `HR 55 ${['AT','BT','CK','DL'][Math.floor(Math.random()*4)]} ${Math.floor(1000 + Math.random()*9000)}`;
    const newShipment = new Shipment({
      trackingId,
      status: 'Booked',
      origin: originCity,
      destination: destinationCity,
      currentLocation: `Origin Depot (${originCity}, ${originState || ''})`,
      estimatedArrival: expectedDeliveryDate || 'TBD',
      shipmentType: shipmentType || 'Full Truck Load (FTL)',
      customerName: customerName || 'Mehar Premium Freight Client',
      phone: phone || '+91 99967 61999',
      vehicle: `Tata Prima 4028 (${vehicleNo})`,
      driver,
      steps,
      routePoints: routePoints || []
    });

    await newShipment.save();
    res.status(201).json({ message: 'Shipment created successfully!', shipment: newShipment });
  } catch (error) {
    console.error(`Error creating shipment: ${error.message}`);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 4. Update Shipment Status & Location (Admin Update Center)
app.put('/api/shipments/:trackingId', async (req, res) => {
  try {
    const { trackingId } = req.params;
    const { status, currentLocation, routePoints, origin, destination, estimatedArrival, driverName } = req.body;

    const shipment = await Shipment.findOne({
      trackingId: { $regex: new RegExp(`^${trackingId.trim()}$`, 'i') }
    });

    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found.' });
    }

    if (status) shipment.status = status;
    if (currentLocation) shipment.currentLocation = currentLocation;
    if (routePoints) shipment.routePoints = routePoints;
    if (origin) shipment.origin = origin;
    if (destination) shipment.destination = destination;
    if (estimatedArrival) shipment.estimatedArrival = estimatedArrival;

    if (driverName !== undefined) {
      if (!shipment.driver) {
        shipment.driver = {
          photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwsl3zo4ZQrhUQ-4y0ut7mGYIB73kG7EWLiKcaWjkzAiRgEuWBgz3fvQbCd6yhsSYPn2jjVFd7Iy14ifn6mhfjAOqejTw6U7nqs6WMJjWek8F9JWfeyZ6iIN31YIulfDgM8unp7MFYxTKm0L9Y5gHlvqCoXYvW4EAqnCv783DhzHz99DxEVIA0Jt67vo6y8J4jpGRgEXBTW-IozCAO3j8LJX0CGAjC_J2ecvQCEi1oNsu38_L46hohgtKHEy4IUeeTlrAG0tU08xBb',
          phone: '+91 98765 43210',
          whatsapp: '919876543210'
        };
      }
      shipment.driver.name = driverName.trim();
    }

    if (status) {
      const statusLower = status.toLowerCase();
      const getFormattedDate = () => {
        const date = new Date();
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ', ' + 
               date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      };
      
      const currentDateStr = getFormattedDate();

      shipment.steps = shipment.steps.map(step => {
        const stepId = step.id;
        
        if (statusLower === 'booked') {
          if (stepId === 'booked') return { ...step.toObject(), done: true, active: true, pending: false, date: currentDateStr };
          return { ...step.toObject(), done: false, active: false, pending: true };
        }
        
        if (statusLower === 'picked up' || statusLower === 'dispatched') {
          if (stepId === 'booked') return { ...step.toObject(), done: true, active: false, pending: false };
          if (stepId === 'dispatched') return { ...step.toObject(), done: true, active: true, pending: false, date: currentDateStr };
          return { ...step.toObject(), done: false, active: false, pending: true };
        }
        
        if (statusLower === 'in transit') {
          if (stepId === 'booked' || stepId === 'dispatched') return { ...step.toObject(), done: true, active: false, pending: false };
          if (stepId === 'transit') return { ...step.toObject(), done: true, active: true, pending: false, date: currentDateStr };
          return { ...step.toObject(), done: false, active: false, pending: true };
        }
        
        if (statusLower === 'delivered') {
          return { ...step.toObject(), done: true, active: false, pending: false, date: step.date === 'Pending' || step.date === 'In Progress' ? currentDateStr : step.date };
        }
        
        return step;
      });
    }

    await shipment.save();
    res.json(shipment);
  } catch (error) {
    console.error(`Error updating shipment: ${error.message}`);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 5. Submit Inquiry (Contact Us form)
app.post('/api/inquiries', async (req, res) => {
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
    console.error(`Error saving inquiry: ${error.message}`);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Status check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'UP', message: 'Mehar Roadlines API is active' });
});

// Port configuration
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in production mode on port ${PORT}`);
});

