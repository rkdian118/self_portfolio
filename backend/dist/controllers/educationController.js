"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reorderEducation = exports.deleteEducation = exports.updateEducation = exports.createEducation = exports.getSingleEducation = exports.getEducation = void 0;
const Education_1 = require("../models/Education");
const errorMiddleware_1 = require("../middleware/errorMiddleware");
exports.getEducation = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const { search, page = 1, limit = 10 } = req.query;
    const filter = { isActive: true };
    if (search) {
        filter.$or = [
            { degree: { $regex: search, $options: "i" } },
            { institution: { $regex: search, $options: "i" } },
            { location: { $regex: search, $options: "i" } },
        ];
    }
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    const education = await Education_1.Education.find(filter)
        .sort({ order: 1, createdAt: -1 })
        .skip(skip)
        .limit(limitNum);
    const total = await Education_1.Education.countDocuments(filter);
    res.status(200).json({
        success: true,
        data: {
            education: education,
            pagination: {
                current: pageNum,
                total: Math.ceil(total / limitNum),
                count: education.length,
                totalDocuments: total,
            },
        },
    });
});
exports.getSingleEducation = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const education = await Education_1.Education.findById(req.params.id);
    if (!education || !education.isActive) {
        res.status(404).json({
            success: false,
            message: "Education record not found",
        });
        return;
    }
    res.status(200).json({
        success: true,
        data: { education },
    });
});
exports.createEducation = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const { degree, institution, duration, location, description, order } = req.body;
    const education = await Education_1.Education.create({
        degree,
        institution,
        duration,
        location,
        description,
        order: order || 0,
    });
    res.status(201).json({
        success: true,
        message: "Education record created successfully",
        data: { education },
    });
});
exports.updateEducation = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const { degree, institution, duration, location, description, order } = req.body;
    const education = await Education_1.Education.findById(req.params.id);
    if (!education) {
        res.status(404).json({
            success: false,
            message: "Education record not found",
        });
        return;
    }
    education.degree = degree || education.degree;
    education.institution = institution || education.institution;
    education.duration = duration || education.duration;
    education.location = location || education.location;
    education.description = description || education.description;
    education.order = order !== undefined ? order : education.order;
    await education.save();
    res.status(200).json({
        success: true,
        message: "Education record updated successfully",
        data: { education },
    });
});
exports.deleteEducation = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const education = await Education_1.Education.findById(req.params.id);
    if (!education) {
        res.status(404).json({
            success: false,
            message: "Education record not found",
        });
        return;
    }
    education.isActive = false;
    await education.save();
    res.status(200).json({
        success: true,
        message: "Education record deleted successfully",
    });
});
exports.reorderEducation = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const { education } = req.body;
    if (!Array.isArray(education)) {
        res.status(400).json({
            success: false,
            message: "Education array is required",
        });
        return;
    }
    const updatePromises = education.map(({ id, order }) => Education_1.Education.findByIdAndUpdate(id, { order }, { new: true }));
    await Promise.all(updatePromises);
    res.status(200).json({
        success: true,
        message: "Education records reordered successfully",
    });
});
//# sourceMappingURL=educationController.js.map