const Shipment = require('../models/Shipment');

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

exports.getAllShipments = async (req, res) => {
  try {
    const shipments = await Shipment.find().sort({ createdAt: -1 });
    res.json(shipments);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.checkIdAvailability = async (req, res) => {
  try {
    const { trackingId } = req.params;
    const shipment = await Shipment.findOne({
      trackingId: { $regex: new RegExp(`^${escapeRegex(trackingId.trim())}$`, 'i') }
    });
    res.json({ available: !shipment });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getShipmentById = async (req, res) => {
  try {
    const { trackingId } = req.params;
    const shipment = await Shipment.findOne({
      trackingId: { $regex: new RegExp(`^${escapeRegex(trackingId.trim())}$`, 'i') }
    });

    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found. Please verify your tracking ID.' });
    }

    res.json(shipment);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.createShipment = async (req, res) => {
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
      shipmentTimeOfDay,
      expectedDeliveryDate,
      deliveryTimeOfDay,
      cargoDescription,
      weight,
      packagesCount,
      specialInstructions,
      routePoints,
      driverName,
      driverPhone,
      driverWhatsapp
    } = req.body;

    if (!customerName || !phone || !originCity || !destinationCity) {
      return res.status(400).json({ message: 'Customer Name, Phone, Origin, and Destination are required.' });
    }

    // Date validations
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (shipmentDate) {
      const shipDate = new Date(shipmentDate);
      if (shipDate < today) {
        return res.status(400).json({ message: 'Shipment date cannot be before current date.' });
      }
    }

    if (expectedDeliveryDate) {
      const deliveryDate = new Date(expectedDeliveryDate);
      if (deliveryDate < today) {
        return res.status(400).json({ message: 'Expected delivery date cannot be before current date.' });
      }
      if (shipmentDate && deliveryDate < new Date(shipmentDate)) {
        return res.status(400).json({ message: 'Expected delivery date cannot be before shipment date.' });
      }
    }

    let trackingId = customTrackingId ? customTrackingId.trim() : '';
    if (trackingId) {
      const existing = await Shipment.findOne({
        trackingId: { $regex: new RegExp(`^${escapeRegex(trackingId)}$`, 'i') }
      });
      if (existing) {
        return res.status(400).json({ message: 'Tracking ID is already in use.' });
      }
    } else {
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const firstL = letters[Math.floor(Math.random() * 26)];
      const secondL = letters[Math.floor(Math.random() * 26)];
      trackingId = `${firstL}${secondL}-${Math.floor(10000 + Math.random() * 90000)}`;
    }

    const getFormattedDate = () => {
      const date = new Date();
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    const steps = [
      { id: 'booked', label: 'Booked', icon: 'check', date: getFormattedDate(), done: true, active: false, pending: false },
      { id: 'dispatched', label: 'Dispatched', icon: 'check', date: 'Pending', done: false, active: false, pending: true },
      { id: 'transit', label: 'In Transit', icon: 'local_shipping', date: 'Pending', done: false, active: false, pending: true },
      { id: 'delivered', label: 'Delivered', icon: 'home', date: 'Pending', done: false, active: false, pending: true }
    ];

    const driver = {
      name: driverName ? driverName.trim() : 'Ravi',
      photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwsl3zo4ZQrhUQ-4y0ut7mGYIB73kG7EWLiKcaWjkzAiRgEuWBgz3fvQbCd6yhsSYPn2jjVFd7Iy14ifn6mhfjAOqejTw6U7nqs6WMJjWek8F9JWfeyZ6iIN31YIulfDgM8unp7MFYxTKm0L9Y5gHlvqCoXYvW4EAqnCv783DhzHz99DxEVIA0Jt67vo6y8J4jpGRgEXBTW-IozCAO3j8LJX0CGAjC_J2ecvQCEi1oNsu38_L46hohgtKHEy4IUeeTlrAG0tU08xBb',
      phone: driverPhone ? driverPhone.trim() : '9996761999',
      whatsapp: driverWhatsapp ? driverWhatsapp.trim() : '9996761999'
    };

    const vehicleNo = `HR 55 ${['AT','BT','CK','DL'][Math.floor(Math.random()*4)]} ${Math.floor(1000 + Math.random()*9000)}`;

    let eta = 'TBD';
    if (expectedDeliveryDate) {
      eta = expectedDeliveryDate;
      if (deliveryTimeOfDay && deliveryTimeOfDay !== 'Any Time') {
        eta += ` (${deliveryTimeOfDay})`;
      }
    }

    const newShipment = new Shipment({
      trackingId,
      status: 'Booked',
      origin: originCity,
      destination: destinationCity,
      currentLocation: `Origin Depot (${originCity}, ${originState || ''})`,
      estimatedArrival: eta,
      shipmentDate,
      shipmentTimeOfDay: shipmentTimeOfDay || 'Any Time',
      expectedDeliveryDate,
      deliveryTimeOfDay: deliveryTimeOfDay || 'Any Time',
      shipmentType: shipmentType || 'Full Truck Load (FTL)',
      customerName: customerName || 'Mehar Premium Freight Client',
      phone: phone || '+91 99967 61999',
      vehicle: `Tata Prima 4028 (${vehicleNo})`,
      weight: weight || '',
      packagesCount: packagesCount || 0,
      cargoDescription: cargoDescription || '',
      specialInstructions: specialInstructions || '',
      driver,
      steps,
      routePoints: routePoints || []
    });

    await newShipment.save();
    res.status(201).json({ message: 'Shipment created successfully!', shipment: newShipment });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateShipment = async (req, res) => {
  try {
    const { trackingId } = req.params;
    const {
      status,
      currentLocation,
      routePoints,
      origin,
      destination,
      estimatedArrival,
      shipmentDate,
      shipmentTimeOfDay,
      expectedDeliveryDate,
      deliveryTimeOfDay,
      driverName,
      driverPhone,
      driverWhatsapp,
      vehicle,
      customerName,
      phone,
      weight,
      packagesCount,
      shipmentType,
      cargoDescription,
      specialInstructions
    } = req.body;

    const shipment = await Shipment.findOne({
      trackingId: { $regex: new RegExp(`^${escapeRegex(trackingId.trim())}$`, 'i') }
    });

    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found.' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (shipmentDate) {
      const shipDate = new Date(shipmentDate);
      if (shipDate < today) {
        return res.status(400).json({ message: 'Shipment date cannot be before current date.' });
      }
    }

    if (expectedDeliveryDate) {
      const deliveryDate = new Date(expectedDeliveryDate);
      if (deliveryDate < today) {
        return res.status(400).json({ message: 'Expected delivery date cannot be before current date.' });
      }
      const activeShipmentDate = shipmentDate || shipment.shipmentDate;
      if (activeShipmentDate && deliveryDate < new Date(activeShipmentDate)) {
        return res.status(400).json({ message: 'Expected delivery date cannot be before shipment date.' });
      }
    }

    if (status) shipment.status = status;
    if (currentLocation) shipment.currentLocation = currentLocation;
    if (routePoints) shipment.routePoints = routePoints;
    if (origin) shipment.origin = origin;
    if (destination) shipment.destination = destination;

    if (shipmentDate !== undefined) shipment.shipmentDate = shipmentDate;
    if (shipmentTimeOfDay !== undefined) shipment.shipmentTimeOfDay = shipmentTimeOfDay;
    if (expectedDeliveryDate !== undefined) shipment.expectedDeliveryDate = expectedDeliveryDate;
    if (deliveryTimeOfDay !== undefined) shipment.deliveryTimeOfDay = deliveryTimeOfDay;

    if (status === 'Delivered') {
      shipment.estimatedArrival = 'Completed';
    } else {
      const activeDate = expectedDeliveryDate !== undefined ? expectedDeliveryDate : shipment.expectedDeliveryDate;
      const activeTod = deliveryTimeOfDay !== undefined ? deliveryTimeOfDay : shipment.deliveryTimeOfDay;
      if (activeDate) {
        let newEta = activeDate;
        if (activeTod && activeTod !== 'Any Time') {
          newEta += ` (${activeTod})`;
        }
        shipment.estimatedArrival = newEta;
      } else if (estimatedArrival !== undefined) {
        shipment.estimatedArrival = estimatedArrival;
      }
    }

    if (customerName !== undefined) shipment.customerName = customerName;
    if (phone !== undefined) shipment.phone = phone;

    if (weight !== undefined) shipment.weight = weight;
    if (packagesCount !== undefined) shipment.packagesCount = packagesCount;
    if (shipmentType !== undefined) shipment.shipmentType = shipmentType;
    if (cargoDescription !== undefined) shipment.cargoDescription = cargoDescription;
    if (specialInstructions !== undefined) shipment.specialInstructions = specialInstructions;
    if (vehicle !== undefined) shipment.vehicle = vehicle;

    if (driverName !== undefined || driverPhone !== undefined || driverWhatsapp !== undefined) {
      if (!shipment.driver) {
        shipment.driver = {
          photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwsl3zo4ZQrhUQ-4y0ut7mGYIB73kG7EWLiKcaWjkzAiRgEuWBgz3fvQbCd6yhsSYPn2jjVFd7Iy14ifn6mhfjAOqejTw6U7nqs6WMJjWek8F9JWfeyZ6iIN31YIulfDgM8unp7MFYxTKm0L9Y5gHlvqCoXYvW4EAqnCv783DhzHz99DxEVIA0Jt67vo6y8J4jpGRgEXBTW-IozCAO3j8LJX0CGAjC_J2ecvQCEi1oNsu38_L46hohgtKHEy4IUeeTlrAG0tU08xBb',
          phone: '+91 98765 43210',
          whatsapp: '919876543210'
        };
      }
      if (driverName !== undefined) shipment.driver.name = driverName.trim();
      if (driverPhone !== undefined) shipment.driver.phone = driverPhone.trim();
      if (driverWhatsapp !== undefined) shipment.driver.whatsapp = driverWhatsapp.trim();
    }

    if (status) {
      const statusLower = status.toLowerCase();
      const getFormattedDate = () => {
        const date = new Date();
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
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
    res.status(500).json({ message: 'Internal server error' });
  }
};
