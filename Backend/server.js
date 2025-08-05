const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session"); 
const connectDB = require("./config/db");
const API_ENDPOINTS = require("./config/apiconfig");
const path = require("path");
const passport = require("passport");
require("./config/passport"); // Ensure passport configuration is loaded

dotenv.config(); // Ensure this is called to load environment variables
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
const corsOptions = {
    origin: process.env.CLIENT_URL || 'http://localhost:5173', // Allow only your frontend URL
    methods: 'GET,POST,PUT,DELETE', // Allowed methods
    credentials: true, // If you want to allow cookies (optional)
};

app.use(cors(corsOptions)); // Use the cors configuration

// Configure express-session
app.use(session({
    secret: process.env.SESSION_SECRET, // Use a secret key from environment variables or a default value
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true,
    sameSite: 'none' }// Set secure to true if using HTTPS
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use("/api/users", require("./routes/userroutes"));
app.use(API_ENDPOINTS.items.base, require("./routes/itemmanageroutes"));
app.use("/api", require("./routes/dashboardroutes")); 
app.use("/api", require("./routes/ManageUserRoutes")); 
app.use("/auth", require("./routes/authroutes")); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
