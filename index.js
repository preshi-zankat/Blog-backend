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

const allowedOrigins = [
  "https://blog-client-mjhp0rhcy-preshi-zankats-projects.vercel.app",
  "https://blog-client-one-drab.vercel.app",
  "https://blog-client-git-main-preshi-zankats-projects.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

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
