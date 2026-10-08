import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app.js';
import User from '../src/models/User.js';
import ServiceCategory from '../src/models/ServiceCategory.js';
import { hashPassword } from '../src/utils/passwordUtils.js';

let database;
let server;
let base;
let studentToken;
let otherToken;
let staffToken;
let category;
let requestId;

async function call(path, { token, body, method = 'GET' } = {}) {
  const response = await fetch(`${base}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  return { status: response.status, ...(await response.json()) };
}

before(async () => {
  process.env.JWT_SECRET = 'integration-test-only-not-a-production-secret';
  database = await MongoMemoryServer.create();
  await mongoose.connect(database.getUri());
  const passwordHash = await hashPassword('Test-password-123');
  await User.create([
    { name: 'Test Student', email: 'student@example.edu', passwordHash, role: 'student' },
    { name: 'Other Student', email: 'other@example.edu', passwordHash, role: 'student' },
    { name: 'Test Staff', email: 'staff@example.edu', passwordHash, role: 'staff' },
  ]);
  category = await ServiceCategory.create({ name: 'Facilities', description: 'Campus buildings' });
  await ServiceCategory.create({ name: 'Inactive', isActive: false });
  server = app.listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  base = `http://127.0.0.1:${server.address().port}/api`;
  for (const [email, assign] of [
    ['student@example.edu', (token) => { studentToken = token; }],
    ['other@example.edu', (token) => { otherToken = token; }],
    ['staff@example.edu', (token) => { staffToken = token; }],
  ]) {
    const result = await call('/auth/login', { method: 'POST', body: { email, password: 'Test-password-123' } });
    assert.equal(result.status, 200);
    assert.equal(result.data.user.passwordHash, undefined);
    assert.equal(result.data.user._id, undefined);
    assign(result.data.token);
  }
}, { timeout: 180000 });

after(async () => {
  if (server) await new Promise((resolve) => server.close(resolve));
  await mongoose.disconnect();
  if (database) await database.stop();
});

test('login failures, unauthenticated access and unknown routes use standard errors', async () => {
  assert.equal((await call('/categories')).status, 401);
  assert.equal((await call('/unknown')).error.code, 'NOT_FOUND');
  const invalid = await call('/auth/login', { method: 'POST', body: { email: 'student@example.edu', password: 'wrong' } });
  assert.equal(invalid.status, 401);
  assert.equal(invalid.error.code, 'INVALID_CREDENTIALS');
});

test('categories include active entries and literal case-insensitive search', async () => {
  assert.equal((await call('/categories', { token: studentToken })).data.length, 1);
  assert.equal((await call('/categories?q=FAC', { token: staffToken })).data.length, 1);
  assert.equal((await call('/categories?q=.*', { token: staffToken })).data.length, 0);
});

test('creation validates fields, enforces role, and takes ownership from authentication', async () => {
  assert.equal((await call('/requests', { token: studentToken, method: 'POST', body: {} })).status, 400);
  assert.equal((await call('/requests', { token: staffToken, method: 'POST', body: {} })).status, 403);
  const result = await call('/requests', { token: studentToken, method: 'POST', body: {
    categoryId: String(category._id), title: 'Broken classroom light', description: 'The light in this room keeps flickering.',
    location: 'Room 204', student: 'attacker', status: 'resolved',
  } });
  assert.equal(result.status, 201);
  assert.equal(result.data.status, 'submitted');
  assert.equal(result.data.student.email, 'student@example.edu');
  requestId = result.data.id;
});

test('student ownership and combined filters are enforced', async () => {
  assert.equal((await call('/requests', { token: otherToken })).data.length, 0);
  assert.equal((await call(`/requests/${requestId}`, { token: otherToken })).status, 403);
  assert.equal((await call('/requests?status=resolved', { token: staffToken })).data.length, 0);
  assert.equal((await call(`/requests?status=submitted&categoryId=${category._id}`, { token: staffToken })).data.length, 1);
  assert.equal((await call('/requests?status=bad', { token: staffToken })).status, 400);
  assert.equal((await call('/requests?categoryId=bad', { token: staffToken })).status, 400);
  assert.equal((await call('/requests/bad', { token: staffToken })).status, 400);
});

test('staff status changes follow transitions and terminal states cannot change', async () => {
  const options = { method: 'PATCH', body: { status: 'in_progress' } };
  assert.equal((await call(`/requests/${requestId}/status`, { ...options, token: studentToken })).status, 403);
  assert.equal((await call(`/requests/${requestId}/status`, { ...options, token: staffToken })).data.status, 'in_progress');
  assert.equal((await call(`/requests/${requestId}/status`, { ...options, token: staffToken, body: { status: 'resolved' } })).data.status, 'resolved');
  assert.equal((await call(`/requests/${requestId}/status`, { ...options, token: staffToken })).error.code, 'INVALID_STATUS_TRANSITION');
});
