import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';
dotenv.config();

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'MacroHub API',
            version: '1.0.0',
            description: 'API documentation for MacroHub',
        },
        servers: [
            {
                url: 'http://localhost:5000/api',
                description: 'Local server',
            },
        ],
    },
    apis: ['./endpoints/*.js'], 
};

const specs = swaggerJsdoc(options);

const swaggerSetup = (app) => {
    app.use('/swagger', swaggerUi.serve, swaggerUi.setup(specs));
};

export default swaggerSetup;