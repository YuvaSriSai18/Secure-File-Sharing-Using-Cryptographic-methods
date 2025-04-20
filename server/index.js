const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
  })
);

// Routes
app.get("/test", (req, res) => {
  return res.send("Test endpoint working!");
});

const authRoutes = require("./routes/authRoute");
app.use("/api/auth", authRoutes);
const fileRoutes = require("./routes/fileRoute");
app.use("/api/files", fileRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
