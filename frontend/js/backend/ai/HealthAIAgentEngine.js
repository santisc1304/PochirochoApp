/**
 * HealthAIAgentEngine.js
 * Motor Híbrido de Inteligencia Artificial para Salud Menstrual y Reproductiva
 * Integra Google Gemini API (Grounding RAG), Motor RAG Semántico Local, Grafo Ontológico y Soporte Técnico
 */

import { DeveloperSupportBridge } from './DeveloperSupportBridge.js';
import { LocalRAGSearchEngine } from './LocalRAGSearchEngine.js';
import { AgentPersonaEngine } from './AgentPersonaEngine.js';
import { GeminiConfig } from './GeminiConfig.js';
import { RoutinesCatalog } from '../tracker/rules/RoutinesCatalog.js';

export class HealthAIAgentEngine {
  constructor() {
    this.ragEngine = new LocalRAGSearchEngine();
  }

  classifyIntent(userMessage) {
    const text = userMessage.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    // 1. Excepciones médicas explícitas (contexto biológico)
    const healthContextPhrases = [
      'para dormir', 'con mi salud', 'con mis colicos', 'con mi regla',
      'con mi periodo', 'con mi cuerpo', 'para quedar embarazada', 'con mi flujo',
      'salud reproductiva', 'salud menstrual'
    ];
    const isExplicitHealthContext = healthContextPhrases.some(h => text.includes(h));

    // 2. Patrones de Fallos / Errores Técnicos de la App
    const bugPatterns = [
      'error', 'bug', 'fallo', 'falla', 'no sirve', 'no funciona', 'no me deja',
      'no abre', 'no reproduce', 'no suena', 'no guarda', 'no cambia', 'no responde',
      'no carga', 'no se escucha', 'no deja entrar', 'no hace nada', 'no actualiza',
      'se queda pegad', 'se queda cargand', 'se congela', 'se tranc', 'se trab',
      'se cerr', 'se colg', 'se bugue', 'se rompi', 'pantalla negra', 'pantalla blanca',
      'problema con', 'problemas con', 'hay problema', 'hay problemas', 'tengo problema',
      'tengo un problema', 'tengo problemas', 'tengo un error', 'tengo errores',
      'un error con', 'un fallo con', 'reportar error', 'soporte tecnico',
      'ticket', 'desarrollador', 'mal la app', 'se salio', 'se sale'
    ];

    const hasBugPattern = bugPatterns.some(bp => text.includes(bp));

    if (hasBugPattern && !isExplicitHealthContext) {
      return 'APP_BUG_QUERY';
    }

    return 'HEALTH_CONVERSATION';
  }

