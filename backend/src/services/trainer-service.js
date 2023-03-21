const Trainer = require('../models/trainer');
const RefreshToken = require('../models/refreshToken')
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
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
        return trainer;

    }
    async getTrainerByUsername(username) {
        try {
            const trainer = await this.getDocumentByField({ 'username': username });
            if (!trainer) {
                throw new Error(`Trainer with username ${username} not found`);
            }
            return trainer;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async createRefreshToken(trainerId, device) {
        // Delete existing refresh tokens for the same trainerId and device
        await RefreshToken.deleteMany({ trainerId, device });

        // Create a new refresh token
        const expiresIn = new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)); // 7 days
        const token = crypto.randomBytes(32).toString('hex');

        const refreshToken = new RefreshToken({
            token,
            trainerId,
            device,
            expiresAt: expiresIn
        });

        await refreshToken.save();
        return refreshToken;
    }


    async validateRefreshToken(token) {
        const refreshToken = await RefreshToken.findOne({ token });
        if (!refreshToken) {
            throw new Error('Invalid refresh token');
        }
        return refreshToken;
    }

    async deleteRefreshToken(token) {
        await RefreshToken.deleteOne({ token });
    }


}


module.exports = new TrainerService();
