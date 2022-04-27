const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

// Database connection
require("./config/database");

const app = require("./app");
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`App listening on ${PORT}...`);
});