  /**
   * Traduce y simplifica la explicación biológica a lenguaje cotidiano, cálido y comprensible
   */
  static simplifyBiologicalExplanation(node, userMessage) {
    const id = (node && node.id) ? node.id : '';
    const q = (userMessage || '').toLowerCase();

    if (id.includes('cramps') || id.includes('pelvic-pain') || q.includes('colic') || q.includes('cólic') || q.includes('vientre')) {
      return "Lo que está pasando es que tu útero es un saquito muscular y, para limpiarse y renovar su tejido cada mes, hace pequeñas contracciones suaves. Esos movimientos musculares son los que generan esa sensación de cólico o presión en la pancita.";
    }
    if (id.includes('back-pain') || q.includes('espalda') || q.includes('lumbar')) {
      return "Los nervios de tu vientre y de la parte baja de tu espalda están muy conectados. Cuando el útero trabaja y la pelvis se tensa, los músculos de la cintura también se aprietan como reflejo.";
    }
    if (id.includes('breast') || q.includes('seno') || q.includes('pecho')) {
      return "Después de ovular, tus hormonas suben para cuidar tu cuerpo. Esto hace que retengas un poquito más de líquido y sientas el tejido de los senos más sensible, hinchado o pesado.";
    }
    if (id.includes('delay') || id.includes('irregularity') || q.includes('retras') || q.includes('no me baja')) {
      return "Tu ciclo es muy perceptivo con lo que vives en el día a día. Cosas como una semana de mucho estrés, dormir poco, un viaje o cansancio acumulado hacen que el cuerpo decida ovular unos días más tarde de lo habitual.";
    }
    if (id.includes('mood') || id.includes('pms') || q.includes('triste') || q.includes('llor') || q.includes('humor') || q.includes('ansied')) {
      return "Antes de que llegue la regla, tus niveles de hormonas bajan de forma natural. Esa bajada influye directamente en los químicos del bienestar en tu cerebro, por lo que es súper común que te sientas más sensible, cansada o con ganas de llorar.";
    }
    if (id.includes('bloating') || id.includes('digestive') || q.includes('hinch') || q.includes('gases') || q.includes('inflam')) {
      return "En esta etapa las hormonas hacen que tu digestión trabaje a un ritmo más despacio y relajado, lo que acumula un poco de gases y genera esa sensación de pancita abultada.";
    }
    if (id.includes('cervical') || id.includes('discharge') || q.includes('flujo') || q.includes('moco')) {
      return "Tu flujo es como el termómetro de tu ciclo: cuando está transparente y resbaloso como clara de huevo te avisa que estás en tus días fértiles, y cuando se vuelve blanco o espeso ayuda a proteger tu salud íntima.";
    }
    if (id.includes('contraceptive') || id.includes('pill') || q.includes('pastill') || q.includes('anticoncept')) {
      return "Los métodos anticonceptivos mantienen tus hormonas en un nivel estable para que tus ovarios se tomen una pausa. Si hubo algún cambio de horario u olvido, el cuerpo puede reaccionar con un pequeño manchado transitorio.";
    }

    // Limpieza general de tecnicismos del texto original si es otro tema
    let text = (node && node.biologicalExplanation) ? node.biologicalExplanation : '';
    text = text.replace(/eje \*\*Hipotálamo-Hipófisis-[^\*]+\*\*/gi, 'tu ritmo hormonal natural');
    text = text.replace(/prostaglandinas?[^,\.]*/gi, 'sustancias naturales del cuerpo');
    text = text.replace(/vasoconstricción e isquemia miometrial/gi, 'tensión muscular');
    text = text.replace(/vías noradrenérgicas y amígdala cerebral/gi, 'tus emociones');
    text = text.replace(/descamación endometrial/gi, 'la llegada de tu período');
    return text;
  }

  static simplifyActionSteps(steps) {
    if (!steps || !steps.length) return [];
    return steps.map(s => {
      let clean = s;
      if (clean.startsWith('**')) {
        const colonIdx = clean.indexOf(':');
        if (colonIdx > 0 && colonIdx < 45) {
          clean = clean.slice(colonIdx + 1).replace(/^\*+\s*/, '').trim();
        }
      }
      clean = clean.replace(/Inhibe la síntesis de prostaglandinas inflamatorias\./gi, '');
      clean = clean.replace(/inhibe la ciclooxigenasa \(COX-2\)\s*/gi, '');
      clean = clean.replace(/Activa receptores GABAérgicos y modula el eje HPA\./gi, '');
      clean = clean.replace(/Optimizando la biodisponibilidad de hierro no hemo\./gi, '');
      clean = clean.replace(/reduciendo prostaglandinas/gi, 'para calmar la molestia');
      clean = clean.replace(/con la misma eficacia que un AINE de venta libre/gi, 'de forma natural y efectiva');
      clean = clean.replace(/que sobreestimulan las vías noradrenérgicas de ansiedad/gi, 'para mantener la calma');
      clean = clean.replace(/desactivar el reflejo simpático de contracción/gi, 'soltar la tensión de la pelvis');
      return clean.trim();
    });
  }

