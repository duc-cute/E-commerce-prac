/** @format */
const router = require("express").Router();
const ctrls = require("../controller/userController");
router.post("/register", ctrls.register);
router.post("/login", ctrls.login);
module.exports = router;
