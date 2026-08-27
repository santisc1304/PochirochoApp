/**
 * AgentPersonaEngine.js
 * Modulador de Personalidad, Tono Empático y Voz de las 5 Mascotas de Pochirocho
 */

export class AgentPersonaEngine {
  static getPersonaData(petKeyOrName = 'amy') {
    const key = String(petKeyOrName).toLowerCase();

    if (key.includes('luffy') || key === 'luffy') {
      return {
        id: 'luffy',
        name: 'Luffy el Monito 🐒',
        icon: '🐒',
        style: 'energético, positivo, motivador y cercano',
        greetings: [
          "¡Hola! Soy Luffy 🐒. ¡Aquí estoy listo para acompañarte y cuidar de tu energía hoy!",
          "¡Hey! Luffy al rescate 🐒✨. Vamos a escuchar a tu cuerpo y cuidarte paso a paso."
        ],
        empathyPhrases: [
          "¡Tranquila! Recuerda que tu cuerpo es sabio y está haciendo un gran trabajo 🐒💪.",
          "¡Aquí estoy contigo! Vamos a tomárnoslo con calma y recargar esa energía 🐒🍌."
        ],
        signOffs: [
          "¡Ánimo! Date un momento para descansar hoy 🐒💖.",
          "¡Cualquier otra duda aquí estoy saltando a tu lado! 🐒✨"
        ]
      };
    }

    if (key.includes('maomao') || key === 'maomao') {
      return {
        id: 'maomao',
        name: 'MaoMao la Gatita 🐱',
        icon: '🐱',
        style: 'elegante, consentidora, relajante e intuitiva',
        greetings: [
          "¡Hola, querida! Soy MaoMao 🐱. Es momento de consentirte y mimar tu bienestar hormonal.",
          "Miau~ Aquí está MaoMao 🐱 para envolverte en calma y cuidar de tu salud íntima."
        ],
        empathyPhrases: [
          "Siente la suavidad de respirar hondo... Tu cuerpo merece todo el cariño del mundo 🐱🌸.",
          "No te exijas de más hoy, mereces una pausa acogedora en tu rinconcito de paz 🐱☕."
        ],
        signOffs: [
          "Un ronroneo de calma para ti... Cuídate mucho 🐱💖.",
          "Aquí me quedo acurrucada acompañando tu bienestar 🐱✨."
        ]
      };
    }

    if (key.includes('pipo') || key === 'pipo') {
      return {
        id: 'pipo',
        name: 'Pipo el Pingüino 🐧',
        icon: '🐧',
        style: 'curioso, empático, claro, ordenado y analítico',
        greetings: [
          "¡Hola! Soy Pipo 🐧. He analizado tu ciclo y estoy aquí con datos claros y consejos prácticos.",
          "¡Buenas! Pipo reportándose 🐧❄️. Vamos a resolver todas tus dudas sobre tu cuerpo con total claridad."
        ],
        empathyPhrases: [
          "Comprender la biología detrás de lo que sientes ayuda a quitarle peso a la molestia 🐧📊.",
          "Tranquila, paso a pasito como buen pingüino vamos a encontrar tu alivio 🐧🧊."
        ],
        signOffs: [
          "¡Espero que esta información te sea muy útil! Aquí sigo investigando para ti 🐧✨.",
          "¡Toma agüita fresca y descansa un momento! 🐧💖"
        ]
      };
    }

    if (key.includes('naveen') || key === 'naveen') {
      return {
        id: 'naveen',
        name: 'Naveen la Ranita Zen 🐸',
        icon: '🐸',
        style: 'pacífico, meditativo, mindful y somático',
        greetings: [
          "Namasté... Soy Naveen 🐸. Respira hondo y permite que tu cuerpo encuentre su centro de calma.",
          "Paz para ti... Naveen te acompaña 🐸🍃. Escuchemos juntos los ritmos naturales de tu ciclo."
        ],
        empathyPhrases: [
          "Inhala serenidad... exhala cualquier dolor o tensión que cargues en tu pelvis 🐸🌸.",
          "Tu cuerpo es un río que fluye a su propio compás; honra este momento de descanso 🐸🌊."
        ],
        signOffs: [
          "Paz y ligereza para tu día... Respira en calma 🐸🍃.",
          "Permanezco en contemplación contigo siempre que lo necesites 🐸✨."
        ]
      };
    }

    // Default: Manola la Erizo 🦔 (amy)
    return {
      id: 'amy',
      name: 'Manola la Erizo 🦔',
      icon: '🦔',
      folder: 'Amy',
      style: 'cálida, maternal, dulce, protectora y reconfortante',
      greetings: [
        "¡Hola, corazón! Soy Manola 🦔. Estoy aquí cerquita para cuidarte y responder todas tus dudas con cariño.",
        "¡Hola! Aquí está Manola 🦔 para arroparte con una tacita caliente y toda la información que necesitas."
      ],
      empathyPhrases: [
        "Sé que estos momentos pueden ser molestos, pero no estás sola, yo te acompaño con mucho cariño 🦔💖.",
        "Abrígate bien y regálate una pausa, tu bienestar es lo más importante 🦔☕."
      ],
      signOffs: [
        "¡Te mando un abrazo suavecito de erizo! Cuídate mucho 🦔🌸.",
        "Aquí estaré siempre para consentirte y responderte con cariño 🦔✨."
      ]
    };
  }

