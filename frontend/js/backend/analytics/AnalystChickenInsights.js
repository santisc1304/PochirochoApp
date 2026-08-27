/**
 * AnalystChickenInsights.js
 * Generador de Insights de Príncipe Pío (El Pollo Analista 🐔👓)
 */

import { AnalyticsEngine } from './AnalyticsEngine.js';

export class AnalystChickenInsights {
  static generateInsights(historyCycles = [], dailyLogs = []) {
    const stats = AnalyticsEngine.computeAnalytics(historyCycles, dailyLogs);

    return [
      {
        id: 'pio-insight-regularity',
        title: 'Insight de Príncipe Pío (El Pollo Analista 🐔👓) — Regularidad Óptima',
        meaning: `Tu ciclo es ${stats.regularidadPorcentaje}% regular (promedio de ${stats.duracionPromedio} días con variabilidad de ±${stats.sigma} días). Esto indica un excelente balance neuroendocrino de estrógenos y progesterona en la fase folicular y lútea.`,
        recommendation: `Mantén tu nivel de hidratación constante (mínimo 2L de agua al día) y conserva un horario de sueño regular para preservar este equilibrio hormonal natural.`
      },
      {
        id: 'pio-insight-pain',
        title: 'Insight de Príncipe Pío (El Pollo Analista 🐔👓) — Concentración del Dolor',
        meaning: stats.dolorConcentradoInicio
          ? `Tus cólicos e inflamación uterina ocurren casi exclusivamente en los primeros 2 días de tu período y luego disminuyen drásticamente.`
          : `Tus molestias pélvicas se distribuyen a lo largo del ciclo, mostrando ligera tensión premenstrual.`,
        recommendation: stats.dolorConcentradoInicio
          ? `Aplica compresas de calor e inicia la rutina de estiramientos 'Echoes of the Soul' 24 horas antes del día estimado de inicio para evitar el pico inflamatorio de prostaglandinas PGF2α.`
          : `Utiliza la rutina de respiración somática 4-7-8 e infusiones de manzanilla con lavanda para mantener la fascia pélvica suelta.`
      },
      {
        id: 'pio-insight-stress',
        title: 'Insight de Príncipe Pío (El Pollo Analista 🐔👓) — Impacto del Estrés',
        meaning: `Cuando tu nivel de estrés se eleva a 'Alto', tus dolores de cabeza y tensión en la espalda baja aumentan en un ${stats.impactoEstresPorcentaje}% durante la Fase Premenstrual.`,
        recommendation: `Practica la rutina de respiración 4-7-8 con Naveen la Ranita Zen durante los días de mayor carga laboral para suprimir la sobreproducción de cortisol y proteger tu ciclo.`
      },
      {
        id: 'pio-insight-retention',
        title: 'Insight de Príncipe Pío (El Pollo Analista 🐔👓) — Retención de Líquidos',
        meaning: `La hinchazón y pesadez antes del período son completamente normales debido al incremento fisiológico de progesterona en la Fase Lútea.`,
        recommendation: `Reducir el consumo de sodio en las comidas 3 días antes de la Fase Lútea e incrementar la ingesta de agua de coco o té de jengibre disminuye significativamente la retención tisular.`
      }
    ];
  }
}
