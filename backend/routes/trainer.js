const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Trainer = require('../schemas/trainerSchema');

router.use(bodyParser.json());
/**
 * @swagger
 * /api/trainer:
 *   get:
 *     summary: Returns a trainer by username
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

router.get('/', async (req, res) => {
    try {
        const trainer = await Trainer.findOne({ username: req.query.username });
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
 * /api/trainer:
 *   post:
 *     summary: Creates a trainer
 *     requestBody:
 *      required: true
 *      content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                      name:
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
router.post('/', async(req, res) => {
    try{
        const trainer = await Trainer.create(req.body)
        res.status(200).json(trainer)
    } catch(error){
        console.log(error.message);
        res.status(500).json({message: error.message});
    }
});

module.exports = router;
