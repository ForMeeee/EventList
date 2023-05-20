const nodemailer = require("nodemailer");
const Mustache = require("mustache");
const { gmail, password } = require("../../config");
const fs = require("fs");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: gmail,
    pass: password,
  },
});

const otpMail = async (email, data) => {
  try {
    let template = fs.readFileSync("app/views/email/otp.html", "utf8");

    let message = {
      from: gmail,
      to: email,
      subject: "Otp for registration is: ",
      html: Mustache.render(template, data),
    };

    return await transporter.sendMail(message);
  } catch (ex) {
    console.log(ex);
  }
};

const invoiceMail = async (data) => {
  try {
    let template = fs.readFileSync("app/views/email/invoice.html", "utf8");
    const view = Mustache.render(template, data);
    
    let message = {
      from: gmail,
      to: data.personalDetail.email,
      subject: "Invoice - Eventlist",
      html: view,
    };

    return await transporter.sendMail(message);
  } catch (err) {
    console.log(err)
  }
}

const receiptMail = async (data) => {
  try {
    let template = fs.readFileSync("app/views/email/receipt.html", "utf8");
    const view = Mustache.render(template, data);
    
    let message = {
      from: gmail,
      to: data.personalDetail.email,
      subject: "Receipt - Eventlist",
      html: view,
    };

    console.log(view)
    return await transporter.sendMail(message);
  } catch (err) {
    console.log(err)
  }
}

module.exports = { otpMail, invoiceMail, receiptMail };