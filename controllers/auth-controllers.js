const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const fs = require("fs/promises");
const path = require("path");
const Jimp = require("jimp");
const { nanoid } = require("nanoid");

const { ctrlWrapper } = require("../utils");
const { HttpError, sendEmail } = require("../helpers");

const { User } = require("../models/user");

const { SECRET_KEY, BASE_URL } = process.env;

const avatarDir = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email already in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verificationToken = nanoid();

  const result = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  const verifyEmail = {
    to: email,
    subject: "Verification",
    html: `<a target="_blank" href=${BASE_URL}/api/users/verify/${verificationToken}>Click to verify<a>`,
  };

  await sendEmail(verifyEmail);

  res.status(201).json({
    email: result.email,
    password: result.password,
    subscription: result.subscription,
  });
};

const verify = async (req, res) => {
  const { verificationToken } = req.params;

  const user = await User.findOne({ verificationToken });

  if (!user) {
    throw HttpError(404, "Email not found");
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: "",
  });

  res.json({
    message: "Email verify success",
  });
};

const resendVerificationEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(404, "Email not found");
  }

  if (user.verify) {
    throw HttpError(404, "Verification has already been passed");
  }

  const verifyEmail = {
    to: email,
    subject: "Verification",
    html: `<a target="_blank" href=${BASE_URL}/api/users/verify/${user.verificationToken}>Click to verify<a>`,
  };

  await sendEmail(verifyEmail);

  res.json({
    message: "Email resend success",
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, "Email or password invalid");
  }

  const comparePassword = await bcrypt.compare(password, user.password);

  if (!comparePassword) {
    throw HttpError(401, "Email or password invalid");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });

  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token,
  });
};

const getCurrent = async (req, res) => {
  const { email } = req.user;

  res.json({ email });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204).json({ message: "Logout success" });
};

const updAvatar = async (req, res) => {
  const { _id } = req.user;

  if (!req.file) {
    throw HttpError(400, "Please select photo");
  }
  const { path: tempUpload, filename } = req.file;

  const image = await Jimp.read(tempUpload);
  await image.resize(250, 250).quality(100).writeAsync(tempUpload);

  const avatarName = `${_id}_${filename}`;

  const resultUpload = path.join(avatarDir, avatarName);
  await fs.rename(tempUpload, resultUpload);
  const avatarURL = path.join("avatars", avatarName);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({
    avatarURL,
  });
};

module.exports = {
  register: ctrlWrapper(register),
  verify: ctrlWrapper(verify),
  resendVerificationEmail: ctrlWrapper(resendVerificationEmail),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updAvatar: ctrlWrapper(updAvatar),
};
