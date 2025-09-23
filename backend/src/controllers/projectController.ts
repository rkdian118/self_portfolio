import { Request, Response } from "express";
import { Project } from "../models/Project";
import { asyncHandler } from "../middleware/errorMiddleware";
import {
  deleteCloudinaryFile,
  extractPublicId,
} from "../middleware/uploadMiddleware";

/**
 * @desc    Get all projects
 * @route   GET /api/projects
 * @access  Public
 */
export const getProjects = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { search, page = 1, limit = 10 } = req.query;

    const filter: any = { isActive: true };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { skills: { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const projects = await Project.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Project.countDocuments(filter);

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
  }
);

/**
 * @desc    Get single project
 * @route   GET /api/projects/:id
 * @access  Public
 */
export const getProject = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const project = await Project.findById(req.params.id);

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
  }
);

/**
 * @desc    Create project
 * @route   POST /api/projects
 * @access  Private (Admin)
 */
export const createProject = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { name, description, duration, skills, website, image, order } =
      req.body;

    // Check if project with same name already exists
    const existingProject = await Project.findOne({
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

    const project = await Project.create({
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
  }
);

/**
 * @desc    Update project
 * @route   PUT /api/projects/:id
 * @access  Private (Admin)
 */
export const updateProject = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { name, description, duration, skills, website, image, order } =
      req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404).json({
        success: false,
        message: "Project not found",
      });
      return;
    }

    // Check for duplicate name (excluding current project)
    if (name && name !== project.name) {
      const existingProject = await Project.findOne({
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
  }
);

/**
 * @desc    Delete project
 * @route   DELETE /api/projects/:id
 * @access  Private (Admin)
 */
export const deleteProject = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404).json({
        success: false,
        message: "Project not found",
      });
      return;
    }

    // Delete associated image from Cloudinary if exists
    if (project.image) {
      try {
        const publicId = extractPublicId(project.image);
        await deleteCloudinaryFile(publicId);
      } catch (error) {
        console.error("Error deleting project image:", error);
      }
    }

    // Soft delete by setting isActive to false
    project.isActive = false;
    await project.save();

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  }
);

/**
 * @desc    Upload project image
 * @route   POST /api/projects/:id/upload-image
 * @access  Private (Admin)
 */
export const uploadProjectImage = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "No image file provided",
      });
      return;
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404).json({
        success: false,
        message: "Project not found",
      });
      return;
    }

    // Delete old image if exists
    if (project.image) {
      try {
        const publicId = extractPublicId(project.image);
        await deleteCloudinaryFile(publicId);
      } catch (error) {
        console.error("Error deleting old project image:", error);
      }
    }

    // Update with new image URL
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
  }
);

/**
 * @desc    Delete project image
 * @route   DELETE /api/projects/:id/image
 * @access  Private (Admin)
 */
export const deleteProjectImage = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const project = await Project.findById(req.params.id);

    if (!project || !project.image) {
      res.status(404).json({
        success: false,
        message: "Project image not found",
      });
      return;
    }

    try {
      const publicId = extractPublicId(project.image);
      await deleteCloudinaryFile(publicId);

      project.image = undefined;
      await project.save();

      res.status(200).json({
        success: true,
        message: "Project image deleted successfully",
        data: { project },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error deleting project image",
      });
    }
  }
);

/**
 * @desc    Reorder projects
 * @route   PUT /api/projects/reorder
 * @access  Private (Admin)
 */
export const reorderProjects = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { projects } = req.body; // Array of { id, order }

    if (!Array.isArray(projects)) {
      res.status(400).json({
        success: false,
        message: "Projects array is required",
      });
      return;
    }

    // Update order for each project
    const updatePromises = projects.map(({ id, order }) =>
      Project.findByIdAndUpdate(id, { order }, { new: true })
    );

    await Promise.all(updatePromises);

    res.status(200).json({
      success: true,
      message: "Projects reordered successfully",
    });
  }
);
