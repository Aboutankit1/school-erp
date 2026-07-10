import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { failure } from "../utils/apiResponse.js";

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) return failure(res, 401, "User no longer exists");
      if (!req.user.isActive) return failure(res, 403, "Account is deactivated");

      next();
    } catch (error) {
      return failure(res, 401, "Not authorized, token failed");
    }
  } else {
    return failure(res, 401, "Not authorized, no token provided");
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return failure(res, 403, `Role '${req.user.role}' is not allowed to access this resource`);
    }
    next();
  };
};
