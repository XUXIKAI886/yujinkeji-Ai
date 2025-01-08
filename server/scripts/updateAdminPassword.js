const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function updateAdminPassword() {
    try {
        const mongoUri = process.env.MONGODB_URI;
        console.log('Connecting to MongoDB:', mongoUri);
        
        await mongoose.connect(mongoUri, {
            dbName: process.env.DB_NAME,
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('Admin@2024#Secure', salt);

        const result = await mongoose.connection.db.collection('users').updateOne(
            { email: 'admin@example.com' },
            { $set: { password: hashedPassword } }
        );

        if (result.matchedCount === 0) {
            console.log('No user found with email admin@example.com');
        } else if (result.modifiedCount === 1) {
            console.log('Password updated successfully');
        }

        console.log('Update result:', result);
        await mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
    }
}

updateAdminPassword(); 