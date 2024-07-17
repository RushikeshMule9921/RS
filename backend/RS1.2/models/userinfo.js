const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userDetailsSchema = new Schema({
  rollNumber: { 
    type: String, 
    ref: 'User',
    required: true,
    unique: true
  },
  cgpa: { type: Number, required: true },
  branch: { type: String, required: true },
  semester: { type: String, required: true }
});

const UserDetails = mongoose.model('UserDetails', userDetailsSchema);
module.exports = UserDetails;