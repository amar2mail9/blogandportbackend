import jwt from "jsonwebtoken"

// verifyToken.js
export const verifyToken = (req, res, next) => {
    const token = req.cookies.accessToken;
    if (!token) {
        return res.status(401).json({ success: false, message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
        req.user = decoded; // contains { id, email, username }
        next();
    } catch (err) {
        return res.status(403).json({ success: false, message: "Invalid token" });
    }
};
