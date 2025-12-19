// app.js - Slightly improved version
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import creditRoutes from "./routes/credit.js";
import verificationRouter from "./routes/verification.js";
import loanRoutes from "./routes/loans.js";
import adminRoutes from "./routes/admin.js";


const app = express();

// Allow only your frontend (more secure)
app.use(cors());

// Parse JSON (increased limit for future file uploads)
app.use(express.json({ limit: "10mb" }));

// Mount auth routes
app.use("/api/auth", authRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/loans", loanRoutes);

app.use("/api/credit", creditRoutes);

app.use("/api/verification", verificationRouter);

// Health check route
app.get("/", (req, res) => {
    res.json({
        message: "CrediScore Backend is running!",
        status: "OK",
    });
});

// 404 handler (nice to have)
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

export default app;
