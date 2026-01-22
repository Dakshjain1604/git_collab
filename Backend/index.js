const express = require("express");
const app = express();
const cors = require("cors");

// CORS configuration - allow frontend origin
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:5174",
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    message: "back",
  });
});

const userRoutes = require("./routes/userRoutes");
const analysisRoutes = require("./routes/analysisRoutes");
const jobSearchRoutes = require("./routes/jobSearchRoutes");

app.use("/user", userRoutes);
app.use("/analysis", analysisRoutes);
app.use("/jobs", jobSearchRoutes);

app.listen(3000, () => {
  console.log("Backend server running on port 3000");
});