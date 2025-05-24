const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post("/add-order",orderController.addOrder);
router.get('/fetch-orders/:clinicId',orderController.fetchOrder);
router.get('/fetch-orders-by-userId/:userId',orderController.fetchOrderByUserId);
router.put('/updateOrderStatus/:orderId',orderController.updateOrderStatus);
router.put('/addClinicReply/:orderId',orderController.addClinicReply);

module.exports  = router;