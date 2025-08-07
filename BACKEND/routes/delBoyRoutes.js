const express = require("express");
const router = express.Router();
const delBoyController = require("../controllers/delBoyController");

router.post("/sign-up",delBoyController.signUp);
router.post("/log-in",delBoyController.logIn);
router.put("/update-location/:id",delBoyController.updateLoc);
router.post("/getLoc",delBoyController.getLocation);
router.put("/update-available-status/:id",delBoyController.updateAvailStatus);
router.get("/fetchStatus/:id",delBoyController.fetchStatus);

module.exports = router;