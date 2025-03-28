const mongoose = require("mongoose");
const dotenv = require("dotenv");
const express = require("express");
const cors= require("cors");
const connectDB = require("./Config/db")
const passengerRoutes = require("./routes/passengerRoutes")
const conductorRoutes = require("./Routes/conductorRoutes");
const adminRoutes = require("./Routes/adminRoutes")
const routeRoutes = require('./Routes/routeRoutes');
const transactionRoutes = require("./Routes/transactionRoutes");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

connectDB();

app.use("/api/passenger", passengerRoutes);
app.use("/api/conductor", conductorRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/route", routeRoutes); 
app.use("/api/transaction", transactionRoutes);

app.get("/", (req, res) => {
  res.send("HIII THis is Connected");
});

const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0"; 
//app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

app.listen(PORT, HOST, () => {
  console.log(`🚀 Server is running and accessible at http://0.0.0.0:${PORT}`);
});