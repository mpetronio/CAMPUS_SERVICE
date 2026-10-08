import mongoose from 'mongoose';
import { STAFF_ROLE, STUDENT_ROLE } from '../utils/userRoles.js';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: [STUDENT_ROLE, STAFF_ROLE],
      default: STUDENT_ROLE,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('User', userSchema);
