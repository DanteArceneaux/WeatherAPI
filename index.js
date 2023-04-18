const express = require("express");
const https = require("https");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const API_ENDPOINT = "https://api.weatherapi.com/v1/current.json";
const API_KEY = process.env.API_KEY;

app.get("/weather/:city", (req, res) => {
  const { city } = req.params;
  const url = `${API_ENDPOINT}?key=${API_KEY}&q=${city}`;

  https
    .get(url, (response) => {
      let body = "";

      response.on("data", (chunk) => {
        body += chunk;
      });

      response.on("end", () => {
        const data = JSON.parse(body);

        if (response.statusCode !== 200) {
          return res
            .status(400)
            .send({ error: `Failed to fetch weather data for ${city}` });
        }

        const { temp_c, feelslike_c, condition } = data.current;

        res.send({
          city,
          temperature: temp_c,
          feelsLike: feelslike_c,
          description: condition.text,
        });
      });
    })
    .on("error", (error) => {
      res.status(400).send({ error: error.message });
    });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
