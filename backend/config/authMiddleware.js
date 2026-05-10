const jwt = require('jsonwebtoken');
const { Admin } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'bika_secret_key_2026';

exports.isAdmin = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'Akses ditolak. Token tidak ditemukan.' });

        const decoded = jwt.verify(token, JWT_SECRET);

        if (decoded.role === 'admin' || decoded.role === 'superadmin') {
            const admin = await Admin.findByPk(decoded.id);
            if (!admin) {
                return res.status(403).json({ message: 'Akses ditolak. Admin tidak ditemukan.' });
            }
            req.admin = admin;
            next();
        } else {
            return res.status(403).json({ message: 'Akses ditolak. Memerlukan hak akses admin.' });
        }
    } catch (err) {
        res.status(401).json({ message: 'Token tidak valid atau kadaluarsa.' });
    }
};
