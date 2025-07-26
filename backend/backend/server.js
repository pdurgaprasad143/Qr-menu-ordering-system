import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import chefRoutes from "./routes/chefRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import dishRoutes from "./routes/dishRoutes.js";
import tableRoutes from "./routes/tableRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import os from "os";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

app.use(
  cors({
    origin: [/^http:\/\/192\.168\.\d+\.\d+:\d+$/, "http://localhost:5173"], // ✅ Allow all local network IPs
    credentials: true,
  })
);

// Routes
app.use("/api/chefs", chefRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/dishes", dishRoutes);
app.use("/api", tableRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/messages", messageRoutes);

// ✅ Function to Get Local Network IP (Dynamically Fetchable)
const getLocalIp = () => {
  const interfaces = os.networkInterfaces();
  for (const iface of Object.values(interfaces)) {
    if (!iface) continue;
    for (const details of iface) {
      if (details.family === "IPv4" && !details.internal) {
        return details.address;
      }
    }
  }
  return "127.0.0.1";
};

const localIP = getLocalIp();

// ✅ API Endpoint to Fetch Local IP (For Frontend)
app.get("/api/ip", (req, res) => {
  res.json({ ip: getLocalIp() }); // Always return the latest local IP
});

// ✅ Start Server and Log Accessible URLs
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on:`);
  console.log(`➡️  Local:   http://localhost:${PORT}`);
  console.log(
    `➡️  Network: http://${localIP}:${PORT} (Use this on your mobile)`
  );
});
