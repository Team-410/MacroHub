import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mysql from 'mysql2';
import fs from 'fs';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

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
    Tästä alkaa apin reiti, näitä reittejä käytetään niin web sovelluksessa
    kuin client scriptissä
*/

// POST-path to adding user (register)
app.post('/api/adduser', async (req, res) => {
    console.log('Pyyntö tullut adduser-reitille', req.body);
    const { email, password, fullname } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Fill all inputs.' });
    }

    if (!email.includes('@')) {
        return res.status(400).json({ error: 'Email must contain @' });
    }

    try {
        // check for duplicate email
        const checkEmailSql = 'SELECT * FROM user WHERE email = ?';
        connection.query(checkEmailSql, [email], (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Email checking error' });
            }

            if (results.length > 0) {
                return res.status(400).json({ error: 'This email is already used' });
            }

            // Password encrypt
            bcrypt.hash(password, 10, (err, hashedPassword) => {
                if (err) {
                    return res.status(500).json({ error: 'Internal password encoding error' });
                }

                const sql = 'INSERT INTO user (email, password, fullname) VALUES (?, ?, ?)';
                connection.query(sql, [email, hashedPassword, fullname], (err, results) => {
                    if (err) {
                        return res.status(500).json({ error: 'Error inserting user to database' });
                    }
                    res.status(201).json({ message: 'User added succesfully', userId: results.insertId });
                });
            });
        });
    } catch (err) {
        res.status(500).json({ error: 'Internal hashing or database error' });
    }
});

// POST-Path for login (login)
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Fill all fields' });
    }

    try {
        const sql = 'SELECT * FROM user WHERE email = ?';
        connection.query(sql, [email], async (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Error in login' });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: 'Check email or password' });
            }

            const user = results[0];
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ error: 'Check email or password' });
            }

            // Luo JWT-tunnus
            const token = jwt.sign(
                { userId: user.userid, email: user.email }, // Payload
                process.env.JWT_SECRET, // Salainen avain
                { expiresIn: '1h' } // Aika, jonka jälkeen token vanhenee
            );
            

            // Lähetetään token vastauksena
            res.status(200).json({ message: 'Login succesful', token });
        });
    } catch (err) {
        res.status(500).json({ error: 'Error in login' });
    }
});

// GET-path for all macros (marketplace)
app.get('/api/macros', async (req, res) => {
    try {
        
        const results = await new Promise((resolve, reject) => {

            const sql = 'SELECT * FROM macro LIMIT 100';
            connection.query(sql, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        if (results.length === 0) {
            return res.status(404).json({ message: 'Macros not found' });
        }

        res.status(200).json({ macros: results });
    } catch (err) {
        
        res.status(500).json({ message: 'Error in retrieving macros' });
    }
});

// GET-path to get one macro (macropage)
app.get('/api/macros/:id', (req, res) => {
    const macroId = req.params.id;

    if (!macroId || isNaN(macroId)) {
        return res.status(400).json({ message: 'Invalid macro ID' });
    }

    const sql = 'SELECT * FROM macro WHERE macroid = ?';
    connection.query(sql, [macroId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error in retrieving macro' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Macro not found' });
        }

        res.status(200).json({ macro: results[0] });
    });
});

// Get-path to get macros comments
app.get('/api/macros/:id/comments', (req, res) => {
    const macroId = req.params.id;

    if (!macroId || isNaN(macroId) || macroId <= 0) {
        return res.status(400).json({ message: 'Invalid macro ID' });
    }

    const sql = 'SELECT * FROM comment WHERE macroid = ?';
    connection.query(sql, [macroId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error in retrieving comments' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'comments not found' });
        }

        res.status(200).json({ results });
    });
})

// POST-path to post macros comment
app.post('/api/macros/:id/comments', (req, res) => {
    const macroId = req.params.id;
    const { fullname, comment } = req.body;
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from "Authorization: Bearer <token>"

    // Validate inputs
    if (!macroId || isNaN(macroId) || macroId <= 0) {
        return res.status(400).json({ message: 'Invalid macro ID' });
    }

    if (!token) {
        return res.status(401).json({ message: 'Token missing, please log in' });
    }

    // Verify the token
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }

        // Token is valid, proceed to insert comment
        const sql = 'INSERT INTO comment (macroid, fullname, comment) VALUES (?, ?, ?)';
        connection.query(sql, [macroId, fullname, comment], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error in adding comment' });
            }

            res.status(201).json({ message: 'Comment added successfully', commentId: result.insertId });
        });
    });
});

// GET-path to personal list (python client)
app.get('/api/personal_list', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    console.log(token);
    
    
    let decoded = jwt.verify(token, JWT_SECRET);
    const userid = decoded.userId;
    
    try {
        const results = await new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM personal_list as pl JOIN macro as m on pl.macroid = m.macroid  WHERE pl.userid = ?';
            connection.query(sql, [userid], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        if (results.length === 0) {
            return res.status(404).json({ message: 'list not found' });
        }

        res.status(200).json({ results });
    } catch (err) {
        console.error(err); // Lokita virhe selkeyden vuoksi
        res.status(500).json({ message: 'Error in retrieving macros' });
    }
});

// POST-path to vote list (macropage)
app.post('/api/vote', async (req, res) => {
    const { macroid, vote } = req.body;
    const token = req.headers.authorization?.split(' ')[1];    
    
    if (!token) {
        return res.status(401).json({ message: 'Authorization token missing' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const userid = decoded.userId;

        if (!macroid || typeof vote === 'undefined') {
            return res.status(400).json({ message: 'macroid or vote missing' });
        }

        const results = await new Promise((resolve, reject) => {
            const sql = 'INSERT INTO vote (macroid, userid, vote) VALUES (?, ?, ?)';
            connection.query(sql, [macroid, userid, vote], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        res.status(200).json({ results });
    } catch (err) {
        console.error('Error in voting:', err);
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        res.status(500).json({ message: 'Error in voting' });
    }
});






app.listen(5000, () => {
    console.log('Server using port 5000');
});
