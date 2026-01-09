require('dotenv').config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const errorHandler = require("./middleware/errorHandler");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require('method-override');

const app = express();

// 1. Configuration
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// 2. Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// 3. Database Connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.Mongo_URL);
        console.log("✅ MongoDB Connected Successfully");
    } catch (err) {
        console.error("❌ MongoDB Connection Failed:", err.message);
        process.exit(1);
    }
};
connectDB();

// 4. Routes
const doubtRoutes = require("./routes/doubtRoutes");
app.use("/doubts", doubtRoutes);

// 5. 404 Handler (The fix you just applied)
// 5. 404 Handler - The NEW Express 5 syntax
// Alternative 404 Handler if routes don't match
app.use((req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
});

// 6. Global Error Middleware
app.use(errorHandler);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server active on http://localhost:${PORT}/doubts/dashboard`);
});