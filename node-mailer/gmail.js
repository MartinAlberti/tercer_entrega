const nodemailer = require("nodemailer");
const envConfig = require('../config');


const TEST_MAIL = "martinalberti123@gmail.com";
const PASSWORD = envConfig.GMAIL_PASSWORD;

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: TEST_MAIL,
    pass: PASSWORD,
  },
});

const mailPayload = {
  form: TEST_MAIL ,
  to: "cordell.wyman94@ethereal.email",
  subject: "Este es un mail de prueba desde GMAIL con Node.js",
  html: '<h1 style="color: teal;">Contenido de prueba enviado desde<span style="color: coral">Node.js</span></h1>'
  ,
};
const sendMail = async () => {
  try {
    const mailResponse = await transporter.sendMail(mailPayload);
    console.log(mailResponse);
  } catch (error) {
    console.log(error.message);
  }
};
sendMail()
