import { Schema, model, Document } from "mongoose";
import { CryptoUtils } from "../utils/cryptoUtils";

export interface IAdmin extends Document {
  email: string;
  password: string;
  name: string;
  role: "admin" | "super-admin";
  isActive: boolean;
  lastLoginAt?: Date;
  refreshTokens: string[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const AdminSchema = new Schema<IAdmin>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
      select: false, // Don't include password in queries by default
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    role: {
      type: String,
      enum: ["admin", "super-admin"],
      default: "admin",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLoginAt: {
      type: Date,
    },
    refreshTokens: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
    collection: "admins",
  }
);

// Hash password before saving
AdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    this.password = await CryptoUtils.hashPassword(this.password);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
AdminSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await CryptoUtils.verifyPassword(candidatePassword, this.password);
};

// Indexes
AdminSchema.index({ email: 1 });
AdminSchema.index({ isActive: 1 });

export const Admin = model<IAdmin>("Admin", AdminSchema);
