const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth/auth');
const { admin, user } = require("../middleware/auth/roles");
const battleService = require('../services/battle/battleService');
/**
 * @swagger
 * tags:
 *   name: battle
 *   description: API for managing battles
 */

/**
 * @swagger
 * /api/battle/start:
 *   post:
 *     summary: Start a battle
 *     tags: [battle]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - trainer1
 *               - trainer2
 *             properties:
 *               trainer1:
 *                 type: string
 *               trainer2:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Battle started
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 trainer1Id:
 *                   type: string
 *                 trainer2Id:
 *                   type: string
 *       '400':
 *         description: Invalid battle data
 */
router.post('/start', async (req, res) => {
    try {
        const { trainer1Id, trainer2Id } = req.body;
        const newBattle = await battleService.startBattle(trainer1Id, trainer2Id);
        res.status(201).json(newBattle);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/battle/end:
 *   post:
 *     summary: End a battle
 *     tags: [battle]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - activeBattleId
 *               - winningTrainerId
 *             properties:
 *               activeBattleId:
 *                 type: string
 *               winningTrainerId:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Battle ended
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 trainer1:
 *                   type: string
 *                 trainer2:
 *                   type: string
 *                 winner:
 *                   type: string
 *                 startDate:
 *                   type: string
 *                   format: date-time
 *                 endDate:
 *                   type: string
 *                   format: date-time
 *       '400':
 *         description: Invalid battle data
 */
router.post('/end', async (req, res) => {
    try {
        const { activeBattleId, winningTrainerId } = req.body;
        const endedBattle = await battleService.endBattle(activeBattleId, winningTrainerId);
        res.status(200).json(endedBattle);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;