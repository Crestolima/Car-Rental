const express = require('express');
const router = express.Router();
const { registerUser, loginUser ,getUsers,getUserCount} = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);

// New route to fetch users
router.get('/users', getUsers);
router.get('/users/count', getUserCount);


module.exports = router;