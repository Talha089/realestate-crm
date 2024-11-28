'use strict';

let crypto = require("crypto");
let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let LeadsSchema = new Schema({
    name: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    phone: { type: String },
    status: { type: String, enum: ['New', 'Contacted', 'Qualified', "Lost", "Closed"], default: "New" },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})


module.exports = mongoose.model("Leads", LeadsSchema);