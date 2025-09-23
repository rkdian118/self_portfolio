import { Request, Response } from "express";
import { Education } from "../models/Education";
import { asyncHandler } from "../middleware/errorMiddleware";

/**
 * @desc    Get all education
 * @route   GET /api/education
 * @access  Public
 */
export const getEducation = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { search, page = 1, limit = 10 } = req.query;

    const filter: any = { isActive: true };

    if (search) {
      filter.$or = [
        { degree: { $regex: search, $options: "i" } },
        { institution: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const education = await Education.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Education.countDocuments(filter);

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
  }
);

/**
 * @desc    Get single education
 * @route   GET /api/education/:id
 * @access  Public
 */
export const getSingleEducation = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const education = await Education.findById(req.params.id);

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
  }
);

/**
 * @desc    Create education
 * @route   POST /api/education
 * @access  Private (Admin)
 */
export const createEducation = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { degree, institution, duration, location, description, order } =
      req.body;

    const education = await Education.create({
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
  }
);

/**
 * @desc    Update education
 * @route   PUT /api/education/:id
 * @access  Private (Admin)
 */
export const updateEducation = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { degree, institution, duration, location, description, order } =
      req.body;

    const education = await Education.findById(req.params.id);

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
  }
);

/**
 * @desc    Delete education
 * @route   DELETE /api/education/:id
 * @access  Private (Admin)
 */
export const deleteEducation = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const education = await Education.findById(req.params.id);

    if (!education) {
      res.status(404).json({
        success: false,
        message: "Education record not found",
      });
      return;
    }

    // Soft delete by setting isActive to false
    education.isActive = false;
    await education.save();

    res.status(200).json({
      success: true,
      message: "Education record deleted successfully",
    });
  }
);

/**
 * @desc    Reorder education records
 * @route   PUT /api/education/reorder
 * @access  Private (Admin)
 */
export const reorderEducation = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { education } = req.body; // Array of { id, order }

    if (!Array.isArray(education)) {
      res.status(400).json({
        success: false,
        message: "Education array is required",
      });
      return;
    }

    // Update order for each education record
    const updatePromises = education.map(({ id, order }) =>
      Education.findByIdAndUpdate(id, { order }, { new: true })
    );

    await Promise.all(updatePromises);

    res.status(200).json({
      success: true,
      message: "Education records reordered successfully",
    });
  }
);
