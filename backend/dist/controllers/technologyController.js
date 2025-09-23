"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTechnology = exports.updateTechnology = exports.createTechnology = exports.getTechnologies = void 0;
const Technology_1 = require("../models/Technology");
const errorMiddleware_1 = require("../middleware/errorMiddleware");
exports.getTechnologies = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const technologies = await Technology_1.Technology.find({ isActive: true }).sort({ category: 1, name: 1 });
    res.status(200).json({
        success: true,
        count: technologies.length,
        data: { technologies },
    });
});
exports.createTechnology = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const { name, category, proficiency, icon } = req.body;
    const technology = await Technology_1.Technology.create({
        name,
        category,
        proficiency,
        icon,
    });
    res.status(201).json({
        success: true,
        message: "Technology created successfully",
        data: { technology },
    });
});
exports.updateTechnology = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { name, category, proficiency, icon } = req.body;
    const technology = await Technology_1.Technology.findById(id);
    if (!technology) {
        res.status(404).json({
            success: false,
            message: "Technology not found",
        });
        return;
    }
    technology.name = name || technology.name;
    technology.category = category || technology.category;
    technology.proficiency = proficiency !== undefined ? proficiency : technology.proficiency;
    technology.icon = icon || technology.icon;
    await technology.save();
    res.status(200).json({
        success: true,
        message: "Technology updated successfully",
        data: { technology },
    });
});
exports.deleteTechnology = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const technology = await Technology_1.Technology.findById(id);
    if (!technology) {
        res.status(404).json({
            success: false,
            message: "Technology not found",
        });
        return;
    }
    await Technology_1.Technology.findByIdAndDelete(id);
    res.status(200).json({
        success: true,
        message: "Technology deleted successfully",
    });
});
//# sourceMappingURL=technologyController.js.map