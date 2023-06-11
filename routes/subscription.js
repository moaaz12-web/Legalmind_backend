const express = require("express");
const router = express.Router();
const subscriptionController = require("../controllers/subscription.js");

router.post("/subscribed", subscriptionController.subscribed);

module.exports = router;