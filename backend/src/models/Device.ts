import mongoose, { Schema, Document } from 'mongoose';

export interface IDevice extends Document {
  deviceId: string;
  name: string;
  location: string;
  status: 'online' | 'offline';
  battery: number;
  lastSeen: Date;
  createdAt: Date;
  updatedAt: Date;
}

const DeviceSchema = new Schema<IDevice>(
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

export default mongoose.model<IDevice>('Device', DeviceSchema);
