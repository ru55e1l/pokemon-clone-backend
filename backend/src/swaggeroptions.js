const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Pokemon Battle API',
            description: 'Pokemon battle information',
            version: '1.0.0',
            servers: [{ url: 'http://localhost:1434' }],
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                Pokemon: {
                    type: 'object',
                    required: ['name', 'type', 'baseStats'],
                    properties: {
                        id: {
                            type: 'string',
                        },
                        name: {
                            type: 'string',
                        },
                        type: {
                            type: 'array',
                            items: {
                                type: 'string',
                            },
                        },
                        baseStats: {
                            type: 'object',
                            properties: {
                                hp: {
                                    type: 'number',
                                },
                                attack: {
                                    type: 'number',
                                },
                                defense: {
                                    type: 'number',
                                },
                                specialAttack: {
                                    type: 'number',
                                },
                                specialDefense: {
                                    type: 'number',
                                },
                                speed: {
                                    type: 'number',
                                },
                            },
                        },
                        cost: {
                            type: 'number',
                        },
                        forSale: {
                            type: 'boolean',
                        }
                    },
                },
                ActivePokemon: {
                    type: 'object',
                    required: ['trainer', 'pokemon', 'level', 'moves', 'active', 'exp', 'levelMultiplier'],
                    properties: {
                        id: {
                            type: 'string',
                        },
                        trainer: {
                            type: 'string',
                            description: 'The ID of the trainer who owns the active Pokemon',
                        },
                        pokemon: {
                            type: 'string',
                            description: 'The ID of the Pokemon that is active',
                        },
                        exp: {
                            type: 'number',
                            description: 'The experience points of the active Pokemon',
                        },
                        levelMultiplier: {
                            type: 'number',
                            description: 'The level multiplier of the active Pokemon',
                        },
                        level: {
                            type: 'number',
                            description: 'The level of the active Pokemon',
                        },
                        moves: {
                            type: 'array',
                            items: {
                                type: 'string',
                                description: 'The ID of a move that the active Pokemon knows',
                            },
                        },
                        active: {
                            type: 'boolean',
                            description: 'Whether the active Pokemon is currently in a battle',
                        },
                    },
                },
                Move: {
                    type: 'object',
                    required: ['name', 'type', 'power', 'accuracy', 'pp', 'effect', 'target'],
                    properties: {
                        id: {
                            type: 'string',
                        },
                        name: {
                            type: 'string',
                            description: 'The name of the move',
                        },
                        type: {
                            type: 'string',
                            description: 'The type of the move, e.g., Fire, Water, etc.',
                        },
                        power: {
                            type: 'number',
                            description: 'The power of the move',
                        },
                        accuracy: {
                            type: 'number',
                            description: 'The accuracy of the move',
                        },
                        pp: {
                            type: 'number',
                            description: 'The Power Points (PP) of the move',
                        },
                        priority: {
                            type: 'number',
                            description: 'The priority of the move',
                            default: 0,
                        },
                        effect: {
                            type: 'string',
                            description: 'The effect of the move, e.g., Burns the target, etc.',
                        },
                        target: {
                            type: 'string',
                            description: 'The target of the move, e.g., Single target, All enemies, etc.',
                        },
                    },
                },

            },
        },
        security: [{ bearerAuth: [] }],
    },
    apis: ['./src/routes/*.js'], // Path to the API docs
};

module.exports = swaggerOptions;
