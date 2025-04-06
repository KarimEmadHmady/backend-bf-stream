const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const orderRoutes = require("./routes/orderRoutes");
const Order = require("./models/Order");
const statusRoutes = require("./routes/statusRoutes");
const cron = require("node-cron");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

app.use(express.json());
app.use(cors());
app.use(cookieParser());

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/orders", orderRoutes);
app.use("/api/status", statusRoutes);

const deleteOldOrders = async () => {
  try {
    const twelveHoursAgo = new Date(Date.now() - 5 * 60 * 60 * 1000);
    const result = await Order.deleteMany({ date: { $lt: twelveHoursAgo } });
    console.log(`Old orders deleted: ${result.deletedCount}`);
  } catch (error) {
    console.error("Error deleting old orders:", error);
  }
};

cron.schedule("0 */5 * * *", () => {
  console.log("Running scheduled task to delete old orders...");
  deleteOldOrders();
});

app.use((req, res, next) => {
  console.log(`Received request for: ${req.originalUrl}`);
  next();
});

app.get("/", (req, res) => {
  res.send("Backend is running.....");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
