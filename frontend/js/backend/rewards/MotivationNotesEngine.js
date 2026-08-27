/**
 * MotivationNotesEngine.js
 * Generador de Mensajes Inspiracionales del Avatar por Fase Hormonal
 */

export class MotivationNotesEngine {
  static getAvatarGreeting(petName = 'Erizo', faseHormonal = 'Fase Ovulatoria', dailyLog = null) {
    const dialogs = {
      'Erizo': {
        menstrual: '"¡Hola! Tu Erizo Amy trajo una cobijita cálida. Hoy descansa y recuerda beber té de jengibre 🦔☕"',
        folicular: '"¡Tu energía está floreciendo! Excelente día para planear tus proyectos 🦔🌱"',
        ovulatoria: '"¡Hoy tu energía está al máximo! Ideal para ejercicio suave. Recuerda beber 2L de agua 🦔✨"',
        lutea: '"Es normal sentir más sensibilidad hoy. Date un abrazo apretado y tómate las cosas con calma 🦔🌸"'
      },
      'Gatito': {
        menstrual: '"MaoMao está acurrucada a tu lado. Si hay cólicos, prueba la compresa tibia lumbosacra 🐱☕"',
        folicular: '"¡Miau! Siento que tu mente está súper despejada hoy. ¡Aprovecha el día! 🐱✨"',
        ovulatoria: '"¡Tus estrógenos están en la cima! Te ves radiante y llena de vida 🐱💖"',
        lutea: '"Un poco de estiramiento suave nos vendrá genial a ambas hoy 🐱🌿"'
      },
      'Pingüino': {
        menstrual: '"¡Pipo el Pingüino te recuerda preparar tu guatero tibio y descansar tus piernas! 🐧🔥"',
        folicular: '"¡Qué linda caminata podemos dar hoy! La Fase Folicular es pura inspiración 🐧☀️"',
        ovulatoria: '"¡Pipo aprueba esta super energía! Recuerda comer fruta fresca e hidratarte 🐧💧"',
        lutea: '"Si la hinchazón molesta, hagamos la rutina de respiración somática 🐧🌾"'
      },
      'Ranita': {
        menstrual: '"Naveen sugiere hacer 5 minutos de respiración 4-7-8 para soltar la rigidez del vientre 🐸🍃"',
        folicular: '"Momento perfecto para meditar y fijar intenciones para las próximas semanas 🐸🧘‍♀️"',
        ovulatoria: '"Tu cuerpo vibra en armonía total. Disfruta tu fuerza física y vitalidad 🐸✨"',
        lutea: '"Paz en el corazón y calma en el abdomen. Todo está en perfecto equilibrio 🐸🌸"'
      },
      'Monito': {
        menstrual: '"¡Luffy te trae una taza de té mágico de jengibre! Nada de esfuerzos fuertes hoy 🐒☕"',
        folicular: '"¡VAMOS! La energía sube y estamos listos para romperla hoy 🐒🚀"',
        ovulatoria: '"¡Woohoo! Fuerza al 100%. Ideal para Pilates o estiramientos de movilidad 🐒🔥"',
        lutea: '"Respira profundo y no te exijas demasiado hoy. ¡Eres genial! 🐒❤️"'
      }
    };

    const petKey = petName.includes('Gat') ? 'Gatito' : petName.includes('Ping') ? 'Pingüino' : petName.includes('Ran') ? 'Ranita' : petName.includes('Mon') ? 'Monito' : 'Erizo';
    const phaseKey = faseHormonal.toLowerCase().includes('menstrual') ? 'menstrual' : faseHormonal.toLowerCase().includes('folicular') ? 'folicular' : faseHormonal.toLowerCase().includes('ovulatoria') ? 'ovulatoria' : 'lutea';

    return dialogs[petKey]?.[phaseKey] || dialogs['Erizo'][phaseKey];
  }
}
