const express = require('express');
const router = express.Router();
const { registerUser, loginUser ,getUsers} = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);

// New route to fetch users
router.get('/users', getUsers);

module.exports = router;