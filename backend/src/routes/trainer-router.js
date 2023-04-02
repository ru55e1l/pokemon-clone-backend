const express = require('express');
const router = express.Router();
const trainerService = require('../services/trainer-service');
const auth = require("../middleware/auth/auth");
const { admin, user } = require("../middleware/auth/roles");

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
        const trainer = await trainerService.authenticateTrainer(req.body.username, req.body.password);

        // Get the device identifier (User-Agent header in this case)
        const device = req.headers['user-agent'] || 'unknown';

        // Create a refresh token for the specific device
        const refreshToken = await trainerService.createRefreshToken(trainer._id, device);

        // Set the cookies
        res.cookie('trainerId', trainer._id, {
            signed: true,
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            secure: process.env.NODE_ENV === 'production',
        });

        res.cookie('refreshToken', refreshToken.token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            secure: process.env.NODE_ENV === 'production',
        });

        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});



/**
 * @swagger
 * /api/trainer/refresh:
 *   post:
 *     summary: Refresh the authentication cookie
 *     tags: [Trainer]
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Token refreshed
 *       401:
 *         description: Unauthorized, no refresh token provided or invalid refresh token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No refresh token provided
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
router.post('/refresh', async (req, res) => {
    try {
        const oldRefreshToken = req.cookies.refresh;

        if (!oldRefreshToken) {
            return res.status(401).json({ message: 'No refresh token provided' });
        }

        const refreshTokenDoc = await trainerService.validateRefreshToken(oldRefreshToken);
        const trainerId = refreshTokenDoc.trainerId;

        // Delete the old refresh token
        await trainerService.deleteRefreshToken(oldRefreshToken);

        // Get the device identifier (User-Agent header in this case)
        const device = req.headers['user-agent'] || 'unknown';

        // Create a new refresh token for the specific device
        const newRefreshToken = await trainerService.createRefreshToken(trainerId, device);

        res.cookie('trainerId', trainerId, {
            signed: true,
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            secure: process.env.NODE_ENV === 'production',
        });

        res.cookie('refreshToken', newRefreshToken.token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            secure: process.env.NODE_ENV === 'production',
        });

        res.status(200).json({ message: 'Token refreshed' });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/trainer/logout:
 *   post:
 *     summary: Logout a trainer and clear their cookies
 *     tags: [Trainer]
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal Server Error
 */
router.post('/logout', async (req, res) => {
    try {
        const trainerId = req.signedCookies.trainerId;
        if (trainerId) {
            await trainerService.deleteRefreshTokenByTrainerId(trainerId);
        }

        res.clearCookie('trainerId');
        res.clearCookie('refreshToken');
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});



module.exports = router;
