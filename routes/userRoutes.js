const express = require("express");
const router = express.Router();

const userController = require("../controller/userController");

router.route("/").get(userController.getAllUsers);
router
  .route("/:id")
  .get(userController.getUserById)
  .patch()
  .delete(userController.deleteUserById);

module.exports = router;
