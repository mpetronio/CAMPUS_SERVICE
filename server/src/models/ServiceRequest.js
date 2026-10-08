import mongoose from 'mongoose';

export const REQUEST_STATUSES = Object.freeze([
  'submitted',
  'in_progress',
  'resolved',
  'rejected',
]);

const serviceRequestSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      immutable: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ServiceCategory',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 120,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 2000,
    },
    location: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 150,
    },
    status: {
      type: String,
      enum: REQUEST_STATUSES,
      default: 'submitted',
    },
  },
  { timestamps: true }
);

export default mongoose.model('ServiceRequest', serviceRequestSchema);