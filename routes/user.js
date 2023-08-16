const express = require('express');

const router = express.Router();
const {
  createUser,
  updateUser,
  getUserMe,
} = require('../controllers/user');
const { validationUpdateUser } = require('../utils/validation');

router.get('/me', getUserMe);

router.post('/', createUser);

router.patch('/me', express.json(), validationUpdateUser, updateUser);

module.exports = router;
