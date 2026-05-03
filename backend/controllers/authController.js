const { User } = require('../models');

exports.loginGoogle = (req, res) => {
  const { googleId, nama, email, foto } = req.body;

  User.findOrCreate({
    where: { googleId: googleId },
    defaults: { nama, email, foto }
  })
  .then(([user, created]) => {
    res.status(200).json({
      message: created ? "User berhasil didaftarkan" : "Login berhasil",
      data: user
    });
  })
  .catch(err => res.status(500).json({ error: err.message }));
};

exports.updateProfile = (req, res) => {
  User.update(req.body, { where: { id: req.params.id } })
    .then(() => {
      User.findByPk(req.params.id)
        .then(user => res.json({ message: "Profil diperbarui", data: user }));
    })
    .catch(err => res.status(500).json({ error: err.message }));
};