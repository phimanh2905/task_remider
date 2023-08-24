module.exports = (app) => {
    const reports = require("../controllers/report.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Tutorial
    router.get("/", reports.getDataReport);
  
    app.use("/api/reports", router);
  };
  