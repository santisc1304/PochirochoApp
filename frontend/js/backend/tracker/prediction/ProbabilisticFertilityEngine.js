/**
 * ProbabilisticFertilityEngine.js
 * Cálculo continuo de probabilidad de fertilidad y decaimiento espermático
 */

export class ProbabilisticFertilityEngine {
  constructor(lambdaDecay = 0.45) {
    this.lambda = lambdaDecay; // Tasa de decaimiento fisiológico de esperma
  }

  /**
   * Supervivencia espermática a los t días de coito previo
   * S(t) = S_0 * e^(-lambda * t)
   */
  spermSurvival(t) {
    if (t < 0 || t > 6) return 0;
    return Math.exp(-this.lambda * t);
  }

  /**
   * Calcula la distribución de fertilidad diaria en un ciclo de duración C
   * Ovulación estimada en O = C - 14 (ej. día 14 en ciclo de 28 días)
   */
  calculateFertilityWindow(cycleLength = 28, currentDay = 14, recentIntercourseLogs = []) {
    const estimatedOvulationDay = cycleLength - 14;
    const fertileWindowStart = estimatedOvulationDay - 5;
    const fertileWindowEnd = estimatedOvulationDay + 1;

    // Calcular probabilidad base diaria (PDF Gaussiana sobre ovulación)
    const stdDevOvulation = 1.5;
    const exponent = -Math.pow(currentDay - estimatedOvulationDay, 2) / (2 * Math.pow(stdDevOvulation, 2));
    const ovulationPDF = (1 / (stdDevOvulation * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);

    // Riesgo cualitativo
    let riskCategory = 'Baja';
    let riskPercent = Math.round(ovulationPDF * 250); // Escalado 0-100%

    if (currentDay >= fertileWindowStart && currentDay <= fertileWindowEnd) {
      if (currentDay === estimatedOvulationDay) {
        riskCategory = 'Máxima (Día de Ovulación ⚡)';
        riskPercent = 98;
      } else if (currentDay >= estimatedOvulationDay - 2 && currentDay <= estimatedOvulationDay) {
        riskCategory = 'Elevada ⚡';
        riskPercent = Math.max(riskPercent, 85);
      } else {
        riskCategory = 'Moderada-Alta';
        riskPercent = Math.max(riskPercent, 60);
      }
    } else {
      riskPercent = Math.min(riskPercent, 12);
    }

    return {
      diaCiclo: currentDay,
      diaOvulacionEstimado: estimatedOvulationDay,
      ventanaFertilInicio: fertileWindowStart,
      ventanaFertilFin: fertileWindowEnd,
      categoriaRiesgo: riskCategory,
      probabilidadPorcentaje: Math.min(100, Math.max(2, riskPercent)),
      factorDecaimientoEsperma: this.spermSurvival(Math.max(0, estimatedOvulationDay - currentDay))
    };
  }
}
