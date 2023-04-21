const { Schema, model } = require("mongoose");
const Joi = require("joi");

const { handleMongooseError } = require("../utils");
const subscriptionType = ["starter", "pro", "business"];

const userSchema = Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Set password for user"],
    },
    subscription: {
      type: String,
      enum: subscriptionType,
      default: "starter",
    },
    token: {
      type: String,
      default: "",
    },
    avatarURL: {
      type: String,
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleMongooseError);

const register = Joi.object({
  email: Joi.string().required().messages({
    "any.required": `missing required "email" field`,
  }),
  password: Joi.string().min(6).required().messages({
    "any.required": `missing required "password" field`,
  }),
  subscription: Joi.string().valid(...subscriptionType),
});

const login = Joi.object({
  email: Joi.string().required().messages({
    "any.required": `missing required "email" field`,
  }),
  password: Joi.string().required().messages({
    "any.required": `missing required "password" field`,
  }),
});

const schemas = {
  register,
  login,
};

const User = model("user", userSchema);

module.exports = {
  schemas,
  User,
};
