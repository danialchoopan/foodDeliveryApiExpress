const mongoose = require('mongoose');
const { Schema } = mongoose;

const AdminActionSchema = new Schema({
  actorId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true }, // admin
  target: {
    type: {
      type: String,
      enum: ['user','restaurant','order','coupon','menu_item'],
      required: true
    },
    id: { type: Schema.Types.ObjectId, required: true, index: true }
  },
  action: { 
    type: String, 
    enum: ['create','update','delete','ban','approve_vendor','set_order_status','refund'], 
    required: true, 
    index: true 
  },
  payload: {}, 
  at: { type: Date, default: Date.now, index: true },
}, { timestamps: true });

module.exports = mongoose.model('AdminAction', AdminActionSchema);
