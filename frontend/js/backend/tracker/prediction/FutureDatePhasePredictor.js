/**
 * FutureDatePhasePredictor.js
 * Predictor de Fase Hormonal e Intervalo de Confianza para Fechas Especiales Futuras
 */

export class FutureDatePhasePredictor {
  static predictPhaseForFutureDate(targetDateStr, lmpDateStr, estimatedCycleLength = 28, cycleSigma = 2.0, periodLength = 5) {
    const targetDate = new Date(targetDateStr);
    const lmpDate = new Date(lmpDateStr);

    if (isNaN(targetDate.getTime()) || isNaN(lmpDate.getTime())) {
      throw new Error('FutureDatePhasePredictor: Fechas inválidas proporcionadas.');
    }

    const diffMs = targetDate - lmpDate;
    if (diffMs < 0) {
      return {
        faseProyectada: 'Fecha Pasada',
        diaCicloProyectado: 1,
        intervaloConfianzaDias: 0
      };
    }

    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    // 1. Estimación del número de ciclos futuros k
    const k = Math.floor(totalDays / estimatedCycleLength);

    // 2. Cálculo del día proyectado d_proyectado
    const dProyectado = (totalDays % Math.round(estimatedCycleLength)) + 1;

    // 3. Intervalo de confianza sigma_k = sqrt(k) * sigma_ciclo
    const sigmaK = Math.round(Math.sqrt(Math.max(1, k)) * cycleSigma * 10) / 10;

    // 4. Inferencia de fase proyectada
    const estimatedOvulationDay = Math.round(estimatedCycleLength - 14);

    let faseProyectada = 'Fase Folicular';
    let descripcionSintomasProbables = 'Energía alta, mente despejada y piel brillante.';

    if (dProyectado <= periodLength) {
      faseProyectada = 'Fase Menstrual 🩸';
      descripcionSintomasProbables = 'Posibilidad de sangrado y cólicos leve-moderados. Lleva productos de higiene.';
    } else if (dProyectado > periodLength && dProyectado <= estimatedOvulationDay - 5) {
      faseProyectada = 'Fase Folicular 🌱';
      descripcionSintomasProbables = 'Excelente momento para viajar o realizar actividad física intensa.';
    } else if (dProyectado > estimatedOvulationDay - 5 && dProyectado <= estimatedOvulationDay + 1) {
      faseProyectada = 'Fase Ovulatoria ✨';
      descripcionSintomasProbables = 'Ventana fértil activa. Libido elevada y energía al máximo.';
    } else {
      faseProyectada = 'Fase Lútea 🌙';
      descripcionSintomasProbables = 'Posibilidad de ligera retención de líquidos o cambios de humor premenstruales.';
    }

    return {
      fechaObjetivo: targetDateStr,
      ciclosFuturosK: k,
      diaCicloProyectado: dProyectado,
      faseProyectada: faseProyectada,
      intervaloConfianzaDias: sigmaK,
      descripcionSintomasProbables: descripcionSintomasProbables
    };
  }
}
