const Contact = require("../models/Contact");
const nodemailer = require("nodemailer");

exports.sendMessage = async (req, res) => {

  try {

    const { name, email, subject, message } = req.body;

    const newMessage = new Contact({
      name,
      email,
      subject,
      message
    });

    await newMessage.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: email,
      to: process.env.EMAIL_USER,
      subject: "New Portfolio Message",
      text: `
      Name: ${name}
      Email: ${email}
      Subject: ${subject}
      Message: ${message}
      `
    });

    res.status(200).json({ success: true });

  } catch (error) {

    res.status(500).json({ error: "Server error" });

  }
};