const mongoose = require('mongoose');

const uri = 'mongodb+srv://nmnikhil726:nmnikhil@resumedatabase.p7jn0gh.mongodb.net/mydatabase';

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Optional: Add event listeners for connection events
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to the database');
});

mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected from the database');
});
