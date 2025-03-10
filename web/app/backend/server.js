import dotenv from 'dotenv';
dotenv.config();
import express from 'express';

import mysql from 'mysql2';

import fs from 'fs';
import cors from 'cors';

import vote from './endpoints/vote.js';
import token from './endpoints/token.js';
import macro from './endpoints/macro.js';
import comment from './endpoints/comment.js';
import swaggerSetup from './swagger.js';

const app = express();
app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});


const sqlScript = fs.readFileSync('createScript.sql', 'utf-8');

connection.connect((err) => {
    if (err) {
        console.error('DB error: ', err);
        return;
    }
    console.log('DB connected');

    // run sql create commands
    const sqlCommands = sqlScript.split(';').map(command => command.trim()).filter(command => command.length > 0);

    sqlCommands.forEach((command) => {
        connection.query(command, (err, results) => {
            if (err) {
                console.error('SQL command error:', err.message);
            }
            console.log('succesful sql command:', results);
        });
    });
});

/*
    Here begins API's route. 
    These routes are used on the web app and on the python client
*/

// votes
app.use('/api', vote);

// login, register, tokenrefresh
app.use('/api', token);

// maros and personal_list
app.use('/api', macro);

// comments
app.use('/api', comment);

swaggerSetup(app);


app.listen(5000, () => {
    console.log('Server using port 5000');
});
