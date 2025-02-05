import express from 'express';
import connection2 from '../connection.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

const router = express.Router();

// Get-path to get macros comments
router.get('/macros/:id/comments', async (req, res) => {
    const macroId = req.params.id;

    if (!macroId || isNaN(macroId) || macroId <= 0) {
        return res.status(400).json({ message: 'Invalid macro ID' });
    }

    const sql = 'SELECT * FROM comment WHERE macroid = ? ORDER BY timestamp DESC';
    
    try {
        const [results] = await connection2.query(sql, [macroId]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'Comments not found' });
        }

        res.status(200).json({ results });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error in retrieving comments' });
    }
});

// POST-path to post macros comment
router.post('/macros/:id/comments', async (req, res) => {
    const macroId = req.params.id;
    const { fullname, comment } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    // Validate inputs
    if (!macroId || isNaN(macroId) || macroId <= 0) {
        return res.status(400).json({ message: 'Invalid macro ID' });
    }

    if (!token) {
        return res.status(401).json({ message: 'Token missing, please log in' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        const sql = 'INSERT INTO comment (macroid, fullname, comment) VALUES (?, ?, ?)';
        const [results] = await connection2.query(sql, [macroId, fullname, comment]);

        res.status(201).json({ message: 'Comment added successfully', commentId: results.insertId });
    } catch (err) {
        console.error(err);
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
});



export default router;