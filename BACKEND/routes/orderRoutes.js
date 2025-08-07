const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const upload = require('../MiddleWare/uploadBill');

router.post("/add-order",orderController.addOrder);
router.get('/fetch-orders/:clinicId',orderController.fetchOrder);
router.get('/fetch-orders-by-userId/:userId',orderController.fetchOrderByUserId);
router.get('/fetch-orders-by-orderId/:orderId',orderController.fetchOrderByOrderId);
router.put('/updateOrderStatus/:orderId',orderController.updateOrderStatus);
router.put('/addClinicReply/:orderId',orderController.addClinicReply);
router.post("/uploadBill/:orderId",upload.fields([{name:'receipt',maxCount:1}]),orderController.uploadBill);
router.get('/all-notification/:delBoyId',orderController.fetchAllNotification)
router.put('/mark-all-seen/:delBoyId',orderController.markAllSeen);
router.put('/update-OrderNotification-Status/:delBoyId',orderController.updateOrderNotificationStatus)
router.put('/update-reject-status',orderController.updateRejectStatus)
router.post('/verify-otp/:orderId',orderController.verifyOtp)
router.post('/generate-otp/:orderId',orderController.generateOtp)
module.exports  = router;