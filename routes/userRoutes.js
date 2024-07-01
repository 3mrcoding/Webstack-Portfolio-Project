const express = require("express");
const router = express.router();

router.route("/api/users").get();
router.route("/api/users/:id").get().delete();
