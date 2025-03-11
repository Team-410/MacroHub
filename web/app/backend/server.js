import dotenv from 'dotenv';
dotenv.config();
import { initializeDatabase } from './connection.js';

import swaggerSetup from './swagger.js';

import app from './app.js';

/*
    Here begins API's route. 
    These routes are used on the web app and on the python client
*/

await initializeDatabase();

swaggerSetup(app);


app.listen(process.env.SERVER_PORT, '0.0.0.0', () => {
    console.log('Server using port ' + process.env.SERVER_PORT);
});
