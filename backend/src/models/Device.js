import mongoose from 'mongoose';
const { Schema } = mongoose;

const DeviceSchema = new Schema(
  {
    deviceId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      default: 'Unknown',
    },
    status: {
      type: String,
      enum: ['online', 'offline'],
      default: 'offline',
    },
    battery: {
      type: Number,
      min: 0,
      max: 100,
      default: 100,
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Device', DeviceSchema);
