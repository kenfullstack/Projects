const fs = require("fs");

let config = {};

if (
  process.env.REST_COUNTRIES_API_KEY ||
  process.env.GEMINI_API_KEY
) {
  config = {
    REST_COUNTRIES_API_KEY: process.env.REST_COUNTRIES_API_KEY,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY
  };
}

else if (fs.existsSync("config.json")) {
  config = JSON.parse(
    fs.readFileSync("config.json", "utf8")
  );
}

fs.writeFileSync(
  "config.json",
  JSON.stringify(config, null, 2)
);

console.log("config.json created successfully!");