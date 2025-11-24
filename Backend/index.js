const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

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