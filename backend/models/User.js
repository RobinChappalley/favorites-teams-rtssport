// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
});

// Export the model so it can be reused
module.exports = mongoose.model('User', userSchema);
