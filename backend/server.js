const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const limiter = require("./middleware/rateLimiter");

dotenv.config();

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors({
  origin: "*", // Allow all origins (for development). In production, specify allowed origins.
}));
app.use(express.json());

// Rate limiter for contact API
app.use("/api/contact", limiter);

// Routes
app.use("/api/contact", require("./routes/contactRoutes"));

// Port
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Backend is running 🚀');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});