"use strict";
/**
 *   Main application routes
 **/

module.exports = (app) => {
  app.use("/api/user", require("./api/user"));
  app.use("/api/leads", require("./api/leads"));

};
