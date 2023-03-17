const TrainerService = require('../../../services/trainer-service');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

describe('TrainerService', () => {
    describe('authenticateTrainer', () => {
        const trainerData = {
            username: 'testuser',
            password: 'password123',
            email: 'testuser@example.com',
            birthday: new Date('2000-01-01'),
            roles: ['trainer'],
        };
        const mockedHashedPassword = '$2a$10$IDfUTLL5LcIfjMhNfSwGFecKVrEJ67agRDHw8ByA5HGPC9yqCGyrm';

        it('should authenticate the trainer and return a token', async () => {
            // Mock dependencies
            const getDocumentByFieldSpy = jest.spyOn(TrainerService, 'getDocumentByField')
                .mockImplementationOnce(() => Promise.resolve({ ...trainerData, password: mockedHashedPassword }));
            const compareSpy = jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => Promise.resolve(true));
            const signSpy = jest.spyOn(jwt, 'sign').mockImplementationOnce(() => 'mockedToken');

            // Invoke function
            const result = await TrainerService.authenticateTrainer(trainerData.username, trainerData.password);

            // Assertions
            expect(getDocumentByFieldSpy).toHaveBeenCalledWith({ username: trainerData.username });
            expect(compareSpy).toHaveBeenCalledWith(trainerData.password, mockedHashedPassword);
            expect(signSpy).toHaveBeenCalledWith(
                { id: undefined, roles: trainerData.roles },
                process.env.SECRET,
                { expiresIn: '90m' }
            );
            expect(result).toEqual({ token: 'mockedToken' });

            // Clean up
            getDocumentByFieldSpy.mockRestore();
            compareSpy.mockRestore();
            signSpy.mockRestore();
        });

        it('should throw an error if the trainer is not found', async () => {
            // Mock dependencies
            const getDocumentByFieldSpy = jest.spyOn(TrainerService, 'getDocumentByField')
                .mockImplementationOnce(() => Promise.resolve(null));

            // Invoke function and assert error
            await expect(TrainerService.authenticateTrainer(trainerData.username, trainerData.password))
                .rejects.toThrow('Invalid username or password');

            // Clean up
            getDocumentByFieldSpy.mockRestore();
        });

        it('should throw an error if the password is incorrect', async () => {
            // Mock dependencies
            const getDocumentByFieldSpy = jest.spyOn(TrainerService, 'getDocumentByField')
                .mockImplementationOnce(() => Promise.resolve({ ...trainerData, password: mockedHashedPassword }));
            const compareSpy = jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => Promise.resolve(false));

            // Invoke function and assert error
            await expect(TrainerService.authenticateTrainer(trainerData.username, trainerData.password))
                .rejects.toThrow('Invalid username or password');

            // Clean up
            getDocumentByFieldSpy.mockRestore();
            compareSpy.mockRestore();
        });
    });
});
