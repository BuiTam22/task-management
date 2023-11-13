const express = require("express");
const router  = express.Router();
const controller = require("../../../api/v1/controllers/task.controller.js");
const Task = require("../models/task.model.js");

router.get("/", controller.index)

router.get("/detail/:id", controller.detail);

router.patch("/change-status/:id", controller.changeStatus);

router.patch("/change-Multi", controller.changeMulti);


module.exports = router;