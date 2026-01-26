import mongoose from 'mongoose';
const { Schema } = mongoose;

const WaterQualitySchema = new Schema(
  {
    deviceId: {
      type: String,
      required: true,
      index: true,
    },
    ph: {
      type: Number,
      required: true,
      min: 0,
      max: 14,
    },
    tds: {
      type: Number,
      required: true,
      min: 0,
    },
    battery: {
      type: Number,
      min: 0,
      max: 100,
    },
    timestamp: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
  },
  {
    timeseries: {
      timeField: 'timestamp',
      metaField: 'deviceId',
      granularity: 'minutes',
    },
  }
);

// Index for efficient time-based queries
WaterQualitySchema.index({ deviceId: 1, timestamp: -1 });

export default mongoose.model('WaterQuality', WaterQualitySchema);
