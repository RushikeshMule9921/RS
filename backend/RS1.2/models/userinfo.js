// models/UserInfo.js
const mongoose = require('mongoose');

const UserInfoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  cgpa: { type: Number, required: true },
  branch: { type: String, required: true },
  semester: { type: String, required: true }
});

module.exports = mongoose.model('UserInfo', UserInfoSchema);
