import { useState, useEffect } from 'react';
import { FiTrash2, FiSearch, FiRefreshCcw } from 'react-icons/fi';
import api from '../../utils/api';

export default function ManageUserPage() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const load = () => {
        setLoading(true);
        api.adminUsers().then(d => {
            if (Array.isArray(d)) setUsers(d);
        }).catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    const handleDelete = async (id) => {
        if (!confirm('Apakah Yakin ingin menghapus user ini?')) return;
        await api.deleteAdminUser(id);
        load();
    };

    const filtered = users.filter(c => (c.nama || '').toLowerCase().includes(search.toLowerCase()) || (c.email || '').toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-bold gradient-text mb-1">Kelola User</h1>
                    <p className="text-text-secondary text-sm">Lihat daftar pengguna dan hapus jika diperlukan</p>
                </div>
                <button onClick={load} className="btn-primary text-sm flex items-center gap-2">
                    <FiRefreshCcw className={loading ? "animate-spin" : ""} /> Refresh Data
                </button>
            </div>

            <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input type="text" placeholder="Cari nama atau email pengguna..." value={search} onChange={e => setSearch(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-bg-card border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all" />
            </div>

            <div className="glass rounded-2xl overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border">
                            <th className="text-left p-4 text-xs text-text-muted font-medium uppercase min-w-[250px]">Nama</th>
                            <th className="text-left p-4 text-xs text-text-muted font-medium uppercase hidden md:table-cell">Email</th>
                            <th className="text-left p-4 text-xs text-text-muted font-medium uppercase hidden sm:table-cell">CV</th>
                            <th className="text-right p-4 text-xs text-text-muted font-medium uppercase">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr><td colSpan="4" className="p-8 text-center text-text-muted text-sm">{loading ? 'Memuat data...' : 'Tidak ada pengguna.'}</td></tr>
                        ) : filtered.map(item => (
                            <tr key={item.id} className="border-b border-border/50 hover:bg-bg-card/50 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <img src={item.foto || 'https://via.placeholder.com/40'} alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
                                        <span className="text-sm text-text-primary font-medium">{item.nama}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-sm text-text-secondary truncate max-w-[200px] hidden md:table-cell">{item.email}</td>
                                <td className="p-4 text-sm text-text-muted truncate max-w-[150px] hidden sm:table-cell">
                                    {item.cv_path ? (
                                        <a href={item.cv_path} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">Lihat CV</a>
                                    ) : '-'}
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg text-text-muted hover:text-danger hover:bg-danger/10 transition-all bg-transparent border-none cursor-pointer"><FiTrash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
