const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path = require("path");

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(bodyParser.json());

// CORS configuration
const allowedOrigins = [
  'https://vercel.com/preshi-zankats-projects/blog-client/5dNLLmYPxD6jhr1CVTyfj6Xe5sLc',
   "https://blog-client-one-drab.vercel.app/",
  'https://api.unsplash.com/search/photos?query=${query}&client_id=qHoSgW1oMKc5Pz_YbpEtmOxwfz1BaYH4tx-vAV3eSI8'
];

app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use(morgan("dev"));

// API Routes
app.use("/api/posts", require("./routes/post"));

// Serve static files from React build folder
app.use(express.static(path.join(__dirname, "dist")));

// Serve index.html for all other routes (Important for client-side routing)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Error handling for unrecognized routes
app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});

// Server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
