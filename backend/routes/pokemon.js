const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Pokemon = require('../models/pokemon');
const pokemonService = require('../services/pokemon-service');
const auth = require("../middleware/auth");
const { admin, user } = require("../middleware/roles");
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
 *   get:
 *     summary: Get all Pokemon
 *     tags: [Pokemon]
 *     responses:
 *       '200':
 *         description: A list of Pokemon
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pokemon'
 */
router.get('/', async (req, res) => {
    try {
        const allPokemon = await pokemonService.getAllPokemon();
        res.status(200).json(allPokemon);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/pokemon/{name}:
 *   get:
 *     summary: Get a Pokemon by name
 *     tags: [Pokemon]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Name of the Pokemon
 *     responses:
 *       '200':
 *         description: A Pokemon with the specified name
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pokemon'
 *       '404':
 *         description: Pokemon not found
 */
router.get('/:name', async (req, res) => {
    try {
        const pokemon = await pokemonService.getPokemonByName(req.params.name);
        res.status(200).json(pokemon);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/pokemon/{name}:
 *   delete:
 *     summary: Delete a Pokemon by name
 *     tags: [Pokemon]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Name of the Pokemon
 *     responses:
 *       '204':
 *         description: Pokemon successfully deleted
 *       '404':
 *         description: Pokemon not found
 */
router.delete('/:name', [auth, admin], async (req, res) => {
    try {
        await pokemonService.deletePokemonByName(req.params.name);
        res.status(200).json({message: `Pokemon ${req.params.name} succesfully deleted`});
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/pokemon/{name}:
 *   put:
 *     summary: Update a Pokemon by name
 *     tags: [Pokemon]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Name of the Pokemon
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pokemon'
 *     responses:
 *       '200':
 *         description: Updated Pokemon
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pokemon'
 *       '404':
 *         description: Pokemon not found
 */
router.put('/:name', [auth, admin], async (req, res) => {
    try {
        const updatedPokemon = await pokemonService.updatePokemonByName(req.params.name, req.body);
        res.status(200).json(updatedPokemon);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/pokemon/create:
 *   post:
 *     summary: Create a new Pokemon
 *     tags: [Pokemon]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pokemon'
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
router.post('/create', [auth, admin], async (req, res) => {
    try {
        const newPokemon = await pokemonService.createPokemon(req.body);
        res.status(201).json(newPokemon);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
