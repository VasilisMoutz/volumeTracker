import mongoose from "mongoose";
const { Schema, model } = mongoose;

const projectSchema = new Schema(
  {
    name:{ type: String, required: true },
    image: String,
    dailyVol: { type: Number, default: 0 },
    weeklyVol: { type: Number, default: 0 },
    monthlyVol: { type: Number, default: 0 },
    yearlyVol: { type: Number, default: 0 },
    totalVol: { type: Number, default: 0 },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    }
  }, 
  {
    timestamps: true
  }
)

const Project = model('Project', projectSchema);
export default Project;