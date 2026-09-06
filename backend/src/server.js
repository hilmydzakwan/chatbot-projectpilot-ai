import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chatRoutes from "./routes/chatRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/", (req, res) => {
  res.json({ status: "ok", service: "ProjectPilot AI backend" });
});

app.use("/api", chatRoutes);

// Fallback error handler for anything unexpected (e.g. malformed JSON body)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err?.message || err);
  res.status(500).json({ success: false, message: "Something went wrong on the server." });
});

app.listen(PORT, () => {
  console.log(`ProjectPilot AI backend running on http://localhost:${PORT}`);
});
