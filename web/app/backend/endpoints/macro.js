import express from 'express';
import connection2 from '../connection.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const router = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: Bearer authentication using JWT. Provide your Bearer token below.
 *   schemas:
 *     Macro:
 *       type: object
 *       properties:
 *         macroid:
 *           type: integer
 *           description: The ID of the macro
 *         name:
 *           type: string
 *           description: The name of the macro
 *         description:
 *           type: string
 *           description: The description of the macro
 *     PersonalList:
 *       type: object
 *       properties:
 *         userid:
 *           type: integer
 *           description: The ID of the user
 *         macroid:
 *           type: integer
 *           description: The ID of the macro
 */

/**
 * @swagger
 * /macros:
 *   get:
 *     summary: Get all macros (marketplace)
 *     tags: [Macros]
 *     responses:
 *       200:
 *         description: List of macros
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Macro'
 *       404:
 *         description: Macros not found
 *       500:
 *         description: Error in retrieving macros
 */
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

router.get('/frontpagemacros', async (req, res) => {
    try {
        const [results] = await connection2.query('SELECT * FROM macro LIMIT 9');

        if (results.length === 0) {
            return res.status(404).json({ message: 'Macros not found' });
        }

        res.status(200).json({ macros: results });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error in retrieving macros' });
    }
});

// GET-path for all macro apps (marketplace)
router.get('/macros/apps', async (req, res) => {
    try {
        const [results] = await connection2.query('SELECT DISTINCT app FROM macro LIMIT 15');

        if (results.length === 0) {
            return res.status(404).json({ message: 'apps not found' });
        }

        res.status(200).json({ apps: results });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error in retrieving apps' });
    }
});

// GET-path for all macros in specific categorie (marketplace)
router.get('/macros/app/:app', async (req, res) => {
    const { app } = req.params;
    try {
        const [results] = await connection2.query('SELECT * FROM macro WHERE app = ? LIMIT 5', [app]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'Categories not found' });
        }

        res.status(200).json({ macros: results });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error in retrieving categories' });
    }
});

/**
 * @swagger
 * /macros/{id}:
 *   get:
 *     summary: Get one macro (macropage)
 *     tags: [Macros]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the macro
 *     responses:
 *       200:
 *         description: Macro found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Macro'
 *       404:
 *         description: Macro not found
 *       500:
 *         description: Error in retrieving macro
 */
// GET-path to get one macro (macropage)
router.get('/macros/:id', async (req, res) => {
    const macroId = req.params.id;

    if (!macroId || isNaN(macroId)) {
        return res.status(400).json({ message: 'Invalid macro ID' });
    }

    const sql = 'SELECT * FROM macro WHERE macroid = ?';

    try {
        // Using promisified query method
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

/**
 * @swagger
 * /personal_list:
 *   get:
 *     summary: Get personal list (python client)
 *     tags: [PersonalList]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the macro
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of personal macros
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PersonalList'
 *       404:
 *         description: List not found
 *       500:
 *         description: Error in retrieving macros
 */

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

/**
 * @swagger
 * /personal_list:
 *   post:
 *     summary: Add a macro to personal list (web client)
 *     tags: [PersonalList]
 *     parameters:
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PersonalList'
 *     responses:
 *       201:
 *         description: Macro added to personal list
 *       400:
 *         description: Token missing or malformed / Invalid macro ID / Macro already in personal list
 *       404:
 *         description: Macro ID not found
 *       500:
 *         description: Error in adding macro to personal list
 */

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

/**
 * @swagger
 * /personal_list:
 *   delete:
 *     summary: Remove a macro from personal list
 *     tags: [PersonalList]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               macroid:
 *                 type: integer
 *                 description: The ID of the macro to remove
 *     responses:
 *       200:
 *         description: Macro removed from personal list
 *       400:
 *         description: Token missing or malformed / Invalid macro ID
 *       404:
 *         description: Macro not found in personal list
 *       500:
 *         description: Error in removing macro
 */
// DELETE-path to remove macro from personal list (web client)
router.delete('/personal_list', async (req, res) => {
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

    const deleteSql = 'DELETE FROM personal_list WHERE userid = ? AND macroid = ?';

    try {
        const [results] = await connection2.query(deleteSql, [userid, macroid]);
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Macro not found in personal list' });
        }
        res.status(200).json({ message: 'Macro removed from personal list' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error in removing macro from personal list' });
    }
});


// POST-path to add macro (python client)
router.post('/save_macro', async (req, res) => {
    const macro_object = req.body;

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

    if (isNaN(userid)) {
        return res.status(400).json({ message: 'Invalid userid' });
    }

    const addMacro = 
    `INSERT INTO macro (macroname, macrodescription, app, category, macrotype, macro) 
        VALUES (?, ?, ?, ?, ?, ?)`;

    let macroId;
    try {
        const [results] = await connection2.query(addMacro, [
            macro_object.macroname,
            macro_object.macrodescription,
            macro_object.app,
            macro_object.category,
            macro_object.macrotype,
            JSON.stringify(macro_object.macro)
        ]);
        macroId = results.insertId;
    } catch (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: 'Error in adding macro', error: err.message });
    }

    const addMacroToPersonalList = "INSERT INTO personal_list (userid, macroid) VALUES (?, ?)";
    try {
        await connection2.query(addMacroToPersonalList, [userid, macroId]);

        return res.status(201).json({ message: 'Macro added successfully', macroid: macroId });
    } catch (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: 'Error in adding macro to personal list', error: err.message });
    }
});



export default router;