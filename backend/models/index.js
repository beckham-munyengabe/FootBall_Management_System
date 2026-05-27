// Central export for all Mongoose models.
// Usage: const { User, Player, Match } = require('./models');

module.exports = {
  User: require('./User'),
  Player: require('./Player'),
  Coach: require('./Coach'),
  Match: require('./Match'),
  Attendance: require('./Attendance'),
  Performance: require('./Performance'),
  TrainingSchedule: require('./TrainingSchedule'),
  Finance: require('./Finance'),
  Salary: require('./Salary'),
};
