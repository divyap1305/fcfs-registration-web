const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => {
    console.error("MongoDB Connection Failed ❌");
    console.error(err.message);
  });

// ROUTES
app.use("/events", require("./routes/events"));
app.use("/admin", require("./routes/admin"));

app.listen(5000, () => console.log("Server running on port 5000"));
