const Contact = require("../models/Contact");
const nodemailer = require("nodemailer");

// create transporter once (outside function)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

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

    // send response immediately
    res.status(200).json({
      success: true,
      message: "Message sent successfully 🚀"
    });

    // send email in background
    transporter.sendMail({
      from: email,
      to: process.env.EMAIL_USER,
      subject: "New Portfolio Message",
      text: `
      Name: ${name}
      Email: ${email}
      Subject: ${subject}
      Message: ${message}
      `
    }).then(() => {
      console.log("Email sent");
    }).catch(err => {
      console.log("Email error:", err);
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }
};