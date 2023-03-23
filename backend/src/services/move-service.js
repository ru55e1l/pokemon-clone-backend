const GenericService = require("./generic-service");
const moves = require("../models/move");
const validEffects = require('../constants/Move/validEffects');
const validTargets = require('../constants/Move/validTargets');
const validTypes = require('../constants/validTypes');

class MoveService extends GenericService {
    constructor() {
        super(moves);
    }

    async validateMoveData(moveData) {
        // Check for duplicate move names
        const existingMove = await this.getDocumentByField({ name: moveData.name.toLowerCase() });
        if (existingMove) {
            throw new Error('Move with the same name already exists');
        }

        if (moveData.effect && !validEffects.includes(moveData.effect)) {
            throw new Error('Invalid move effect');
        }

        if (!validTargets.includes(moveData.target)) {
            throw new Error('Invalid move target');
        }

        if(!validTypes.includes(moveData.type)) {
            throw new Error('Invalid move type');
        }

        return true;
    }

    async createMove(moveData) {
        try {
            await this.validateMoveData(moveData);
            return this.createDocument(moveData);
        } catch(error) {

            throw error;
        }
    }

    async getMovesByType(type) {
        try{
            // Check if valid type
            if(!validTypes.includes(type)){
                throw new Error('Invalid type')
            }

            const moves = await this.getDocumentsByField({type: type.toLowerCase()})
            return moves;
        } catch(error) {
            throw error;
        }
    }
    // moveService.js

    // moveService.js

    async bulkCreateMoves(moveList) {
        const newMoveList = [];
        const errorMessages = [];

        for (const moveData of moveList) {
            try {
                await this.validateMoveData(moveData);
                const newMove = new moves(moveData);
                await this.createDocument(newMove);
                newMoveList.push(newMove);
            } catch (error) {
                // Store the error message for the failed Move creation
                errorMessages.push({
                    name: moveData.name,
                    message: error.message,
                });
            }
        }

        return { newMoveList, errorMessages };
    }


}

module.exports = new MoveService();