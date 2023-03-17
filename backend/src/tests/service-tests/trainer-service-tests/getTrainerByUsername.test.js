const TrainerService = require('../../../services/trainer-service');
const GenericRepository = require('../../../repository/generic-repository');
const Trainer = require('../../../models/trainer');

jest.mock('../../../repository/generic-repository');

describe('TrainerService', () => {
    let trainerService;

    beforeEach(() => {
        GenericRepository.mockClear();
        trainerService = new TrainerService.constructor();
        GenericRepository.prototype.getDocumentByField.mockClear();

    });

    describe('getTrainerByUsername', () => {
        it('should return the trainer with the given username', async () => {
            // Arrange
            const mockTrainer = new Trainer({
                username: 'testuser',
                password: 'password',
                email: 'testuser@example.com',
                Birthday: new Date('1990-01-01'),
            });
            GenericRepository.prototype.getDocumentByField.mockResolvedValue(mockTrainer);

            // Act
            const result = await trainerService.getTrainerByUsername('testuser');

            // Assert
            expect(result).toEqual(mockTrainer);
            expect(GenericRepository.prototype.getDocumentByField).toHaveBeenCalledTimes(1);
            expect(GenericRepository.prototype.getDocumentByField).toHaveBeenCalledWith({ 'username': 'testuser' });
        });

        it('should throw an error if the trainer with the given username is not found', async () => {
            // Arrange
            GenericRepository.prototype.getDocumentByField.mockResolvedValue(null);

            // Act & Assert
            await expect(trainerService.getTrainerByUsername('testuser')).rejects.toThrow('Trainer with username testuser not found');
            expect(GenericRepository.prototype.getDocumentByField).toHaveBeenCalledTimes(1);
            expect(GenericRepository.prototype.getDocumentByField).toHaveBeenCalledWith({ 'username': 'testuser' });
        });

        it('should throw an error if there is an error retrieving the trainer', async () => {
            // Arrange
            const errorMessage = 'Error retrieving trainer';
            GenericRepository.prototype.getDocumentByField.mockRejectedValue(new Error(errorMessage));

            // Act & Assert
            await expect(trainerService.getTrainerByUsername('testuser')).rejects.toThrow(errorMessage);
            expect(GenericRepository.prototype.getDocumentByField).toHaveBeenCalledTimes(1);
            expect(GenericRepository.prototype.getDocumentByField).toHaveBeenCalledWith({ 'username': 'testuser' });
        });
    });
});
