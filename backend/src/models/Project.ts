import { Schema, model, Document } from "mongoose";

export interface IProject extends Document {
  name: string;
  description: string;
  duration: string;
  skills: string;
  website: string;
  image?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    duration: {
      type: String,
      required: [true, "Duration is required"],
      trim: true,
      maxlength: [50, "Duration cannot exceed 50 characters"],
    },
    skills: {
      type: String,
      required: [true, "Skills are required"],
      trim: true,
      maxlength: [500, "Skills cannot exceed 500 characters"],
    },
    website: {
      type: String,
      required: [true, "Website URL is required"],
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
      min: [0, "Order cannot be negative"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: "projects",
  }
);

// Indexes
ProjectSchema.index({ order: 1 });
ProjectSchema.index({ isActive: 1 });
ProjectSchema.index({ name: "text", description: "text", skills: "text" });

export const Project = model<IProject>("Project", ProjectSchema);
