import mysql2 from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

async function createConnection() {
    return await mysql2.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
    });
}
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

const connection = await createConnection();
// Lue SQL-tiedosto
const sqlScript = fs.readFileSync(path.join(__dirname, 'createScript.sql'), 'utf-8');

export async function initializeDatabase() {

    console.log('DB connected');

    const sqlCommands = sqlScript.split(';').map(command => command.trim()).filter(command => command.length > 0);
    for (const command of sqlCommands) {
        await connection.query(command)
    }
}

export default connection;