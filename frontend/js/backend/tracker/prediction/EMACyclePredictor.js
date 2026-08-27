/**
 * EMACyclePredictor.js
 * Media Móvil Exponencial (EMA) para suavizado de baseline
 */

export class EMACyclePredictor {
  constructor(alpha = 0.3) {
    this.alpha = alpha; // Factor de suavizado exponencial
  }

  predict(historyDurations = [], fallbackDefault = 28) {
    if (historyDurations.length === 0) return fallbackDefault;

    let ema = historyDurations[0];
    for (let i = 1; i < historyDurations.length; i++) {
      ema = this.alpha * historyDurations[i] + (1 - this.alpha) * ema;
    }

    return Math.round(ema * 10) / 10;
  }
}
