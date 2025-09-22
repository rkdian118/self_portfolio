import { Request, Response } from "express";
import { Experience } from "../models/Experience";
import { asyncHandler } from "../middleware/errorMiddleware";

/**
 * @desc    Get all experiences
 * @route   GET /api/experience
 * @access  Public
 */
export const getExperiences = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { search, page = 1, limit = 10 } = req.query;

    const filter: any = { isActive: true };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const experiences = await Experience.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Experience.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        items: experiences,
        pagination: {
          current: pageNum,
          total: Math.ceil(total / limitNum),
          count: experiences.length,
          totalDocuments: total,
        },
      },
    });
  }
);

/**
 * @desc    Get single experience
 * @route   GET /api/experience/:id
 * @access  Public
 */
export const getExperience = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const experience = await Experience.findById(req.params.id);

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
  }
);

/**
 * @desc    Create experience
 * @route   POST /api/experience
 * @access  Private (Admin)
 */
export const createExperience = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { title, company, website, duration, location, description, order } =
      req.body;

    const experience = await Experience.create({
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
  }
);

/**
 * @desc    Update experience
 * @route   PUT /api/experience/:id
 * @access  Private (Admin)
 */
export const updateExperience = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { title, company, website, duration, location, description, order } =
      req.body;

    const experience = await Experience.findById(req.params.id);

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
  }
);

/**
 * @desc    Delete experience
 * @route   DELETE /api/experience/:id
 * @access  Private (Admin)
 */
export const deleteExperience = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const experience = await Experience.findById(req.params.id);

    if (!experience) {
      res.status(404).json({
        success: false,
        message: "Experience not found",
      });
      return;
    }

    // Soft delete by setting isActive to false
    experience.isActive = false;
    await experience.save();

    res.status(200).json({
      success: true,
      message: "Experience deleted successfully",
    });
  }
);

/**
 * @desc    Reorder experiences
 * @route   PUT /api/experience/reorder
 * @access  Private (Admin)
 */
export const reorderExperiences = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { experiences } = req.body; // Array of { id, order }

    if (!Array.isArray(experiences)) {
      res.status(400).json({
        success: false,
        message: "Experiences array is required",
      });
      return;
    }

    // Update order for each experience
    const updatePromises = experiences.map(({ id, order }) =>
      Experience.findByIdAndUpdate(id, { order }, { new: true })
    );

    await Promise.all(updatePromises);

    res.status(200).json({
      success: true,
      message: "Experiences reordered successfully",
    });
  }
);
