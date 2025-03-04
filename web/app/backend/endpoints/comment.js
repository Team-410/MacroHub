import express from 'express';
import connection2 from '../connection.js';
import jwt from 'jsonwebtoken';

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
 *     Comment:
 *       type: object
 *       properties:
 *         commentid:
 *           type: integer
 *           description: The ID of the comment
 *         macroid:
 *           type: integer
 *           description: The ID of the macro
 *         fullname:
 *           type: string
 *           description: The full name of the commenter
 *         comment:
 *           type: string
 *           description: The comment text
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: The timestamp of the comment
 */

/**
 * @swagger
 * /macros/{id}/comments:
 *   get:
 *     summary: Get comments for a specific macro
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the macro
 *     responses:
 *       200:
 *         description: Comments found
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Comments not found
 *       500:
 *         description: Error in retrieving comments
 */
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

/**
 * @swagger
 * /macros/{id}/comments:
 *   post:
 *     summary: Post a comment for a specific macro
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the macro
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullname:
 *                 type: string
 *                 description: The full name of the commenter
 *               comment:
 *                 type: string
 *                 description: The comment text
 *     responses:
 *       201:
 *         description: Comment added successfully
 *       400:
 *         description: Invalid macro ID
 *       401:
 *         description: Token missing, please log in
 *       403:
 *         description: Invalid or expired token
 *       500:
 *         description: Error in adding comment
 */
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