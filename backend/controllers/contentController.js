const { Content } = require('../models');

// Ambil konten berdasarkan kategori (lowongan/tutorial/usaha)
exports.getContentByKategori = (req, res) => {
  Content.findAll({ where: { kategori: req.params.kategori }, order: [['createdAt', 'DESC']] })
    .then(data => res.json(data))
    .catch(err => res.status(500).json({ error: err.message }));
};

// Tambah Konten Baru
exports.createContent = (req, res) => {
  Content.create(req.body)
    .then(content => res.status(201).json(content))
    .catch(err => res.status(400).json({ error: err.message }));
};

// Update Konten
exports.updateContent = (req, res) => {
  Content.update(req.body, { where: { id: req.params.id } })
    .then(() => {
      Content.findByPk(req.params.id)
        .then(content => res.json({ message: "Konten diperbarui", data: content }));
    })
    .catch(err => res.status(500).json({ error: err.message }));
};

// Hapus Konten
exports.deleteContent = (req, res) => {
  Content.destroy({ where: { id: req.params.id } })
    .then(() => res.json({ message: "Konten berhasil dihapus" }))
    .catch(err => res.status(500).json({ error: err.message }));
};