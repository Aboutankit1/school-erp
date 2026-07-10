import Class from "../models/Class.js";
import Subject from "../models/Subject.js";
import { success, failure } from "../utils/apiResponse.js";

export const createClass = async (req, res, next) => {
  try {
    const { name, sections } = req.body;
    const newClass = await Class.create({ school: req.user.school, name, sections });
    return success(res, 201, "Class created successfully", { class: newClass });
  } catch (error) {
    next(error);
  }
};

export const getClasses = async (req, res, next) => {
  try {
    const classes = await Class.find({ school: req.user.school }).populate("classTeacher");
    return success(res, 200, "Classes fetched", { classes });
  } catch (error) {
    next(error);
  }
};

export const updateClass = async (req, res, next) => {
  try {
    const updated = await Class.findOneAndUpdate(
      { _id: req.params.id, school: req.user.school },
      req.body,
      { new: true }
    );
    if (!updated) return failure(res, 404, "Class not found");
    return success(res, 200, "Class updated successfully", { class: updated });
  } catch (error) {
    next(error);
  }
};

export const deleteClass = async (req, res, next) => {
  try {
    const deleted = await Class.findOneAndDelete({ _id: req.params.id, school: req.user.school });
    if (!deleted) return failure(res, 404, "Class not found");
    return success(res, 200, "Class deleted successfully");
  } catch (error) {
    next(error);
  }
};

export const createSubject = async (req, res, next) => {
  try {
    const subject = await Subject.create({ ...req.body, school: req.user.school });
    return success(res, 201, "Subject created successfully", { subject });
  } catch (error) {
    next(error);
  }
};

export const getSubjects = async (req, res, next) => {
  try {
    const filter = { school: req.user.school };
    if (req.query.classId) filter.class = req.query.classId;
    const subjects = await Subject.find(filter).populate("class").populate("teacher");
    return success(res, 200, "Subjects fetched", { subjects });
  } catch (error) {
    next(error);
  }
};
