import mongoose from 'mongoose';
const { Schema } = mongoose;

const AlertSchema = new Schema(
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

export default mongoose.model('Alert', AlertSchema);
