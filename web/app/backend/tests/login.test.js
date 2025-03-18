import { test, before } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import app from '../app.js';
import { initializeDatabase } from '../connection.js';

before(async () => {
    await initializeDatabase();
});

test('Returns 201 if successful', async () => {
    const res = await request(app)
        .post('/api/adduser')
        .send({ email: 'testuser@', password: 'asd', fullname: 'Testman' });

    assert.strictEqual(res.statusCode, 201);
    assert.ok(res);
});

test('Returns token when login is successful', async () => {
    const res = await request(app)
        .post('/api/login')
        .send({ email: 'testuser@', password: 'asd' });

    assert.strictEqual(res.statusCode, 200);
    assert.ok(res.body.token);
});
