/**
 * CycleModel.js
 * Entidad de Ciclo Menstrual
 */

export class CycleModel {
  constructor(data = {}) {
    this.id = data.id || `cycle_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    this.fechaInicio = data.fechaInicio || new Date().toISOString();
    this.fechaFin = data.fechaFin || null;
    this.duracionDias = data.duracionDias || null;
    this.esAnomalo = data.esAnomalo || false;
  }

  toJSON() {
    return {
      id: this.id,
      fechaInicio: this.fechaInicio,
      fechaFin: this.fechaFin,
      duracionDias: this.duracionDias,
      esAnomalo: this.esAnomalo
    };
  }
}
