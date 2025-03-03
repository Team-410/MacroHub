import express from 'express';
import connection2 from '../connection.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
console.log(JWT_SECRET);



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
 *     Vote:
 *       type: object
 *       properties:
 *         macroid:
 *           type: integer
 *           description: The ID of the macro
 *         upvotes:
 *           type: integer
 *           description: The number of upvotes
 *         downvotes:
 *           type: integer
 *           description: The number of downvotes
 *         total:
 *           type: integer
 *           description: The total votes
 */

/**
 * @swagger
 * /macro/{macroid}/votes:
 *   get:
 *     summary: Get total votes for a specific macro
 *     tags: [Votes]
 *     parameters:
 *       - in: path
 *         name: macroid
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the macro
 *     responses:
 *       200:
 *         description: Total votes retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vote'
 *       500:
 *         description: Error retrieving votes
 */
// Get total votes for a specific macro
router.get("/macro/:macroid/votes", async (req, res) => {
    const { macroid } = req.params;

    try {
        const [[{ upcount }]] = await connection2.query(
            "SELECT COUNT(*) AS upcount FROM vote WHERE macroid = ? AND vote = 1",
            [macroid]
        );    

        const [[{ downcount }]] = await connection2.query(
            "SELECT COUNT(*) AS downcount FROM vote WHERE macroid = ? AND vote = 0",
            [macroid]
        );    

        const voteTotal = upcount - downcount;

        res.status(200).json({ macroid, upvotes: upcount, downvotes: downcount, total: voteTotal });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error retrieving votes" });
    }
});

/**
 * @swagger
 * /macro/{macroid}/uservote:
 *   get:
 *     summary: Get user's vote for a specific macro
 *     tags: [Votes]
 *     parameters:
 *       - in: path
 *         name: macroid
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the macro
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User vote retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userVote:
 *                   type: integer
 *                   description: The user's vote (1 for upvote, 0 for downvote, null if no vote)
 *       400:
 *         description: Token missing or malformed
 *       401:
 *         description: Invalid token
 *       500:
 *         description: Error getting vote
 */

// Get Users macrovotes
router.get("/macro/:macroid/uservote", async (req, res) => {
    const { macroid } = req.params;
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(400).json({ message: 'Token missing or malformed' });
    }

    let decoded;
    try {
        decoded = jwt.verify(token, JWT_SECRET)
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }

    const userId = decoded.userId;

    try {
        const [existingVote] = await connection2.query(
            "SELECT * FROM vote WHERE userid = ? AND macroid = ?",
            [userId, macroid]
        );
    
        const userVote = existingVote.length > 0 ? existingVote[0].vote : null;
    
        console.log("User vote:", userVote);
    
        res.status(200).json({ userVote });
    } catch (err) {
        console.error("Error getting vote:", err);
        res.status(500).json({ message: "Error getting vote" });
    }
    
});

/**
 * @swagger
 * /macro/{macroid}/uservote/remove:
 *   delete:
 *     summary: Delete user's vote for a specific macro
 *     tags: [Votes]
 *     parameters:
 *       - in: path
 *         name: macroid
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the macro
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Vote deleted successfully
 *       400:
 *         description: Token missing or malformed
 *       401:
 *         description: Invalid token
 *       404:
 *         description: No vote found for this user and macro
 *       500:
 *         description: Error deleting vote
 */
// Delete users macrovotes
router.delete("/macro/:macroid/uservote/remove", async (req, res) => {
    const { macroid } = req.params;
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(400).json({ message: 'Token missing or malformed' });
    }

    let decoded;
    try {
        decoded = jwt.verify(token, JWT_SECRET)
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }

    const userId = decoded.userId;

    try {
        const [removeVote] = await connection2.query(
            "DELETE  FROM vote WHERE userid = ? AND macroid = ?",
            [userId, macroid]
        );

        if (removeVote.affectedRows > 0) {
            return res.status(200).json({ message: 'Vote deleted' });
        } else {
            return res.status(404).json({ message: "No vote found for this user and macro" });
        }

    }  catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error deleting vote" });
    }
});

/**
 * @swagger
 * /macro/{macroid}/vote:
 *   post:
 *     summary: Handle upvotes and downvotes for a specific macro
 *     tags: [Votes]
 *     parameters:
 *       - in: path
 *         name: macroid
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the macro
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               voteType:
 *                 type: integer
 *                 description: The type of vote (1 for upvote, 0 for downvote)
 *     responses:
 *       200:
 *         description: Vote recorded successfully
 *       400:
 *         description: Token missing or malformed
 *       401:
 *         description: Invalid token
 *       500:
 *         description: Error processing vote
 */

// Handle upvotes and downvotes
router.post("/macro/:macroid/vote", async (req, res) => {
    const { macroid } = req.params;
    const { voteType } = req.body;
    const voteValue = voteType ;

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
    
    const userId = decoded.userId;

    try {
        const [existingVote] = await connection2.query(
            "SELECT * FROM vote WHERE userid = ? AND macroid = ?",
            [userId, macroid]
        );

        if (existingVote.length > 0) {
            await connection2.query(
                "UPDATE vote SET vote = ? WHERE userid = ? AND macroid = ?",
                [voteValue, userId, macroid]
            );
        } else {
            await connection2.query(
                "INSERT INTO vote (userid, macroid, vote) VALUES (?, ?, ?)",
                [userId, macroid, voteValue]
            );
        }

        res.status(200).json({ message: "Vote recorded successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error processing vote" });
    }
});

/**
 * @swagger
 * /macro/{macroid}/voted:
 *   post:
 *     summary: Check if a user has voted for a specific macro
 *     tags: [Votes]
 *     parameters:
 *       - in: path
 *         name: macroid
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the macro
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Vote found
 *       400:
 *         description: Token missing or malformed
 *       401:
 *         description: Invalid token
 *       404:
 *         description: Vote not found
 *       500:
 *         description: Error in retrieving vote
 */
// Check if a user has voted for a specific macro
router.post("/macro/:macroid/voted"), async (req, res) => {
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

    const sql = 'SELECT * FROM vote WHERE userid = ?';

    try {
        const [results] = await connection2.query(sql, [userid]);
        if (results.length === 0) {
            return res.status(404).json({ message: 'Vote not found' });
        }
        res.status(200).json({ results });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error in retrieving vote' });
    }

}

export default router;