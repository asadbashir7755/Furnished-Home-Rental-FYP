const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name: { type: String },
    username: { type: String },
    email: { type: String },
    phone: { type: String },
    country: { type: String },
    countryCode: { type: String },
    password: { type: String },
    confirmPassword: { type: String },
    role: { type: String, default: "user" },
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: String },
    googleId: { type: String }, // Add googleId field
    authProvider: { type: String, default: "local" }, // Add authProvider field
}, { timestamps: true });

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    this.confirmPassword = await bcrypt.hash(this.confirmPassword, 10);
    next();
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
