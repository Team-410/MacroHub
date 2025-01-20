const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// MySQL-yhteyden määrittely
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// Tarkista yhteys
db.connect((err) => {
  if (err) {
    console.error('MySQL-yhteyden muodostaminen epäonnistui:', err);
  } else {
    console.log('Yhteys MySQL-tietokantaan onnistui!');

    // Luo tietokanta, jos sitä ei ole olemassa
    const createDatabaseQuery = 'CREATE DATABASE IF NOT EXISTS macrohub';
    db.query(createDatabaseQuery, (err) => {
      if (err) {
        console.error('Virhe tietokannan luomisessa:', err);
      } else {
        console.log('Tietokanta luotu tai se on jo olemassa.');

        // Lue SQL-skripti ja poista rivinvaihdot
        const sqlScript = fs.readFileSync('sqlCreateScript.sql', 'utf8');

        // Jaa komennot puolipisteen mukaan
        const sqlCommands = sqlScript.split(';').map(command => command.trim()).filter(command => command.length > 0);

        // Suorita komennot yksi kerrallaan
        const executeSqlCommands = (commands, index = 0) => {
          if (index < commands.length) {
            db.query(commands[index], (err) => {
              if (err) {
                console.error(`Virhe komennon suorittamisessa: ${commands[index]}`, err);
              } else {
                console.log(`Komento suoritettu onnistuneesti: ${commands[index]}`);
              }
              executeSqlCommands(commands, index + 1); // Suorita seuraava komento
            });
          } else {
            console.log('Kaikki SQL-komennot on suoritettu.');
            db.end(); // Sulje yhteys
          }
        };

        executeSqlCommands(sqlCommands);
      }
    });
  }
});

// API-reitti tietojen hakemiseen
app.get('/api/data', (req, res) => {
  db.query('SELECT * FROM macro', (err, results) => {
    if (err) {
      console.error('Virhe kyselyssä:', err);
      res.status(500).send('Virhe tietojen hakemisessa.');
    } else {
      res.json(results);
    }
  });
});

// Palvelimen käynnistys
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Palvelin käynnissä portissa ${PORT}`);
});
