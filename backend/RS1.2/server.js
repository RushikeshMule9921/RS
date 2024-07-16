const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const loginRoutes = require('./routes/login');
const registerRoutes = require('./routes/register');
const additionalInfoRoutes = require('./routes/addtionalinfo'); // Ensure the file name is correct

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
const uri = 'mongodb+srv://nmnikhil726:nmnikhil@resumedatabase.p7jn0gh.mongodb.net/mydatabase';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

// Routes
app.use('/login', loginRoutes);
app.use('/register', registerRoutes);
app.use('/additional-info', additionalInfoRoutes); // Ensure this path matches the frontend

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
