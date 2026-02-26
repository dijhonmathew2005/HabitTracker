const fetch = global.fetch || require('node-fetch');

const BASE = 'http://localhost:5000';

async function run() {
  try {
    console.log('Registering user...');
    const reg = await fetch(`${BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Smoke Test', email: 'smoke@example.com', password: 'pass123' }),
    });
    console.log('register status', reg.status);
    console.log('register body', await reg.text());

    console.log('Logging in...');
    const login = await fetch(`${BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'smoke@example.com', password: 'pass123' }),
    });
    console.log('login status', login.status);
    const loginJson = await login.json().catch(() => null);
    console.log('login body', loginJson);
    const token = loginJson && (loginJson.token || loginJson.token);

    if (!token) {
      console.log('No token received, aborting further tests');
      return;
    }

    console.log('Creating habit...');
    const createHabit = await fetch(`${BASE}/api/habits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ habit_name: 'Drink water' }),
    });
    console.log('createHabit status', createHabit.status);
    console.log('createHabit body', await createHabit.text());

    console.log('Listing habits...');
    const listHabits = await fetch(`${BASE}/api/habits`, { headers: { Authorization: `Bearer ${token}` } });
    console.log('listHabits status', listHabits.status);
    console.log('listHabits body', await listHabits.text());

    console.log('Creating log...');
    const createLog = await fetch(`${BASE}/api/logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ habit_id: 1, date: '2026-02-26', status: 'done' }),
    });
    console.log('createLog status', createLog.status);
    console.log('createLog body', await createLog.text());

    console.log('Listing logs...');
    const listLogs = await fetch(`${BASE}/api/logs`, { headers: { Authorization: `Bearer ${token}` } });
    console.log('listLogs status', listLogs.status);
    console.log('listLogs body', await listLogs.text());
  } catch (err) {
    console.error('Smoke test error', err);
  }
}

run();
