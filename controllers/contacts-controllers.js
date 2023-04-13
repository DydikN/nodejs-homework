const { ctrlWrapper } = require("../utils");
const { HttpError } = require("../helpers");

const { Contact } = require("../models/contact");

const getAllContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10, favourite = false } = req.query;
  const skip = (page - 1) * limit;
  const result = await Contact.find({ owner }, "-createdAt -updatedAt", {
    skip,
    limit,
    favourite,
  }).populate("owner", "email subscription");
  res.json(result);
};

const getContactById = async (req, res, next) => {
  const { contactId } = req.params;

  const contactsById = await Contact.findById(contactId);

  console.log(contactsById);

  if (!contactsById) {
    throw HttpError(404, `Contact with id: ${contactId} not found`);
  }
  res.json(contactsById);
};

const addNewContact = async (req, res) => {
  const { _id: owner } = req.user;

  const newContact = await Contact.create({ ...req.body, owner });
  res.status(201).json(newContact);
};

const deleteContactById = async (req, res) => {
  const { contactId } = req.params;
  const contactsById = await Contact.findByIdAndRemove(contactId);

  if (!contactsById) {
    throw HttpError(404, `Contact with id: ${contactId} not found`);
  }

  res.json({ message: "contact deleted" });
};

const updateContactById = async (req, res) => {
  const { contactId } = req.params;
  const updatedContact = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });

  if (!updatedContact) {
    throw HttpError(404, `Contact with id: ${contactId} not found`);
  }
  res.status(201).json(updatedContact);
};

const updateStatusContact = async (req, res) => {
  const { contactId } = req.params;
  const updatedContact = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });

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
  updateStatusContact: ctrlWrapper(updateStatusContact),
};
