const express = require('express');
const router = express.Router();

const authCtrl = require('../controllers/authController');
const contentCtrl = require('../controllers/contentController');
const quizCtrl = require('../controllers/quizController');
const adminAuthCtrl = require('../controllers/adminAuthController');
const { isAdmin } = require('../config/authMiddleware');

// Routes Auth & Profile (User)
router.post('/auth/google', authCtrl.loginGoogle);
router.put('/user/:id', authCtrl.updateProfile);

// Routes Contents (Masa Depan, Tutorial, Usaha)
router.get('/contents/:kategori', contentCtrl.getContentByKategori);
router.get('/stats/login', contentCtrl.getLoginStats);
router.post('/contents', isAdmin, contentCtrl.createContent);
router.put('/contents/:id', isAdmin, contentCtrl.updateContent);
router.delete('/contents/:id', isAdmin, contentCtrl.deleteContent);

// Routes Quizzes
router.get('/quizzes', quizCtrl.getAllQuiz);
router.get('/quizzes/:id', quizCtrl.getQuizDetail);
router.post('/quizzes', isAdmin, quizCtrl.createQuiz);
router.put('/quizzes/:id', isAdmin, quizCtrl.updateQuiz);
router.delete('/quizzes/:id', isAdmin, quizCtrl.deleteQuiz);

// Routes Admin Auth
router.post('/admin/login', adminAuthCtrl.loginAdmin);
router.get('/admin/verify', adminAuthCtrl.verifyAdmin);
router.post('/admin/register', adminAuthCtrl.registerAdmin);
router.get('/admin/stats', isAdmin, adminAuthCtrl.getDashboardStats);
router.get('/admin/users', isAdmin, adminAuthCtrl.getAllUsers);
router.delete('/admin/users/:id', isAdmin, adminAuthCtrl.deleteUser);

module.exports = router;
