import { Schema, model, Document } from "mongoose";

// Contact Information Model
export interface IContact extends Document {
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  location: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema = new Schema<IContact>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
      trim: true,
    },
    linkedin: {
      type: String,
      required: [true, "LinkedIn is required"],
      trim: true,
    },
    github: {
      type: String,
      required: [true, "GitHub is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
      maxlength: [200, "Location cannot exceed 200 characters"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: "contact",
  }
);

export const Contact = model<IContact>("Contact", ContactSchema);
