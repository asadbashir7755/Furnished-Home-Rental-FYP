const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.cookies.accessToken; // Read token from HTTP-only cookie
    // console.log("Token:", token);
    
    if (!token) return res.status(401).json({ message: "Access denied" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.message === "jwt expired") {
            res.status(401).json({ message: "Token expired" });
        } else {
            res.status(403).json({ message: "Invalid token" });
            console.log(error);
        }
    }
};

module.exports = { verifyToken };
