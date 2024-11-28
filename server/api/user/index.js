"use strict";

const router = require("express").Router();
const auth = require('../../auth/auth.service');
const controller = require("./user.controller");



/////////////////////   USER    ///////////////////////////

router.post("/signin", controller.signIn);

router.post("/signup", controller.signUp);

router.get('/', auth.isAuthenticated(), controller.getAllUsers);


module.exports = router;
