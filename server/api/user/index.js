"use strict";

const router = require("express").Router();
const controller = require("./user.controller");



/////////////////////   USER    ///////////////////////////

router.post("/signin", controller.signIn);

router.post("/signup", controller.signUp);

module.exports = router;
