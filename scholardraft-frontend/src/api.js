const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5001/api/v1';

export const api = {
  getDocuments: async () => {
    const response = await fetch(`${API_BASE_URL}/docs`);
    if (!response.ok) throw new Error('Gagal mengambil dokumen');
    return response.json();
  },

  getDocumentById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/docs/${id}`);
    if (!response.ok) throw new Error('Gagal mengambil dokumen');
    return response.json();
  },

  generateCitation: async (url) => {
    const response = await fetch(`${API_BASE_URL}/ai/citation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });
    if (!response.ok) throw new Error('Gagal menghasilkan sitasi. Pastikan backend berjalan.');
    return response.json();
  },
  
  enhanceText: async (text) => {
    const response = await fetch(`${API_BASE_URL}/ai/enhance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    if (!response.ok) throw new Error('Gagal memperbaiki teks. Pastikan backend berjalan.');
    return response.json();
  },

  generateAbstract: async (text) => {
    const response = await fetch(`${API_BASE_URL}/ai/abstract`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    if (!response.ok) throw new Error('Gagal membuat abstrak. Pastikan backend berjalan.');
    return response.json();
  },

  saveDocument: async (title, content, id) => {
    const response = await fetch(`${API_BASE_URL}/docs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, id })
    });
    if (!response.ok) throw new Error('Gagal menyimpan dokumen ke Supabase.');
    return response.json();
  },

  scanEthics: async (text) => {
    const response = await fetch(`${API_BASE_URL}/ai/ethics-scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    if (!response.ok) throw new Error('Gagal melakukan pemindaian etis. Pastikan backend berjalan.');
    return response.json();
  }
};
