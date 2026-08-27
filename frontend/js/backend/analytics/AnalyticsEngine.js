/**
 * AnalyticsEngine.js
 * Procesador de Tendencias Biológicas, Gráficas Líquidas y Matriz Correlacional
 */

export class AnalyticsEngine {
  static computeAnalytics(historyCycles = [], dailyLogs = []) {
    const historyDurations = historyCycles.map(c => c.duracionDias).filter(Boolean);
    const totalCycles = historyDurations.length;

    // 1. Duración Promedio y Variabilidad (Sigma)
    const avgDuration = totalCycles > 0
      ? Math.round((historyDurations.reduce((a, b) => a + b, 0) / totalCycles) * 10) / 10
      : 28.1;

    const variance = totalCycles > 1
      ? historyDurations.reduce((a, b) => a + Math.pow(b - avgDuration, 2), 0) / totalCycles
      : 0.5;
    const sigma = Math.sqrt(variance);

    // Regularidad (Porcentaje)
    const regularityPercent = Math.min(100, Math.max(60, Math.round(100 - (sigma * 8))));

    // 2. Patrón del Dolor (Concentración de Cólicos)
    let colicosInicioContador = 0;
    let colicosTotales = 0;

    dailyLogs.forEach(log => {
      if (log.nivelColicos > 0) {
        colicosTotales++;
        const dayNum = parseInt(log.id.split('_')[1] || '1', 10);
        if (dayNum <= 3 || log.esInicioPeriodo) {
          colicosInicioContador++;
        }
      }
    });

    const dolorConcentradoInicio = colicosTotales > 0
      ? (colicosInicioContador / colicosTotales) >= 0.7
      : true;

    // 3. Correlación Estrés vs Síntomas
    let diasAltoEstres = 0;
    let sintomasEnAltoEstres = 0;

    dailyLogs.forEach(log => {
      if (log.nivelEstres === 'Alto') {
        diasAltoEstres++;
        if (log.dolorEspaldaBaja || log.dolorSenos || log.nivelColicos > 2) {
          sintomasEnAltoEstres++;
        }
      }
    });

    const impactoEstresPorcentaje = diasAltoEstres > 0
      ? Math.round((sintomasEnAltoEstres / diasAltoEstres) * 40) + 10
      : 40;

    // 4. Score Somático de Salud (0 - 100%)
    const scoreSomatico = Math.min(100, Math.max(70, Math.round((regularityPercent * 0.6) + (100 - impactoEstresPorcentaje) * 0.4)));

    return {
      duracionPromedio: avgDuration,
      regularidadPorcentaje: regularityPercent,
      sigma: Math.round(sigma * 10) / 10,
      dolorConcentradoInicio: dolorConcentradoInicio,
      impactoEstresPorcentaje: impactoEstresPorcentaje,
      scoreSomatico: scoreSomatico,
      totalCiclosRegistrados: totalCycles
    };
  }
}
