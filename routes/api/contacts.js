const express = require("express");

const { validateBody } = require("../../utils");

const { isValidId } = require("../../middlewares");

const { schemas } = require("../../models/contact");

const router = express.Router();

const ctrl = require("../../controllers/contacts-controllers");

router.get("/", ctrl.getAllContacts);

router.get("/:contactId", isValidId, ctrl.getContactById);

router.post("/", validateBody(schemas.addContactSchema), ctrl.addNewContact);

router.delete("/:contactId", isValidId, ctrl.deleteContactById);

router.patch(
  "/:contactId/favorite",
  isValidId,
  validateBody(schemas.updateFavoriteContactSchema),
  ctrl.updateStatusContact
);

router.put(
  "/:contactId",
  isValidId,
  validateBody(schemas.addContactSchema),
  ctrl.updateContactById
);

module.exports = router;
