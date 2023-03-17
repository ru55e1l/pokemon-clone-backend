const TrainerService = require('../../../services/trainer-service');
const Trainer = require('../../../models/trainer');
const bcrypt = require('bcryptjs');

// Mock data
const trainerData = {
    username: 'testuser',
    password: 'password123',
    email: 'testuser@example.com',
    birthday: new Date('2000-01-01'),
};

const mockedHashedPassword = '$2a$10$IDfUTLL5LcIfjMhNfSwGFecKVrEJ67agRDHw8ByA5HGPC9yqCGyrm';

describe('TrainerService', () => {
    describe('createTrainer', () => {
        it('should create a new trainer', async () => {
            // Mock dependencies
            const existingTrainer = null;
            const hashSpy = jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => Promise.resolve(mockedHashedPassword));
            const createDocumentSpy = jest.spyOn(TrainerService, 'createDocument')
                .mockImplementationOnce(() => Promise.resolve({
                    _id: '1234567890',
                    username: trainerData.username,
                    password: mockedHashedPassword,
                    email: trainerData.email,
                    birthday: trainerData.birthday,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }));
            const getDocumentByFieldSpy = jest.spyOn(TrainerService, 'getDocumentByField')
                .mockImplementationOnce(() => Promise.resolve(existingTrainer));

            // Invoke function
            const result = await TrainerService.createTrainer(trainerData);

            // Assertions
            expect(createDocumentSpy).toHaveBeenCalledWith({
                username: trainerData.username,
                password: mockedHashedPassword,
                email: trainerData.email,
                Birthday: trainerData.birthday,
            });

            expect(getDocumentByFieldSpy).toHaveBeenCalledWith({
                $or: [
                    {username: trainerData.username},
                    {email: trainerData.email},
                ],
            });
            expect(result).toEqual({
                _id: '1234567890',
                username: trainerData.username,
                password: mockedHashedPassword,
                email: trainerData.email,
                birthday: trainerData.birthday,
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
            });

            // Clean up
            createDocumentSpy.mockRestore();
            getDocumentByFieldSpy.mockRestore();
            hashSpy.mockRestore();
        });

        it('should throw an error if a trainer with the same username or email already exists', async () => {
            // Mock dependencies
            const existingTrainer = {
                _id: '0987654321',
                username: 'existinguser',
                password: 'password123',
                email: 'existinguser@example.com',
                birthday: new Date('1990-01-01'),
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            const hashSpy = jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => Promise.resolve(mockedHashedPassword));
            const createDocumentSpy = jest.spyOn(TrainerService, 'createDocument');
            const getDocumentByFieldSpy = jest.spyOn(TrainerService, 'getDocumentByField')
                .mockImplementationOnce(() => Promise.resolve(existingTrainer));

            // Invoke function and assert error
            await expect(TrainerService.createTrainer(trainerData)).rejects.toThrow('A trainer with the same username or email already exists.');
            // Assertions
            expect(createDocumentSpy).not.toHaveBeenCalled();
            expect(getDocumentByFieldSpy).toHaveBeenCalledWith({
                $or: [
                    {username: trainerData.username},
                    {email: trainerData.email},
                ],
            });

            // Clean up
            createDocumentSpy.mockRestore();
            getDocumentByFieldSpy.mockRestore();
            hashSpy.mockRestore();
        });
    });
});

