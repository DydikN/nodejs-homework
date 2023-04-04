const contacts = require("../../models/contacts");

const { ctrlWrapper } = require("../utils");

const { HttpError } = require("../../helpers");

const getAllContacts = async (req, res) => {
  res.json(await contacts.listContacts());
};

const getContactById = async (req, res, next) => {
  const { contactId } = req.params;
  const contactsById = await contacts.getContactById(contactId);

  if (!contactsById) {
    throw HttpError(404, `Contact with id: ${contactId} not found`);
  }
  res.json(contactsById);
};

const addNewContact = async (req, res) => {
  const { name, email, phone } = req.body;
  const newContact = await contacts.addContact(name, email, phone);
  res.status(201).json(newContact);
};

const deleteContactById = async (req, res) => {
  const { contactId } = req.params;
  const contactsById = await contacts.removeContact(contactId);

  if (!contactsById) {
    throw HttpError(404, `Contact with id: ${contactId} not found`);
  }

  res.json({ message: "contact deleted" });
};

const updateContactById = async (req, res) => {
  const { contactId } = req.params;
  const updatedContact = await contacts.updateContact(contactId, req.body);

  if (!updatedContact) {
    throw HttpError(404, `Contact with id: ${contactId} not found`);
  }
  res.status(201).json(updatedContact);
};

module.exports = {
  getAllContacts: ctrlWrapper(getAllContacts),
  getContactById: ctrlWrapper(getContactById),
  addNewContact: ctrlWrapper(addNewContact),
  deleteContactById: ctrlWrapper(deleteContactById),
  updateContactById: ctrlWrapper(updateContactById),
};
