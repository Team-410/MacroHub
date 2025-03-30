import dotenv from 'dotenv';
dotenv.config();
import express from 'express';

import cors from 'cors';

import vote from './endpoints/vote.js';
import token from './endpoints/token.js';
import macro from './endpoints/macro.js';
import comment from './endpoints/comment.js';
import blink from './endpoints/blink.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

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

// blink
app.use('/api', blink);

export default app;