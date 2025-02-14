const express = require("express");
const cors = require('cors');
const { PrismaClient } = require("@prisma/client");
const {sendReferralemail} = require("./sendemail");
require("dotenv").config();

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/referral", async (req, res) => {
  try {
    const {
      referrerName,
      referrerEmail,
      refereeName,
      refereeEmail,
      courseName,
    } = req.body;

    if (
      !referrerName ||
      !referrerEmail ||
      !refereeName ||
      !refereeEmail ||
      !courseName
    ) {
      return res
        .status(400)
        .json({ error: "All required fields must be filled." });
    }

    // Save referral to the database
    const newReferral = await prisma.referral.create({
      data: {
        referrerName,
        referrerEmail,
        refereeName,
        refereeEmail,
        courseName,
      },
    });

    const emailResult = await sendReferralemail(
      referrerName,
      referrerEmail,
      refereeName,
      refereeEmail,
      courseName
    );

    if (emailResult.success) {
      return res
        .status(201)
        .json({
          message: "Referral submitted and email sent successfully!",
          referral: newReferral,
        });
    } else {
      res.status(500).json({ error: "Failed to send referral email." });
    }
  } catch (error) {
    console.error("Error submitting referral:", error);
    return res.status(500).json({ error: "Something went wrong!" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
