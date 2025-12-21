import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import creditRoutes from "./routes/credit.js";
import verificationRouter from "./routes/verification.js";
import loanRoutes from "./routes/loans.js";
import adminRoutes from "./routes/admin.js";


const app = express();

app.use(cors());

app.use(express.json({ limit: "10mb" }));

app.use("/api/auth", authRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/loans", loanRoutes);

app.use("/api/credit", creditRoutes);

app.use("/api/verification", verificationRouter);

app.get("/", (req, res) => {
    res.json({
        message: "CrediScore Backend is running!",
        status: "OK",
    });
});

app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

export default app;