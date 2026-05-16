import { Link } from 'react-router-dom';
import { FileText, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { api } from '../api';

export default function Dashboard() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDocs = async () => {
      try {
        const data = await api.getDocuments();
        setDocuments(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadDocs();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Workspace Anda</h1>
          <p className="text-sm text-slate-500 mt-1">Kelola draf proposal dan karya tulis ilmiah Anda.</p>
        </div>
        <Link to="/editor/new" className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium">
          <Plus className="h-5 w-5" />
          Draf Baru
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500">Memuat dokumen...</div>
      ) : documents.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 border-dashed">
          <p className="text-slate-500 mb-4">Belum ada dokumen yang disimpan.</p>
          <Link to="/editor/new" className="text-primary-600 font-medium hover:underline">Buat dokumen pertama Anda</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <Link key={doc.id} to={`/editor/${doc.id}`} className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-md transition-all hover:-translate-y-1 group">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors">
                  <FileText className="h-6 w-6" />
                </div>
                <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-600 rounded-full">Draft</span>
              </div>
              <h3 className="font-semibold text-lg mb-1 text-slate-900 line-clamp-1">{doc.title}</h3>
              <p className="text-sm text-slate-500">
                Tersimpan: {new Date(doc.created_at).toLocaleDateString('id-ID')}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
