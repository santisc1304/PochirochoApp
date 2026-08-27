/**
 * DailyLogModel.js
 * Entidad de Registro Diario de Síntomas
 */

export class DailyLogModel {
  constructor(data = {}) {
    this.id = data.id || `log_${new Date(data.fecha || Date.now()).toISOString().split('T')[0]}`;
    this.fecha = data.fecha || new Date().toISOString().split('T')[0];
    this.nivelSangrado = data.nivelSangrado || 'Ninguno'; // Ninguno, Manchado, Mediano, Alto
    this.esInicioPeriodo = data.esInicioPeriodo || false;
    this.nivelColicos = data.nivelColicos || 0; // 0 a 5
    this.dolorSenos = data.dolorSenos || false;
    this.dolorEspaldaBaja = data.dolorEspaldaBaja || false;
    this.nivelEstres = data.nivelEstres || 'Bajo'; // Bajo, Moderado, Alto
    this.emocionesEspecificas = data.emocionesEspecificas || [];
    this.sexoProtegido = data.sexoProtegido !== undefined ? data.sexoProtegido : null;
    this.pildoraTomada = data.pildoraTomada !== undefined ? data.pildoraTomada : null;
    this.temperaturaBasal = data.temperaturaBasal || null;
    this.resultadoLH = data.resultadoLH || null; // Negativo, Positivo
    this.flujoVaginal = data.flujoVaginal || 'Ninguno'; // Transparente, Cremoso, Clara de huevo
  }

  toJSON() {
    return {
      id: this.id,
      fecha: this.fecha,
      nivelSangrado: this.nivelSangrado,
      esInicioPeriodo: this.esInicioPeriodo,
      nivelColicos: this.nivelColicos,
      dolorSenos: this.dolorSenos,
      dolorEspaldaBaja: this.dolorEspaldaBaja,
      nivelEstres: this.nivelEstres,
      emocionesEspecificas: this.emocionesEspecificas,
      sexoProtegido: this.sexoProtegido,
      pildoraTomada: this.pildoraTomada,
      temperaturaBasal: this.temperaturaBasal,
      resultadoLH: this.resultadoLH,
      flujoVaginal: this.flujoVaginal
    };
  }
}
