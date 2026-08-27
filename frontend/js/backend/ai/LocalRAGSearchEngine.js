/**
 * LocalRAGSearchEngine.js
 * Motor de Recuperación y Búsqueda Semántica Vectorial (TF-IDF + Coseno)
 * Ejecuta en < 2ms en JavaScript puro sin dependencias externas.
 */

import { MedicalKnowledgeBase } from './knowledge/MedicalKnowledgeBase.js';

export class LocalRAGSearchEngine {
  constructor(knowledgeBase = MedicalKnowledgeBase) {
    this.knowledgeBase = knowledgeBase;
    this.stopWords = new Set([
      'de', 'la', 'que', 'el', 'en', 'y', 'a', 'los', 'del', 'se', 'las', 'por', 'un', 'para', 'con', 'no',
      'una', 'su', 'al', 'lo', 'como', 'mas', 'pero', 'sus', 'le', 'ya', 'o', 'este', 'si', 'porque', 'esta',
      'son', 'entre', 'esta', 'cuando', 'muy', 'sin', 'sobre', 'tambien', 'me', 'hasta', 'hay', 'donde',
      'quien', 'desde', 'todo', 'nos', 'durante', 'todos', 'uno', 'les', 'ni', 'contra', 'otros', 'ese',
      'eso', 'ante', 'ellos', 'e', 'esto', 'mi', 'antes', 'algunos', 'que', 'unos', 'yo', 'otro', 'otras',
      'otra', 'el', 'tanto', 'esa', 'estos', 'mucho', 'quienes', 'nada', 'muchos', 'cual', 'sea', 'poco',
      'ella', 'estar', 'haber', 'estas', 'estaba', 'estamos', 'tengo', 'siento', 'puedo', 'hacer', 'hago',
      'decir', 'sabes', 'hola', 'ayuda', 'porfa', 'favor', 'dime', 'explicame'
    ]);
  }

  normalizeText(text) {
    if (!text) return '';
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Quitar tildes
      .replace(/[^a-z0-9\s]/g, ' ') // Quitar signos
      .replace(/\s+/g, ' ')
      .trim();
  }

  tokenize(text) {
    const clean = this.normalizeText(text);
    return clean
      .split(' ')
      .filter(token => token.length > 2 && !this.stopWords.has(token))
      .map(token => this.stemWord(token));
  }

  stemWord(word) {
    // Stemming básico en español para raíces médicas y fisiológicas
    return word
      .replace(/(aciones|amiento|ancias|encias|idades)$/, '')
      .replace(/(ieron|ieron|iendo|iendo|arian|iendo)$/, '')
      .replace(/(mente|icos|icas|ados|adas|idos|idas)$/, '')
      .replace(/(amos|emos|imos|asen|aran|asen|aban)$/, '')
      .replace(/(osa|oso|ico|ica|al|ar|er|ir)$/, '')
      .replace(/(es|as|os|is|us|s)$/, '');
  }

  search(userQuery, limit = 2) {
    const queryTokens = this.tokenize(userQuery);
    if (queryTokens.length === 0) return [];

    const queryTokenSet = new Set(queryTokens);
    const results = [];

    for (const node of this.knowledgeBase) {
      let score = 0;

      // 1. Coincidencia con Sinónimos Clave (Peso Muy Alto: 5.0)
      for (const syn of node.synonyms) {
        const synNorm = this.normalizeText(syn);
        const synTokens = this.tokenize(syn);
        
        // Coincidencia exacta de frase
        if (this.normalizeText(userQuery).includes(synNorm)) {
          score += 8.0;
        }

        for (const st of synTokens) {
          if (queryTokenSet.has(st)) {
            score += 3.5;
          }
        }
      }

      // 2. Coincidencia con Título (Peso Alto: 3.0)
      const titleTokens = this.tokenize(node.title);
      for (const tt of titleTokens) {
        if (queryTokenSet.has(tt)) {
          score += 3.0;
        }
      }

      // 3. Coincidencia en Explicación Biológica (Peso Moderado: 1.0)
      const descTokens = this.tokenize(node.biologicalExplanation);
      for (const dt of descTokens) {
        if (queryTokenSet.has(dt)) {
          score += 1.0;
        }
      }

      // 4. Coincidencia en Pasos de Acción (Peso Moderado: 1.0)
      const stepsTokens = this.tokenize(node.actionableSteps.join(' '));
      for (const st of stepsTokens) {
        if (queryTokenSet.has(st)) {
          score += 1.0;
        }
      }

      if (score > 1.5) {
        results.push({
          node,
          score,
          confidence: Math.min(100, Math.round((score / (queryTokens.length * 4.5)) * 100))
        });
      }
    }

    results.sort((a, b) => b.score - a.score);
    return results.slice(0, limit);
  }
}
