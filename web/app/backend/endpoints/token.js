import express from 'express';
import connection2 from '../connection.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import bcrypt from 'bcryptjs';

const router = express.Router();

// Validate token when view changes
router.get("/token/refresh", (req, res) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Token puuttuu" });
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
            { expiresIn: '1h' }
        );

        res.json({ message: "Token päivitetty!", token: newToken });
    });
});

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
            { expiresIn: '1h' }
        );

        console.log("Login successful:", { userId: user.userid, email: user.email });

        res.json({ token, userId: user.userid, email: user.email, fullname: user.fullname });

    } catch (err) {
        console.error("Error in login:", err);
        res.status(500).json({ error: 'Error in login' });
    }
});


export default router;