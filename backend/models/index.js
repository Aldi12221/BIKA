const User = require('./User');
const Content = require('./Content');
const Quiz = require('./Quiz');
const Question = require('./Question');
const Admin = require('./Admin');

// Definisi Relasi
// Satu Quiz memiliki banyak Question (1:M)
Quiz.hasMany(Question, {
  foreignKey: 'quiz_id',
  onDelete: 'CASCADE'
});
Question.belongsTo(Quiz, {
  foreignKey: 'quiz_id'
});

// Jika ingin mencatat skor user (Opsional Kedepannya)
// User.hasMany(Score); 

module.exports = {
  User,
  Content,
  Quiz,
  Question,
  Admin
};