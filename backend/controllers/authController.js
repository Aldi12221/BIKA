const { User } = require('../models');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'bika_secret_key_2026';

exports.loginGoogle = async (req, res) => {
  try {
    const { googleId, nama, email, foto } = req.body;

    const [user, created] = await User.findOrCreate({
      where: { googleId: googleId },
      defaults: { nama, email, foto }
    });

    // Generate JWT token untuk user
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email,
        role: 'user'
      },
      JWT_SECRET,
      { expiresIn: '7d' } // Token berlaku 7 hari
    );

    res.status(200).json({
      message: created ? "User berhasil didaftarkan" : "Login berhasil",
      token: token,
      user: {
        id: user.id,
        googleId: user.googleId,
        nama: user.nama,
        email: user.email,
        foto: user.foto
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateProfile = (req, res) => {
  User.update(req.body, { where: { id: req.params.id } })
    .then(() => {
      User.findByPk(req.params.id)
        .then(user => res.json({ message: "Profil diperbarui", data: user }));
    })
    .catch(err => res.status(500).json({ error: err.message }));
};