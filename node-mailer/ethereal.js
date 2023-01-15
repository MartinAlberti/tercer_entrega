const nodemailer = require("nodemailer");
const envConfig = require('../config');


const TEST_MAIL = "cordell.wyman94@ethereal.email";
const PASSWORD = envConfig.ETHEREAL_PASSWORD;

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: TEST_MAIL,
    pass: PASSWORD,
  },
});

const mailPayload = {
  form: "Servidor Node.js",
  to: TEST_MAIL,
  subject: "Este es un mail de prueba desde Node.js",
  html: '<h1 style="color: teal;">Contenido de prueba enviado desde<span style="color: coral"> Node.js</span></h1>'
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
