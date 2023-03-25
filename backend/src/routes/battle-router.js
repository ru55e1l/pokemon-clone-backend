const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth/auth');
const { admin, user } = require("../middleware/auth/roles");
const battleService = require('../services/battle/active-battle-service');
/**
 * @swagger
 * tags:
 *   name: battle
 *   description: API for managing battles
 */

/**
 * @swagger
 * /api/battle:
 *   post:
 *     summary: Create a battle
 *     tags: [battle]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Battle'
 *     responses:
 *       '201':
 *         description: Battle created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Move'
 *       '400':
 *         description: Invalid battle data
 */
router.post('/', async (req, res) => {
    try {
        const battleData = req.body;
        const newBattle = await battleService.createDocument(battleData);
        res.status(201).json(newBattle);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
module.exports = router;