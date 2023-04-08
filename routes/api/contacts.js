const express = require("express");

const { validateBody } = require("../../utils");

const { schemas } = require("../../models/contact");

const router = express.Router();

const ctrl = require("../../controllers");

router.get("/", ctrl.getAllContacts);

router.get("/:contactId", ctrl.getContactById);

router.post("/", validateBody(schemas.addContactSchema), ctrl.addNewContact);

router.delete("/:contactId", ctrl.deleteContactById);

router.patch(
  "/:contactId/favorite",
  validateBody(schemas.updateFavoriteContactSchema),
  ctrl.updateStatusContact
);

router.put(
  "/:contactId",
  validateBody(schemas.addContactSchema),
  ctrl.updateContactById
);

module.exports = router;
