import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ENV } from "../lib/env.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized access." });
    }

    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: "Unauthorized access." });
    }
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized access." });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware: ", error); 
    res.status(500).json({ message: "Internal server error." });
  }
};
