# HabitTracker — local setup

Requirements:
- Node.js 18+ (or compatible)
- MySQL server available and running

Environment:
- Create a `.env` file in the project root with these vars:

```
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=habittracker
DB_PORT=3306
PORT=5000
JWT_SECRET=your_jwt_secret
```

Run migrations (creates `users`, `habits`, `logs` tables):

```bash
npm run migrate
```

Start server:

```bash
npm run dev
```

Notes:
- If your MySQL server is not on the default host/port, update `.env` accordingly.
- The migration runner requires a reachable DB; if you get `ECONNREFUSED`, start your MySQL server first.
