"use strict";

const router = require("express").Router();
const controller = require("./leads.controller");



/////////////////////   USER    ///////////////////////////

router.post("/leads", controller.createNewLead);

router.get("/leads", controller.getAllLeads);
router.get("/leads/:id", controller.getLeadDetails);
router.put("/leads/:id", controller.updateLead);
router.delete("/leads/:id", controller.deleteLead);


module.exports = router;
