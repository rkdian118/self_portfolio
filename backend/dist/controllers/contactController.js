"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteContactForm = exports.toggleContactFormArchive = exports.toggleContactFormRead = exports.getContactForm = exports.getContactForms = exports.submitContactForm = exports.updateContact = exports.getContact = void 0;
const Contact_1 = require("../models/Contact");
const ContactForm_1 = require("../models/ContactForm");
const errorMiddleware_1 = require("../middleware/errorMiddleware");
const nodemailer_1 = __importDefault(require("nodemailer"));
const createTransporter = () => {
    return nodemailer_1.default.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
};
exports.getContact = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const contact = await Contact_1.Contact.findOne({ isActive: true });
    if (!contact) {
        res.status(404).json({
            success: false,
            message: "Contact information not found",
        });
        return;
    }
    res.status(200).json({
        success: true,
        data: { contact },
    });
});
exports.updateContact = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const { email, phone, linkedin, github, location } = req.body;
    let contact = await Contact_1.Contact.findOne({ isActive: true });
    if (!contact) {
        contact = await Contact_1.Contact.create({
            email,
            phone,
            linkedin,
            github,
            location,
        });
    }
    else {
        contact.email = email || contact.email;
        contact.phone = phone || contact.phone;
        contact.linkedin = linkedin || contact.linkedin;
        contact.github = github || contact.github;
        contact.location = location || contact.location;
        await contact.save();
    }
    res.status(200).json({
        success: true,
        message: "Contact information updated successfully",
        data: { contact },
    });
});
exports.submitContactForm = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const { name, email, phone, role, company, message } = req.body;
    console.log(req.body, "Request body in contactController");
    const contactForm = await ContactForm_1.ContactForm.create({
        name,
        email,
        phone,
        role,
        company,
        message,
    });
    try {
        const transporter = createTransporter();
        const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New Contact Form Submission</h2>
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
          <p><strong>Role/Position:</strong> ${role}</p>
          <p><strong>Company:</strong> ${company}</p>
        </div>
        <div style="background: #ffffff; padding: 20px; border-left: 4px solid #007bff; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Message:</h3>
          <p style="line-height: 1.6; color: #666;">${message}</p>
        </div>
        <div style="margin-top: 30px; padding: 15px; background: #f8f9fa; border-radius: 5px;">
          <p style="margin: 0; font-size: 12px; color: #6c757d;">
            Submitted on: ${new Date().toLocaleString()}<br>
            Form ID: ${contactForm._id}
          </p>
        </div>
      </div>
    `;
        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
            subject: `Portfolio Contact Form - ${name} from ${company}`,
            html: emailHtml,
            replyTo: email,
        });
        const confirmationHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Thank you for contacting us!</h2>
        <p>Hi ${name},</p>
        <p>Thank you for reaching out. I have received your message and will get back to you as soon as possible.</p>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Your message:</h3>
          <p style="font-style: italic; color: #666;">"${message}"</p>
        </div>
        <p>Best regards,<br>Dhanraj Vishwakarma</p>
      </div>
    `;
        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: email,
            subject: "Thank you for your message - Portfolio Contact",
            html: confirmationHtml,
        });
    }
    catch (emailError) {
        console.error("Email sending failed:", emailError);
    }
    res.status(201).json({
        success: true,
        message: "Thank you for your message! I will get back to you soon.",
        data: {
            id: contactForm._id,
            submittedAt: contactForm.createdAt,
        },
    });
});
exports.getContactForms = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const { isRead, isArchived, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (isRead !== undefined) {
        filter.isRead = isRead === "true";
    }
    if (isArchived !== undefined) {
        filter.isArchived = isArchived === "true";
    }
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    const forms = await ContactForm_1.ContactForm.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum);
    const total = await ContactForm_1.ContactForm.countDocuments(filter);
    const unreadCount = await ContactForm_1.ContactForm.countDocuments({
        isRead: false,
        isArchived: false,
    });
    res.status(200).json({
        success: true,
        data: {
            forms,
            pagination: {
                current: pageNum,
                total: Math.ceil(total / limitNum),
                count: forms.length,
                totalDocuments: total,
            },
            unreadCount,
        },
    });
});
exports.getContactForm = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const form = await ContactForm_1.ContactForm.findById(req.params.id);
    if (!form) {
        res.status(404).json({
            success: false,
            message: "Contact form not found",
        });
        return;
    }
    if (!form.isRead) {
        form.isRead = true;
        await form.save();
    }
    res.status(200).json({
        success: true,
        data: { form },
    });
});
exports.toggleContactFormRead = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const { isRead } = req.body;
    const form = await ContactForm_1.ContactForm.findById(req.params.id);
    if (!form) {
        res.status(404).json({
            success: false,
            message: "Contact form not found",
        });
        return;
    }
    form.isRead = isRead !== undefined ? isRead : !form.isRead;
    await form.save();
    res.status(200).json({
        success: true,
        message: `Contact form marked as ${form.isRead ? "read" : "unread"}`,
        data: { form },
    });
});
exports.toggleContactFormArchive = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const { isArchived } = req.body;
    const form = await ContactForm_1.ContactForm.findById(req.params.id);
    if (!form) {
        res.status(404).json({
            success: false,
            message: "Contact form not found",
        });
        return;
    }
    form.isArchived = isArchived !== undefined ? isArchived : !form.isArchived;
    await form.save();
    res.status(200).json({
        success: true,
        message: `Contact form ${form.isArchived ? "archived" : "unarchived"}`,
        data: { form },
    });
});
exports.deleteContactForm = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const form = await ContactForm_1.ContactForm.findById(req.params.id);
    if (!form) {
        res.status(404).json({
            success: false,
            message: "Contact form not found",
        });
        return;
    }
    await ContactForm_1.ContactForm.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success: true,
        message: "Contact form deleted successfully",
    });
});
//# sourceMappingURL=contactController.js.map