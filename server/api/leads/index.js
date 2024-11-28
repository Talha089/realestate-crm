"use strict";

const router = require("express").Router();
const controller = require("./leads.controller");
const auth = require('../../auth/auth.service');



/////////////////////   USER    ///////////////////////////

router.post("/leads", auth.isAuthenticated(), controller.createNewLead);

router.get("/leads", auth.isAuthenticated(), controller.getAllLeads);
router.get("/leads/:id", auth.isAuthenticated(), controller.getLeadDetails);
router.put("/leads/:id", auth.isAuthenticated(), controller.updateLead);
router.delete("/leads/:id", auth.isAuthenticated(), controller.deleteLead);

router.get('/stats', controller.getStats)



module.exports = router;
