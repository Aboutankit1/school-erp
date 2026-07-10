import { validationResult } from "express-validator";
import { failure } from "../utils/apiResponse.js";

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return failure(res, 422, errors.array().map((e) => e.msg).join(", "));
  }
  next();
};
