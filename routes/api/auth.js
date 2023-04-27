const express = require("express");

const { validateBody } = require("../../utils");
const { authenticate, upload } = require("../../middlewares");
const { schemas } = require("../../models/user");
const router = express.Router();
const ctrl = require("../../controllers/auth-controllers");

router.post("/register", validateBody(schemas.register), ctrl.register);

router.get("/verify/:verificationToken", ctrl.verify);

router.post("/login", validateBody(schemas.login), ctrl.login);

router.get("/current", authenticate, ctrl.getCurrent);

router.post("/logout", authenticate, ctrl.logout);

router.patch("/avatars", authenticate, upload.single("avatar"), ctrl.updAvatar);

module.exports = router;
