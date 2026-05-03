const { Quiz, Question } = require('../models');

// Ambil semua daftar kuis
exports.getAllQuiz = (req, res) => {
  Quiz.findAll({ order: [['createdAt', 'DESC']] })
    .then(quizzes => res.json(quizzes))
    .catch(err => res.status(500).json({ error: err.message }));
};

// Ambil detail satu kuis beserta soal-soalnya
exports.getQuizDetail = (req, res) => {
  Quiz.findByPk(req.params.id, { include: [Question] })
    .then(quiz => {
      if (!quiz) return res.status(404).json({ message: "Kuis tidak ditemukan" });
      res.json(quiz);
    })
    .catch(err => res.status(500).json({ error: err.message }));
};

// Tambah Kuis Baru
exports.createQuiz = (req, res) => {
  Quiz.create(req.body)
    .then(quiz => res.status(201).json(quiz))
    .catch(err => res.status(400).json({ error: err.message }));
};

// Update Kuis
exports.updateQuiz = (req, res) => {
  Quiz.update(req.body, { where: { id: req.params.id } })
    .then(() => {
      Quiz.findByPk(req.params.id)
        .then(quiz => res.json({ message: "Kuis diperbarui", data: quiz }));
    })
    .catch(err => res.status(500).json({ error: err.message }));
};

// Hapus Kuis
exports.deleteQuiz = (req, res) => {
  Quiz.destroy({ where: { id: req.params.id } })
    .then(() => res.json({ message: "Kuis berhasil dihapus" }))
    .catch(err => res.status(500).json({ error: err.message }));
};

// Tambah Soal ke dalam Kuis Tertentu
exports.addQuestionToQuiz = (req, res) => {
  const payload = { ...req.body, quiz_id: req.params.quizId };
  Question.create(payload)
    .then(question => res.status(201).json(question))
    .catch(err => res.status(400).json({ error: err.message }));
};

// Hapus Soal
exports.deleteQuestion = (req, res) => {
  Question.destroy({ where: { id: req.params.questionId, quiz_id: req.params.quizId } })
    .then(() => res.json({ message: "Soal berhasil dihapus" }))
    .catch(err => res.status(500).json({ error: err.message }));
};