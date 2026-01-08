// src/database.js
const mongoose = require("mongoose");


// Conexión a tu cluster
mongoose
  .connect("mongodb+srv://admin1:diamante1@bingoauth.wlul1.mongodb.net/webauthn")
  .then(() => console.log("Database is connected"))
  .catch((error) => console.error("Connection error:", error));