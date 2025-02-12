const express = require('express');
const { getDb } = require('../db/connection');
const { ObjectId } = require('mongodb');
const { getContactById } = require('../utils/contactService');
const { validateContact } = require('../middleware/validation');

const router = express.Router();
const collectionName = 'contacts';

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
    const db = getDb();
    const contacts = await db.collection(collectionName).find({}).toArray();
    res.json(Array.isArray(contacts) ? contacts : []);
  } catch (error) {
    console.error('Error querying contacts:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

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
    const contact = await getContactById(id);
    res.status(200).json(contact);
  } catch (error) {
    console.error('Error fetching contact by ID:', error.message);
    const statusCode = error.message === 'Invalid ID format' ? 400 : 404;
    res.status(statusCode).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/contacts:
 *   post:
 *     summary: Create a new contact
 *     tags: [Contacts]
 *     requestBody:
 *       required: true
 *       description: "Required fields: firstName, lastName, email"
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:  # ✅ Properly placed 'required' block
 *               - firstName
 *               - lastName
 *               - email
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: "First name of the contact"
 *               lastName:
 *                 type: string
 *                 description: "Last name of the contact"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: "Valid email address"
 *               favoriteColor:
 *                 type: string
 *                 description: "Favorite color (optional)"
 *               birthday:
 *                 type: string
 *                 format: date
 *                 description: "Birthday (optional)"
 *     responses:
 *       201:
 *         description: Contact created successfully
 *       400:
 *         description: Missing required fields
 */
router.post('/', validateContact, async (req, res) => {
  try {
    const db = getDb();

    // ✅ Ensure birthday is stored as YYYY-MM-DD (string) instead of Date object
    if (req.body.birthday) {
      req.body.birthday = req.body.birthday.toISOString().split('T')[0]; // Extract date only
    }

    const result = await db.collection(collectionName).insertOne(req.body);

    if (result.acknowledged) {
      res.status(201).json({ id: result.insertedId, message: 'Contact created successfully' });
    } else {
      res.status(500).json({ message: 'Failed to create contact' });
    }
  } catch (error) {
    console.error('Error creating contact:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

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
 *       description: "Required fields: firstName, lastName, email"
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: "First name of the contact"
 *               lastName:
 *                 type: string
 *                 description: "Last name of the contact"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: "Valid email address"
 *               favoriteColor:
 *                 type: string
 *                 description: "Favorite color (optional)"
 *               birthday:
 *                 type: string
 *                 format: date
 *                 description: "Birthday (optional)"
 *     responses:
 *       200:
 *         description: Contact updated successfully
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Contact not found
 */
router.put('/:id', validateContact, async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const db = getDb();

    // ✅ Ensure birthday is stored as YYYY-MM-DD (string) instead of Date object
    if (req.body.birthday) {
      req.body.birthday = req.body.birthday.toISOString().split('T')[0]; // Extract date only
    }

    const result = await db.collection(collectionName).updateOne(
      { _id: new ObjectId(id) },
      { $set: req.body }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.status(200).json({ message: 'Contact updated successfully' });
  } catch (error) {
    console.error('Error updating contact:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

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
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const db = getDb();
    const result = await db.collection(collectionName).deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.status(200).json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

module.exports = router;
