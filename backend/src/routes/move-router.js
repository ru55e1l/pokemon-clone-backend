const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth/auth');
const { admin, user } = require("../middleware/auth/roles");
const moveService = require('../services/move-service');

/**
 * @swagger
 * tags:
 *   name: move
 *   description: API for managing moves
 */

/**
 * @swagger
 * /api/move:
 *   get:
 *     summary: Get all moves
 *     tags: [move]
 *     responses:
 *       '200':
 *         description: A list of moves
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/move'
 */
router.get('/', [auth, user], async (req, res) => {
    try {
        const allMoves = await moveService.getAllDocuments();
        res.status(200).json(allMoves);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/move/{id}:
 *   get:
 *     summary: Get move
 *     tags: [move]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: id of the move
 *     responses:
 *       '200':
 *         description: a move
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Move'
 *       '404':
 *         description: move not found
 */
router.get('/:id', [auth, user], async (req, res) => {
    try {
        const move = await moveService.getDocumentById(req.params.id);
        res.status(200).json(move);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/move:
 *   post:
 *     summary: Create a move
 *     tags: [move]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Move'
 *     responses:
 *       '201':
 *         description: Move created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Move'
 *       '400':
 *         description: Invalid move data
 */
router.post('/', [auth, admin], async (req, res) => {
    try {
        const move = await moveService.createMove(req.body);
        res.status(201).json(move);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/move/{id}:
 *   put:
 *     summary: Update a move
 *     tags: [move]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: id of the move
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Move'
 *     responses:
 *       '200':
 *         description: move updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Move'
 *       '400':
 *         description: invalid move data
 *       '404':
 *         description: move not found
 */
router.put('/:id', [auth, admin], async (req, res) => {
    try {
        const move = await moveService.updateDocumentById(req.params.id, req.body);
        res.status(200).json(move);
    } catch (error) {
        res.status(error.message === 'Document not found' ? 404 : 400).json({ message: error.message});
    }
});

/**
 * @swagger
 * /api/move/{id}:
 *   delete:
 *     summary: Delete a move
 *     tags: [move]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: id of the move
 *     responses:
 *       '200':
 *         description: move deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Move'
 *       '404':
 *         description: move not found
 */
router.delete('/:id', [auth, admin], async (req, res) => {
    try {
        const move = await moveService.deleteDocumentById(req.params.id);
        res.status(200).json(move);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

module.exports = router;

