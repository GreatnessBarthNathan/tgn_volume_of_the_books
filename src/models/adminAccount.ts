import mongoose from "mongoose"

const AdminAccountSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  authVersion: {
    type: Number,
    default: 0,
  },
  recoveryCodeHash: {
    type: String,
    select: false,
  },
  recoveryCodeExpiresAt: {
    type: Date,
    select: false,
  },
})

export default mongoose.model("AdminAccount", AdminAccountSchema)
