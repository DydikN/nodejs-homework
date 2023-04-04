const express = require("express");

const { validateBody } = require("../../utils");

const schemas = require("../../schemas/contact-schema");

const router = express.Router();

const ctrl = require("../../controllers");

router.get("/", ctrl.getAllContacts);

router.get("/:contactId", ctrl.getContactById);

router.post("/", validateBody(schemas.contactSchema), ctrl.addNewContact);

router.delete("/:contactId", ctrl.deleteContactById);

router.put(
  "/:contactId",
  validateBody(schemas.contactSchema),
  ctrl.updateContactById
);

module.exports = router;
