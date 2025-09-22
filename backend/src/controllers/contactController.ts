import { Request, Response } from "express";
import { Contact } from "../models/Contact";
import { ContactForm } from "../models/ContactForm";
import { asyncHandler } from "../middleware/errorMiddleware";
import nodemailer from "nodemailer";

// Email transporter setup
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

/**
 * @desc    Get contact information
 * @route   GET /api/contact
 * @access  Public
 */
export const getContact = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const contact = await Contact.findOne({ isActive: true });

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
  }
);

/**
 * @desc    Update contact information
 * @route   PUT /api/contact
 * @access  Private (Admin)
 */
export const updateContact = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email, phone, linkedin, github, location } = req.body;

    let contact = await Contact.findOne({ isActive: true });

    if (!contact) {
      // Create new contact if doesn't exist
      contact = await Contact.create({
        email,
        phone,
        linkedin,
        github,
        location,
      });
    } else {
      // Update existing contact
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
  }
);

/**
 * @desc    Submit contact form
 * @route   POST /api/contact/form
 * @access  Public
 */
export const submitContactForm = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { name, email, phone, role, company, message } = req.body;
    console.log(req.body, "Request body in contactController");

    // Create contact form entry
    const contactForm = await ContactForm.create({
      name,
      email,
      phone,
      role,
      company,
      message,
    });

    // Send email notification to admin
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

      // Send confirmation email to user
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
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      success: true,
      message: "Thank you for your message! I will get back to you soon.",
      data: {
        id: contactForm._id,
        submittedAt: contactForm.createdAt,
      },
    });
  }
);

/**
 * @desc    Get all contact form submissions (Admin)
 * @route   GET /api/contact/forms
 * @access  Private (Admin)
 */
export const getContactForms = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { isRead, isArchived, page = 1, limit = 20 } = req.query;

    const filter: any = {};

    if (isRead !== undefined) {
      filter.isRead = isRead === "true";
    }

    if (isArchived !== undefined) {
      filter.isArchived = isArchived === "true";
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const forms = await ContactForm.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await ContactForm.countDocuments(filter);
    const unreadCount = await ContactForm.countDocuments({
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
  }
);

/**
 * @desc    Get single contact form submission (Admin)
 * @route   GET /api/contact/forms/:id
 * @access  Private (Admin)
 */
export const getContactForm = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const form = await ContactForm.findById(req.params.id);

    if (!form) {
      res.status(404).json({
        success: false,
        message: "Contact form not found",
      });
      return;
    }

    // Mark as read when viewed
    if (!form.isRead) {
      form.isRead = true;
      await form.save();
    }

    res.status(200).json({
      success: true,
      data: { form },
    });
  }
);

/**
 * @desc    Mark contact form as read/unread (Admin)
 * @route   PUT /api/contact/forms/:id/read
 * @access  Private (Admin)
 */
export const toggleContactFormRead = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { isRead } = req.body;

    const form = await ContactForm.findById(req.params.id);

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
  }
);

/**
 * @desc    Archive/unarchive contact form (Admin)
 * @route   PUT /api/contact/forms/:id/archive
 * @access  Private (Admin)
 */
export const toggleContactFormArchive = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { isArchived } = req.body;

    const form = await ContactForm.findById(req.params.id);

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
  }
);

/**
 * @desc    Delete contact form (Admin)
 * @route   DELETE /api/contact/forms/:id
 * @access  Private (Admin)
 */
export const deleteContactForm = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const form = await ContactForm.findById(req.params.id);

    if (!form) {
      res.status(404).json({
        success: false,
        message: "Contact form not found",
      });
      return;
    }

    await ContactForm.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Contact form deleted successfully",
    });
  }
);
