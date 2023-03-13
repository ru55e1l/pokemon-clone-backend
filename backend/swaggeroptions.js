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
                    type: "http",
                    scheme: "bearer",
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
                    },
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    apis: ['./routes/*.js'], // Path to the API docs
};

module.exports = swaggerOptions;
