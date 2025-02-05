import mysql2 from 'mysql2/promise';
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

const connection2 = await createConnection();

export default connection2;