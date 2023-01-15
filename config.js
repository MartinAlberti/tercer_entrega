const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  DB_PASSWORD: process.env.DB_PASSWORD,
  ACCOUNT_SID: process.env.ACCOUNT_SID,
  AUTH_TOKEN: process.env.AUTH_TOKEN,
  TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,
  GMAIL_PASSWORD: process.env.GMAIL_PASSWORD,
  ETHEREAL_PASSWORD: process.env.ETHEREAL_PASSWORD,
};
