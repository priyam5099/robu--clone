// backend/src/routes/userRoutes.js
const express = require('express');
const router = express.Router();

// Import BOTH functions from your controller
const { registerUser, loginUser } = require('../controllers/userController');


router.post('/register', registerUser);
router.post('/login', loginUser); // <-- Our new login door!

module.exports = router;