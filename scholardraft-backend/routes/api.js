const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini SDK
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy_key');
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const { supabase } = require('../config/supabase');

// --- Document Routes (Supabase) ---
router.get('/docs', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('id, title, created_at')
      .order('created_at', { ascending: false });
    if (error) {
      console.error("Fetch Docs Error:", error);
      throw error;
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil daftar dokumen' });
  }
});

router.get('/docs/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', req.params.id)
      .single();
    if (error) {
      console.error("Fetch Single Doc Error:", error);
      throw error;
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil dokumen' });
  }
});

router.post('/docs', async (req, res) => {
  try {
    const { id, title, content } = req.body;
    if (!supabase) return res.status(500).json({ error: 'Supabase client not initialized' });
    
    let result;
    if (id) {
      // Update
      result = await supabase
        .from('documents')
        .update({ title, content })
        .eq('id', id)
        .select();
    } else {
      // Insert
      result = await supabase
        .from('documents')
        .insert([{ title, content }])
        .select();
    }

    if (result.error) throw result.error;
    res.status(201).json({ success: true, document: result.data[0] });
  } catch (error) {
    console.error("Save Error:", error);
    res.status(500).json({ error: 'Gagal menyimpan ke database' });
  }
});

// --- AI Gateway Routes ---

// 1. Smart Citation Generator
router.post('/ai/citation', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL is required' });

    const prompt = `Convert the following URL/DOI or raw text into a strict APA Style 7th Edition citation format. Return ONLY the citation text, nothing else. Text: ${url}`;
    const result = await model.generateContent(prompt);
    const citation = result.response.text().trim();
    
    res.json({ citation });
  } catch (error) {
    console.error("Citation Error:", error);
    res.status(500).json({ error: 'AI processing failed' });
  }
});

// 2. AI Abstract Generator (New Feature)
router.post('/ai/abstract', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required' });

    const prompt = `Anda adalah asisten peneliti senior. Buatlah sebuah abstrak akademik sepanjang 1 paragraf (maksimal 200 kata) berdasarkan isi dokumen berikut. Abstrak harus merangkum latar belakang, tujuan, dan potensi solusi/metode.
    Tuliskan dalam bahasa yang sama dengan teks aslinya. Hanya kembalikan teks abstraknya saja.
    
    Dokumen:
    ${text}`;
    
    const result = await model.generateContent(prompt);
    const abstractText = result.response.text().trim();
    res.json({ abstractText });
  } catch (error) {
    console.error("Abstract Error:", error);
    res.status(500).json({ error: 'AI processing failed' });
  }
});

// 2. Draft Enhancer
router.post('/ai/enhance', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required' });

    const prompt = `Anda adalah seorang editor akademik profesional. Perbaiki paragraf berikut agar memiliki nada akademik yang formal, transisi kalimat yang lebih baik, dan kosakata yang lebih canggih (standar penulisan jurnal ilmiah).
    ATURAN KRITIS: Anda HARUS mempertahankan bahasa asli teks tersebut. Jika teks berbahasa Indonesia, perbaiki dalam bahasa Indonesia. Jangan menerjemahkannya ke bahasa Inggris kecuali teks aslinya memang bahasa Inggris.
    Hanya kembalikan paragraf yang sudah diperbaiki tanpa tambahan kata-kata pengantar.
    
    Teks untuk diperbaiki:
    ${text}`;
    const result = await model.generateContent(prompt);
    const enhancedText = result.response.text().trim();
    
    res.json({ enhancedText });
  } catch (error) {
    console.error("Enhance Error:", error);
    res.status(500).json({ error: 'AI processing failed' });
  }
});

// 3. Ethics Scanner (Flagship)
router.post('/ai/ethics-scan', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required' });

    const prompt = `You are an Ethics Reviewer for technological innovations. Analyze the following project description for societal impacts, data privacy issues, and algorithmic biases.
    You MUST output the result STRICTLY as a JSON object with this exact schema:
    {
      "score": "string (A, B, C, D, or F)",
      "risks": ["array of identified risks as strings"],
      "mitigation": ["array of actionable mitigations as strings"]
    }
    Do not wrap the JSON in markdown code blocks. Just return the raw JSON object.
    
    Project Description:
    ${text}`;
    
    const result = await model.generateContent(prompt);
    let rawText = result.response.text().trim();
    
    // Attempt to parse JSON even if Gemini wrapped it in markdown
    if (rawText.startsWith('\`\`\`json')) {
      rawText = rawText.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
    } else if (rawText.startsWith('\`\`\`')) {
      rawText = rawText.replace(/\`\`\`/g, '').trim();
    }
    
    const ethicsReport = JSON.parse(rawText);
    res.json(ethicsReport);
  } catch (error) {
    console.error("Ethics Scan Error:", error);
    res.status(500).json({ error: 'AI processing failed or failed to parse JSON' });
  }
});

module.exports = router;
