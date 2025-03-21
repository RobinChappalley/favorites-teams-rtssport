const mongoose = require('mongoose');

const mongoURI = process.env.MONGO_URI || 'mongodb://mongo:27017/ftsports';

const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1); // Exit process if unable to connect
    }
};

module.exports = connectDB;
