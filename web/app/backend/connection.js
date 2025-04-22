import mysql2 from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let connection;

async function createConnection() {
    const conn = await mysql2.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
    });

    console.log('✅ MySQL connection established');
    return conn;
}

export async function getConnection() {
    if (!connection) {
        console.warn('🔁 No MySQL connection. Connecting...');
        connection = await createConnection();
    } else {
        try {
            await connection.ping();
        } catch (err) {
            console.warn('🔁 Connection lost. Reconnecting...');
            connection = await createConnection();
        }
    }
    return connection;
}

export async function initializeDatabase() {
    const conn = await getConnection();

    console.log('✅ Running SQL script to initialize database');

    const sqlScript = fs.readFileSync(path.join(__dirname, 'createScript.sql'), 'utf-8');
    const sqlCommands = sqlScript
        .split(';')
        .map(command => command.trim())
        .filter(command => command.length > 0);

    for (const command of sqlCommands) {
        await conn.query(command);
    }

    console.log('✅ Database initialized');
}
