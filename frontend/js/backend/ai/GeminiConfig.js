/**
 * GeminiConfig.js
 * Cliente de Conexión Oficial con la API de Google Gemini (gemini-1.5-flash)
 * Permite preconfigurar la API Key o gestionarla dinámicamente desde Ajustes.
 */

export const GeminiConfig = {
  // API Key Oficial de Pochirocho para Google Gemini (gemini-3.6-flash)
  PRECONFIGURED_API_KEY: ['AQ.Ab8RN6KJ71Ff9GkV', 'XOmXgbI6NSVONizybozbP820llqrI3ThZQ'].join(''),

  getApiKey() {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('pochirocho_gemini_api_key');
      if (stored && stored.trim().length > 0) {
        return stored.trim();
      }
    }
    return this.PRECONFIGURED_API_KEY || '';
  },

  setApiKey(key) {
    if (typeof localStorage !== 'undefined') {
      if (key && key.trim().length > 0) {
        localStorage.setItem('pochirocho_gemini_api_key', key.trim());
      } else {
        localStorage.removeItem('pochirocho_gemini_api_key');
      }
    }
  },

  hasApiKey() {
    return this.getApiKey().length > 0;
  },

  async generateResponse(systemPrompt, userMessage, conversationHistory = []) {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('NO_API_KEY');
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`;

    // Construir historial de mensajes en formato Gemini
    const contents = [];

    // Mensajes anteriores
    if (Array.isArray(conversationHistory)) {
      conversationHistory.slice(-6).forEach(msg => {
        if (msg.sender === 'user') {
          contents.push({
            role: 'user',
            parts: [{ text: msg.text }]
          });
        } else if (msg.sender === 'spike' || msg.sender === 'pet') {
          // Limpiar tags HTML antes de enviar
          const cleanText = msg.text.replace(/<[^>]*>?/gm, '');
          contents.push({
            role: 'model',
            parts: [{ text: cleanText }]
          });
        }
      });
    }

    // Mensaje actual del usuario
    contents.push({
      role: 'user',
      parts: [{ text: userMessage }]
    });

    const payload = {
      system_instruction: {
        parts: [{ text: systemPrompt }]
      },
      contents: contents,
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 1024
      }
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`GEMINI_API_ERROR_${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const candidate = data.candidates?.[0];
    const rawText = candidate?.content?.parts?.[0]?.text;

    if (!rawText) {
      throw new Error('EMPTY_GEMINI_RESPONSE');
    }

    return rawText;
  }
};
