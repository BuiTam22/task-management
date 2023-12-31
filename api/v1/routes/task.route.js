const express = require("express");
const router  = express.Router();
const controller = require("../../../api/v1/controllers/task.controller.js");
router.get("/", controller.index)

router.get("/detail/:id", controller.detail);

router.patch("/change-status/:id", controller.changeStatus);

router.patch("/change-Multi", controller.changeMulti);

router.post("/create", controller.create);

router.patch("/edit/:id", controller.edit);

router.patch("/delete/:id", controller.delete);


module.exports = router;