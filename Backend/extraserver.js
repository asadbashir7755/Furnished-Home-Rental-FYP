const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const path = require("path");

dotenv.config();
connectDB();

const app = express();
app.set("trust proxy", 1); // Fix HTTPS redirect issue

// Middleware
app.use(express.json());
app.use(cookieParser());

// Log requests for debugging
app.use((req, res, next) => {
    console.log(`Endpoint Hit: ${req.method} ${req.originalUrl}`);
    next();
});

// CORS Fix
const corsOptions = {
    origin: "https://furnished-home-rental.vercel.app",
    methods: "GET, POST, PUT, DELETE, OPTIONS",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 200,
};

// Handle CORS preflight requests explicitly
app.options("*", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "https://furnished-home-rental.vercel.app");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.status(200).end();
});

// Apply CORS middleware
app.use(cors(corsOptions));

// Root route
app.get("/", (req, res) => {
    res.send("API is running. Visit https://furnished-home-rental.vercel.app for the frontend.");
});

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Fixed Route Paths
app.use("/api/users", require("./routes/userroutes"));
app.use("/api/items", require("./routes/itemmanageroutes"));
app.use("/api", require("./routes/dashboardroutes"));
app.use("/api", require("./routes/ManageUserRoutes"));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
