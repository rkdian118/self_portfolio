import mongoose, { Document, Schema } from "mongoose";

export interface ITechnology extends Document {
  name: string;
  category: string;
  proficiency: number;
  icon?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const technologySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Technology name is required"],
      trim: true,
      maxlength: [50, "Technology name cannot exceed 50 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Frontend", "Backend", "Database", "DevOps", "Mobile", "Other"],
    },
    proficiency: {
      type: Number,
      required: [true, "Proficiency level is required"],
      min: [0, "Proficiency cannot be less than 0"],
      max: [100, "Proficiency cannot exceed 100"],
    },
    icon: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Technology = mongoose.model<ITechnology>("Technology", technologySchema);