  /**
   * Encuentra las rutinas de la pantalla de Alivio que mejor alivian la consulta de la usuaria
   */
  static findBestMatchingRoutines(userMessage, max = 2) {
    const q = (userMessage || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    // 1. Cólicos, dolor menstrual, dolor pélvico o de vientre
    if (q.includes('colic') || (q.includes('dolor') && (q.includes('vientre') || q.includes('menstru') || q.includes('regla') || q.includes('periodo') || q.includes('pelvi') || q.includes('bajo')))) {
      return [
        { id: 'routine-py-2', name: 'Yoga Terapéutico para Dismenorrea (Postura de la Paloma)', benefit: 'Ayuda a soltar la tensión del útero y la pelvis profunda mediante estiramientos suaves.' },
        { id: 'routine-st-1', name: 'Estiramiento de Rodillas al Pecho (Apanasana)', benefit: 'Masajea el bajo vientre y alivia de inmediato los espasmos y cólicos.' }
      ].slice(0, max);
    }

    // 2. Dolor de espalda, lumbar, cintura o sacro
    if (q.includes('espalda') || q.includes('lumbar') || q.includes('cintura') || q.includes('sacr') || q.includes('columna')) {
      return [
        { id: 'routine-py-1', name: 'Yoga Restaurativo para Liberación Sacra', benefit: 'Descomprime los nervios de la espalda baja y relaja la zona lumbar.' },
        { id: 'routine-st-2', name: 'Estiramiento Gato-Vaca Somático', benefit: 'Moviliza suavemente las vértebras y disuelve la rigidez de la espalda.' }
      ].slice(0, max);
    }

    // 3. Sensibilidad en senos, pesadez o congestión pectoral
    if (q.includes('seno') || q.includes('pecho') || q.includes('mamas') || q.includes('tetas') || q.includes('pezon')) {
      return [
        { id: 'routine-st-4', name: 'Apertura Torácica & Hombros Suave', benefit: 'Mejora la circulación y la sensación de pesadez en el pecho.' },
        { id: 'routine-so-1', name: 'Respiración Pélvica Diafragmática 4-7-8', benefit: 'Oxigena los tejidos y calma la sensibilidad hormonal.' }
      ].slice(0, max);
    }

    // 4. Hinchazón, gases, digestión lenta o inflamación abdominal
    if (q.includes('hinch') || q.includes('gas') || q.includes('inflam') || q.includes('digest') || q.includes('estomago') || q.includes('pesadez')) {
      return [
        { id: 'routine-st-3', name: 'Torsión Abdominal Suave en el Suelo', benefit: 'Facilita la expulsión de gases y reactiva la digestión suavemente.' },
        { id: 'routine-py-3', name: 'Postura del Niño Asistida con Cojín', benefit: 'Quita toda la presión sobre el abdomen y calma la inflamación.' }
      ].slice(0, max);
    }

    // 5. Ansiedad, estrés, tristeza, llanto, irritabilidad o cambios de humor
    if (q.includes('ansied') || q.includes('estres') || q.includes('nervio') || q.includes('triste') || q.includes('llor') || q.includes('panico') || q.includes('humor') || q.includes('miedo') || q.includes('abrum')) {
      return [
        { id: 'routine-so-2', name: 'Técnica de Conexión a Tierra 5-4-3-2-1', benefit: 'Frena los pensamientos abrumadores y te ancla en calma.' },
        { id: 'routine-so-3', name: 'Relajación Muscular Progresiva', benefit: 'Envía una señal de seguridad al cerebro para que el cuerpo se suelte por completo.' }
      ].slice(0, max);
    }

    // 6. Insomnio, desvelo, cansancio o fatiga
    if (q.includes('dormir') || q.includes('insomni') || q.includes('desvel') || q.includes('noche') || q.includes('sueno') || q.includes('cansad') || q.includes('agotad')) {
      return [
        { id: 'routine-so-3', name: 'Relajación Muscular Progresiva para Dormir', benefit: 'Prepara tu cuerpo para un sueño profundo y reparador.' },
        { id: 'routine-so-1', name: 'Respiración Somática Diafragmática 4-7-8', benefit: 'Baja las pulsaciones y te ayuda a conciliar el sueño con calma.' }
      ].slice(0, max);
    }

    // 7. Dolor de cabeza, migraña o tensión en el cuello
    if (q.includes('cabeza') || q.includes('migran') || q.includes('jaqueca') || q.includes('cuello') || q.includes('nuca')) {
      return [
        { id: 'routine-st-5', name: 'Liberación Somática Cervical y de Cuello', benefit: 'Disuelve la tensión acumulada en el cuello y la base de la cabeza.' },
        { id: 'routine-so-1', name: 'Respiración Somática 4-7-8', benefit: 'Aumenta la oxigenación general disminuyendo la presión cefálica.' }
      ].slice(0, max);
    }

    // Por defecto: Bienestar somático general
    return [
      { id: 'routine-so-1', name: 'Respiración Pélvica Diafragmática 4-7-8', benefit: 'Calma tu sistema nervioso y oxigena todo tu cuerpo con suavidad.' },
      { id: 'routine-st-1', name: 'Estiramiento de Rodillas al Pecho', benefit: 'Libera la tensión pélvica y brinda alivio inmediato.' }
    ].slice(0, max);
  }

  async processQuery(userMessage, currentPet = 'amy', userProfile = {}, conversationHistory = []) {
    const intent = this.classifyIntent(userMessage);
    const persona = AgentPersonaEngine.getPersonaData(currentPet);
    const textLower = userMessage.toLowerCase();

    // 1. Detección de petición explícita de recursos o videos
    const linkKeywords = ['link', 'links', 'video', 'videos', 'youtube', 'enlace', 'enlaces', 'pagina', 'paginas', 'recursos externos', 'donde ver', 'donde leer', 'fuente', 'fuentes'];
    const requestedExternalMedia = linkKeywords.some(kw => textLower.includes(kw));

    // =========================================================================
    // CAMINO 2: ERROR O FALLA TÉCNICA (POLLO DESARROLLADOR 🐔💻)
    // =========================================================================
    if (intent === 'APP_BUG_QUERY') {
      await DeveloperSupportBridge.sendNotificationTicket({
        userEmail: userProfile.desarrolladorEmail || 'santisc1304@gmail.com',
        issueSummary: userMessage,
        appState: { currentPet: persona.name, timestamp: new Date().toISOString() }
      });

      return {
        text: `Me he comunicado de inmediato con el **Pollo Desarrollador 🐔💻**. Le he transmitido un reporte técnico de este inconveniente (*"${userMessage}"*). Te notificaremos en este mismo chat tan pronto como el equipo lo resuelva para que sigas disfrutando de Pochirocho al 100%. 🛠️✨`,
        isDevTicketTriggered: true,
        type: 'dev_ticket'
      };
    }

    // =========================================================================
    // CAMINO 1: GOOGLE GEMINI API (CONVERSACIÓN GENERATIVA ESTRUCTURADA)
    // =========================================================================
    const candidateRoutines = HealthAIAgentEngine.findBestMatchingRoutines(userMessage, 2);

    if (GeminiConfig.hasApiKey()) {
      try {
        const cyclePhase = userProfile.faseHormonal || 'Fase Ovulatoria';
        const cycleDay = userProfile.diaActualCiclo || 14;
        const symptomsList = userProfile.sintomasHoy || [];

        // RAG Context enriquecido para Gemini
        const ragHits = this.ragEngine.search(userMessage, 2);
        let groundingData = '';
        if (ragHits && ragHits.length > 0) {
          groundingData = ragHits.map(h => `TÓPICO: ${h.node.title}\nEXPLICACIÓN: ${h.node.biologicalExplanation}\nRECOMENDACIONES: ${h.node.actionableSteps.join('; ')}`).join('\n\n');
        }

        const routinesPromptText = candidateRoutines.map(r => `• Rutina "${r.name}" (ID: ${r.id}) -> Por qué le sirve: ${r.benefit}`).join('\n');

        const systemPrompt = `Eres ${persona.name}, la compañera amorosa, empática y experta en salud menstrual y bienestar de la app Pochirocho.
Tu personalidad es: ${persona.style}.

ESTADO DE LA USUARIA:
- Fase Hormonal: ${cyclePhase} (Día ${cycleDay} del ciclo).
- Síntomas Registrados Hoy: ${symptomsList.length > 0 ? symptomsList.join(', ') : 'Ninguno registrado'}.

RUTINAS DE LA PESTAÑA DE ALIVIO DE LA APP PARA ESTE CASO:
${routinesPromptText}

${groundingData ? `BASE MÉDICA DE REFERENCIA:\n${groundingData}\n` : ''}

REGLAS OBLIGATORIAS DE ESTRUCTURA Y TONO (DEBES RESPONDER EN ESTOS 4 PASOS EXACTOS):

1. **MENSAJE DE COMPRENSIÓN Y EMPATÍA**:
   Comienza con un mensaje cálido donde valides sinceramente lo que ella está sintiendo. Que sienta que la escuchas y la acompañas con mucho amor.

2. **EXPLICACIÓN SENCILLA (CERO TECNICISMOS)**:
   Explícale qué le está pasando a su cuerpo de forma clara, amena y con palabras cotidianas. NO uses tecnicismos médicos fríos o complicados. Usa analogías amables (ejemplo: "el útero es como un saquito muscular...", "las hormonas están en un momento de descanso...", "tu cuerpo retiene un poquito de líquido...") para que entienda a la primera y sin esfuerzo.

3. **RECOMENDACIONES PRÁCTICAS**:
   Brinda 3 o 4 consejos claros, útiles y aplicables de inmediato en su hogar (hidratación, calor local, qué infusión tomar, qué alimentos reconfortantes elegir, cómo acomodarse o descansar).

4. **RECOMENDACIÓN DE RUTINA EN LA PESTAÑA DE ALIVIO**:
   Recomiéndale con entusiasmo la rutina "${candidateRoutines[0]?.name || 'Respiración Pélvica'}" de la pestaña de **Alivio** de la app, explicándole con palabras sencillas por qué le va a ayudar a aliviar su molestia específica.`;

        const geminiResponseText = await GeminiConfig.generateResponse(systemPrompt, userMessage, conversationHistory);

        return {
          text: geminiResponseText,
          resources: requestedExternalMedia && ragHits.length > 0 ? (ragHits[0].node.verifiedResources || []) : [],
          linkedRoutines: candidateRoutines,
          type: 'gemini_ai_response'
        };
      } catch (geminiError) {
        console.warn('Fallback a RAG Local debido a error en Gemini API:', geminiError);
      }
    }

    // =========================================================================
    // MOTOR SEMÁNTICO RAG LOCAL DE RESPALDO (ESTRUCTURA EXACTA EN 4 PASOS)
    // =========================================================================
    const searchResults = this.ragEngine.search(userMessage, 2);

    if (searchResults && searchResults.length > 0 && (searchResults[0].score >= 3.0 || searchResults[0].confidence >= 25)) {
      const topMatch = searchResults[0].node;

      // 1. Apertura de empatía y validación emocional
      const empathyOpener = AgentPersonaEngine.generateValidationMessage(currentPet, userMessage, topMatch.title);
      
      // 2. Explicación biológica pedagógica y comprensible sin tecnicismos
      const simpleBio = HealthAIAgentEngine.simplifyBiologicalExplanation(topMatch, userMessage);
      
      // 3. Recomendaciones prácticas en viñetas
      const cleanSteps = HealthAIAgentEngine.simplifyActionSteps(topMatch.actionableSteps);
      let stepsMarkdown = '';
      if (cleanSteps.length > 0) {
        stepsMarkdown = 'Aquí tienes varias cosas sencillas y efectivas que puedes hacer ahora mismo:\n\n' + 
          cleanSteps.map(step => `• **${step}**`).join('\n\n');
      }

      // 4. Recomendación de rutina de Alivio
      let routineSection = '';
      if (candidateRoutines.length > 0) {
        const r = candidateRoutines[0];
        routineSection = `🌿 **Para ayudarte a sentirte mejor:** Te recomiendo hacer la rutina **"${r.name}"** en tu sección de **Alivio**. ${r.benefit} Puedes abrirla directamente aquí abajo para que la hagamos juntas paso a paso ✨.`;
      }

      let responseMarkdown = `${empathyOpener}\n\n${simpleBio}\n\n${stepsMarkdown}\n\n${routineSection}`;

      if (topMatch.redFlags) {
        responseMarkdown += `\n\n⚠️ *Nota de cuidado:* ${topMatch.redFlags}`;
      }

      const signOff = persona.signOffs[Math.floor(Math.random() * persona.signOffs.length)];
      responseMarkdown += `\n\n*${signOff}*`;

      return {
        text: responseMarkdown,
        resources: requestedExternalMedia && topMatch.verifiedResources ? topMatch.verifiedResources : [],
        linkedRoutines: candidateRoutines,
        type: 'rag_expert_response',
        topicId: topMatch.id
      };
    }

    // =========================================================================
    // RESPUESTA HONESTA Y NATURAL CUANDO EL TEMA NO ESTÁ EN LA BASE LOCAL
    // =========================================================================
    const id = persona.id;
    let fallbackText = '';
    if (id === 'luffy') {
      fallbackText = `¡Hey! Te entiendo y aquí estoy contigo 🐒. Sobre lo que me preguntas (*"${userMessage}"*), no tengo esa información específica en mi memoria local de salud menstrual. Si necesitas que Pochirocho cuente con este tipo de información, puedes solicitárselo al **Pollo Desarrollador 🐔💻** para que la añada a nuestra base de datos. Mientras tanto, ¡puedes relajarte con las rutinas de nuestra sección de Alivio! 🐒✨`;
    } else if (id === 'maomao') {
      fallbackText = `Miau~ Te escucho con todo mi corazón 🐱💖. Sobre lo que me preguntas (*"${userMessage}"*), ese tema no se encuentra en mi base de datos de bienestar femenino. Si es un tema que te gustaría consultar aquí, puedes pedirle con cariño al **Pollo Desarrollador 🐔💻** que lo incluya en la app. ¡Aquí me quedo acurrucada acompañándote! 🐱✨`;
    } else if (id === 'pipo') {
      fallbackText = `He analizado tu consulta con mucho cuidado 🐧📊. Sobre (*"${userMessage}"*), ese tema no está registrado aún en mi base ontológica. Puedes solicitarle al **Pollo Desarrollador 🐔💻** que incorpore esta información en una próxima actualización 🐧🧊. ¡Cualquier duda de tu ciclo aquí estoy para ayudarte!`;
    } else if (id === 'naveen') {
      fallbackText = `Namasté... Sobre lo que me consultas (*"${userMessage}"*), no encuentro ese conocimiento en mi compendio de bienestar hormonal 🐸🍃. Si sientes que es un saber que enriquecería la app, puedes pedirle al **Pollo Desarrollador 🐔💻** que lo añada a nuestra base de datos. Permíteme seguir acompañando tu serenidad 🐸✨.`;
    } else {
      fallbackText = `¡Hola! Te acompaño con mucho cariño en lo que sientes 🦔💖. Sobre (*"${userMessage}"*), aún no tengo ese tema en mi memoria de salud femenina. Puedes pedirle al **Pollo Desarrollador 🐔💻** que investigue y lo añada. ¡Te mando un abrazo suave! 🦔✨`;
    }

    return {
      text: fallbackText,
      resources: [],
      linkedRoutines: candidateRoutines,
      type: 'conversational_general'
    };
  }
}
