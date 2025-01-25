/* eslint-disable */
const mongoose = require('mongoose');
const { initDb } = require('./db/connection');
const Contact = require('./models/contact');

// Test the Contact model
const testContact = async () => {
    try {
        // Ensure the database connection is initialized
        await new Promise((resolve, reject) => {
            initDb((err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        const newContact = new Contact({
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com',
            favoriteColor: 'Blue',
            birthday: '2000-01-01',
        });

        const savedContact = await newContact.save();
        console.log('Contact saved successfully:', savedContact);
        process.exit(0); // Exit after success
    } catch (error) {
        console.error('Error testing contact model:', error.message);
        process.exit(1); // Exit with failure
    }
};

testContact();
