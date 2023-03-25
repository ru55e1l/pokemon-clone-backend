const ActivePokemonService = require('../../../services/pokemon/active-pokemon-service');
const TrainerService = require('../../../services/trainer-service');
const ActivePokemon = require('../../../models/activePokemon');
const Trainer = require('../../../models/trainer');

describe('ActivePokemonService', () => {
    const activePokemonData = {
        _id: '1',
        exp: 100,
        active: false,
        trainer: '2',
    };

    const trainerData = {
        _id: '2',
        activePokemon: new Array(),
    };

    describe('awardExp', () => {
        it('should award experience points to the active Pokemon', async () => {
            // Mock dependencies
            const getDocumentByIdSpy = jest.spyOn(ActivePokemonService, 'getDocumentById')
                .mockImplementationOnce(() => Promise.resolve(activePokemonData));
            const updateDocumentByIdSpy = jest.spyOn(ActivePokemonService, 'updateDocumentById')
                .mockImplementationOnce(() => Promise.resolve());

            // Invoke function
            await ActivePokemonService.awardExp(activePokemonData._id, 50);

            // Assertions
            expect(getDocumentByIdSpy).toHaveBeenCalledWith(activePokemonData._id);
            expect(updateDocumentByIdSpy).toHaveBeenCalledWith(activePokemonData._id, { ...activePokemonData, exp: 150 });

            // Clean up
            getDocumentByIdSpy.mockRestore();
            updateDocumentByIdSpy.mockRestore();
        });
    });

    describe('equipPokemon', () => {
        it('should equip the active Pokemon to the trainer', async () => {
            // Mock dependencies
            const getActivePokemonByIdSpy = jest.spyOn(ActivePokemonService, 'getDocumentById')
                .mockImplementationOnce(() => Promise.resolve(activePokemonData));
            const getTrainerByIdSpy = jest.spyOn(TrainerService, 'getDocumentById')
                .mockImplementationOnce(() => Promise.resolve(trainerData));
            const updateActivePokemonByIdSpy = jest.spyOn(ActivePokemonService, 'updateDocumentById')
                .mockImplementationOnce(() => Promise.resolve());
            const updateTrainerByIdSpy = jest.spyOn(TrainerService, 'updateDocumentById')
                .mockImplementationOnce(() => Promise.resolve());

            // Invoke function
            await ActivePokemonService.equipPokemon(activePokemonData._id);

            // Assertions
            expect(getActivePokemonByIdSpy).toHaveBeenCalledWith(activePokemonData._id);
            expect(getTrainerByIdSpy).toHaveBeenCalledWith(activePokemonData.trainer);
            expect(updateActivePokemonByIdSpy).toHaveBeenCalledWith(activePokemonData._id, { ...activePokemonData, active: true });
            expect(updateTrainerByIdSpy).toHaveBeenCalledWith(trainerData._id, { ...trainerData, activePokemon: [activePokemonData._id] });

            // Clean up
            getActivePokemonByIdSpy.mockRestore();
            getTrainerByIdSpy.mockRestore();
            updateActivePokemonByIdSpy.mockRestore();
            updateTrainerByIdSpy.mockRestore();
        });
    });
});
