const mongoose = require('mongoose');

const mongoURI = process.env.MONGO_URI || 'mongodb://mongo:27017/ftsports';

const userSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

async function seed() {
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB for seeding.');

        // Optional: Clear existing users
        await User.deleteMany({});

        // Insert test users
        const testUsers = [
            { id: '1', name: 'Marc' },
            { id: '2', name: 'Alice' },
            { id: '3', name: 'Bob' },
        ];
        await User.insertMany(testUsers);
        console.log('Test users inserted successfully.');
    } catch (err) {
        console.error('Error seeding test users:', err);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
    }
}

seed();
