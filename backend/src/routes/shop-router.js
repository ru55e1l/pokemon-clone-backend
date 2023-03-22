const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth/auth');
const { admin, user } = require("../middleware/auth/roles");
const PokemonService = require('../services/pokemon-service');
const shopService = require('../services/shop-service');

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
 * /api/shop/{trainerId}/{pokemonId}:
 *   post:
 *     summary: Buy a Pokemon using trainer ID and pokemon ID
 *     tags: [shop]
 *     parameters:
 *       - in: path
 *         name: trainerId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the trainer
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
router.post('/:trainerId/:pokemonId', async (req, res) => {
    try {
        const { trainerId, pokemonId } = req.params;
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


module.exports = router;
