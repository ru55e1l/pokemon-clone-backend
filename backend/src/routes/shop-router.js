const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth/auth');
const { admin, user } = require("../middleware/auth/roles");
const PokemonService = require('../services/pokemon/pokemon-service');
const shopService = require('../services/pokemon/shop-service');

/**
 * @swagger
 * tags:
 *   name: shop
 *   description: API for managing active-pokemon
 */

/**
 * @swagger
 * /api/shop:
 *   get:
 *     summary: Get all available pokemon to buy
 *     tags: [shop]
 *     responses:
 *       '200':
 *         description: A list of pokemon
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/move'
 */
router.get('/', [auth, user], async (req, res) => {
    try {
        const pokemon = await PokemonService.getDocumentsByField({forSale: true})
        res.status(200).json(pokemon);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/shop/{pokemonId}:
 *   post:
 *     summary: Buy a Pokemon using trainer ID and pokemon ID
 *     tags: [shop]
 *     parameters:
 *       - in: path
 *         name: pokemonId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the Pokemon to buy
 *     responses:
 *       '200':
 *         description: Successfully purchased Pokemon
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/activePokemon'
 *       '400':
 *         description: Bad request (Trainer not found, Pokemon not found or Insufficient Credits)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.post('/:pokemonId', [auth, user], async (req, res) => {
    try {
        // Get the trainerId from the req.trainer object
        const trainerId = req.trainer._id;
        const pokemonId = req.params.pokemonId;
        const activePokemon = await shopService.buyPokemon(trainerId, pokemonId);
        res.status(200).json(activePokemon);
    } catch (error) {
        if (['Trainer not found', 'Pokemon not found', 'Insufficient Credits'].includes(error.message)) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
});

/**
 * @swagger
 * /api/shop/trade:
 *   post:
 *     summary: Trade a pokemon with another trainer
 *     tags:
 *       - shop
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pokemonId
 *               - targetTrainerId
 *             properties:
 *               pokemonId:
 *                 type: string
 *                 description: The ID of the pokemon to trade
 *                 example: 5f9f1b9b0b5b9c0b5c0b5c0b
 *               targetTrainerId:
 *                 type: string
 *                 description: The ID of the trainer to trade with
 *                 example: 5f9f1b9b0b5b9c0b5c0b5c0b
 *     responses:
 *       '200':
 *         description: Successfully traded pokemon
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/activePokemon'
 *       '400':
 *         description: Bad request (Trainer not found, Pokemon not found or Insufficient Credits)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                   description: Error message
 */
router.post('/trade', [auth, user], async (req, res) => {
    try {
        const trainerId = req.trainer._id;
        const { pokemonId, targetTrainerId } = req.body;
        const activePokemon = await shopService.tradePokemon(trainerId, pokemonId, targetTrainerId);
        res.status(200).json(activePokemon);
    } catch (error) {
        if (['Trainer not found', 'Pokemon not found', 'Insufficient Credits'].includes(error.message)) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
});

module.exports = router;
