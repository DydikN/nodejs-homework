const express = require("express");

const { validateBody } = require("../../utils");
const { authenticate } = require("../../middlewares");
const { schemas } = require("../../models/user");
const router = express.Router();
const ctrl = require("../../controllers/auth-controllers");

router.post("/register", validateBody(schemas.register), ctrl.register);

router.post("/login", validateBody(schemas.login), ctrl.login);

router.get("/current", authenticate, ctrl.getCurrent);

router.post("/logout", authenticate, ctrl.logout);

module.exports = router;
