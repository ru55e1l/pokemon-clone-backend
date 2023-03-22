const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const PokemonRouter = require('../models/pokemon');
const pokemonService = require('../services/pokemon-service');
const auth = require("../middleware/auth/auth");
const { admin, user } = require("../middleware/auth/roles");
router.use(bodyParser.json());
/**
 * @swagger
 * tags:
 *   name: pokemon
 *   description: API for managing PokemonRouter
 */

/**
 * @swagger
 * /api/pokemon:
 *   get:
 *     summary: Get all PokemonRouter
 *     tags: [pokemon]
 *     responses:
 *       '200':
 *         description: A list of PokemonRouter
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pokemon'
 */
router.get('/', [auth, user], async (req, res) => {
    try {
        const allPokemon = await pokemonService.getAllDocuments();
        res.status(200).json(allPokemon);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/pokemon/{name}:
 *   get:
 *     summary: Get a PokemonRouter by name
 *     tags: [pokemon]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Name of the PokemonRouter
 *     responses:
 *       '200':
 *         description: A PokemonRouter with the specified name
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pokemon'
 *       '404':
 *         description: PokemonRouter not found
 */
router.get('/:name', [auth, user], async (req, res) => {
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
 *     summary: Delete a PokemonRouter by name
 *     tags: [pokemon]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Name of the PokemonRouter
 *     responses:
 *       '204':
 *         description: PokemonRouter successfully deleted
 *       '404':
 *         description: PokemonRouter not found
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
 *     summary: Update a PokemonRouter by name
 *     tags: [pokemon]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Name of the PokemonRouter
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pokemon'
 *     responses:
 *       '200':
 *         description: Updated PokemonRouter
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pokemon'
 *       '404':
 *         description: PokemonRouter not found
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
 *     summary: Create a new PokemonRouter
 *     tags: [pokemon]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pokemon'
 *     responses:
 *       '200':
 *         description: A new PokemonRouter has been created
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
