const express = require('express');
const router = express.Router();
const pageController = require('../controller/page.controller')




router.get("/", pageController.getMainPage)




module.exports = router;