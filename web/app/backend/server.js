import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mysql from 'mysql2';
import fs from 'fs';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Käynnistä Express-palvelin
const app = express(); 
app.use(cors());
app.use(express.json());

// Yhteys MySQL-tietokantaan
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

// Lue SQL-skripti tiedostosta
const sqlScript = fs.readFileSync('createScript.sql', 'utf-8');

// Suorita SQL-create scriptit tietokannassa
connection.connect((err) => {
    if (err) {
        console.error('DB error: ', err);
        return;
    }
    console.log('DB connected');

    // Suorita SQL-tiedoston komennot
    const sqlCommands = sqlScript.split(';').map(command => command.trim()).filter(command => command.length > 0);

    // Suorita komennot erikseen
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

// POST-reitti Käyttäjän lisäämiseen (register)
app.post('/api/adduser', async (req, res) => {
    console.log('Pyyntö tullut adduser-reitille', req.body);
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Fill all inputs.' });
    }

    if (!email.includes('@')) {
        return res.status(400).json({ error: 'Email must contain @' });
    }

    try {
        // Tarkistetaan, onko käyttäjällä jo sama sähköpostiosoite
        const checkEmailSql = 'SELECT * FROM user WHERE email = ?';
        connection.query(checkEmailSql, [email], (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Email checking error' });
            }

            if (results.length > 0) {
                return res.status(400).json({ error: 'This email is already used' });
            }

            // Salasanan salaus
            bcrypt.hash(password, 10, (err, hashedPassword) => {
                if (err) {
                    return res.status(500).json({ error: 'Internal password encoding error' });
                }

                const sql = 'INSERT INTO user (email, password) VALUES (?, ?)';
                connection.query(sql, [email, hashedPassword], (err, results) => {
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

// POST-reitti kirjautumista varten (login)
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
                { userId: user.id, email: user.email }, // Payload
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

// GET-reitti kaikkia makroja varten (marketplace)
app.get('/api/macros', async (req, res) => {
    try {
        // Käytetään Promisea tietokannan kyselylle
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

        // Lähetetään makrot vastauksena
        res.status(200).json({ macros: results });
    } catch (err) {
        
        res.status(500).json({ message: 'Error in retrieving macros' });
    }
});


app.listen(5000, () => {
    console.log('Server using port 5000');
});
