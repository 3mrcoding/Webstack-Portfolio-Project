const express = require("express");
const router = express.Router();

const userController = require("../controller/userController");
const authController = require("../controller/authController");

router.route("/").get(userController.getAllUsers);
router
  .route("/:id")
  .get(userController.getUserById)
  .delete(userController.deleteUserById);

router.post("/signup", authController.createUser);

module.exports = router;
