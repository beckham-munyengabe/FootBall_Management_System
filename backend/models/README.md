# Database Models (Mongoose)

Standalone Mongoose schemas for the Football Club Management System. No DB connection wired — just drop into your Express backend and connect via `mongoose.connect(process.env.MONGO_URI)` in your `server.js`.

## Dependencies

```bash
npm install mongoose bcrypt
```

## Collections

| Model | File | Purpose |
|---|---|---|
| User | `User.js` | Auth accounts with role (administrator / coach / player / accountant). Password auto-hashed with bcrypt. |
| Player | `Player.js` | playerName, age, position, jerseyNumber, nationality (+ salary, phone). |
| Coach | `Coach.js` | coachName, role, phone (+ email, nationality). |
| Match | `Match.js` | opponent, matchDate, stadium, result (teamScore / opponentScore / outcome), status, lineup. |
| Attendance | `Attendance.js` | playerId, trainingDate, status (Present/Absent/Late/Excused). |
| Performance | `Performance.js` | Per-match player stats: goals, assists, cards, minutes, rating. |
| TrainingSchedule | `TrainingSchedule.js` | Training sessions created by coaches. |
| Finance | `Finance.js` | expenseName, amount, date, category, type (Expense/Income). |
| Salary | `Salary.js` | Monthly player salary payments. |

## Role → Model mapping

- **Administrator** → manages `User`, `Player`, `Coach`, `Match`
- **Coach** → reads `Player`, writes `Attendance`, `Performance`, `TrainingSchedule`
- **Player** → reads own `Attendance`, `Performance`, `Match`
- **Accountant** → manages `Finance`, `Salary`

## Quick use

```js
const { User, Player } = require('./models');

const u = new User({ username: 'jane', email: 'j@x.com', password: 'secret123', role: 'coach' });
await u.save(); // password is hashed automatically
const ok = await u.comparePassword('secret123'); // true
```

## Notes

- `User.password` is hashed via a `pre('save')` hook — never store plain passwords.
- Unique indexes: `User.email`, `User.username`, `Player.jerseyNumber`, `Attendance(playerId+trainingDate)`, `Salary(playerId+month)`.
- All schemas use `timestamps: true` → `createdAt` / `updatedAt`.
- `recordedBy` fields reference the `User` who created the record (useful for audit + reports).
