import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FileText, Sparkles, ShieldCheck, BookMarked, Download, Undo, ArrowLeft, X, Save, AlignLeft } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { api } from '../api';

export default function EditorWorkspace() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [content, setContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const [citationUrl, setCitationUrl] = useState('');
  const [ethicsReport, setEthicsReport] = useState(null);
  const [title, setTitle] = useState('Draf Tanpa Judul');

  useEffect(() => {
    if (id && id !== 'new') {
      setIsProcessing(true);
      setAiMessage("Memuat dokumen...");
      api.getDocumentById(id)
        .then(doc => {
          setTitle(doc.title);
          setContent(doc.content || '');
        })
        .catch(err => alert("Gagal memuat dokumen: " + err.message))
        .finally(() => setIsProcessing(false));
    }
  }, [id]);

  const handleSaveToCloud = async () => {
    if (!content) {
      alert("Dokumen kosong, tidak ada yang bisa disimpan.");
      return;
    }
    setIsProcessing(true);
    setAiMessage("Menyimpan ke Supabase Database...");
    try {
      const isNew = !id || id === 'new';
      const docId = isNew ? null : id;
      const response = await api.saveDocument(title, content, docId);
      alert("Tersimpan dengan sukses di Supabase!");
      if (isNew && response.document?.id) {
        navigate(`/editor/${response.document.id}`, { replace: true });
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEnhanceDraft = async () => {
    if (!content || content.length < 15) {
      alert("Tuliskan beberapa kalimat terlebih dahulu di editor.");
      return;
    }
    const rawText = content.replace(/<[^>]+>/g, '');
    setIsProcessing(true);
    setAiMessage("AI sedang memperbaiki paragraf Anda...");
    try {
      const response = await api.enhanceText(rawText);
      setContent(response.enhancedText);
    } catch (error) {
      alert(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateCitation = async () => {
    if (!citationUrl) {
      alert("Masukkan URL atau DOI terlebih dahulu.");
      return;
    }
    setIsProcessing(true);
    setAiMessage("AI sedang men-generate sitasi APA...");
    try {
      const response = await api.generateCitation(citationUrl);
      const newContent = content + `<p><br><strong>Daftar Pustaka:</strong><br>${response.citation}</p>`;
      setContent(newContent);
      setCitationUrl('');
    } catch (error) {
      alert(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEthicsScan = async () => {
    if (!content || content.length < 20) {
      alert("Tuliskan deskripsi inovasi teknologi Anda terlebih dahulu.");
      return;
    }
    const rawText = content.replace(/<[^>]+>/g, '');
    setIsProcessing(true);
    setAiMessage("AI sedang meninjau kelayakan etis dokumen Anda...");
    try {
      const response = await api.scanEthics(rawText);
      setEthicsReport(response);
    } catch (error) {
      alert(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateAbstract = async () => {
    if (!content || content.length < 50) {
      alert("Tuliskan isi dokumen yang cukup panjang agar AI bisa merangkum abstraknya.");
      return;
    }
    const rawText = content.replace(/<[^>]+>/g, '');
    setIsProcessing(true);
    setAiMessage("AI sedang merangkum abstrak dari karya tulis Anda...");
    try {
      const response = await api.generateAbstract(rawText);
      const newContent = `<p><strong>ABSTRAK</strong><br>${response.abstractText}</p><br><hr><br>` + content;
      setContent(newContent);
    } catch (error) {
      alert(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] relative">
      {/* Ethics Report Modal */}
      {ethicsReport && (
        <div className="absolute inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col">
            <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
              <h2 className="text-white font-semibold flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-green-400" /> Ethical Report Card
              </h2>
              <button onClick={() => setEthicsReport(null)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-16 w-16 rounded-full bg-slate-100 border-4 border-slate-200 flex items-center justify-center text-2xl font-bold text-slate-800">
                  {ethicsReport.score}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Ethics Score</h3>
                  <p className="text-sm text-slate-500">Berdasarkan analisis dampak sosial & privasi</p>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="font-semibold text-red-600 mb-2 flex items-center gap-2">Identified Risks</h4>
                <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
                  {ethicsReport.risks && ethicsReport.risks.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-green-600 mb-2 flex items-center gap-2">Mitigation Suggestions</h4>
                <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
                  {ethicsReport.mitigation && ethicsReport.mitigation.map((m, i) => <li key={i}>{m}</li>)}
                </ul>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button onClick={() => setEthicsReport(null)} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800">Tutup Laporan</button>
            </div>
          </div>
        </div>
      )}

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col bg-slate-50 border-r border-slate-200 relative">
        <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-slate-500 hover:text-slate-900"><ArrowLeft className="h-5 w-5" /></Link>
            <input value={title} onChange={(e)=>setTitle(e.target.value)} type="text" className="font-semibold text-lg bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-primary-500 rounded px-2 w-80" />
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleSaveToCloud} className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors">
              <Save className="h-4 w-4" /> Save to Cloud
            </button>
            <button className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors">
              <Download className="h-4 w-4" /> Export .docx
            </button>
          </div>
        </div>

        {isProcessing && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-30 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600 mb-4"></div>
            <p className="text-lg font-medium text-slate-800">{aiMessage}</p>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100">
          <div className="max-w-[800px] mx-auto bg-white shadow-sm border border-slate-200 min-h-full">
            <ReactQuill 
              theme="snow" 
              value={content} 
              onChange={setContent}
              className="h-full border-none"
              placeholder="Ketik inovasi/tulisan ilmiah Anda di sini..."
            />
          </div>
        </div>
      </div>

      {/* AI Tools Sidebar */}
      <div className="w-80 bg-white flex flex-col z-10 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)]">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
          <h2 className="font-semibold text-slate-900 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary-500" /> AI Assistants
          </h2>
          <p className="text-xs text-slate-500 mt-1">Ditenagai oleh Gemini API</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5">
          {/* AI Abstract Generator (New) */}
          <div className="p-4 bg-white border border-slate-200 shadow-sm rounded-xl hover:border-orange-300 transition-colors">
            <h3 className="font-medium text-slate-900 mb-2 flex items-center gap-2">
              <AlignLeft className="h-4 w-4 text-orange-500" /> Auto Abstract
            </h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">Rangkum seluruh isi dokumen menjadi sebuah paragraf abstrak ilmiah otomatis.</p>
            <button onClick={handleGenerateAbstract} className="w-full bg-white border border-slate-300 hover:border-orange-500 hover:text-orange-600 hover:bg-orange-50 text-slate-700 text-sm py-2 rounded-lg transition-all font-medium">
              Buat Abstrak
            </button>
          </div>

          {/* Draft Enhancer */}
          <div className="p-4 bg-white border border-slate-200 shadow-sm rounded-xl hover:border-blue-300 transition-colors">
            <h3 className="font-medium text-slate-900 mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-500" /> Draft Enhancer
            </h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">Perbaiki transisi kalimat dan tingkatkan kosa kata ke standar akademik formal.</p>
            <button onClick={handleEnhanceDraft} className="w-full bg-white border border-slate-300 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 text-slate-700 text-sm py-2 rounded-lg transition-all font-medium">
              Perbaiki Tulisan Editor
            </button>
          </div>

          {/* Smart Citation */}
          <div className="p-4 bg-white border border-slate-200 shadow-sm rounded-xl hover:border-purple-300 transition-colors">
            <h3 className="font-medium text-slate-900 mb-2 flex items-center gap-2">
              <BookMarked className="h-4 w-4 text-purple-500" /> Smart Citation
            </h3>
            <p className="text-xs text-slate-500 mb-3 leading-relaxed">Masukkan DOI/URL jurnal untuk *generate* sitasi APA Style secara otomatis.</p>
            <input value={citationUrl} onChange={(e)=>setCitationUrl(e.target.value)} type="text" placeholder="https://doi.org/..." className="w-full text-sm p-2 border border-slate-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-50" />
            <button onClick={handleGenerateCitation} className="w-full bg-white border border-slate-300 hover:border-purple-500 hover:text-purple-600 hover:bg-purple-50 text-slate-700 text-sm py-2 rounded-lg transition-all font-medium">
              Sisipkan Sitasi di Editor
            </button>
          </div>

          <div className="my-2 border-t border-slate-100"></div>

          {/* Ethics Scanner (Flagship) */}
          <div className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 shadow-sm rounded-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2">
              <span className="text-[10px] font-bold tracking-wider uppercase text-green-600 bg-green-100 px-2 py-1 rounded-full">Unggulan</span>
            </div>
            <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2 mt-2">
              <ShieldCheck className="h-5 w-5 text-green-600" /> Ethics Scanner
            </h3>
            <p className="text-xs text-green-800 mb-4 leading-relaxed">Validasi inovasi teknologi Anda. AI akan menganalisis potensi bias, privasi, dan dampak sosial.</p>
            <button onClick={handleEthicsScan} className="w-full bg-green-600 hover:bg-green-700 text-white text-sm py-2.5 rounded-lg transition-all shadow-md hover:shadow-lg font-medium flex justify-center items-center gap-2">
              <Sparkles className="h-4 w-4" /> Mulai Ulasan Etis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
