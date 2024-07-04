const express = require("express");
const router = express.Router();

const userController = require("../controller/userController");

router.route("/").get(userController.getAllUsers);
router.route("/:id").patch().delete();

module.exports = router;
