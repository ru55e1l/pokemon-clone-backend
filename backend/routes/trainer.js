const express = require('express');
const router = express.Router();
const trainerService = require('../services/trainer-service');
const auth = require("../middleware/auth");
const { admin, user } = require("../middleware/roles");

/**
 * @swagger
 * tags:
 *   name: Trainer
 *   description: API for managing Trainers
 */

/**
 * @swagger
 * /api/trainer:
 *   get:
 *     summary: Returns a trainer by name
 *     tags: [Trainer]
 *     parameters:
 *       - in: query
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *       404:
 *         description: Trainer not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/', [auth, user], async (req, res) => {
    try {
        const trainer = await trainerService.getTrainerByUsername(req.query.username);
        if (!trainer) {
            return res.status(404).json({ message: 'Trainer not found' });
        }
        res.status(200).json(trainer);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/trainer/signup:
 *   post:
 *     summary: Signup as a trainer
 *     tags: [Trainer]
 *     requestBody:
 *      required: true
 *      content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                      username:
 *                          type: string
 *                      password:
 *                          type: string
 *                      email:
 *                          type: string
 *                      birthday:
 *                          type: string
 *                          format: date
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
router.post('/signup', async (req, res) => {
    try {
        // Call the trainerService to create a new trainer
        const trainer = await trainerService.createTrainer({
            username: req.body.username.trim(),
            password: req.body.password,
            email: req.body.email.trim(),
            birthday: new Date(req.body.birthday),
        });
        res.status(200).json(trainer);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/trainer/login:
 *   post:
 *     summary: login as a trainer
 *     tags: [Trainer]
 *     requestBody:
 *      required: true
 *      content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                      username:
 *                          type: string
 *                      password:
 *                          type: string
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
router.post('/login', async (req, res) => {
    try {
        // Call the trainerService to authenticate the user and generate a JWT token
        const { token } = await trainerService.authenticateTrainer(req.body.username, req.body.password);
        // Return the token in the response
        res.status(200).json({ token });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
