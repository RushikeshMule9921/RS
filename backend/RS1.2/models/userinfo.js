const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for additional user details
const userDetailsSchema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', // Reference to the User schema
    required: true 
  },
  cgpa: { type: Number, required: true },
  branch: { type: String, required: true },
  semester: { type: String, required: true }
});

const UserDetails = mongoose.model('UserDetails', userDetailsSchema);
module.exports = UserDetails;
