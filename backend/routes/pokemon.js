const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Pokemon = require('../models/pokemon');

router.use(bodyParser.json());
/**
 * @swagger
 * tags:
 *   name: Pokemon
 *   description: API for managing Pokemon
 */

/**
 * @swagger
 * /api/pokemon:
 *   post:
 *     summary: Create a new Pokemon
 *     tags: [Pokemon]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: array
 *                 items:
 *                   type: string
 *               baseStats:
 *                 type: object
 *                 properties:
 *                   hp:
 *                     type: number
 *                   attack:
 *                     type: number
 *                   defense:
 *                     type: number
 *                   specialAttack:
 *                     type: number
 *                   specialDefense:
 *                     type: number
 *                   speed:
 *                     type: number
 *     responses:
 *       '200':
 *         description: A new Pokemon has been created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 type:
 *                   type: array
 *                   items:
 *                     type: string
 *                 baseStats:
 *                   type: object
 *                   properties:
 *                     hp:
 *                       type: number
 *                     attack:
 *                       type: number
 *                     defense:
 *                       type: number
 *                     specialAttack:
 *                       type: number
 *                     specialDefense:
 *                       type: number
 *                     speed:
 *                       type: number
 */
router.post('/', async (req, res) => {
    try {
        const { name, type, baseStats } = req.body;
        const pokemon = await Pokemon.create({
            name,
            type,
            baseStats
        });
        res.status(200).json(pokemon);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
