/**
 * PainReliefRulesEngine.js
 * Motor de Selección Clínico de Protocolos de Alivio del Dolor
 */

import { RoutinesCatalog } from './RoutinesCatalog.js';

export class PainReliefRulesEngine {
  static evaluarProtocoloAlivio(dailyLog, faseHormonal = 'Fase Menstrual') {
    if (!dailyLog) {
      return RoutinesCatalog.slice(0, 4); // Recomendaciones por defecto
    }

    const nivelColicos = dailyLog.nivelColicos || 0;
    const tieneDolorEspalda = dailyLog.dolorEspaldaBaja || false;
    const estresAlto = dailyLog.nivelEstres === 'Alto';

    let categoriaPrioritaria = 'stretches';

    if (nivelColicos >= 3) {
      // Cólicos severos -> Priorizar Termoterapia y Meditación Somática
      categoriaPrioritaria = 'thermo';
    } else if (tieneDolorEspalda) {
      // Tensión lumbar -> Priorizar Estiramientos y Pilates
      categoriaPrioritaria = 'stretches';
    } else if (estresAlto) {
      // Estrés -> Priorizar Meditación y Nutrición Antiinflamatoria
      categoriaPrioritaria = 'meditation';
    } else if (faseHormonal === 'Fase Menstrual') {
      categoriaPrioritaria = 'thermo';
    }

    // Filtrar rutinas de la categoría prioritaria
    let recomendadas = RoutinesCatalog.filter(r => r.catId === categoriaPrioritaria);

    // Si no hay suficientes, completar con otras categorías
    if (recomendadas.length < 5) {
      const otras = RoutinesCatalog.filter(r => r.catId !== categoriaPrioritaria);
      recomendadas = [...recomendadas, ...otras.slice(0, 7 - recomendadas.length)];
    }

    return recomendadas;
  }
}
