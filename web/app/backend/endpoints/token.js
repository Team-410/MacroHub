import express from 'express';
import connection2 from '../connection.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import bcrypt from 'bcryptjs';

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
 *     User:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           description: The email of the user
 *         password:
 *           type: string
 *           description: The password of the user
 *         fullname:
 *           type: string
 *           description: The full name of the user
 *     TokenResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: The JWT token
 *         userId:
 *           type: integer
 *           description: The ID of the user
 *         email:
 *           type: string
 *           description: The email of the user
 *         fullname:
 *           type: string
 *           description: The full name of the user
 */

/**
 * @swagger
 * /token/refresh:
 *   get:
 *     summary: Refresh the JWT token
 *     tags: [Token]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *       401:
 *         description: Token missing or invalid
 *       403:
 *         description: Token expired or invalid
 */
// Validate token when view changes
router.get("/token/refresh", (req, res) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Token missing" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: "Token ei kelpaa" });
        }

        console.log("User details from token:", user);

        const newToken = jwt.sign(
            {
                userId: user.userId,
                email: user.email,
                fullname: user.fullname,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '48h' }
        );

        res.json({ message: "Token refreshed!", token: newToken });
    });
});

router.get("/token/userinfo", (req, res) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Token missing" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: "Token ei kelpaa" });
        }

        console.log("User details from token:", user);
        res.json({ user });
    });
});

/**
 * @swagger
 * /adduser:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the user
 *               password:
 *                 type: string
 *                 description: The password of the user
 *               fullname:
 *                 type: string
 *                 description: The full name of the user
 *     responses:
 *       201:
 *         description: User added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 userId:
 *                   type: integer
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal hashing or database error
 */
// POST-path to adding user (register)
router.post('/adduser', async (req, res) => {
    console.log('Pyyntö tullut adduser-reitille', req.body);
    const { email, password, fullname } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Fill all inputs.' });
    }

    if (!email.includes('@')) {
        return res.status(400).json({ error: 'Email must contain @' });
    }

    try {
        const checkEmailSql = 'SELECT * FROM user WHERE email = ?';
        const [results] = await connection2.query(checkEmailSql, [email]);

        if (results.length > 0) {
            return res.status(400).json({ error: 'This email is already used' });
        }

        // Salasanan salaus odotetaan async/awaitilla
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = 'INSERT INTO user (email, password, fullname) VALUES (?, ?, ?)';
        const [insertResult] = await connection2.query(sql, [email, hashedPassword, fullname]);

        res.status(201).json({ message: 'User added successfully', userId: insertResult.insertId });

    } catch (err) {
        console.error("Error adding user:", err);
        res.status(500).json({ error: 'Internal hashing or database error' });
    }
});

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login a user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the user
 *               password:
 *                 type: string
 *                 description: The password of the user
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenResponse'
 *       400:
 *         description: Fill all fields
 *       401:
 *         description: Check email or password
 *       404:
 *         description: Check email or password
 *       500:
 *         description: Error in login
 */
// POST-Path for login (login)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Fill all fields' });
    }

    try {
        const sql = 'SELECT * FROM user WHERE email = ?';
        const [results] = await connection2.query(sql, [email]); 

        if (results.length === 0) {
            return res.status(404).json({ error: 'Check email or password' });
        }

        const user = results[0];
        console.log(user);

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Check email or password' });
        }

        const token = jwt.sign(
            {
                userId: user.userid,
                email: user.email,
                fullname: user.fullname,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '48h' }
        );

        console.log("Login successful:", { userId: user.userid, email: user.email });

        res.json({ token, userId: user.userid, email: user.email, fullname: user.fullname });

    } catch (err) {
        console.error("Error in login:", err);
        res.status(500).json({ error: 'Error in login' });
    }
});


export default router;