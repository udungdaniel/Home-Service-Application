const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',

        info: {
            title: 'Home Service Application API',
            version: '1.0.0',
            description:
                'A REST API that connects customers with artisan service providers. Users can browse services, create bookings, leave reviews, and manage service listings.'
        },

        servers: [
            {
                url:
                    process.env.NODE_ENV === 'production'
                        ? 'https://home-service-application-u66j.onrender.com'
                        : 'http://localhost:8181',
                description:
                    process.env.NODE_ENV === 'production'
                        ? 'Production Server'
                        : 'Development Server'
            }
        ],

        components: {
            securitySchemes: {
                sessionAuth: {
                    type: 'apiKey',
                    in: 'cookie',
                    name: 'connect.sid',
                    description:
                        'Session cookie generated after GitHub authentication.'
                },

                GitHubOAuth: {
                    type: 'oauth2',
                    description:
                        'GitHub OAuth authentication flow.',
                    flows: {
                        authorizationCode: {
                            authorizationUrl:
                                'https://github.com/login/oauth/authorize',

                            tokenUrl:
                                'https://github.com/login/oauth/access_token',

                            scopes: {
                                'user:email':
                                    'Access authenticated user email'
                            }
                        }
                    }
                }
            },

            schemas: {
                User: {
                    type: 'object',

                    required: ['name', 'email'],

                    properties: {
                        

                        name: {
                            type: 'string'
                        },

                        email: {
                            type: 'string',
                            format: 'email'
                        },

                        githubId: {
                            type: 'string'
                        },

                        role: {
                            type: 'string',
                            enum: [
                                'customer',
                                'artisan',
                                'admin'
                            ]
                        },

                        phone: {
                            type: 'string'
                        },

                        address: {
                            type: 'string'
                        },

                        createdAt: {
                            type: 'string',
                            format: 'date-time'
                        }
                    }
                },

                Service: {
                    type: 'object',

                    required: [
                        'providerId',
                        'serviceName',
                        'category',
                        'price'
                    ],

                    properties: {
                        providerId: {
                            type: 'string'
                        },

                        serviceName: {
                            type: 'string'
                        },

                        category: {
                            type: 'string'
                        },

                        description: {
                            type: 'string'
                        },

                        price: {
                            type: 'number'
                        },

                        availability: {
                            type: 'boolean'
                        },

                        rating: {
                            type: 'number'
                        },

                        imageUrl: {
                            type: 'string'
                        },

                        createdAt: {
                            type: 'string',
                            format: 'date-time'
                        }
                    }
                },

                Booking: {
                    type: 'object',

                    properties: {
                        _id: {
                            type: 'string'
                        },

                        userId: {
                            type: 'string'
                        },

                        serviceId: {
                            type: 'string'
                        },

                        bookingDate: {
                            type: 'string',
                            format: 'date-time'
                        },

                        status: {
                            type: 'string',
                            enum: [
                                'pending',
                                'confirmed',
                                'completed',
                                'cancelled'
                            ]
                        },

                        location: {
                            type: 'string'
                        },

                        paymentStatus: {
                            type: 'string',
                            enum: [
                                'pending',
                                'paid',
                                'failed'
                            ]
                        },

                        notes: {
                            type: 'string'
                        }
                    }
                },

                Review: {
                    type: 'object',

                    properties: {

                        userId: {
                            type: 'string'
                        },

                        serviceId: {
                            type: 'string'
                        },

                        rating: {
                            type: 'number'
                        },

                        comment: {
                            type: 'string'
                        },

                        createdAt: {
                            type: 'string',
                            format: 'date-time'
                        }
                    }
                }
            }
        },

        security: [
            {
                sessionAuth: []
            }
        ],

        tags: [
            {
                name: 'Users',
                description: 'Manage users'
            },

            {
                name: 'Services',
                description: 'Manage artisan services'
            },

            {
                name: 'Bookings',
                description: 'Manage service bookings'
            },

            {
                name: 'Reviews',
                description: 'Manage reviews and ratings'
            }
        ]
    },

    apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJsDoc(options);

const swaggerDocs = (app) => {
    app.use(
        '/api-docs',
        swaggerUi.serve,
        swaggerUi.setup(swaggerSpec, {
            explorer: true,
            customSiteTitle:
                'Home Service API Documentation'
        })
    );

    console.log(
        'Swagger Documentation available at /api-docs'
    );
};

module.exports = swaggerDocs;