/**
 * MotivationNoteModel.js
 * Modelo de Notas de Motivación e Inspiración
 */

export class MotivationNoteModel {
  constructor(data = {}) {
    this.id = data.id || '';
    this.fase = data.fase || 'general'; // menstrual, folicular, ovulatoria, lutea, general
    this.pet = data.pet || 'Erizo'; // Gatito, Monito, Pinguino, Ranita, Erizo
    this.titulo = data.titulo || '';
    this.mensaje = data.mensaje || '';
    this.fecha = data.fecha || new Date().toISOString();
  }

  toJSON() {
    return {
      id: this.id,
      fase: this.fase,
      pet: this.pet,
      titulo: this.titulo,
      mensaje: this.mensaje,
      fecha: this.fecha
    };
  }
}
