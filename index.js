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
app.use(express.static(path.join(__dirname, "dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Middleware
app.use(bodyParser.json());
const allowedOrigins = [
  'https://blog-client-9gw84kx6i-preshi-zankats-projects.vercel.app'
];
app.use(cors({
   origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Add the HTTP methods you need
  credentials: true,
}));
app.use(morgan("dev"));


// Routes
app.use("/api/posts", require("./routes/post"));


app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});

// Server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
