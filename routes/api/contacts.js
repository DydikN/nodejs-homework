const express = require("express");
const Joi = require("joi");

const contacts = require("../../models/contacts");

const { HttpError } = require("../../helpers");

const router = express.Router();

const contactSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": `missing required "name" field`,
  }),
  email: Joi.string().required().messages({
    "any.required": `missing required "email" field`,
  }),
  phone: Joi.string().required().messages({
    "any.required": `missing required "phone" field`,
  }),
});

router.get("/", async (req, res, next) => {
  try {
    res.json(await contacts.listContacts());
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contactsById = await contacts.getContactById(contactId);

    if (!contactsById) {
      throw HttpError(404, `Contact with id: ${contactId} not found`);
    }
    res.json(contactsById);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { error } = contactSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }

    const { name, email, phone } = req.body;
    const newContact = await contacts.addContact(name, email, phone);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contactsById = await contacts.removeContact(contactId);

    if (!contactsById) {
      throw HttpError(404, `Contact with id: ${contactId} not found`);
    }

    res.json({ message: "contact deleted" });
  } catch (error) {
    next(error);
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const { error } = contactSchema.validate(req.body);
    if (error) {
      throw HttpError(400, (error.message = "missing fields"));
    }

    const { contactId } = req.params;
    const updatedContact = await contacts.updateContact(contactId, req.body);

    if (!updatedContact) {
      throw HttpError(404, `Contact with id: ${contactId} not found`);
    }
    res.status(201).json(updatedContact);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
