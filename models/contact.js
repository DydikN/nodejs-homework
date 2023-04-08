const { Schema, model } = require("mongoose");

const { handleMongooseError } = require("../utils");

const Joi = require("joi");
const phonePattern = /^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$/;

const contactSchema = Schema(
  {
    name: {
      type: String,
      min: 2,
      max: 30,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
      min: 2,
      required: [true, "Set email for contact"],
    },
    phone: {
      type: String,
      min: 2,
      match: phonePattern,
      required: [true, "Set phone  for contact"],
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: true }
);

contactSchema.post("save", handleMongooseError);

const addContactSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": `missing required "name" field`,
  }),
  email: Joi.string().required().messages({
    "any.required": `missing required "email" field`,
  }),
  phone: Joi.string().pattern(phonePattern).required().messages({
    "any.required": `missing required "phone" field`,
  }),
  favorite: Joi.boolean(),
});

const updateFavoriteContactSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

const schemas = {
  addContactSchema,
  updateFavoriteContactSchema,
};

const Contact = model("contact", contactSchema);

module.exports = { Contact, schemas };
