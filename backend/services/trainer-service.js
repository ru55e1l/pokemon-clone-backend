const Trainer = require('../models/trainer');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const GenericService = require('./generic-service');

class TrainerService extends GenericService {
    constructor() {
        super(Trainer);
    }

    async createTrainer(trainerData) {
        // Check if a trainer with the same username or email already exists
        const existingTrainer = await this.getDocumentByField({
            $or: [
                { username: trainerData.username },
                { email: trainerData.email },
            ],
        });
        if (existingTrainer) {
            throw new Error('A trainer with the same username or email already exists.');
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(trainerData.password, salt);

        // Create a new Trainer instance with the hashed password and converted birthday
        const trainer = await this.createDocument({
            username: trainerData.username,
            password: hashedPassword,
            email: trainerData.email,
            Birthday: trainerData.birthday,
        });

        return trainer;
    }

    async authenticateTrainer(username, password) {
        // Find the trainer by their username
        const trainer = await this.getDocumentByField({ username });
        if (!trainer) {
            throw new Error('Invalid username or password');
        }

        // Check if the password is correct
        const validPassword = await bcrypt.compare(password, trainer.password);
        if (!validPassword) {
            throw new Error('Invalid username or password');
        }

        // Generate a JWT token with the trainer's ID and roles
        const token = jwt.sign({
            id: trainer.id,
            roles: trainer.roles,
        }, process.env.SECRET, { expiresIn: "90m" });

        return { token };
    }
}

module.exports = new TrainerService();
