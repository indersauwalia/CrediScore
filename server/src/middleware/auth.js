// src/middleware/auth.js
import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ msg: "No token, authorization denied" });
    }

    const token = authHeader.replace("Bearer ", "");

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user; // { id: user.id }
        next();
    } catch (err) {
        res.status(401).json({ msg: "Token is not valid" });
    }
};

export default auth;
