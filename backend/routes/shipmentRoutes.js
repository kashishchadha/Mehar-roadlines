const express = require('express');
const router = express.Router();
const shipmentController = require('../controllers/shipmentController');

router.get('/', shipmentController.getAllShipments);
router.post('/', shipmentController.createShipment);
router.get('/check-id/:trackingId', shipmentController.checkIdAvailability);
router.get('/:trackingId', shipmentController.getShipmentById);
router.put('/:trackingId', shipmentController.updateShipment);

module.exports = router;
