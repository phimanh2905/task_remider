module.exports = (app) => {
  const tasks = require("../controllers/task.controller.js");

  var router = require("express").Router();

  // Create a new Tutorial
  router.post("/sendmail", tasks.sendMail);

  app.use("/api/tasks", router);
};
