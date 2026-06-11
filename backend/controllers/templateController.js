const { Template } = require('../models');

exports.getAllTemplates = async (req, res) => {
  try {
    const templates = await Template.findAll({ order: [['key', 'ASC']] });
    res.json(templates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createOrUpdateTemplate = async (req, res) => {
  try {
    const { key, title, description, file_name, mime_type, data } = req.body;
    if (!key || !title) return res.status(400).json({ error: 'Missing key or title' });

    const [tpl, created] = await Template.findOrCreate({ where: { key }, defaults: { key, title, description, file_name, mime_type, data } });
    if (!created) {
      tpl.title = title;
      tpl.description = description;
      tpl.file_name = file_name;
      tpl.mime_type = mime_type;
      tpl.data = data;
      await tpl.save();
    }
    res.json({ success: true, template: tpl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
