const express = require("express");

const { validateBody } = require("../../utils");

const { isValidId, authenticate } = require("../../middlewares");

const { schemas } = require("../../models/contact");

const router = express.Router();

const ctrl = require("../../controllers/contacts-controllers");

router.get("/", authenticate, ctrl.getAllContacts);

router.get("/:contactId", authenticate, isValidId, ctrl.getContactById);

router.post(
  "/",
  authenticate,
  validateBody(schemas.addContactSchema),
  ctrl.addNewContact
);

router.delete("/:contactId", authenticate, isValidId, ctrl.deleteContactById);

router.patch(
  "/:contactId/favorite",
  authenticate,
  isValidId,
  validateBody(schemas.updateFavoriteContactSchema),
  ctrl.updateStatusContact
);

router.put(
  "/:contactId",
  authenticate,
  isValidId,
  validateBody(schemas.addContactSchema),
  ctrl.updateContactById
);

module.exports = router;
