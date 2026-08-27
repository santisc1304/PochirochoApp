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
        userEmail: userProfile.desarrolladorEmail || 'ana@ejemplo.com',
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
    // CAMINO 1: GOOGLE GEMINI API (CONVERSACIÓN LIBRE GENERATIVA SOBRE CUALQUIER TEMA)
    // =========================================================================
    if (GeminiConfig.hasApiKey()) {
      try {
        const cyclePhase = userProfile.faseHormonal || 'Fase Ovulatoria';
        const cycleDay = userProfile.diaActualCiclo || 14;
        const symptomsList = userProfile.sintomasHoy || [];

        // RAG Context enriquecido para Gemini
        const ragHits = this.ragEngine.search(userMessage, 2);
        let groundingData = '';
        if (ragHits && ragHits.length > 0) {
          groundingData = ragHits.map(h => `TÓPICO: ${h.node.title}\nEXPLICACIÓN BIOLÓGICA: ${h.node.biologicalExplanation}\nPASOS DE ACCIÓN: ${h.node.actionableSteps.join('; ')}`).join('\n\n');
        }

        const systemPrompt = `Eres ${persona.name}, la compañera empática, cercana y conversacional de salud menstrual y bienestar en la app Pochirocho.
Tu personalidad es: ${persona.style}.
ESTADO DE LA USUARIA:
- Fase Hormonal Actual: ${cyclePhase} (Día ${cycleDay} del ciclo).
- Síntomas Registrados: ${symptomsList.length > 0 ? symptomsList.join(', ') : 'Sin síntomas severos'}.

${groundingData ? `INFORMACIÓN DE REFERENCIA:\n${groundingData}\n` : ''}

DIRECTRICES:
1. Responde de forma 100% conversacional, fluida y cálida como una amiga cercana en párrafos naturales.
2. NUNCA uses encabezados robóticos ni plantillas repetitivas de tarjetas.
3. Puedes conversar sobre CUALQUIER tema que la usuaria pregunte (emociones, dudas médicas, vida diaria, hábitos, nutrición, etc.).
4. Si es relevante para su molestia, puedes invitarla con cariño a revisar las rutinas en su pestaña de Alivio.`;

        const geminiResponseText = await GeminiConfig.generateResponse(systemPrompt, userMessage, conversationHistory);

        let linkedRoutines = [];
        if (ragHits && ragHits.length > 0) {
          linkedRoutines = ragHits[0].node.linkedRoutines || [];
        }

        return {
          text: geminiResponseText,
          resources: requestedExternalMedia && ragHits.length > 0 ? (ragHits[0].node.verifiedResources || []) : [],
          linkedRoutines: linkedRoutines,
          type: 'gemini_ai_response'
        };
      } catch (geminiError) {
        console.warn('Fallback a RAG Local debido a error en Gemini API:', geminiError);
      }
    }

    // =========================================================================
    // MOTOR SEMÁNTICO RAG LOCAL DE RESPALDO (PROSA FLUIDA Y NATURAL SIN PLANTILLAS)
    // =========================================================================
    const searchResults = this.ragEngine.search(userMessage, 2);

    if (searchResults && searchResults.length > 0 && (searchResults[0].score >= 3.0 || searchResults[0].confidence >= 25)) {
      const topMatch = searchResults[0].node;
      const secondaryMatch = searchResults.length > 1 && searchResults[1].confidence > 50 ? searchResults[1].node : null;

      // 1. Apertura de empatía variada
      const empathyOpener = AgentPersonaEngine.generateValidationMessage(currentPet, userMessage, topMatch.title);
      
      // 2. Explicación sencilla en prosa continua
      const simpleBio = HealthAIAgentEngine.simplifyBiologicalExplanation(topMatch, userMessage);
      
      // 3. Consejos prácticos hilados en lenguaje conversacional
      const cleanSteps = HealthAIAgentEngine.simplifyActionSteps(topMatch.actionableSteps);
      let adviceText = '';
      if (cleanSteps.length > 0) {
        const step1 = cleanSteps[0].replace(/\.$/, '');
        const step2 = cleanSteps.length > 1 ? cleanSteps[1].replace(/\.$/, '') : '';
        if (step2) {
          adviceText = `Te recomiendo probar ${step1.charAt(0).toLowerCase() + step1.slice(1)}, y también ${step2.charAt(0).toLowerCase() + step2.slice(1)}.`;
        } else {
          adviceText = `Te sugiero ${step1.charAt(0).toLowerCase() + step1.slice(1)}.`;
        }
      }

      let responseMarkdown = `${empathyOpener}\n\n${simpleBio}\n\n${adviceText}`;

      // 4. Mención natural de rutina
      let linkedRoutines = [...(topMatch.linkedRoutines || [])];
      if (secondaryMatch && secondaryMatch.linkedRoutines) {
        linkedRoutines = linkedRoutines.concat(secondaryMatch.linkedRoutines);
      }

      if (linkedRoutines.length > 0) {
        responseMarkdown += `\n\nSi quieres que hagamos una pausa juntas, te dejé lista la rutina **${linkedRoutines[0].name}** en tu pestaña de **Alivio** ✨.`;
      }

      if (topMatch.redFlags) {
        responseMarkdown += `\n\n⚠️ *Ten en cuenta:* ${topMatch.redFlags}`;
      }

      const signOff = persona.signOffs[Math.floor(Math.random() * persona.signOffs.length)];
      responseMarkdown += `\n\n*${signOff}*`;

      let externalResources = [];
      if (requestedExternalMedia || topMatch.verifiedResources) {
        externalResources = topMatch.verifiedResources || [];
        if (secondaryMatch && secondaryMatch.verifiedResources) {
          externalResources = externalResources.concat(secondaryMatch.verifiedResources);
        }
      }

      return {
        text: responseMarkdown,
        resources: requestedExternalMedia ? externalResources : (externalResources.length > 0 ? externalResources.slice(0, 1) : []),
        linkedRoutines: linkedRoutines,
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
      fallbackText = `¡Hey! Sobre lo que me preguntas (*"${userMessage}"*), no tengo esa información específica en mi memoria local de salud menstrual 🐒. Si necesitas que Pochirocho cuente con información de este estilo, puedes solicitárselo al **Pollo Desarrollador 🐔💻** para que investigue y la añada a nuestra base de datos. ¡Cualquier duda de tu ciclo aquí estoy listo para apoyarte! 🐒✨`;
    } else if (id === 'maomao') {
      fallbackText = `Miau~ Sobre lo que me preguntas (*"${userMessage}"*), ese tema no se encuentra en mi base de datos de bienestar femenino 🐱. Si es un tema que te gustaría consultar aquí, puedes pedirle con cariño al **Pollo Desarrollador 🐔💻** que lo incluya en la base de datos de la app. ¡Aquí me quedo acurrucada acompañándote con mucho amor! 🐱💖`;
    } else if (id === 'pipo') {
      fallbackText = `He analizado tu consulta (*"${userMessage}"*), pero ese tema específico no está registrado en mi base ontológica de salud menstrual 🐧📊. Si consideras útil que la app abarque este tipo de temas, puedes solicitarle al **Pollo Desarrollador 🐔💻** que incorpore esta información a nuestra base de datos en una futura actualización 🐧🧊.`;
    } else if (id === 'naveen') {
      fallbackText = `Namasté... Sobre lo que me consultas (*"${userMessage}"*), no encuentro ese conocimiento en mi compendio de bienestar hormonal 🐸🍃. Si sientes que es un saber que enriquecería la app, puedes pedirle al **Pollo Desarrollador 🐔💻** que lo añada a nuestra base de datos. Permíteme seguir acompañando tu serenidad 🐸✨.`;
    } else {
      // Manola
      fallbackText = `Corazón, sobre lo que me preguntas (*"${userMessage}"*), no tengo esa información específica en mi base de datos de salud menstrual 🦔. Mi misión es cuidarte y explicarte todo sobre tu ciclo, tus cólicos, tus hormonas y tu alivio diario. Si sientes que es algo importante que deberíamos tener aquí, puedes solicitárselo al **Pollo Desarrollador 🐔💻** para que lo investigue y lo incluya en nuestra base de datos. ¡Aquí estoy siempre para mimarte y acompañarte en tu ciclo! 🦔💖`;
    }

    return {
      text: fallbackText,
      resources: [],
      linkedRoutines: [],
      type: 'general_dialogue'
    };
  }
}
