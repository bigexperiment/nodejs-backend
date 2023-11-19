const express = require("express");
const cors = require("cors");
const app = express();

// Enable CORS for all routes and origins
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// The valid license key
const VALID_LICENSE_KEY = "ganesh";

// Route to handle the license verification
app.post("/verify", (req, res) => {
  const { licenseKey, input } = req.body;

  // Check if the license key is valid
  if (licenseKey === VALID_LICENSE_KEY) {
    // If valid, return the uppercase version of the input
    const output = input.toUpperCase();
    res.json({ output });
  } else {
    // If invalid, return an error message
    res.status(401).json({ error: "Invalid license key" });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
