// verifyToken.js
import jwt, { decode } from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
console.log(token);

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
        req.user = decoded;
        console.log(decode)
        next();
    } catch (err) {
        return res.status(403).json({ success: false, message: "Invalid token" });
    }
};
