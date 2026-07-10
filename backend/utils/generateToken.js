import jwt from "jsonwebtoken";

export const generateAccessToken = (id, role, schoolId = null) => {
  return jwt.sign({ id, role, schoolId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "1d",
  });
};

export const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || "30d",
  });
};
