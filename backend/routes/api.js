const express = require('express');
const router = express.Router();

const authCtrl = require('../controllers/authController');
const contentCtrl = require('../controllers/contentController');
const quizCtrl = require('../controllers/quizController');
const adminAuthCtrl = require('../controllers/adminAuthController');

// Routes Auth & Profile (User)
router.post('/auth/google', authCtrl.loginGoogle);
router.put('/user/:id', authCtrl.updateProfile);

// Routes Contents (Masa Depan, Tutorial, Usaha)
router.get('/contents/:kategori', contentCtrl.getContentByKategori);
router.post('/contents', contentCtrl.createContent);
router.put('/contents/:id', contentCtrl.updateContent);
router.delete('/contents/:id', contentCtrl.deleteContent);

// Routes Quizzes
router.get('/quizzes', quizCtrl.getAllQuiz);
router.get('/quizzes/:id', quizCtrl.getQuizDetail);
router.post('/quizzes', quizCtrl.createQuiz);
router.put('/quizzes/:id', quizCtrl.updateQuiz);
router.delete('/quizzes/:id', quizCtrl.deleteQuiz);
router.post('/quizzes/:quizId/questions', quizCtrl.addQuestionToQuiz);
router.delete('/quizzes/:quizId/questions/:questionId', quizCtrl.deleteQuestion);

// Routes Admin Auth
router.post('/admin/login', adminAuthCtrl.loginAdmin);
router.get('/admin/verify', adminAuthCtrl.verifyAdmin);
router.post('/admin/register', adminAuthCtrl.registerAdmin);
router.get('/admin/stats', adminAuthCtrl.getDashboardStats);

module.exports = router;