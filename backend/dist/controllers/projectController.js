"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reorderProjects = exports.deleteProjectImage = exports.uploadProjectImage = exports.deleteProject = exports.updateProject = exports.createProject = exports.getProject = exports.getProjects = void 0;
const Project_1 = require("../models/Project");
const errorMiddleware_1 = require("../middleware/errorMiddleware");
const uploadMiddleware_1 = require("../middleware/uploadMiddleware");
exports.getProjects = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const { search, page = 1, limit = 10 } = req.query;
    const filter = { isActive: true };
    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { skills: { $regex: search, $options: "i" } },
        ];
    }
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    const projects = await Project_1.Project.find(filter)
        .sort({ order: 1, createdAt: -1 })
        .skip(skip)
        .limit(limitNum);
    const total = await Project_1.Project.countDocuments(filter);
    res.status(200).json({
        success: true,
        data: {
            projects: projects,
            pagination: {
                current: pageNum,
                total: Math.ceil(total / limitNum),
                count: projects.length,
                totalDocuments: total,
            },
        },
    });
});
exports.getProject = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const project = await Project_1.Project.findById(req.params.id);
    if (!project || !project.isActive) {
        res.status(404).json({
            success: false,
            message: "Project not found",
        });
        return;
    }
    res.status(200).json({
        success: true,
        data: { project },
    });
});
exports.createProject = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const { name, description, duration, skills, website, image, order } = req.body;
    const existingProject = await Project_1.Project.findOne({
        name: { $regex: new RegExp(`^${name}$`, "i") },
        isActive: true,
    });
    if (existingProject) {
        res.status(400).json({
            success: false,
            message: "Project with this name already exists",
        });
        return;
    }
    const project = await Project_1.Project.create({
        name,
        description,
        duration,
        skills,
        website,
        image,
        order: order || 0,
    });
    res.status(201).json({
        success: true,
        message: "Project created successfully",
        data: { project },
    });
});
exports.updateProject = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const { name, description, duration, skills, website, image, order } = req.body;
    const project = await Project_1.Project.findById(req.params.id);
    if (!project) {
        res.status(404).json({
            success: false,
            message: "Project not found",
        });
        return;
    }
    if (name && name !== project.name) {
        const existingProject = await Project_1.Project.findOne({
            _id: { $ne: req.params.id },
            name: { $regex: new RegExp(`^${name}$`, "i") },
            isActive: true,
        });
        if (existingProject) {
            res.status(400).json({
                success: false,
                message: "Project with this name already exists",
            });
            return;
        }
    }
    project.name = name || project.name;
    project.description = description || project.description;
    project.duration = duration || project.duration;
    project.skills = skills || project.skills;
    project.website = website || project.website;
    project.image = image || project.image;
    project.order = order !== undefined ? order : project.order;
    await project.save();
    res.status(200).json({
        success: true,
        message: "Project updated successfully",
        data: { project },
    });
});
exports.deleteProject = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const project = await Project_1.Project.findById(req.params.id);
    if (!project) {
        res.status(404).json({
            success: false,
            message: "Project not found",
        });
        return;
    }
    if (project.image) {
        try {
            const publicId = (0, uploadMiddleware_1.extractPublicId)(project.image);
            await (0, uploadMiddleware_1.deleteCloudinaryFile)(publicId);
        }
        catch (error) {
            console.error("Error deleting project image:", error);
        }
    }
    project.isActive = false;
    await project.save();
    res.status(200).json({
        success: true,
        message: "Project deleted successfully",
    });
});
exports.uploadProjectImage = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    if (!req.file) {
        res.status(400).json({
            success: false,
            message: "No image file provided",
        });
        return;
    }
    const project = await Project_1.Project.findById(req.params.id);
    if (!project) {
        res.status(404).json({
            success: false,
            message: "Project not found",
        });
        return;
    }
    if (project.image) {
        try {
            const publicId = (0, uploadMiddleware_1.extractPublicId)(project.image);
            await (0, uploadMiddleware_1.deleteCloudinaryFile)(publicId);
        }
        catch (error) {
            console.error("Error deleting old project image:", error);
        }
    }
    const imageUrl = req.file.path.startsWith('http')
        ? req.file.path
        : `${process.env.BACKEND_URL || 'http://localhost:5000'}/${req.file.path.replace(/\\/g, '/')}`;
    project.image = imageUrl;
    await project.save();
    res.status(200).json({
        success: true,
        message: "Project image uploaded successfully",
        data: {
            imageUrl: imageUrl,
            project,
        },
    });
});
exports.deleteProjectImage = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const project = await Project_1.Project.findById(req.params.id);
    if (!project || !project.image) {
        res.status(404).json({
            success: false,
            message: "Project image not found",
        });
        return;
    }
    try {
        const publicId = (0, uploadMiddleware_1.extractPublicId)(project.image);
        await (0, uploadMiddleware_1.deleteCloudinaryFile)(publicId);
        project.image = undefined;
        await project.save();
        res.status(200).json({
            success: true,
            message: "Project image deleted successfully",
            data: { project },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting project image",
        });
    }
});
exports.reorderProjects = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const { projects } = req.body;
    if (!Array.isArray(projects)) {
        res.status(400).json({
            success: false,
            message: "Projects array is required",
        });
        return;
    }
    const updatePromises = projects.map(({ id, order }) => Project_1.Project.findByIdAndUpdate(id, { order }, { new: true }));
    await Promise.all(updatePromises);
    res.status(200).json({
        success: true,
        message: "Projects reordered successfully",
    });
});
//# sourceMappingURL=projectController.js.map