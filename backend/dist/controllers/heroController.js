"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCV = exports.deleteProfileImage = exports.uploadCV = exports.uploadProfileImage = exports.updateHero = exports.getHero = void 0;
const Hero_1 = require("../models/Hero");
const errorMiddleware_1 = require("../middleware/errorMiddleware");
const uploadMiddleware_1 = require("../middleware/uploadMiddleware");
exports.getHero = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const hero = await Hero_1.Hero.findOne({ isActive: true });
    if (!hero) {
        res.status(404).json({
            success: false,
            message: "Hero information not found",
        });
        return;
    }
    res.status(200).json({
        success: true,
        data: { hero },
    });
});
exports.updateHero = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const { name, title, bio, yearsExperience, cvUrl, profileImage } = req.body;
    let hero = await Hero_1.Hero.findOne({ isActive: true });
    if (!hero) {
        hero = await Hero_1.Hero.create({
            name,
            title,
            bio,
            yearsExperience,
            cvUrl,
            profileImage,
        });
    }
    else {
        hero.name = name || hero.name;
        hero.title = title || hero.title;
        hero.bio = bio || hero.bio;
        hero.yearsExperience = yearsExperience || hero.yearsExperience;
        hero.cvUrl = cvUrl || hero.cvUrl;
        hero.profileImage = profileImage || hero.profileImage;
        await hero.save();
    }
    res.status(200).json({
        success: true,
        message: "Hero information updated successfully",
        data: { hero },
    });
});
exports.uploadProfileImage = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    if (!req.file) {
        res.status(400).json({
            success: false,
            message: "No image file provided",
        });
        return;
    }
    const hero = await Hero_1.Hero.findOne({ isActive: true });
    if (!hero) {
        res.status(404).json({
            success: false,
            message: "Hero information not found",
        });
        return;
    }
    if (hero.profileImage) {
        try {
            const publicId = (0, uploadMiddleware_1.extractPublicId)(hero.profileImage);
            await (0, uploadMiddleware_1.deleteCloudinaryFile)(publicId);
        }
        catch (error) {
            console.error("Error deleting old profile image:", error);
        }
    }
    const imageUrl = req.file.path.startsWith('http')
        ? req.file.path
        : `${process.env.BACKEND_URL || 'http://localhost:5000'}/${req.file.path.replace(/\\/g, '/')}`;
    hero.profileImage = imageUrl;
    await hero.save();
    res.status(200).json({
        success: true,
        message: "Profile image uploaded successfully",
        data: {
            profileImage: imageUrl,
            hero,
        },
    });
});
exports.uploadCV = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    if (!req.file) {
        res.status(400).json({
            success: false,
            message: "No CV file provided",
        });
        return;
    }
    const hero = await Hero_1.Hero.findOne({ isActive: true });
    if (!hero) {
        res.status(404).json({
            success: false,
            message: "Hero information not found",
        });
        return;
    }
    if (hero.cvUrl) {
        try {
            const publicId = (0, uploadMiddleware_1.extractPublicId)(hero.cvUrl);
            await (0, uploadMiddleware_1.deleteCloudinaryFile)(publicId);
        }
        catch (error) {
            console.error("Error deleting old CV:", error);
        }
    }
    const cvUrl = req.file.path.startsWith('http')
        ? req.file.path
        : `${process.env.BACKEND_URL || 'http://localhost:5000'}/${req.file.path.replace(/\\/g, '/')}`;
    hero.cvUrl = cvUrl;
    await hero.save();
    res.status(200).json({
        success: true,
        message: "CV uploaded successfully",
        data: {
            cvUrl: cvUrl,
            hero,
        },
    });
});
exports.deleteProfileImage = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const hero = await Hero_1.Hero.findOne({ isActive: true });
    if (!hero || !hero.profileImage) {
        res.status(404).json({
            success: false,
            message: "Profile image not found",
        });
        return;
    }
    try {
        const publicId = (0, uploadMiddleware_1.extractPublicId)(hero.profileImage);
        await (0, uploadMiddleware_1.deleteCloudinaryFile)(publicId);
        hero.profileImage = undefined;
        await hero.save();
        res.status(200).json({
            success: true,
            message: "Profile image deleted successfully",
            data: { hero },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting profile image",
        });
    }
});
exports.deleteCV = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const hero = await Hero_1.Hero.findOne({ isActive: true });
    if (!hero || !hero.cvUrl) {
        res.status(404).json({
            success: false,
            message: "CV not found",
        });
        return;
    }
    try {
        const publicId = (0, uploadMiddleware_1.extractPublicId)(hero.cvUrl);
        await (0, uploadMiddleware_1.deleteCloudinaryFile)(publicId);
        hero.cvUrl = undefined;
        await hero.save();
        res.status(200).json({
            success: true,
            message: "CV deleted successfully",
            data: { hero },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting CV",
        });
    }
});
//# sourceMappingURL=heroController.js.map