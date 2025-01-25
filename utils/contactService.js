const { getDb } = require('../db/connection');
const { ObjectId } = require('mongodb');

const getContactById = async (id) => {
    const db = getDb();
    const collection = db.collection('contacts');

    if (!ObjectId.isValid(id)) {
        throw new Error('Invalid ID format');
    }

    const contact = await collection.findOne({ _id: new ObjectId(id) });

    if (!contact) {
        throw new Error('Contact not found');
    }

    return contact;
};

module.exports = {
    getContactById,
};
