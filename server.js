const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { Resend } = require("resend");

dotenv.config();

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// INIT RESEND
const resend = new Resend(process.env.RESEND_API_KEY);

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// CONTACT ROUTE
app.post("/contact", async (req, res) => {

  const { name, email, message } = req.body;

  try {

    const response = await resend.emails.send({

      from: "Portfolio <onboarding@resend.dev>",

      to: process.env.EMAIL_USER,

      reply_to: email,

      subject: `New Message from ${name}`,

      html: `
        <h2>New Contact Message</h2>

        <p><b>Name:</b> ${name}</p>

        <p><b>Email:</b> ${email}</p>

        <p><b>Message:</b> ${message}</p>
      `
    });

    return res.json({
      success: true,
      message: "Email sent successfully ✅",
      data: response
    });

  } catch (error) {

    console.log("EMAIL ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send email ❌"
    });

  }

});

// PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});