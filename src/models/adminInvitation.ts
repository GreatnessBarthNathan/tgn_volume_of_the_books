import mongoose from "mongoose"

const AdminInvitationSchema = new mongoose.Schema({
  tokenHash: {
    type: String,
    required: true,
    unique: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    expires: 0,
  },
  usedAt: {
    type: Date,
    default: null,
  },
})

export default mongoose.model("AdminInvitation", AdminInvitationSchema)
