import Parent from "../models/Parent.js";
import Student from "../models/Student.js";
import User from "../models/User.js";
import crypto from "crypto";
import { success, failure } from "../utils/apiResponse.js";

const generatePassword = () => crypto.randomBytes(4).toString("hex");

// @desc Create a parent (creates linked User with role=parent) and optionally link children
// @route POST /api/parents
export const createParent = async (req, res, next) => {
  try {
    const { name, email, password, phone, occupation, relation, children } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return failure(res, 400, "Email already in use");

    const plainPassword = password && password.length >= 6 ? password : generatePassword();

    const user = await User.create({
      name,
      email,
      password: plainPassword,
      phone,
      role: "parent",
      school: req.user.school,
    });

    const parent = await Parent.create({
      school: req.user.school,
      user: user._id,
      occupation,
      relation,
      children: children || [],
    });

    if (children?.length) {
      await Student.updateMany(
        { _id: { $in: children }, school: req.user.school },
        { parent: parent._id }
      );
    }

    const populated = await parent.populate([
      { path: "user", select: "-password" },
      { path: "children", populate: { path: "user", select: "name" } },
    ]);

    return success(res, 201, "Parent added successfully", {
      parent: populated,
      credentials: { email, password: plainPassword },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get all parents for a school
// @route GET /api/parents
export const getParents = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const filter = { school: req.user.school };
    const total = await Parent.countDocuments(filter);
    const parents = await Parent.find(filter)
      .populate("user", "-password")
      .populate({ path: "children", populate: { path: "user", select: "name" } })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    return success(res, 200, "Parents fetched", { parents, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};

// @desc Get single parent
// @route GET /api/parents/:id
export const getParent = async (req, res, next) => {
  try {
    const parent = await Parent.findOne({ _id: req.params.id, school: req.user.school })
      .populate("user", "-password")
      .populate({ path: "children", populate: [{ path: "user", select: "name" }, { path: "class" }] });
    if (!parent) return failure(res, 404, "Parent not found");
    return success(res, 200, "Parent fetched", { parent });
  } catch (error) {
    next(error);
  }
};

// @desc Update parent (details + link/unlink children)
// @route PUT /api/parents/:id
export const updateParent = async (req, res, next) => {
  try {
    const { children, ...rest } = req.body;

    const parent = await Parent.findOne({ _id: req.params.id, school: req.user.school });
    if (!parent) return failure(res, 404, "Parent not found");

    Object.assign(parent, rest);

    if (children) {
      // unlink students no longer selected
      await Student.updateMany(
        { parent: parent._id, _id: { $nin: children } },
        { $unset: { parent: "" } }
      );
      // link newly selected students
      await Student.updateMany(
        { _id: { $in: children }, school: req.user.school },
        { parent: parent._id }
      );
      parent.children = children;
    }

    await parent.save();
    const populated = await parent.populate([
      { path: "user", select: "-password" },
      { path: "children", populate: { path: "user", select: "name" } },
    ]);

    return success(res, 200, "Parent updated successfully", { parent: populated });
  } catch (error) {
    next(error);
  }
};

// @desc Delete parent
// @route DELETE /api/parents/:id
export const deleteParent = async (req, res, next) => {
  try {
    const parent = await Parent.findOneAndDelete({ _id: req.params.id, school: req.user.school });
    if (!parent) return failure(res, 404, "Parent not found");
    await Student.updateMany({ parent: parent._id }, { $unset: { parent: "" } });
    await User.findByIdAndDelete(parent.user);
    return success(res, 200, "Parent removed successfully");
  } catch (error) {
    next(error);
  }
};
