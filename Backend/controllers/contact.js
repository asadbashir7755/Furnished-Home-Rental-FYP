const ContactUs = require("../models/ContactUs");
const nodemailer = require("nodemailer");

function validateEmail(email) {
  // Simple email regex for validation
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

exports.submitContactForm = async (req, res) => {
  try {
    const { firstName, lastName, phone, email, message } = req.body;

    // Robust validation
    if (
      !firstName || !lastName || !phone || !email || !message ||
      typeof firstName !== "string" ||
      typeof lastName !== "string" ||
      typeof phone !== "string" ||
      typeof email !== "string" ||
      typeof message !== "string"
    ) {
      return res.status(400).json({ message: "All fields are required and must be valid strings." });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email address." });
    }
    if (phone.length < 7 || phone.length > 20) {
      return res.status(400).json({ message: "Invalid phone number." });
    }
    if (message.length < 5) {
      return res.status(400).json({ message: "Message is too short." });
    }

    // Save to DB
    await ContactUs.create({ firstName, lastName, phone, email, message });

    // Setup nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email to user
    const userMailOptions = {
      from: `"Furnished Home Rental" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Thank you for contacting Furnished Home Rental",
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f6f8fa; padding: 32px;">
          <div style="max-width: 520px; margin: 0 auto; background: #fff; border-radius: 12px; box-shadow: 0 4px 24px #e3e8ee; padding: 32px;">
            <div style="text-align: center;">
              <img src="https://img.icons8.com/color/96/000000/home--v2.png" alt="Furnished Home Rental" style="margin-bottom: 12px;" />
              <h2 style="color: #1890ff; margin-bottom: 8px;">Thank you for reaching out, ${firstName}!</h2>
              <p style="font-size: 17px; color: #333; margin-bottom: 24px;">
                We have received your message and our team will get back to you as soon as possible.
              </p>
            </div>
            <div style="background: #f7f9fb; border-radius: 8px; padding: 18px 20px; margin-bottom: 24px;">
              <h3 style="color: #1890ff; margin-bottom: 10px;">Your Submitted Details</h3>
              <table style="width: 100%; font-size: 15px; color: #222;">
                <tr>
                  <td style="padding: 6px 0;"><b>Name:</b></td>
                  <td style="padding: 6px 0;">${firstName} ${lastName}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0;"><b>Email:</b></td>
                  <td style="padding: 6px 0;">${email}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0;"><b>Phone:</b></td>
                  <td style="padding: 6px 0;">${phone}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; vertical-align: top;"><b>Message:</b></td>
                  <td style="padding: 6px 0; white-space: pre-line;">${message}</td>
                </tr>
              </table>
            </div>
            <div style="font-size: 15px; color: #444; margin-bottom: 18px;">
              <p>
                If you have any urgent queries, you can also reach us at 
                <a href="mailto:${process.env.admin_email}" style="color: #1890ff;">${process.env.admin_email}</a>.
              </p>
              <p style="margin-top: 12px;">
                Best regards,<br>
                <b>Furnished Home Rental Team</b>
              </p>
            </div>
            <div style="text-align: center; color: #aaa; font-size: 13px; margin-top: 18px;">
              &copy; ${new Date().getFullYear()} Furnished Home Rental. All rights reserved.
            </div>
          </div>
        </div>
      `,
    };

    // Email to admin
    const adminMailOptions = {
      from: `"Furnished Home Rental" <${process.env.EMAIL_USER}>`,
      to: process.env["admin-email"],
      subject: "New Contact Form Submission",
      html: `
        <div style="font-family: Arial, sans-serif; color: #222;">
          <h2 style="color: #1890ff;">New Contact Form Submission</h2>
          <ul>
            <li><b>Name:</b> ${firstName} ${lastName}</li>
            <li><b>Email:</b> ${email}</li>
            <li><b>Phone:</b> ${phone}</li>
            <li><b>Message:</b> ${message}</li>
          </ul>
          <p>Submitted at: ${new Date().toLocaleString()}</p>
        </div>
      `,
    };

    // Send both emails in parallel and handle errors gracefully
    try {
      await Promise.all([
        transporter.sendMail(userMailOptions),
        transporter.sendMail(adminMailOptions)
      ]);
    } catch (emailErr) {
      console.error("Error sending confirmation or admin email:", emailErr);
      // Still return success for the form, but mention email issue
      return res.status(201).json({
        message: "Contact form submitted. Email delivery failed, but your message was received."
      });
    }

    res.status(201).json({ message: "Contact form submitted successfully. Confirmation email sent." });
  } catch (error) {
    console.error("Error submitting contact form:", error);
    res.status(500).json({ message: "Failed to submit contact form." });
  }
};
