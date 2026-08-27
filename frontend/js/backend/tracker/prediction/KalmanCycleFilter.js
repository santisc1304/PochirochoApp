/**
 * KalmanCycleFilter.js
 * Dynamic Linear Model (DLM) y Filtro de Kalman Bayesiano con Huber Loss para suavizado de duración de ciclo
 */

export class KalmanCycleFilter {
  constructor(initialMean = 28.0, initialVariance = 4.0, processNoiseW = 1.0, measurementNoiseV = 2.25) {
    this.x = initialMean; // Estado estimado (duración esperada)
    this.P = initialVariance; // Covarianza de estimación
    this.W = processNoiseW; // Varianza de proceso (cambios biológicos graduados)
    this.V = measurementNoiseV; // Varianza de medición
  }

  /**
   * Huber Loss Outlier Filter:
   * Si la diferencia se aleja más de 2.5 * sigma, reduce la ganancia de Kalman para amortiguar ciclos anómalos.
   */
  huberWeight(residual, sigma) {
    const threshold = 2.5 * sigma;
    const absRes = Math.abs(residual);
    if (absRes <= threshold) {
      return 1.0;
    }
    return threshold / absRes;
  }

  /**
   * Procesa un historial de ciclos observados [duracion1, duracion2, ...]
   * Retorna { estimadoKalman, variabilidadSigma, anomaliasDeteccion }
   */
  predict(historyDurations = []) {
    if (historyDurations.length === 0) {
      return {
        duracionEstimada: this.x,
        sigma: Math.sqrt(this.P),
        historialFiltro: [this.x]
      };
    }

    let x_current = this.x;
    let P_current = this.P;
    const filterPath = [];
    const anomalias = [];

    for (let i = 0; i < historyDurations.length; i++) {
      const y_t = historyDurations[i];

      // 1. Paso de Predicción (State Update)
      const x_prior = x_current;
      const P_prior = P_current + this.W;

      // 2. Cálculo de Innovación (Residual)
      const residual = y_t - x_prior;
      const sigma_residual = Math.sqrt(P_prior + this.V);

      // 3. Huber Loss Weight
      const w_huber = this.huberWeight(residual, sigma_residual);
      const isAnomalo = w_huber < 1.0;
      if (isAnomalo) {
        anomalias.push({ index: i, valorObserved: y_t, residual });
      }

      // 4. Ganancia de Kalman ajustada por Huber
      const K = (P_prior / (P_prior + this.V)) * w_huber;

      // 5. Paso de Actualización (Update State)
      x_current = x_prior + K * residual;
      P_current = (1 - K) * P_prior;

      filterPath.push(x_current);
    }

    this.x = x_current;
    this.P = P_current;

    return {
      duracionEstimada: Math.round(x_current * 10) / 10,
      sigma: Math.round(Math.sqrt(P_current) * 100) / 100,
      historialFiltro: filterPath,
      anomaliasDetectadas: anomalias
    };
  }
}
