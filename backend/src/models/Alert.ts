import mongoose, { Schema, Document } from 'mongoose';

export interface IAlert extends Document {
  type: 'fall_detection' | 'water_quality' | 'device_offline';
  severity: 'critical' | 'warning' | 'info';
  message: string;
  deviceId: string;
  timestamp: Date;
  acknowledged: boolean;
}

const AlertSchema = new Schema<IAlert>(
  {
    type: {
      type: String,
      enum: ['fall_detection', 'water_quality', 'device_offline'],
      required: true,
      index: true,
    },
    severity: {
      type: String,
      enum: ['critical', 'warning', 'info'],
      required: true,
      index: true,
    },
    message: {
      type: String,
      required: true,
    },
    deviceId: {
      type: String,
      required: true,
      index: true,
    },
    timestamp: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
    acknowledged: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient alert queries
AlertSchema.index({ acknowledged: 1, severity: 1, timestamp: -1 });

export default mongoose.model<IAlert>('Alert', AlertSchema);
