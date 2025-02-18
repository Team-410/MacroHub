import express from 'express';
import connection2 from '../connection.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const router = express.Router();

// GET-path for all macros (marketplace)
router.get('/macros', async (req, res) => {
    try {
        const [results] = await connection2.query('SELECT * FROM macro LIMIT 100');

        if (results.length === 0) {
            return res.status(404).json({ message: 'Macros not found' });
        }

        res.status(200).json({ macros: results });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error in retrieving macros' });
    }
});

// GET-path to get one macro (macropage)
router.get('/macros/:id', async (req, res) => {
    const macroId = req.params.id;

    if (!macroId || isNaN(macroId)) {
        return res.status(400).json({ message: 'Invalid macro ID' });
    }

    const sql = 'SELECT * FROM macro WHERE macroid = ?';

    try {
        // Käytetään promisified query-menetelmää
        const [results] = await connection2.query(sql, [macroId]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'Macro not found' });
        }

        res.status(200).json({ macro: results[0] });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error in retrieving macro' });
    }
});

// GET-path to personal list (python client)
router.get('/personal_list', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(400).json({ message: 'Token missing or malformed' });
    }

    let decoded;
    try {
        decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
    
    const userid = decoded.userId;

    const sql = 'SELECT * FROM personal_list as pl JOIN macro as m on pl.macroid = m.macroid WHERE pl.userid = ?';

    try {
        const [results] = await connection2.query(sql, [userid]);
        if (results.length === 0) {
            return res.status(404).json({ message: 'List not found' });
        }
        res.status(200).json({ results });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error in retrieving macros' });
    }
});

// POST-path to add macro to personal list (web client)
router.post('/personal_list', async (req, res) => {
    const { macroid } = req.body;

    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(400).json({ message: 'Token missing or malformed' });
    }

    let decoded;
    try {
        decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
    
    const userid = decoded.userId;

    if (!macroid || isNaN(macroid)) {
        return res.status(400).json({ message: 'Invalid macro ID' });
    }
    const checkMacroSql = 'SELECT * FROM macro WHERE macroid = ?';
    try {
        const [macroResults] = await connection2.query(checkMacroSql, [macroid]);
        if (macroResults.length === 0) {
            return res.status(404).json({ message: 'Macro ID not found' });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error in checking macro ID' });
    }

    const existingPersonalListSql = 'SELECT * FROM personal_list WHERE userid = ? AND macroid = ?';

    try {
        const [results] = await connection2.query(existingPersonalListSql, [userid, macroid]);
        if (results.length > 0) {
            return res.status(400).json({ message: 'Macro already in personal list' });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error in checking personal list' });
    }


    const sql = 'INSERT INTO personal_list (userid, macroid) VALUES (?, ?)';

    try {
        const [results] = await connection2.query(sql, [userid, macroid]);
        res.status(201).json({ message: 'Macro added to personal list', listId: results.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error in adding macro to personal list' });
    }
});


export default router;