const sgMail = require("@sendgrid/mail");

const { SENDGRID_API_KEY, EMAIL_FROM } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

const sendEmail = async (data) => {
  const email = { ...data, from: EMAIL_FROM };

  await sgMail.send(email);

  return true;
};

module.exports = sendEmail;