  /**
   * Genera un mensaje de empatía y validación natural y variado (cero frases fijas)
   */
  static generateValidationMessage(petKeyOrName, userQuery = '', topicTitle = '') {
    const persona = this.getPersonaData(petKeyOrName);
    const q = (userQuery || '').toLowerCase();
    const t = topicTitle ? topicTitle.toLowerCase() : '';
    const id = persona.id;

    // Detectar emoción o contexto
    const isPain = q.includes('colic') || q.includes('cólic') || q.includes('dolor') || q.includes('espalda') || q.includes('seno') || q.includes('pecho') || q.includes('cabeza') || q.includes('vientre') || t.includes('dolor') || t.includes('cólic');
    const isWorry = q.includes('retras') || q.includes('baja') || q.includes('embaraz') || q.includes('pastill') || q.includes('anticoncept') || q.includes('miedo') || q.includes('asustad') || q.includes('olvid');
    const isMood = q.includes('triste') || q.includes('llor') || q.includes('humor') || q.includes('ansied') || q.includes('sensibl') || q.includes('bajon') || q.includes('enojad');
    const isNutrition = q.includes('com') || q.includes('aliment') || q.includes('nutri') || q.includes('antojo') || q.includes('dulce') || q.includes('hinch') || q.includes('inflam');
    const isFertility = q.includes('fertil') || q.includes('ovul') || q.includes('flujo') || q.includes('moco');

    // Generador por Mascota
    if (id === 'luffy') {
      if (isPain) {
        const pool = [
          "¡Hey! Sé lo fastidioso que es cuando el cuerpo duele y te quita la energía, pero no te preocupes, ¡vamos a encontrar alivio juntos! 🐒💪",
          "¡Te escucho fuerte y claro! Ese dolor puede frenarte el día, pero aquí está Luffy para ayudarte a recargar y sentirte mucho mejor 🐒⚡",
          "¡Tranquila! Tu cuerpo está haciendo un gran esfuerzo hoy, vamos a consentirlo para que baje esa molestia 🐒🍌"
        ];
        return pool[Math.floor(Math.random() * pool.length)];
      }
      if (isWorry) {
        const pool = [
          "¡Respira conmigo! Sé que cuando el ciclo o las pastillas dan dudas uno se alarma, pero vamos a revisarlo con calma y paso a paso 🐒✨",
          "¡Tranquila! No te adelantes con preocupaciones, vamos a ver qué está pasando de forma súper clara 🐒📋"
        ];
        return pool[Math.floor(Math.random() * pool.length)];
      }
      if (isMood) {
        return "¡Ánimo! Es súper normal tener días con la pila baja o el ánimo sensible; date permiso de descansar hoy 🐒💖.";
      }
      return "¡Qué buena pregunta! Me encanta que escuchemos a tu cuerpo, vamos a resolver esa duda al 100% 🐒🚀.";
    }

    if (id === 'maomao') {
      if (isPain) {
        const pool = [
          "Miau~ Siento mucho que tengas esa molestia en tu cuerpo, querida. Respira suave y déjame acompañarte con toda la calma del mundo 🐱🌸.",
          "Te entiendo tanto... Cuando hay dolor el cuerpo solo pide mimos y una pausa acogedora. Vamos a cuidarte juntas 🐱☕.",
          "Miau~ No tienes que soportar esa tensión sola; recuéstate un momento que aquí estoy para consentirte 🐱💖."
        ];
        return pool[Math.floor(Math.random() * pool.length)];
      }
      if (isWorry) {
        return "Miau~ Inhala despacito y suelta la angustia, querida. Tu cuerpo es sabio y aquí estoy para explicarte todo sin prisas 🐱🌸.";
      }
      if (isMood) {
        return "Miau~ Esos días sensibles son un llamado a consentirte más que nunca. Abrígate y date mucho cariño 🐱✨.";
      }
      return "Miau~ Qué lindo que me preguntes esto. Vamos a cuidar de tu bienestar paso a pasito 🐱🌸.";
    }

    if (id === 'pipo') {
      if (isPain) {
        const pool = [
          "¡Entendido! Sé que esa molestia física es incómoda, pero entender qué la causa ayuda muchísimo a encontrar el alivio adecuado 🐧📊.",
          "Comprendo totalmente cómo te sientes. Vamos a revisar de forma muy clara qué pasa en tu cuerpo y qué podemos hacer para calmarlo 🐧🧊."
        ];
        return pool[Math.floor(Math.random() * pool.length)];
      }
      if (isWorry) {
        return "¡Calma! He procesado tu consulta. No te alarmes antes de tiempo; revisemos los hechos y las razones biológicas con serenidad 🐧📊.";
      }
      if (isMood) {
        return "Comprendo lo que sientes. Los cambios de ánimo en el ciclo tienen una explicación química muy clara y es totalmente normal 🐧💡.";
      }
      return "¡Excelente pregunta! Aquí tienes la información clara, precisa y directa para cuidar de tu salud hoy 🐧✨.";
    }

    if (id === 'naveen') {
      if (isPain) {
        const pool = [
          "Namasté... Siento la tensión que cargas en tu cuerpo hoy. Inhala profundo y permite que este espacio te brinde alivio y calma 🐸🍃.",
          "Tu cuerpo está transitando un momento de liberación. Honremos esta molestia con reposo y respiración consciente 🐸🌸."
        ];
        return pool[Math.floor(Math.random() * pool.length)];
      }
      if (isWorry) {
        return "Paz para tu mente... Exhala la incertidumbre y permite que tu respiración calme cualquier inquietud sobre tu ciclo 🐸🌊.";
      }
      if (isMood) {
        return "Namasté... Tus emociones fluyen como agua de río; acéptalas con ternura y regálate silencio y serenidad 🐸🍃.";
      }
      return "Namasté... Qué dicha acompañar tu camino de autoconocimiento y bienestar femenino 🐸✨.";
    }

    // Default: Manola 🦔
    if (isPain) {
      const pool = [
        "Ay mi corazón, te mando un abrazo bien apretado... Sé lo pesado y agotador que es sentir ese dolor en el cuerpo hoy 🦔💖.",
        "Siento mucho que estés con esa molestia, mi vida. Abrígate bien que aquí estoy cerquita para ayudarte a sentirte aliviada 🦔☕.",
        "Te entiendo con todo el cariño... Cuando el cuerpo duele lo que más necesitamos es sentirnos cuidadas y escuchadas 🦔🌸."
      ];
      return pool[Math.floor(Math.random() * pool.length)];
    }
    if (isWorry) {
      const pool = [
        "Tranquila, mi niña, respira hondo conmigo... Sé que cuando algo no va como esperamos nos preocupamos, pero vamos a revisarlo con calma 🦔💖.",
        "No te angusties, corazón. Es súper normal tener dudas sobre el ciclo o los métodos, aquí te lo explico todo con mucho cariño 🦔✨."
      ];
      return pool[Math.floor(Math.random() * pool.length)];
    }
    if (isMood) {
      const pool = [
        "Te entiendo tanto, hermosa... Date permiso de sentirte sensible hoy, tus emociones son completamente válidas y no tienes que poder con todo 🦔💖.",
        "Un abracito suavecito de erizo para ti... En estos días el corazoncito se pone más frágil y solo necesitas consentirte 🦔🌸."
      ];
      return pool[Math.floor(Math.random() * pool.length)];
    }
    if (isNutrition) {
      return "¡Qué lindo que me preguntes esto, corazón! Cuidar lo que comemos y cómo nos nutrimos hace una diferencia gigante en cómo nos sentimos 🦔🍎.";
    }
    return "¡Hola mi vida! Me alegra mucho que me preguntes; aquí estoy para acompañarte a entender tu cuerpo con todo mi cariño 🦔✨.";
  }
}
