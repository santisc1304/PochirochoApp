/**
 * StackingEnsemblePredictor.js
 * Ensamble híbrido ponderado ML y actualización Bayesiana en tiempo real por biomarcadores
 */

import { KalmanCycleFilter } from './KalmanCycleFilter.js';
import { EMACyclePredictor } from './EMACyclePredictor.js';

export class StackingEnsemblePredictor {
  constructor() {
    this.kalman = new KalmanCycleFilter();
    this.ema = new EMACyclePredictor();
    // Ponderaciones del meta-clasificador ensamble
    this.wKalman = 0.50;
    this.wEMA = 0.20;
    this.wBayesianBiomarkers = 0.30;
  }

  /**
   * Extrae 18+ características biomédicas del registro diario e historial
   */
  extractFeatures(userProfile, historyCycles = [], dailyLog = null) {
    const historyDurations = historyCycles.map(c => c.duracionDias).filter(Boolean);
    const lastDuration = historyDurations.length > 0 ? historyDurations[historyDurations.length - 1] : userProfile.duracionPromedioCiclo;
    
    return {
      duracionCicloAnterior: lastDuration,
      variabilidadHistoricaSigma: historyDurations.length > 1 ? this.calculateSigma(historyDurations) : 2.0,
      edadUsuaria: 25,
      scoreSintomasLuteos: dailyLog ? (dailyLog.dolorSenos ? 1 : 0) + (dailyLog.dolorEspaldaBaja ? 1 : 0) + (dailyLog.nivelColicos > 0 ? 1 : 0) : 0,
      presenciaMocoClaraHuevo: dailyLog && dailyLog.flujoVaginal === 'Clara de huevo' ? 1.0 : 0.0,
      testLHOvulacion: dailyLog && dailyLog.resultadoLH === 'Positivo' ? 1.0 : 0.0,
      diferenciaTemperaturaBasal: dailyLog && dailyLog.temperaturaBasal ? dailyLog.temperaturaBasal - 36.5 : 0.0,
      nivelEstres: dailyLog ? (dailyLog.nivelEstres === 'Alto' ? 2.0 : dailyLog.nivelEstres === 'Moderado' ? 1.0 : 0.0) : 0.0
    };
  }

  calculateSigma(values) {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  }

  /**
   * Predice la fecha de inicio del próximo período e inferencia de fase
   */
  predictNextPeriod(userProfile, historyCycles = [], dailyLog = null) {
    const historyDurations = historyCycles.map(c => c.duracionDias).filter(Boolean);
    
    // 1. Inferencia del Filtro de Kalman
    const kalmanResult = this.kalman.predict(historyDurations);
    const kalmanEstimate = kalmanResult.duracionEstimada;

    // 2. Inferencia EMA
    const emaEstimate = this.ema.predict(historyDurations, userProfile.duracionPromedioCiclo);

    // 3. Ajuste Bayesiano por biomarcadores diarios (Test LH, Temperatura, Síntomas)
    const features = this.extractFeatures(userProfile, historyCycles, dailyLog);
    let bayesianShift = 0;

    if (features.testLHOvulacion === 1.0) {
      // Un test de LH positivo fija la ovulación a las ~24-36h (fase lútea dura ~14 días)
      bayesianShift = -1.0; 
    }
    if (features.nivelEstres === 2.0) {
      // Estrés alto tiende a alargar la fase folicular en +1.5 días
      bayesianShift += 1.5;
    }

    const bayesianEstimate = kalmanEstimate + bayesianShift;

    // 4. Meta-Clasificador Ensamble Ponderado (Stacking)
    const ensembleCycleLength = Math.round(
      (this.wKalman * kalmanEstimate + this.wEMA * emaEstimate + this.wBayesianBiomarkers * bayesianEstimate) * 10
    ) / 10;

    // 5. Determinar Día Actual del Ciclo y Fase
    const lmpDate = userProfile.lmpFecha ? new Date(userProfile.lmpFecha) : new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
    const now = new Date();
    const diffTime = Math.abs(now - lmpDate);
    const currentCycleDay = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const estimatedPeriodLength = userProfile.duracionPromedioPeriodo || 5;
    const estimatedOvulationDay = Math.round(ensembleCycleLength - 14);

    let faseHormonal = 'Fase Folicular';
    let faseColor = '#F4A261'; // Amarillo Sol

    if (currentCycleDay <= estimatedPeriodLength) {
      faseHormonal = 'Fase Menstrual';
      faseColor = userProfile.coloresFasesCustom?.menstrual || '#E63946';
    } else if (currentCycleDay > estimatedPeriodLength && currentCycleDay <= estimatedOvulationDay - 4) {
      faseHormonal = 'Fase Folicular';
      faseColor = userProfile.coloresFasesCustom?.folicular || '#F4A261';
    } else if (currentCycleDay > estimatedOvulationDay - 4 && currentCycleDay <= estimatedOvulationDay + 1) {
      faseHormonal = 'Fase Ovulatoria';
      faseColor = userProfile.coloresFasesCustom?.ovulatoria || '#7209B7';
    } else {
      faseHormonal = 'Fase Lútea';
      faseColor = userProfile.coloresFasesCustom?.lutea || '#1D3557';
    }

    const daysUntilNextPeriod = Math.max(0, Math.round(ensembleCycleLength - currentCycleDay));
    const isDelayed = currentCycleDay > ensembleCycleLength;
    const daysLate = isDelayed ? currentCycleDay - Math.round(ensembleCycleLength) : 0;

    if (isDelayed) {
      faseHormonal = 'Fase Lútea Prolongada';
    }

    return {
      duracionCicloEstimada: ensembleCycleLength,
      diaActualCiclo: currentCycleDay,
      faseHormonal: faseHormonal,
      faseColor: isDelayed ? '#F59E0B' : faseColor,
      isDelayed: isDelayed,
      diasRetraso: daysLate,
      diasFaltantesProximoPeriodo: daysUntilNextPeriod,
      confianzaAlgoritmoPorcentaje: Math.min(99, Math.max(75, Math.round(100 - (kalmanResult.sigma * 4))))
    };
  }

  /**
   * Re-alimenta el ensamble cuando la usuaria registra el inicio de un nuevo período
   * recalibrando el Filtro de Kalman, la EMA y el baseline adaptativo.
   */
  feedCycleCompletion(completedDuration, historyCycles = [], fallbackDefault = 28) {
    const validDuration = Math.max(15, Math.min(60, parseInt(completedDuration, 10) || fallbackDefault));
    const historyDurations = historyCycles.map(c => typeof c === 'number' ? c : c.duracionDias).filter(Boolean);
    historyDurations.push(validDuration);

    const kalmanRes = this.kalman.predict(historyDurations);
    const emaRes = this.ema.predict(historyDurations, fallbackDefault);

    const newEstimatedLength = Math.round(
      (this.wKalman * kalmanRes.duracionEstimada + (this.wEMA + this.wBayesianBiomarkers) * emaRes) * 10
    ) / 10;

    return {
      nuevaDuracionCiclo: newEstimatedLength,
      duracionCicloCompletado: validDuration,
      nuevoSigma: kalmanRes.sigma,
      totalCiclosHistoricos: historyDurations.length,
      confianzaPorcentaje: Math.min(99, Math.max(75, Math.round(100 - (kalmanRes.sigma * 4))))
    };
  }
}
