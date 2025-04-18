// backend/routes/users.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');

/**
 * @openapi
 * /api/users/{userId}:
 *   get:
 *     summary: Returns a user by their custom ID
 *     tags:
 *       - Users
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The custom ID field of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User data
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findOne({ id: userId });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
