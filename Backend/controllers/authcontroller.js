const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { generateTokens } = require("../utils/generatetoken");
const nodemailer = require("nodemailer");

exports.register = async (req, res) => {
    try {
        const { name, username, email, phone, country, countryCode, password, confirmPassword } = req.body;
        console.log("Registering user with data:", req.body); // Add logging
        let user = await User.findOne({ email });

        if (user) return res.status(400).json({ message: "User already exists" });

        user = new User({ name, username, email, phone, country, countryCode, password, confirmPassword });
        await user.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error during registration:", error); // Add logging
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await user.matchPassword(password))) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const { accessToken, refreshToken } = generateTokens(user._id);

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        });

        res.json({ accessToken, user: { id: user._id, username: user.username, role: user.role,verificationstatus:user.isVerified } }); // Include user role
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.refreshToken = (req, res) => {
    console.log("Refreshing token");
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.status(403).json({ message: "Unauthorized" });

        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    console.log("Refresh token expired"); // Add logging
                    return res.status(403).json({ message: "Refresh token expired, please log in again" });
                }
                return res.status(403).json({ message: "Invalid refresh token" });
            }

            const { accessToken, refreshToken: newRefreshToken } = generateTokens(decoded.userId);

            // Set the new access token and refresh token in the cookies
            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
            });

            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
            });

            res.json({ accessToken });
        });
    } catch (error) {
        console.log("refresh token error",error)
        res.status(500).json({ message: error.message });
    }
};

exports.logout = (req, res) => {
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
};

exports.profile = async (req, res) => {
    try {
        console.log("Fetching user profile:", req.user.userId); // Add logging
        const user = await User.findById(req.user.userId).select("-password -confirmPassword -verificationCode");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({
            message: "Welcome to your profile",
            user, // Send proper details of the user
        });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: error.message });
        console.error("Error fetching user profile:", error.message)

    }
};

exports.sendVerificationEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: "User not found" });

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        user.verificationCode = verificationCode;
        console.log("Verification code:", verificationCode); // Add logging
        await user.save();

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Email Verification - Furnished Home Rental',
            text: `Welcome to Furnished Home Rental! Your verification code is: ${verificationCode}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email:", error);
                return res.status(500).json({ message: "Error sending email" });
            }
            res.status(200).json({ message: "Verification email sent successfully" });
        });
    } catch (error) {
        console.error("Error during sending verification email:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.verifyEmail = async (req, res) => {
    try {
        const { email, verificationCode } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: "User not found" });
        if (user.verificationCode !== verificationCode) return res.status(400).json({ message: "Invalid verification code" });

        user.isVerified = true;
        user.verificationCode = undefined;
        await user.save();

        res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
        console.error("Error during email verification:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.getAuthenticatedUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-password -confirmPassword -verificationCode");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user);
    } catch (error) {
        console.error("Error fetching authenticated user:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.sendForgotPasswordEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: "User not found" });

        const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_RESET_PASSWORD_SECRET, { expiresIn: '1h' });
        const resetLink = `${process.env.FRONTEND_URL}/resetpassword?token=${resetToken}`;
        console.log(`Password reset link sent to ${email}: ${resetLink}`); // Add logging with full link

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Password Reset - Furnished Home Rental',
            text: `You requested a password reset. Click the link to reset your password: ${resetLink}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email:", error);
                return res.status(500).json({ message: "Error sending email" });
            }
            res.status(200).json({ message: "Password reset email sent successfully" });
        });
    } catch (error) {
        console.error("Error during sending password reset email:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const decoded = jwt.verify(token, process.env.JWT_RESET_PASSWORD_SECRET);

        const user = await User.findById(decoded.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        console.error("Error during password reset:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const updateData = req.body;
        const user = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, select: "-password -confirmPassword -verificationCode" }
        );
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json({ message: "Profile updated successfully", user });
    } catch (error) {
        console.error("Error updating user profile:", error);
        res.status(500).json({ message: error.message });
    }
};
