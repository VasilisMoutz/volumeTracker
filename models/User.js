import mongoose from "mongoose";
const { Schema, model } = mongoose;


const dateVolumeSchema = new Schema(
  {
    year: { type: Number, required: true, unique: true },
    0: { type: Number, default: 0 }, // January
    1: { type: Number, default: 0 }, // February
    2: { type: Number, default: 0 }, // March
    3: { type: Number, default: 0 }, // April
    4: { type: Number, default: 0 }, // May
    5: { type: Number, default: 0 }, // June
    6: { type: Number, default: 0 }, // July
    7: { type: Number, default: 0 }, // August
    8: { type: Number, default: 0 }, // September
    9: { type: Number, default: 0 }, // October
    10: { type: Number, default: 0 }, // November
    11: { type: Number, default: 0 }, // Decembers
  }
)

const projectSchema = new Schema(
  {
    name:       { type: String, required: true },
    image:      { type: String, default: null },
    volumeType: { type: String, enum: ['duration', 'frequency'], required: true },
    generalVolume: {
      daily:    { type: Number, default: 0 },
      weekly:   { type: Number, default: 0 },
      monthly:  { type: Number, default: 0 },
      yearly:   { type: Number, default: 0 },
      total:    { type: Number, default: 0 },
    },
    dateVolume: [dateVolumeSchema],
    createdAt:  { type: Date, default: Date.now },
  }
)

const userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  name:     { type: String, required: true },
  lastname: { type: String, required: true },
  projects: [projectSchema],
})

const User = model('User', userSchema);
export default User;