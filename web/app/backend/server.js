import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mysql from 'mysql2';
import fs from 'fs';
import cors from 'cors';

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

// Suorita SQL-komennot tietokannassa
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
            return;
            }
            console.log('SQL-komento onnistui:', results);
        });
    });
});

// Käynnistä Express-palvelin
const app = express();
app.use(cors());

app.listen(process.env.PORT, () => {
    console.log(`Palvelin käynnissä portissa ${process.env.PORT}`);
});
