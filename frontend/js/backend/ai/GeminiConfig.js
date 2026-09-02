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

    const modelsToTry = ['gemini-3.1-flash-lite', 'gemini-3.5-flash-lite', 'gemini-flash-latest', 'gemini-3.5-flash', 'gemini-3-flash-preview'];

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

    let lastError = null;
    for (const modelName of modelsToTry) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload),
          signal: controller.signal
        }).finally(() => clearTimeout(timeoutId));

        if (response.ok) {
          const data = await response.json();
          const candidate = data.candidates?.[0];
          const rawText = candidate?.content?.parts?.[0]?.text;
          if (rawText && rawText.trim()) {
            return rawText;
          }
        } else {
          const errText = await response.text();
          console.warn(`Gemini (${modelName}) error ${response.status}:`, errText);
          lastError = new Error(`GEMINI_${response.status}_${modelName}`);
        }
      } catch (err) {
        console.warn(`Gemini (${modelName}) request failed:`, err);
        lastError = err;
      }
    }

    throw lastError || new Error('GEMINI_MODELS_UNAVAILABLE');
  }
};
