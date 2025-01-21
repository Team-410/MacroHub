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
        console.error('Virhe tietokantayhteydessä: ', err);
        return;
    }
    console.log('Yhteys tietokantaan onnistui.');

    // Suorita SQL-tiedoston komennot
    const sqlCommands = sqlScript.split(';').map(command => command.trim()).filter(command => command.length > 0);

    // Suorita komennot erikseen
    sqlCommands.forEach((command) => {
        connection.query(command, (err, results) => {
            if (err) {
            console.error('Virhe SQL-komennon suorittamisessa:', err.message);
            }
            console.log('SQL-komento onnistui:', results);
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
        return res.status(400).json({ error: 'Kaikki kentät ovat pakollisia.' });
    }

    try {
        // Tarkistetaan, onko käyttäjällä jo sama sähköpostiosoite
        const checkEmailSql = 'SELECT * FROM user WHERE email = ?';
        connection.query(checkEmailSql, [email], (err, results) => {
            if (err) {
                console.error('Virhe tarkistettaessa sähköpostiosoitetta:', err);
                return res.status(500).json({ error: 'Sähköpostin tarkistaminen epäonnistui.' });
            }

            // Jos käyttäjä löytyy, palautetaan virhe
            if (results.length > 0) {
                return res.status(400).json({ error: 'Tällä sähköpostiosoitteella on jo käyttäjä.' });
            }

            // Salasanan salaus
            bcrypt.hash(password, 10, (err, hashedPassword) => {
                if (err) {
                    console.error('Virhe salasanan salaamisessa:', err);
                    return res.status(500).json({ error: 'Salasanan salaus epäonnistui.' });
                }

                // Käyttäjän lisääminen tietokantaan
                const sql = 'INSERT INTO user (email, password) VALUES (?, ?)';
                connection.query(sql, [email, hashedPassword], (err, results) => {
                    if (err) {
                        console.error('Virhe tietojen lisäämisessä:', err);
                        return res.status(500).json({ error: 'Tietojen lisääminen epäonnistui.' });
                    }
                    res.status(201).json({ message: 'Käyttäjä lisätty onnistuneesti.', userId: results.insertId });
                });
            });
        });
    } catch (err) {
        console.error('Virhe salasanan salaamisessa:', err);
        res.status(500).json({ error: 'Salasanan salaus epäonnistui.' });
    }
});

// POST-reitti kirjautumista varten (login)
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Kaikki kentät ovat pakollisia.' });
    }

    try {
        const sql = 'SELECT * FROM user WHERE email = ?';
        connection.query(sql, [email], async (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Virhe kirjautumisessa.' });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: 'Käyttäjää ei löytynyt.' });
            }

            const user = results[0];
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ error: 'Väärä salasana.' });
            }

            // Luo JWT-tunnus
            const token = jwt.sign(
                { userId: user.id, email: user.email }, // Payload
                process.env.JWT_SECRET, // Salainen avain
                { expiresIn: '1h' } // Aika, jonka jälkeen token vanhenee
            );

            // Lähetetään token vastauksena
            res.status(200).json({ message: 'Kirjautuminen onnistui!', token });
        });
    } catch (err) {
        res.status(500).json({ error: 'Virhe kirjautumisessa.' });
    }
});



app.listen(5000, () => {
    console.log('Palvelin käynnissä portissa 5000');
});
