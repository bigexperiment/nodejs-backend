const dotenvResult = require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors("https://data.maccopypasta.com"));
app.use(express.json());

// Dynamic import of node-fetch
import("node-fetch").then((nodeFetch) => {
  const fetch = nodeFetch.default;

  async function chatgpt(inputText) {
    try {
      // Move the code that requires the API key inside this function
      //   const apikey = process.env.API_KEY;
      const apikey = process.env.API_KEY;

      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apikey}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo-1106",
            messages: [
              {
                role: "user",
                content: `format this text nicely. Correct any possible typos or errors. Return me the final formatted text only. Nothing else. [${inputText}]`,
              },
            ],
          }),
        }
      );

      const data = await response.json();
      console.log(data);
      return data.choices[0].message.content;
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  }

  // Route to handle the license verification
  app.post("/verify", (req, res) => {
    const { licenseKey, input } = req.body;

    let bodyOfGumroadRequest = `product_id=NhAqLP5xtahtiBzKPeoeSw==&license_key=${licenseKey}`;

    fetch("https://api.gumroad.com/v2/licenses/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: bodyOfGumroadRequest,
    })
      .then((response) => {
        console.log(response.status);
        return response.json();
      })
      .then((data) => {
        if (data.success && input) {
          chatgpt(input)
            .then((outputData) => {
              res.json({
                output: outputData,
                test: "test",
              });
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          res.status(401).json({ error: "Invalid license key", value: data });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      });
  });

  // Start the server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
