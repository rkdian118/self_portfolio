import { Request, Response } from "express";
import { Admin } from "../models/Admin";
import { JWTUtils } from "../utils/jwtUtils";
import { CryptoUtils } from "../utils/cryptoUtils";
import { asyncHandler } from "../middleware/errorMiddleware";

/**
 * @desc    Admin login
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    // Check if admin exists
    const admin = await Admin.findOne({ email, isActive: true }).select(
      "+password"
    );

    if (!admin || !(await admin.comparePassword(password))) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    // Generate tokens
    const tokenPair = JWTUtils.generateTokenPair({
      userId: admin._id as import("mongoose").Types.ObjectId,
      email: admin.email,
      role: admin.role === "super-admin" ? "admin" : admin.role,
    });

    // Save refresh token
    admin.refreshTokens.push(tokenPair.refreshToken);
    admin.lastLoginAt = new Date();
    await admin.save();

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          lastLoginAt: admin.lastLoginAt,
        },
        tokens: tokenPair,
      },
    });
  }
);

/**
 * @desc    Refresh access token
 * @route   POST /api/auth/refresh
 * @access  Private
 */
export const refreshToken = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(401).json({
        success: false,
        message: "Refresh token is required",
      });
      return;
    }

    try {
      const decoded = JWTUtils.verifyRefreshToken(refreshToken);
      const admin = await Admin.findById(decoded.userId);

      if (
        !admin ||
        !admin.isActive ||
        !admin.refreshTokens.includes(refreshToken)
      ) {
        res.status(401).json({
          success: false,
          message: "Invalid refresh token",
        });
        return;
      }

      // Generate new tokens
      const newTokenPair = JWTUtils.generateTokenPair({
        userId: admin._id as import("mongoose").Types.ObjectId,
        email: admin.email,
        role: admin.role === "super-admin" ? "admin" : admin.role,
      });

      // Replace old refresh token with new one
      admin.refreshTokens = admin.refreshTokens.filter(
        (token) => token !== refreshToken
      );
      admin.refreshTokens.push(newTokenPair.refreshToken);
      await admin.save();

      res.status(200).json({
        success: true,
        message: "Tokens refreshed successfully",
        data: {
          tokens: newTokenPair,
        },
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Invalid refresh token",
      });
    }
  }
);

/**
 * @desc    Logout admin
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { refreshToken } = req.body;
    const adminId = req.user?.userId;

    if (adminId) {
      const admin = await Admin.findById(adminId);
      if (admin && refreshToken) {
        admin.refreshTokens = admin.refreshTokens.filter(
          (token) => token !== refreshToken
        );
        await admin.save();
      }
    }

    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  }
);

/**
 * @desc    Get admin profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
export const getProfile = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const admin = await Admin.findById(req.user?.userId);

    if (!admin) {
      res.status(404).json({
        success: false,
        message: "Admin not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          lastLoginAt: admin.lastLoginAt,
          createdAt: admin.createdAt,
        },
      },
    });
  }
);

/**
 * @desc    Update admin profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
export const updateProfile = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { name, email } = req.body;
    const admin = await Admin.findById(req.user?.userId);

    if (!admin) {
      res.status(404).json({
        success: false,
        message: "Admin not found",
      });
      return;
    }

    admin.name = name || admin.name;
    admin.email = email || admin.email;

    await admin.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      },
    });
  }
);

/**
 * @desc    Change admin password
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
export const changePassword = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { currentPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.user?.userId).select("+password");

    if (!admin) {
      res.status(404).json({
        success: false,
        message: "Admin not found",
      });
      return;
    }

    // Verify current password
    const isCurrentPasswordValid = await admin.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
      return;
    }

    // Update password
    admin.password = newPassword;
    admin.refreshTokens = []; // Invalidate all refresh tokens
    await admin.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  }
);
