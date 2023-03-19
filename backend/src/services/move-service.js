const GenericService = require("./generic-service");
const moves = require("../models/move");

class MoveService extends GenericService {
    constructor() {
        super(moves);
    }
}

module.exports = new MoveService();