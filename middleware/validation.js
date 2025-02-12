const { body, validationResult } = require('express-validator');

// Validation rules for creating or updating a contact
const validateContact = [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('favoriteColor').optional().isString(),
  body('birthday')
  .optional()
  .isISO8601()
  .withMessage('Birthday must be a valid date')
  .toDate() // Converts input to a Date object
  .custom((value) => {
    if (value instanceof Date && !isNaN(value)) {
      return value.toISOString().split('T')[0]; // Extract only YYYY-MM-DD
    }
    throw new Error('Invalid date format');
  }),


  // Middleware to handle validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = { validateContact };
