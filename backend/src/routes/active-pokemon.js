const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const activePokemonService = require('../services/active-pokemon-service');
const { user, admin } = require("../middleware/roles");
const auth = require("../middleware/auth");
const pokemonService = require("../services/pokemon-service");
router.use(bodyParser.json());

const isOwnerOrAdmin = async (req, res, next) => {
    try {
        const activePokemon = await activePokemonService.getDocumentById(req.params.id);
        if (!activePokemon) {
            return res.status(404).json({ message: "Active Pokemon not found" });
        }

        if (req.user.roles.includes("admin") || activePokemon.trainer.toString() === req.user.id) {
            next();
        } else {
            return res.status(403).json({ message: "You are not authorized to perform this action" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


/**
 * @swagger
 * tags:
 *   name: active-pokemon
 *   description: API for managing active-pokemon
 */

/**
 * @swagger
 * /api/active-pokemon/equipped-pokemon:
 *   get:
 *     summary: Get the active Pokemon of the authenticated user
 *     tags: [active-pokemon]
 *     responses:
 *       '200':
 *         description: A list of active Pokemon for the authenticated user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ActivePokemon'
 *       '500':
 *         description: Internal server error
 */
router.get('/equipped-pokemon', [auth, user], async (req, res) => {
    try {
        const userId = req.user.id;
        const myActivePokemon = await activePokemonService.getDocumentByField({ trainer: userId, active: true });
        res.status(200).json(myActivePokemon);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/active-pokemon/by-trainer/{username}:
 *   get:
 *     summary: Get active Pokemon by trainer name
 *     tags: [active-pokemon]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: A list of active Pokemon for the specified trainer
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ActivePokemon'
 *       '500':
 *         description: Internal server error
 */

router.get('/by-trainer/:username', async (req, res) => {
    try {
        const username = req.params.username;
        const activePokemon = await activePokemonService.getActivePokemonByTrainerName(username);
        res.status(200).json(activePokemon);
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
router.delete('/:id', [auth, admin], async (req, res) => {
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

/**
 * @swagger
 * /api/active-pokemon/equip/{id}:
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
router.put('/equip/:id', [auth, user, isOwnerOrAdmin], async (req, res) => {
    try {
        const updatedActivePokemon = await activePokemonService.equipPokemon(req.params.id)
        res.status(200).json({message: 'Pokemon Equipped'});
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/active-pokemon/unequip/{id}:
 *   put:
 *     summary: Unequip an active-pokemon by ID
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
 *         description: Unequipped active-pokemon
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ActivePokemon'
 *       '404':
 *         description: active-pokemon not found
 */
router.put('/unequip/:id', [auth, user, isOwnerOrAdmin], async (req, res) => {
    try {
        const updatedActivePokemon = await activePokemonService.unequipPokemon(req.params.id)
        res.status(200).json({message: 'Pokemon Unequipped'});
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});




module.exports = router;
