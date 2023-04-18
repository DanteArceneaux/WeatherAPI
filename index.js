const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.OPENWEATHERMAP_API_KEY;

app.get("/weather", async (req, res) => {
  const location = req.query.location;

  if (!location) {
    return res.status(400).send({ error: "Location is required" });
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=imperial`;
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API response error: ${errorText}`);
      return res.status(500).send({ error: "API response not OK" });
    }

    const data = await response.json();
    const temp = data.main?.temp;
    const humidity = data.main?.humidity;

    if (!temp) {
      console.error("Temperature not found in API response");
      return res
        .status(500)
        .send({ error: "Temperature not found in API response" });
    }

    res.send({ temp, humidity });
  } catch (err) {
    console.error(`API call error: ${err}`);
    res.status(500).send({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
