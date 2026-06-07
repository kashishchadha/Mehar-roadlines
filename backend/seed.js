require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Shipment = require('./models/Shipment');

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing shipments
    await Shipment.deleteMany({});
    console.log('Cleared existing shipments from database...');

    const now = Date.now();

    // Seed Data using realistic June 2026 dates (DD/MM/YYYY)
    const shipments = [
      {
        trackingId: 'MH-8902341',
        status: 'In Transit',
        origin: 'Mumbai, MH',
        destination: 'Delhi, NCR',
        currentLocation: 'Near Vadodara, Gujarat (NH-48)',
        estimatedArrival: '2026-06-09 (Evening)',
        shipmentDate: '2026-06-05',
        shipmentTimeOfDay: 'Morning',
        expectedDeliveryDate: '2026-06-09',
        deliveryTimeOfDay: 'Evening',
        shipmentType: 'Full Truck Load (FTL)',
        customerName: 'IndoTech Electronics Ltd',
        phone: '+91 99967 61999',
        vehicle: 'Tata Prima 4028 (HR 55 AT 4421)',
        weight: '14.2 Tons',
        packagesCount: 240,
        cargoDescription: 'Industrial Telecommunication Hardware',
        specialInstructions: 'Fragile electronics. Keep away from moisture.',
        driver: {
          name: 'Sarabjit Singh',
          photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwsl3zo4ZQrhUQ-4y0ut7mGYIB73kG7EWLiKcaWjkzAiRgEuWBgz3fvQbCd6yhsSYPn2jjVFd7Iy14ifn6mhfjAOqejTw6U7nqs6WMJjWek8F9JWfeyZ6iIN31YIulfDgM8unp7MFYxTKm0L9Y5gHlvqCoXYvW4EAqnCv783DhzHz99DxEVIA0Jt67vo6y8J4jpGRgEXBTW-IozCAO3j8LJX0CGAjC_J2ecvQCEi1oNsu38_L46hohgtKHEy4IUeeTlrAG0tU08xBb',
          phone: '+91 98765 43210',
          whatsapp: '919876543210'
        },
        steps: [
          { id: 'booked', label: 'Booked', icon: 'check', date: '05/06/2026, 09:00 AM', done: true, active: false, pending: false },
          { id: 'dispatched', label: 'Dispatched', icon: 'check', date: '05/06/2026, 04:30 PM', done: true, active: false, pending: false },
          { id: 'transit', label: 'In Transit', icon: 'local_shipping', date: 'In Progress', done: false, active: true, pending: false },
          { id: 'delivered', label: 'Delivered', icon: 'home', date: 'Pending', done: false, active: false, pending: true }
        ],
        createdAt: new Date(now - 2 * 60 * 1000), // 2 mins ago
        updatedAt: new Date(now - 2 * 60 * 1000)
      },
      {
        trackingId: 'MH-8902342',
        status: 'Delivered',
        origin: 'Pune, MH',
        destination: 'Bangalore, KA',
        currentLocation: 'Bangalore Hub (Yeshwanthpur Warehouse)',
        estimatedArrival: 'Completed',
        shipmentDate: '2026-06-01',
        shipmentTimeOfDay: 'Morning',
        expectedDeliveryDate: '2026-06-03',
        deliveryTimeOfDay: 'Afternoon',
        shipmentType: 'Part Truck Load (PTL)',
        customerName: 'Gujarat Metalworks Corp',
        phone: '+91 98877 66554',
        vehicle: 'Tata Prima 4028 (HR 55 BT 3423)',
        weight: '9.8 Tons',
        packagesCount: 110,
        cargoDescription: 'Steel Pipes & Valve Assembly Fittings',
        specialInstructions: 'Heavy components. Secure tightly.',
        driver: {
          name: 'Gurpreet Singh',
          photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwsl3zo4ZQrhUQ-4y0ut7mGYIB73kG7EWLiKcaWjkzAiRgEuWBgz3fvQbCd6yhsSYPn2jjVFd7Iy14ifn6mhfjAOqejTw6U7nqs6WMJjWek8F9JWfeyZ6iIN31YIulfDgM8unp7MFYxTKm0L9Y5gHlvqCoXYvW4EAqnCv783DhzHz99DxEVIA0Jt67vo6y8J4jpGRgEXBTW-IozCAO3j8LJX0CGAjC_J2ecvQCEi1oNsu38_L46hohgtKHEy4IUeeTlrAG0tU08xBb',
          phone: '+91 98765 43211',
          whatsapp: '919876543211'
        },
        steps: [
          { id: 'booked', label: 'Booked', icon: 'check', date: '01/06/2026, 10:00 AM', done: true, active: false, pending: false },
          { id: 'dispatched', label: 'Dispatched', icon: 'check', date: '01/06/2026, 02:00 PM', done: true, active: false, pending: false },
          { id: 'transit', label: 'In Transit', icon: 'check', date: '02/06/2026, 09:00 AM', done: true, active: false, pending: false },
          { id: 'delivered', label: 'Delivered', icon: 'home', date: '03/06/2026, 03:00 PM', done: true, active: false, pending: false }
        ],
        createdAt: new Date(now - 45 * 60 * 1000), // 45 mins ago
        updatedAt: new Date(now - 45 * 60 * 1000)
      },
      {
        trackingId: 'MH-8902343',
        status: 'Dispatched',
        origin: 'Surat, GJ',
        destination: 'Indore, MP',
        currentLocation: 'Surat Warehouse',
        estimatedArrival: '2026-06-08',
        shipmentDate: '2026-06-06',
        shipmentTimeOfDay: 'Morning',
        expectedDeliveryDate: '2026-06-08',
        deliveryTimeOfDay: 'Any Time',
        shipmentType: 'Full Truck Load (FTL)',
        customerName: 'Kalyani Textiles Ltd',
        phone: '+91 88877 99966',
        vehicle: 'Tata Prima 4028 (HR 55 CK 8765)',
        weight: '6.5 Tons',
        packagesCount: 150,
        cargoDescription: 'Premium Cotton Yarn Bales',
        specialInstructions: 'Keep dry. Avoid open fires.',
        driver: {
          name: 'Sarabjit Singh',
          photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwsl3zo4ZQrhUQ-4y0ut7mGYIB73kG7EWLiKcaWjkzAiRgEuWBgz3fvQbCd6yhsSYPn2jjVFd7Iy14ifn6mhfjAOqejTw6U7nqs6WMJjWek8F9JWfeyZ6iIN31YIulfDgM8unp7MFYxTKm0L9Y5gHlvqCoXYvW4EAqnCv783DhzHz99DxEVIA0Jt67vo6y8J4jpGRgEXBTW-IozCAO3j8LJX0CGAjC_J2ecvQCEi1oNsu38_L46hohgtKHEy4IUeeTlrAG0tU08xBb',
          phone: '+91 98765 43210',
          whatsapp: '919876543210'
        },
        steps: [
          { id: 'booked', label: 'Booked', icon: 'check', date: '06/06/2026, 11:00 AM', done: true, active: false, pending: false },
          { id: 'dispatched', label: 'Dispatched', icon: 'check', date: '06/06/2026, 05:00 PM', done: true, active: true, pending: false },
          { id: 'transit', label: 'In Transit', icon: 'local_shipping', date: 'Pending', done: false, active: false, pending: true },
          { id: 'delivered', label: 'Delivered', icon: 'home', date: 'Pending', done: false, active: false, pending: true }
        ],
        createdAt: new Date(now - 60 * 60 * 1000), // 1 hour ago
        updatedAt: new Date(now - 60 * 60 * 1000)
      },
      {
        trackingId: 'MR-00123',
        status: 'In Transit',
        origin: 'Delhi',
        destination: 'Mumbai',
        currentLocation: 'Near Vadodara, Gujarat (NH-48)',
        estimatedArrival: '2026-06-09 (Evening)',
        shipmentDate: '2026-06-05',
        shipmentTimeOfDay: 'Morning',
        expectedDeliveryDate: '2026-06-09',
        deliveryTimeOfDay: 'Evening',
        shipmentType: 'Full Truck Load (FTL)',
        customerName: 'Apex Auto Spares',
        phone: '+91 99967 61999',
        vehicle: 'Tata Prima 4028 (HR 55 DL 4321)',
        weight: '12.0 Tons',
        packagesCount: 320,
        cargoDescription: 'Automotive Spark Plugs & Clutches',
        specialInstructions: 'Fragile parts. Stack with arrows pointing up.',
        driver: {
          name: 'Sarabjit Singh',
          photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwsl3zo4ZQrhUQ-4y0ut7mGYIB73kG7EWLiKcaWjkzAiRgEuWBgz3fvQbCd6yhsSYPn2jjVFd7Iy14ifn6mhfjAOqejTw6U7nqs6WMJjWek8F9JWfeyZ6iIN31YIulfDgM8unp7MFYxTKm0L9Y5gHlvqCoXYvW4EAqnCv783DhzHz99DxEVIA0Jt67vo6y8J4jpGRgEXBTW-IozCAO3j8LJX0CGAjC_J2ecvQCEi1oNsu38_L46hohgtKHEy4IUeeTlrAG0tU08xBb',
          phone: '+91 98765 43210',
          whatsapp: '919876543210'
        },
        steps: [
          { id: 'booked', label: 'Booked', icon: 'check', date: '05/06/2026, 09:00 AM', done: true, active: false, pending: false },
          { id: 'dispatched', label: 'Dispatched', icon: 'check', date: '05/06/2026, 04:30 PM', done: true, active: false, pending: false },
          { id: 'transit', label: 'In Transit', icon: 'local_shipping', date: 'In Progress', done: false, active: true, pending: false },
          { id: 'delivered', label: 'Delivered', icon: 'home', date: 'Pending', done: false, active: false, pending: true }
        ],
        createdAt: new Date(now - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        updatedAt: new Date(now - 2 * 24 * 60 * 60 * 1000)
      },
      {
        trackingId: 'MR-00456',
        status: 'Delivered',
        origin: 'Mumbai',
        destination: 'Ahmedabad',
        currentLocation: 'Ahmedabad Hub (Aslali Warehouse)',
        estimatedArrival: 'Completed',
        shipmentDate: '2026-06-01',
        shipmentTimeOfDay: 'Morning',
        expectedDeliveryDate: '2026-06-03',
        deliveryTimeOfDay: 'Any Time',
        shipmentType: 'Part Truck Load (PTL)',
        customerName: 'Metro Plastics',
        phone: '+91 77766 55443',
        vehicle: 'Tata Prima 4028 (HR 55 AT 9988)',
        weight: '8.5 Tons',
        packagesCount: 200,
        cargoDescription: 'Polyethylene Pellets & PVC Pipes',
        specialInstructions: 'Store in cool conditions.',
        driver: {
          name: 'Gurpreet Singh',
          photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwsl3zo4ZQrhUQ-4y0ut7mGYIB73kG7EWLiKcaWjkzAiRgEuWBgz3fvQbCd6yhsSYPn2jjVFd7Iy14ifn6mhfjAOqejTw6U7nqs6WMJjWek8F9JWfeyZ6iIN31YIulfDgM8unp7MFYxTKm0L9Y5gHlvqCoXYvW4EAqnCv783DhzHz99DxEVIA0Jt67vo6y8J4jpGRgEXBTW-IozCAO3j8LJX0CGAjC_J2ecvQCEi1oNsu38_L46hohgtKHEy4IUeeTlrAG0tU08xBb',
          phone: '+91 98765 43211',
          whatsapp: '919876543211'
        },
        steps: [
          { id: 'booked', label: 'Booked', icon: 'check', date: '01/06/2026, 10:00 AM', done: true, active: false, pending: false },
          { id: 'dispatched', label: 'Dispatched', icon: 'check', date: '01/06/2026, 02:00 PM', done: true, active: false, pending: false },
          { id: 'transit', label: 'In Transit', icon: 'check', date: '02/06/2026, 09:00 AM', done: true, active: false, pending: false },
          { id: 'delivered', label: 'Delivered', icon: 'home', date: '03/06/2026, 03:00 PM', done: true, active: false, pending: false }
        ],
        createdAt: new Date(now - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        updatedAt: new Date(now - 5 * 24 * 60 * 60 * 1000)
      }
    ];

    // Use raw mongodb collection to preserve custom timestamps
    await Shipment.collection.insertMany(shipments);
    console.log('Successfully seeded database with test shipments matching screenshot.');
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedData();
