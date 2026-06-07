const { Job, Tutorial, Business, Finance, User } = require('../models');

const modelMap = {
  lowongan: Job,
  tutorial: Tutorial,
  usaha: Business,
  keuangan: Finance
};

// Helper untuk mendapatkan model berdasarkan kategori
const getModel = (kategori) => modelMap[kategori?.toLowerCase()];

exports.getContentByKategori = async (req, res) => {
  const Model = getModel(req.params.kategori);
  if (!Model) return res.status(400).json({ error: "Kategori tidak valid" });

  try {
    const data = await Model.findAll({ order: [['createdAt', 'DESC']] });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createContent = async (req, res) => {
  const { kategori } = req.body;
  const Model = getModel(kategori);
  if (!Model) return res.status(400).json({ error: "Kategori tidak valid" });

  try {
    const data = await Model.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateContent = async (req, res) => {
  const { kategori } = req.body; // Kita butuh kategori untuk tahu tabel mana yang diupdate
  const Model = getModel(kategori);
  if (!Model) return res.status(400).json({ error: "Kategori tidak valid" });

  try {
    await Model.update(req.body, { where: { id: req.params.id } });
    const updated = await Model.findByPk(req.params.id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteContent = async (req, res) => {
  const { kategori } = req.query;
  console.log('Delete Request - ID:', req.params.id, 'Kategori:', kategori);
  const Model = getModel(kategori);
  if (!Model) return res.status(400).json({ error: `Kategori '${kategori}' tidak valid atau tidak ditemukan` });

  try {
    await Model.destroy({ where: { id: req.params.id } });
    res.json({ message: "Berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getLoginStats = async (req, res) => {
  try {
    const total = await User.count();
    res.json({ totalUsers: total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPublicStats = async (req, res) => {
  try {
    const [totalJobs, totalTutorials, totalUsers] = await Promise.all([
      Job.count(),
      Tutorial.count(),
      User.count()
    ]);
    res.json({ totalJobs, totalTutorials, totalUsers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
