const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const activePokemonService = require('../services/active-pokemon-service');
const { user, admin } = require("../middleware/roles");
const auth = require("../middleware/auth");
const pokemonService = require("../services/pokemon-service");

router.use(bodyParser.json());

/**
 * @swagger
 * tags:
 *   name: active-pokemon
 *   description: API for managing active-pokemon
 */

/**
 * @swagger
 * /api/active-pokemon:
 *   get:
 *     summary: Get all active-pokemon
 *     tags: [active-pokemon]
 *     responses:
 *       '200':
 *         description: A list of active-pokemon
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ActivePokemon'
 */
router.get('/', async (req, res) => {
    try {
        const allActivePokemon = await activePokemonService.getAllDocuments();
        res.status(200).json(allActivePokemon);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
/**
 * @swagger
 * /api/active-pokemon/{id}:
 *   get:
 *     summary: Get active-pokemon
 *     tags: [active-pokemon]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: id of the active-pokemon
 *     responses:
 *       '200':
 *         description: an active-pokemon
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ActivePokemon'
 *       '404':
 *         description: active-pokemon not found
 */
router.get('/:id', [auth, user], async (req, res) => {
    try {
        const pokemon = await activePokemonService.getDocumentById(req.params.id);
        res.status(200).json(pokemon);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/active-pokemon:
 *   post:
 *     summary: Create a new active-pokemon
 *     tags: [active-pokemon]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *             schema:
 *               $ref: '#/components/schemas/ActivePokemon'
 *     responses:
 *       '201':
 *         description: A new active-pokemon has been created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ActivePokemon'
 */
router.post('/', [auth, admin], async (req, res) => {
    try {
        const newActivePokemon = await activePokemonService.createDocument(req.body);
        res.status(201).json(newActivePokemon);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/active-pokemon/{id}:
 *   delete:
 *     summary: Delete an active-pokemon by ID
 *     tags: [active-pokemon]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the active-pokemon
 *     responses:
 *       '200':
 *         description: active-pokemon successfully deleted
 *       '404':
 *         description: active-pokemon not found
 */
router.delete('/:id', [auth, user], async (req, res) => {
    try {
        await activePokemonService.deleteDocumentById(req.params.id);
        res.status(200).json({message: `active-pokemon ${req.params.id} successfully deleted`}).send();
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/active-pokemon/{id}:
 *   put:
 *     summary: Update an active-pokemon by ID
 *     tags: [active-pokemon]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the active-pokemon
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ActivePokemon'
 *     responses:
 *       '200':
 *         description: Updated active-pokemon
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ActivePokemon'
 *       '404':
 *         description: active-pokemon not found
 */
router.put('/:id', [auth, admin], async (req, res) => {
    try {
        const updatedActivePokemon = await activePokemonService.updateDocumentById(req.params.id, req.body)
        res.status(200).json(updatedActivePokemon);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

module.exports = router;
