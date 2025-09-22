import { Schema, model, Document } from "mongoose";

// Contact Form Submission Model
export interface IContactForm extends Document {
  name: string;
  email: string;
  phone?: string;
  role: string;
  company: string;
  message: string;
  isRead: boolean;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ContactFormSchema = new Schema<IContactForm>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      required: [true, "Role/Position is required"],
      trim: true,
      maxlength: [100, "Role cannot exceed 100 characters"],
    },
    company: {
      type: String,
      required: [true, "Company is required"],
      trim: true,
      maxlength: [100, "Company cannot exceed 100 characters"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      maxlength: [2000, "Message cannot exceed 2000 characters"],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: "contact_forms",
  }
);

// Indexes
ContactFormSchema.index({ isRead: 1 });
ContactFormSchema.index({ isArchived: 1 });
ContactFormSchema.index({ createdAt: -1 });
ContactFormSchema.index({ email: 1 });

export const ContactForm = model<IContactForm>(
  "ContactForm",
  ContactFormSchema
);
