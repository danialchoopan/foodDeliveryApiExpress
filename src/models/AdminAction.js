const mongoose = require('mongoose');
const { Schema } = mongoose;

const AdminActionSchema = new Schema({
  adminId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  action: { type: String, required: true },
  targetType: { type: String, required: true }, // e.g., 'User', 'Restaurant'
  targetId: { type: Schema.Types.ObjectId, required: true },
  details: Schema.Types.Mixed
}, { timestamps: true });

module.exports = mongoose.model('AdminAction', AdminActionSchema);
