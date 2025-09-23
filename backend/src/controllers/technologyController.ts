import { Request, Response } from "express";
import { Technology } from "../models/Technology";
import { asyncHandler } from "../middleware/errorMiddleware";

/**
 * @desc    Get all technologies
 * @route   GET /api/technologies
 * @access  Public
 */
export const getTechnologies = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const technologies = await Technology.find({ isActive: true }).sort({ category: 1, name: 1 });

    res.status(200).json({
      success: true,
      count: technologies.length,
      data: { technologies },
    });
  }
);

/**
 * @desc    Create new technology
 * @route   POST /api/technologies
 * @access  Private (Admin)
 */
export const createTechnology = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { name, category, proficiency, icon } = req.body;

    const technology = await Technology.create({
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
  }
);

/**
 * @desc    Update technology
 * @route   PUT /api/technologies/:id
 * @access  Private (Admin)
 */
export const updateTechnology = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { name, category, proficiency, icon } = req.body;

    const technology = await Technology.findById(id);

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
  }
);

/**
 * @desc    Delete technology
 * @route   DELETE /api/technologies/:id
 * @access  Private (Admin)
 */
export const deleteTechnology = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const technology = await Technology.findById(id);

    if (!technology) {
      res.status(404).json({
        success: false,
        message: "Technology not found",
      });
      return;
    }

    await Technology.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Technology deleted successfully",
    });
  }
);