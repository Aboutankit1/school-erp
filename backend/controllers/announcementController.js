import Announcement from "../models/Announcement.js";
import { success, failure } from "../utils/apiResponse.js";

export const createAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.create({
      ...req.body,
      school: req.user.school,
      createdBy: req.user._id,
    });
    return success(res, 201, "Announcement published successfully", { announcement });
  } catch (error) {
    next(error);
  }
};

export const getAnnouncements = async (req, res, next) => {
  try {
    const { audience } = req.query;
    const filter = { school: req.user.school };
    if (audience) filter.audience = { $in: [audience, "all"] };

    const announcements = await Announcement.find(filter)
      .populate("createdBy", "name role")
      .sort({ createdAt: -1 });

    return success(res, 200, "Announcements fetched", { announcements });
  } catch (error) {
    next(error);
  }
};

export const deleteAnnouncement = async (req, res, next) => {
  try {
    const deleted = await Announcement.findOneAndDelete({ _id: req.params.id, school: req.user.school });
    if (!deleted) return failure(res, 404, "Announcement not found");
    return success(res, 200, "Announcement deleted successfully");
  } catch (error) {
    next(error);
  }
};
