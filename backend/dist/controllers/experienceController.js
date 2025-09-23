"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reorderExperiences = exports.deleteExperience = exports.updateExperience = exports.createExperience = exports.getExperience = exports.getExperiences = void 0;
const Experience_1 = require("../models/Experience");
const errorMiddleware_1 = require("../middleware/errorMiddleware");
exports.getExperiences = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const { search, page = 1, limit = 10 } = req.query;
    const filter = { isActive: true };
    if (search) {
        filter.$or = [
            { title: { $regex: search, $options: "i" } },
            { company: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { location: { $regex: search, $options: "i" } },
        ];
    }
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    const experiences = await Experience_1.Experience.find(filter)
        .sort({ order: 1, createdAt: -1 })
        .skip(skip)
        .limit(limitNum);
    const total = await Experience_1.Experience.countDocuments(filter);
    res.status(200).json({
        success: true,
        data: {
            experiences: experiences,
            pagination: {
                current: pageNum,
                total: Math.ceil(total / limitNum),
                count: experiences.length,
                totalDocuments: total,
            },
        },
    });
});
exports.getExperience = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const experience = await Experience_1.Experience.findById(req.params.id);
    if (!experience || !experience.isActive) {
        res.status(404).json({
            success: false,
            message: "Experience not found",
        });
        return;
    }
    res.status(200).json({
        success: true,
        data: { experience },
    });
});
exports.createExperience = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const { title, company, website, duration, location, description, order } = req.body;
    const experience = await Experience_1.Experience.create({
        title,
        company,
        website,
        duration,
        location,
        description,
        order: order || 0,
    });
    res.status(201).json({
        success: true,
        message: "Experience created successfully",
        data: { experience },
    });
});
exports.updateExperience = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const { title, company, website, duration, location, description, order } = req.body;
    const experience = await Experience_1.Experience.findById(req.params.id);
    if (!experience) {
        res.status(404).json({
            success: false,
            message: "Experience not found",
        });
        return;
    }
    experience.title = title || experience.title;
    experience.company = company || experience.company;
    experience.website = website || experience.website;
    experience.duration = duration || experience.duration;
    experience.location = location || experience.location;
    experience.description = description || experience.description;
    experience.order = order !== undefined ? order : experience.order;
    await experience.save();
    res.status(200).json({
        success: true,
        message: "Experience updated successfully",
        data: { experience },
    });
});
exports.deleteExperience = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const experience = await Experience_1.Experience.findById(req.params.id);
    if (!experience) {
        res.status(404).json({
            success: false,
            message: "Experience not found",
        });
        return;
    }
    experience.isActive = false;
    await experience.save();
    res.status(200).json({
        success: true,
        message: "Experience deleted successfully",
    });
});
exports.reorderExperiences = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const { experiences } = req.body;
    if (!Array.isArray(experiences)) {
        res.status(400).json({
            success: false,
            message: "Experiences array is required",
        });
        return;
    }
    const updatePromises = experiences.map(({ id, order }) => Experience_1.Experience.findByIdAndUpdate(id, { order }, { new: true }));
    await Promise.all(updatePromises);
    res.status(200).json({
        success: true,
        message: "Experiences reordered successfully",
    });
});
//# sourceMappingURL=experienceController.js.map