const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const medicineController = require('../controllers/medicineController');
// const LoggedInMiddleWare = require('../MiddleWare/auth')
 

router.post('/med-check',upload.fields([{ name: 'photo', maxCount: 1 }, { name: 'name', maxCount: 1 }]),medicineController.medCheck);

module.exports  = router;