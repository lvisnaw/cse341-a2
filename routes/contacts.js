const express = require('express');
const router = express.Router();
const { getDb } = require('../db/connection'); // Import the getDb function
const { ObjectId } = require('mongodb');
const { getContactById } = require('../utils/contactService'); // Import the utility function

// GET all contacts

/**
 * @swagger
 * tags:
 *   name: Contacts
 *   description: API for managing contacts
 */

/**
 * @swagger
 * /api/contacts:
 *   get:
 *     summary: Retrieve all contacts
 *     tags: [Contacts]
 *     responses:
 *       200:
 *         description: Successfully retrieved list of contacts
 */

router.get('/', async (req, res) => {
  try {
    const db = getDb(); // Get the initialized database
    const collection = db.collection('contacts'); // Access the contacts collection

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

/**
 * @swagger
 * /api/contacts/{id}:
 *   get:
 *     summary: Retrieve a contact by ID
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The contact ID
 *     responses:
 *       200:
 *         description: Successfully retrieved the contact
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Contact not found
 */

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Use the utility function to get the contact
    const contact = await getContactById(id);
    res.status(200).json(contact);
  } catch (error) {
    console.error('Error fetching contact by ID:', error.message);

    // Respond with appropriate error codes
    if (error.message === 'Invalid ID format') {
      res.status(400).json({ message: error.message });
    } else if (error.message === 'Contact not found') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
});

// POST: Create a new contact

/**
 * @swagger
 * /api/contacts:
 *   post:
 *     summary: Create a new contact
 *     tags: [Contacts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               favoriteColor:
 *                 type: string
 *               birthday:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Contact created successfully
 *       400:
 *         description: Missing required fields
 */

router.post('/', async (req, res) => {
  try {
    // Build the contact object from the request body
    const contact = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      favoriteColor: req.body.favoriteColor,
      birthday: req.body.birthday,
    };

    // Validate required fields
    if (!contact.firstName || !contact.lastName || !contact.email) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Insert the contact into the database
    const db = getDb(); // Access the database
    const response = await db.collection('contacts').insertOne(contact);

    // Check if the insertion was successful
    if (response.acknowledged) {
      res.status(201).json({ id: response.insertedId });
    } else {
      res.status(500).json({ message: 'Failed to create contact' });
    }
  } catch (error) {
    console.error('Error creating contact:', error.message);
    res
      .status(500)
      .json({ message: 'Internal server error', error: error.message });
  }
});

// PUT: Update a contact

/**
 * @swagger
 * /api/contacts/{id}:
 *   put:
 *     summary: Update a contact
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The contact ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               favoriteColor:
 *                 type: string
 *               birthday:
 *                 type: string
 *                 format: date
 *     responses:
 *       204:
 *         description: Contact updated successfully
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Contact not found
 */

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    // Validate ID format
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const db = getDb();
    const response = await db.collection('contacts').updateOne(
      { _id: new ObjectId(id) }, // Match the contact by ID
      { $set: updatedData } // Set the fields to update
    );

    if (response.matchedCount === 0) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.status(204).send(); // No content response
  } catch (error) {
    console.error('Error updating contact:', error.message);
    res
      .status(500)
      .json({ message: 'Internal server error', error: error.message });
  }
});

// DELETE: Delete a contact

/**
 * @swagger
 * /api/contacts/{id}:
 *   delete:
 *     summary: Delete a contact
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The contact ID
 *     responses:
 *       200:
 *         description: Contact deleted successfully
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Contact not found
 */

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const db = getDb();
    const response = await db
      .collection('contacts')
      .deleteOne({ _id: new ObjectId(id) });

    if (response.deletedCount === 0) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.status(200).json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error.message);
    res
      .status(500)
      .json({ message: 'Internal server error', error: error.message });
  }
});

module.exports = router;
