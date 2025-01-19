// const express = require('express');
// const router = express.Router();
// const Contact = require('../models/contact');

// // GET all contacts
// router.get('/', async (req, res) => {
//     try {
//         console.log('Attempting to query all contacts...');
//         const contacts = await Contact.find();
//         console.log('Contacts retrieved: ', contacts);
//         res.json(contacts);
//     } catch (error) {
//         console.error('Error querying contacts:', error);
//         res.status(500).json({ message: error.message });
//     }
// });

// // GET contact by ID
// router.get('/:id', async (req, res) => {
//     try {
//         const contact = await Contact.findById(req.params.id);
//         if (!contact) {
//             return res.status(404).json({ message: 'Contact not found' });
//         }
//         res.json(contact);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// module.exports = router;


/* Testing a direct conntecion */
// const express = require('express');
// const router = express.Router();
// const { getDb } = require('../db/connection');

// router.get('/', async (req, res) => {
//     try {
//         const db = getDb(); // Get the initialized DB object
//         const collection = db.collection('family'); // Access the 'family' collection
//         const contacts = await collection.find().toArray(); // Retrieve all documents
//         console.log('Contacts retrieved:', contacts);
//         res.json(contacts);
//     } catch (error) {
//         console.error('Error querying contacts:', error);
//         res.status(500).json({ message: error.message });
//     }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const { getDb } = require('../db/connection'); // Import the getDb function
const { ObjectId } = require('mongodb');

// GET all contacts
router.get('/', async (req, res) => {
    try {
        const db = getDb(); // Get the initialized database
        const collection = db.collection('family'); // Access the family collection

        console.log('Attempting to retrieve documents from collection...');
        const contacts = await collection.find({}).toArray(); // Retrieve all documents
        console.log('Raw query result:', contacts); // Debug log

        // Ensure the response is an array, even if empty
        res.json(Array.isArray(contacts) ? contacts : []);
    } catch (error) {
        console.error('Error querying contacts:', error);
        res.status(500).json({ message: error.message });
    }
});

// GET contact by ID
router.get('/:id', async (req, res) => {
    try {
        const db = getDb();
        const collection = db.collection('family');

        const id = req.params.id; // Get ID from the request parameters
        console.log(`Fetching contact with ID: ${id}`);

        // Validate ID format
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        // Query for the contact by ID
        const contact = await collection.findOne({ _id: new ObjectId(id) });
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        res.json(contact); // Send the found contact as the response
    } catch (error) {
        console.error('Error fetching contact by ID:', error);
        res.status(500).json({ message: 'Error fetching contact' });
    }
});

module.exports = router;
