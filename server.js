const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config(); // Load .env

// Firebase Admin Initialization using ENV
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.GOOGLE_PROJECT_ID,
    clientEmail: process.env.GOOGLE_CLIENT_EMAIL,
    privateKey: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
});

const db = admin.firestore();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/api/hr-nomination', async (req, res) => {
  const { companyName, hrName, hrPhone, hrEmail, nominator, preferredTimeSlot } = req.body;
  try {
    await db.collection('hr-nominations').add({
      companyName,
      hrName,
      hrPhone,
      hrEmail,
      nominator,
      preferredTimeSlot,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });
    res.json({ success: true, message: 'Nomination saved to Firebase!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to save to Firebase', error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
