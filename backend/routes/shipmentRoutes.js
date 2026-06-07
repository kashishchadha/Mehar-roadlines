const express = require('express');
const router = express.Router();
const shipmentController = require('../controllers/shipmentController');
const protect = require('../middleware/authMiddleware');

router.get('/', shipmentController.getAllShipments);
router.post('/', protect, shipmentController.createShipment);
router.get('/check-id/:trackingId', shipmentController.checkIdAvailability);
router.get('/:trackingId', shipmentController.getShipmentById);
router.put('/:trackingId', protect, shipmentController.updateShipment);


module.exports = router;
