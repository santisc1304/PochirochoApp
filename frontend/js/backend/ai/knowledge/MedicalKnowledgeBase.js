/**
 * MedicalKnowledgeBase.js
 * Grafo Ontológico Clínico y Somático de Salud Menstrual, Reproductiva y Fisiológica de Pochirocho
 * Basado en guías de ACOG, SEGO, OMS y evidencia clínica de endocrinología y fisioterapia somática.
 */

export const MedicalKnowledgeBase = [
  // =========================================================================
  // 1. VISIÓN GENERAL & SALUD MENSTRUAL FUNDAMENTAL
  // =========================================================================
  {
    id: "general-menstrual-cycle-overview",
    category: "general_health",
    title: "Fisiología General del Ciclo Menstrual y Salud Reproductiva",
    synonyms: [
      "ciclo menstrual", "salud menstrual", "salud reproductiva", "como funciona el ciclo",
      "dudas sobre mi ciclo", "dudas de mi ciclo", "mi ciclo menstrual", "duracion normal del ciclo",
      "salud de la mujer", "aparato reproductor", "fases del periodo", "entender mi ciclo",
      "salud femenina", "hormonas femeninas", "mi regla", "explicacion del ciclo"
    ],
    biologicalExplanation: "El ciclo menstrual es un proceso biológico rítmico orquestado por el eje **Hipotálamo-Hipófisis-Ovario**. En un ciclo promedio de 28 días (rango normal 21-35 días), tu cuerpo transita por 4 fases hormonales interconectadas: **Menstrual** (descamación endometrial), **Folicular** (aumento de estrógenos y maduración del óvulo), **Ovulatoria** (pico de LH y liberación del óvulo) y **Lútea** (predominio de progesterona y preparación del útero).",
    actionableSteps: [
      "Registra diariamente tus sensaciones, energía y flujo en el calendario de Pochirocho para sincronizarte con tu ritmo biológico.",
      "Adapta tu alimentación y tipo de ejercicio según tu fase actual (más fuerza en folicular, más pausa y nutrición reconfortante en lútea y menstrual).",
      "Recuerda que una variación de 2 a 4 días entre ciclos es completamente normal y saludable."
    ],
    linkedRoutines: [
      { id: "routine-py-1", name: "Secuencia Restaurativa para Cólicos", benefit: "Apertura pélvica y bienestar uterino." },
      { id: "routine-nut-1", name: "Infusión de Jengibre, Limón y Miel", benefit: "Inhibe la inflamación y reconforta el cuerpo." },
      { id: "routine-br-1", name: "Respiración Somática 4-7-8", benefit: "Equilibra el sistema nervioso autónomo en cualquier fase." }
    ],
    verifiedResources: [
      { title: "ACOG — Tu Ciclo Menstrual y Salud Hormonal", url: "https://www.acog.org/womens-health/faqs/your-menstrual-cycle", type: "web", icon: "🌐" },
      { title: "OMS — Salud Sexual y Reproductiva", url: "https://www.who.int/es/health-topics/sexual-health", type: "web", icon: "🏥" }
    ],
    redFlags: "Ciclos menores a 21 días de forma repetitiva o ausencia de menstruación por más de 90 días requieren valoración ginecológica."
  },
  {
    id: "general-period-delay-irregularity",
    category: "general_health",
    title: "Retrasos Menstruales, Irregularidad y Factores Hormonales",
    synonyms: [
      "retraso", "retraso menstrual", "se me retraso", "no me baja", "retraso de regla",
      "ciclo irregular", "por que no me baja", "periodo retrasado", "cuantos dias de retraso",
      "mi regla no llega", "retraso con prueba negativa", "mi periodo es irregular", "retraso por estres"
    ],
    biologicalExplanation: "Un retraso en la menstruación ocurre principalmente porque la **ovulación se retrasó o no ocurrió (ciclo anovulatorio)**. El eje hormonal es sumamente sensible al **cortisol (estrés)**, cambios de huso horario, desvelos, restricción calórica, variaciones de peso o procesos inflamatorios transitorios.",
    actionableSteps: [
      "Si tuviste relaciones sexuales sin protección en las últimas 3 semanas, realiza una prueba de embarazo en orina a partir del primer día de retraso.",
      "Si la prueba es negativa, dale espacio a tu cuerpo: reduce estresores, mantén comidas calientes y aplica calor en la pelvis.",
      "Practica respiración diafragmática para enviar señales de seguridad al hipotálamo y permitir que se reactive la cascada hormonal."
    ],
    linkedRoutines: [
      { id: "routine-br-1", name: "Respiración Somática 4-7-8", benefit: "Reduce el cortisol que frena la señal hipotalámica." },
      { id: "routine-nut-3", name: "Té Premenstrual de Manzanilla y Menta", benefit: "Calma la tensión pélvica y el estrés visceral." }
    ],
    verifiedResources: [
      { title: "Mayo Clinic — Retrasos Menstruales e Irregularidad", url: "https://www.mayoclinic.org/es/healthy-lifestyle/womens-health/in-depth/menstrual-cycle/art-20046008", type: "web", icon: "🏥" }
    ],
    redFlags: "Retrasos recurrentes de más de 15 días o sangrados irregulares intermenstruales ameritan ecografía transvaginal y perfil hormonal."
  },
  {
    id: "general-bleeding-flow-characteristics",
    category: "general_health",
    title: "Características del Sangrado Menstrual (Color, Flujo y Coágulos)",
    synonyms: [
      "sangrado abundante", "flujo menstrual", "sangrado marron", "coagulos", "color de la sangre",
      "flujo escaso", "sangre oscura", "sangre roja brillante", "cuanto es normal sangrar",
      "color de mi regla", "sangre espesa", "manchado marron antes de la regla"
    ],
    biologicalExplanation: "El color del sangrado indica la velocidad de tránsito del flujo: **rojo brillante** refleja salida rápida y fresca; **marrón u oscuro** indica sangre oxidada de flujo lento (común al inicio o final del período). Los coágulos pequeños (< 2 cm) son normales por acción de las enzimas anticoagulantes uterinas saturadas.",
    actionableSteps: [
      "El volumen normal por ciclo oscila entre 30 y 80 ml (aprox. 3 a 6 compresas o tampones llenos al día).",
      "Para sangrados abundantes, repón hierro y vitamina C (espinacas, lentejas, fresas, cítricos) para evitar anemia y fatiga.",
      "Mantén calor constante en la zona baja de la espalda y reposo en días de mayor sangrado."
    ],
    linkedRoutines: [
      { id: "routine-nut-1", name: "Infusión de Jengibre, Limón y Miel", benefit: "Regula el tono vascular y disminuye la pérdida excesiva de sangre." },
      { id: "routine-nut-4", name: "Smoothie Antiinflamatorio de Fresa y Plátano", benefit: "Aporte de vitamina C para optimizar la absorción de hierro." }
    ],
    verifiedResources: [
      { title: "ACOG — Sangrado Menstrual Excesivo (Menorragia)", url: "https://www.acog.org/womens-health/faqs/heavy-menstrual-bleeding", type: "web", icon: "🌐" }
    ],
    redFlags: "Empapar una compresa cada hora por más de 2 horas seguidas, mareos al ponerte de pie o coágulos del tamaño de una pelota de golf requieren atención médica."
  },
  {
    id: "general-pms-mood-emotions",
    category: "mental_emotional",
    title: "Salud Emocional, Ansiedad y Cambios de Humor en el SPM",
    synonyms: [
      "cambios de humor", "estoy triste", "irritabilidad", "llorar por todo", "ansiedad premenstrual",
      "spm emocional", "emociones en el ciclo", "depresion antes de la regla", "sensible antes de la regla",
      "lloro por nada", "ira antes del periodo", "tristeza menstrual"
    ],
    biologicalExplanation: "En la fase lútea tardía, la caída en picada de **estrógenos y progesterona** arrastra los niveles de **serotonina y GABA** en el sistema límbico. Esto sensibiliza la amígdala cerebral, haciéndote más vulnerable a la tristeza, irritabilidad o llanto espontáneo.",
    actionableSteps: [
      "Consume carbohidratos complejos (avena tibia, plátano, camote) que facilitan el paso del aminoácido triptófano al cerebro para sintetizar serotonina.",
      "Evita cafeína y alcohol en la semana previa a la regla, ya que sobreestimulan las vías noradrenérgicas de ansiedad.",
      "Date permiso de descansar sin culpa: tu cerebro está atravesando una reconfiguración neuroquímica transitoria."
    ],
    linkedRoutines: [
      { id: "routine-nut-5", name: "Bowl de Avena Tibia con Canela y Manzana", benefit: "Estabiliza la glucosa y eleva la serotonina naturalmente." },
      { id: "routine-br-1", name: "Respiración Somática 4-7-8", benefit: "Estimula el nervio vago y calma la reactividad emocional." },
      { id: "routine-aud-4", name: "Ruido Marrón Profundo con Crujidos ASMR", benefit: "Enmascara estímulos y promueve descanso mental." }
    ],
    verifiedResources: [
      { title: "Mayo Clinic — Síndrome Premenstrual y Estado de Ánimo", url: "https://www.mayoclinic.org/es/diseases-conditions/premenstrual-syndrome/symptoms-causes/syc-20376780", type: "web", icon: "🏥" }
    ],
    redFlags: "Si la irritabilidad o tristeza se vuelven incapacitantes con pensamientos oscuros o desesperanza, consulta a salud mental para evaluar TDPM."
  },

  // =========================================================================
  // 2. FASES DEL CICLO & HORMONAS
  // =========================================================================
  {
    id: "phase-menstrual",
    category: "hormones_phases",
    title: "Fase Menstrual (Días 1 a 5 aprox.)",
    synonyms: ["menstruacion", "periodo", "sangrado", "primer dia de regla", "fase menstrual", "bajada de la regla", "regla"],
    biologicalExplanation: "Durante esta fase, al no haber fecundación, caen abruptamente los niveles de **estrógenos y progesterona**. El endometrio se desprende y el miometrio libera **prostaglandinas PGF2α** para generar micro-contracciones que expulsan el flujo menstrual.",
    actionableSteps: [
      "Aplica calor local en la pelvis (38-40°C) durante 15 a 20 minutos para provocar vasodilatación y calmar las contracciones uterinas.",
      "Prioriza el descanso somático, hidratación tibia con infusiones de jengibre y evita entrenamientos de alto impacto.",
      "Realiza estiramientos pasivos de apertura pélvica como la Postura del Niño (Balasana) para descomprimir el sacro."
    ],
    linkedRoutines: [
      { id: "routine-py-1", name: "Secuencia Restaurativa para Cólicos", benefit: "Apertura pasiva de caderas y alivio del bajo vientre." },
      { id: "routine-nut-1", name: "Infusión de Jengibre, Limón y Miel", benefit: "Inhibe naturalmente la síntesis de prostaglandinas inflamatorias." },
      { id: "routine-br-1", name: "Respiración Somática 4-7-8", benefit: "Estimula el nervio vago y eleva el umbral de tolerancia al dolor." }
    ],
    verifiedResources: [
      { title: "ACOG — Tu Ciclo Menstrual y Cambios Fisiológicos", url: "https://www.acog.org/womens-health/faqs/your-menstrual-cycle", type: "web", icon: "🌐" }
    ],
    redFlags: "Si empapas más de una compresa o tampón por hora durante 2 horas consecutivas o expulsas coágulos mayores a una moneda, consulta a tu médica."
  },
  {
    id: "phase-follicular",
    category: "hormones_phases",
    title: "Fase Folicular (Días 6 a 13 aprox.)",
    synonyms: ["fase folicular", "estrogenos altos", "despues del periodo", "renovacion", "energia alta", "foliculo"],
    biologicalExplanation: "La hormona **FSH** estimula el desarrollo de folículos en los ovarios. Los niveles de **estrógenos (estradiol)** aumentan progresivamente, regenerando el endometrio, potenciando la energía cerebral, la síntesis de colágeno y la sensibilidad a la insulina.",
    actionableSteps: [
      "Aprovecha el pico de energía para actividades de mayor intensidad física como Pilates dinámico o entrenamiento de fuerza.",
      "Incorpora alimentos ricos en proteínas limpias y vegetales crucíferos (brócoli, rúcula) que ayudan al hígado a metabolizar adecuadamente los estrógenos.",
      "Inicia el ciclado de semillas (*Seed Cycling*): 1 cucharada diaria de semillas de lino y calabaza molidas."
    ],
    linkedRoutines: [
      { id: "routine-py-3", name: "Yoga Suave de Apertura Pélvica", benefit: "Potencia la flexibilidad y la circulación pélvica en ascenso." },
      { id: "routine-nut-4", name: "Smoothie Antiinflamatorio de Fresa y Plátano", benefit: "Aporte antioxidante y vitamina C para la síntesis celular." }
    ],
    verifiedResources: [
      { title: "Mayo Clinic — Fisiología de la Fase Folicular", url: "https://www.mayoclinic.org/es/healthy-lifestyle/womens-health/in-depth/menstrual-cycle/art-20046008", type: "web", icon: "🏥" }
    ],
    redFlags: "Foliculogénesis prolongada con ciclos mayores a 45 días de forma recurrente requiere evaluación médica para descartar anovulación."
  },
  {
    id: "phase-ovulatory",
    category: "hormones_phases",
    title: "Fase Ovulatoria (Días 14 a 16 aprox.)",
    synonyms: ["ovulacion", "ovular", "pico de lh", "ventana fertil", "dia 14", "moco clara de huevo", "mittelschmerz", "dolor de ovulacion"],
    biologicalExplanation: "Un pico masivo de la hormona **LH (Luteinizante)** provoca la ruptura del folículo dominante y la liberación del óvulo hacia la trompa de Falopio. Los estrógenos alcanzan su punto máximo y la testosterona tiene un leve repunte, elevando la libido y la confianza.",
    actionableSteps: [
      "Observa el moco cervical: se vuelve transparente, elástico y resbaladizo (tipo clara de huevo), indicando máxima fertilidad biológica.",
      "Si sientes una ligera punzada unilateral en el ovario (*Mittelschmerz*), es la distensión folicular normal de la ovulación.",
      "Mantén buena hidratación y ejercicios de movilidad de cadera para facilitar el tránsito tubárico."
    ],
    linkedRoutines: [
      { id: "routine-st-1", name: "Estiramientos Suaves de Cadera y Lumbar", benefit: "Libera tensión en el psoas ilíaco y la articulación sacroilíaca." },
      { id: "routine-aud-5", name: "Naturaleza: Río Cristalino y Canto de Aves", benefit: "Acompañamiento relajante para mantener el balance parasimpático." }
    ],
    verifiedResources: [
      { title: "ACOG — Ovulación y Fertilidad", url: "https://www.acog.org/womens-health/faqs/evaluating-infertility", type: "web", icon: "🌐" }
    ],
    redFlags: "Dolor pélvico agudo e incapacitante durante la mitad del ciclo que impida caminar debe ser evaluado para descartar torsión ovárica o quiste hemorrágico."
  },
  {
    id: "phase-luteal",
    category: "hormones_phases",
    title: "Fase Lútea y Premenstrual (Días 17 a 28 aprox.)",
    synonyms: ["fase lutea", "fase lútea", "progesterona", "spm", "sindrome premenstrual", "antes de la regla", "dias previos", "antojos", "retencion de liquidos"],
    biologicalExplanation: "El folículo vacío se convierte en el **cuerpo lúteo**, secretando grandes cantidades de **progesterona**. Esta hormona eleva ligeramente la temperatura basal y calma el sistema nervioso. Si no hay embarazo, el cuerpo lúteo degenera, cayendo la progesterona y dando paso al SPM.",
    actionableSteps: [
      "Prioriza carbohidratos complejos de digestión lenta (avena, camote, arroz integral) para sostener la producción de serotonina.",
      "Añade magnesio glicinato (300-400 mg) para prevenir cólicos tempranos, retención de líquidos y mejorar la calidad del sueño.",
      "Practica rutinas somáticas lentas, respiración 4-7-8 y automasajes pélvicos con calor."
    ],
    linkedRoutines: [
      { id: "routine-nut-5", name: "Bowl de Avena Tibia con Canela y Manzana", benefit: "Estabiliza la glucosa y aporta magnesio para evitar cambios de humor." },
      { id: "routine-mt-1", name: "Masaje Circular Abdominal con Fricción", benefit: "Estimula la circulación pélvica y previene calambres premenstruales." },
      { id: "routine-aud-4", name: "Ruido Marrón Profundo con Crujidos ASMR", benefit: "Calma la hiperexcitabilidad cortical y el insomnio de fase lútea." }
    ],
    verifiedResources: [
      { title: "Mayo Clinic — Síndrome Premenstrual (SPM)", url: "https://www.mayoclinic.org/es/diseases-conditions/premenstrual-syndrome/symptoms-causes/syc-20376780", type: "web", icon: "🏥" }
    ],
    redFlags: "Cambios de humor extremos con depresión severa, desesperanza o ideación autolítica requieren evaluación por Trastorno Disfórico Premenstrual (TDPM)."
  },

  // =========================================================================
  // 3. SÍNTOMAS FÍSICOS & DISMENORREA
  // =========================================================================
  {
    id: "symptom-dysmenorrhea",
    category: "symptoms_pain",
    title: "Cólicos Menstruales y Dismenorrea",
    synonyms: ["colicos", "cólicos", "dolor de vientre", "dolor de ovarios", "dolor bajo vientre", "punzadas menstruales", "espasmos uterinos", "retortijones"],
    biologicalExplanation: "El endometrio en descamación sintetiza **prostaglandinas PGF2α**, lípidos que inducen contracciones espasmódicas del miometrio para expulsar la sangre. La vasoconstricción temporal causa isquemia tisular transitoria, lo que activa los nociceptores pélvicos (dolor).",
    actionableSteps: [
      "**Termoterapia (38-40°C):** El calor continuo sobre el pubis dilata los vasos uterinos, aumentando el flujo sanguíneo y reduciendo el dolor con la misma eficacia que un AINE de venta libre.",
      "**Jengibre Terapéutico:** Tomar 1 taza de infusión concentrada de jengibre fresco al inicio del dolor inhibe la ciclooxigenasa (COX-2) reduciendo prostaglandinas.",
      "**Respiración Diafragmática:** Infla el abdomen al inhalar para masajear las vísceras pélvicas y desactivar el reflejo simpático de contracción."
    ],
    linkedRoutines: [
      { id: "routine-py-1", name: "Secuencia Restaurativa para Cólicos", benefit: "Posturas pasivas que reducen la presión intrauterina." },
      { id: "routine-nut-1", name: "Infusión Concentrada de Jengibre y Limón", benefit: "Antiinflamatorio somático que frena las prostaglandinas." },
      { id: "routine-mt-1", name: "Masaje Circular Abdominal con Fricción", benefit: "Rompe el patrón espasmódico mediante contacto táctil cálido." }
    ],
    verifiedResources: [
      { title: "ACOG — Dismenorrea (Períodos Menstruales Dolorosos)", url: "https://www.acog.org/womens-health/faqs/dysmenorrhea-painful-periods", type: "web", icon: "🌐" }
    ],
    redFlags: "Dolor que no cede con analgésicos comunes, que empeora progresivamente cada mes o que produce desmayos debe ser investigado por endometriosis."
  },
  {
    id: "symptom-low-back-pain",
    category: "symptoms_pain",
    title: "Dolor Lumbar y Tensión en la Zona Sacra",
    synonyms: ["dolor de espalda", "dolor lumbar", "dolor de cintura", "espalda baja", "sacro", "ciatica menstrual", "punzadas en la espalda"],
    biologicalExplanation: "Los nervios que inervan el útero y el cuello uterino comparten las mismas raíces espinales (T10-L1 y S2-S4) que la región lumbar y sacra. Esto produce **dolor referido**, contracturando la musculatura paravertebral y los ligamentos uterosacros.",
    actionableSteps: [
      "Coloca un cojín o botella de agua tibia en la zona baja de la espalda mientras estás sentada o recostada de lado en posición fetal.",
      "Realiza el estiramiento 'Gato-Vaca' muy suave y la postura de 'Balasana con rodillas abiertas' para descompresión lumbar.",
      "Aplica automasaje con los nudillos en los laterales del sacro realizando pequeños círculos de presión moderada."
    ],
    linkedRoutines: [
      { id: "routine-st-2", name: "Descompresión Suave Lumbar y Cadera", benefit: "Alivia la tracción de los ligamentos uterosacros en la columna." },
      { id: "routine-mt-2", name: "Masaje Lumbosacro y Puntos Gatillo", benefit: "Desactiva los puntos de tensión en los glúteos y zona sacra." }
    ],
    verifiedResources: [
      { title: "Mayo Clinic — Dolor de Espalda durante el Período", url: "https://www.mayoclinic.org/es/diseases-conditions/back-pain/symptoms-causes/syc-20369906", type: "web", icon: "🏥" }
    ],
    redFlags: "Dolor irradiado por la pierna con pérdida de sensibilidad o fuerza motora en el pie requiere evaluación neurológica."
  },
  {
    id: "symptom-breast-tenderness",
    category: "symptoms_pain",
    title: "Dolor y Tensión en los Senos (Mastalgia Cíclica)",
    synonyms: ["dolor de senos", "senos hinchados", "dolor de pechos", "pechos sensibles", "pesadez en el busto", "dolor mamario", "tetas hinchadas"],
    biologicalExplanation: "En la fase lútea, la **progesterona** estimula los acinos glandulares y los **estrógenos** dilatan los conductos mamarios, provocando edema intersticial y retención hídrica en el estroma mamario.",
    actionableSteps: [
      "Usa un sujetador cómodo sin aros que ofrezca buen soporte para reducir el movimiento y la tracción ligamentosa de Cooper.",
      "Reduce temporalmente el consumo de café, té negro, bebidas energéticas y exceso de sal (la metilxantina y el sodio empeoran la turgencia).",
      "Consume alimentos ricos en vitamina E y ácidos grasos esenciales (nueces, semillas de girasol, aguacate)."
    ],
    linkedRoutines: [
      { id: "routine-br-1", name: "Respiración Somática 4-7-8", benefit: "Disminuye la sensibilidad simpática y relaja la caja torácica." },
      { id: "routine-nut-5", name: "Bowl de Avena con Manzana y Canela", benefit: "Aporte de magnesio para drenaje intersticial y saciedad." }
    ],
    verifiedResources: [
      { title: "Mayo Clinic — Dolor Mamario (Mastalgia)", url: "https://www.mayoclinic.org/es/diseases-conditions/breast-pain/symptoms-causes/syc-20350423", type: "web", icon: "🏥" }
    ],
    redFlags: "Bultos duros asimétricos fijos que no varían con el ciclo, piel de naranja o secreción sanguinolenta por el pezón requieren ecografía o mamografía."
  },
  {
    id: "symptom-headache-migraine",
    category: "symptoms_pain",
    title: "Migrañas y Dolores de Cabeza Menstruales",
    synonyms: ["dolor de cabeza", "migraña menstrual", "jaqueca", "cefalea catamenial", "dolor de sienes", "cabeza pesada"],
    biologicalExplanation: "Ocurren típicamente en los 2 días previos al período o durante los primeros días debido a la **caída brusca de estrógenos**, lo que altera la regulación de serotonina cerebral y sensibiliza el sistema trigeminovascular.",
    actionableSteps: [
      "Aplica compresas frías en la frente o base del cuello y descansa en una habitación oscura y silenciosa.",
      "Mantén niveles estables de glucosa evitando ayunos prolongados y consume magnesio (300-500 mg) que estabiliza la reactividad vascular.",
      "Escucha frecuencias de relajación o ruido marrón para amortiguar la hipersensibilidad acústica."
    ],
    linkedRoutines: [
      { id: "routine-aud-4", name: "Ruido Marrón Profundo con Crujidos ASMR", benefit: "Enmascara estímulos y favorece el reposo sensorial." },
      { id: "routine-br-4", name: "Respiración Nadi Shodhana (Fosas Alternadas)", benefit: "Equilibra la hemodinámica cerebral y calma la tensión cefálica." }
    ],
    verifiedResources: [
      { title: "Mayo Clinic — Dolores de Cabeza y Hormonas Femeninas", url: "https://www.mayoclinic.org/es/diseases-conditions/chronic-daily-headaches/in-depth/headaches-and-hormones/art-20047524", type: "web", icon: "🏥" }
    ],
    redFlags: "Cefalea explosiva de inicio súbito ('la peor de tu vida'), visión doble o debilidad en un lado del cuerpo son signos de alarma que requieren urgencias."
  },
  {
    id: "symptom-bloating-digestion",
    category: "symptoms_pain",
    title: "Hinchazón Abdominal y Cambios Digestivos",
    synonyms: ["hinchazon", "inflamacion", "gases", "barriga hinchada", "distension abdominal", "estrenimiento", "diarrea menstrual", "digestion lenta"],
    biologicalExplanation: "La **progesterona** relaja la musculatura lisa de todo el cuerpo, incluyendo el tracto gastrointestinal (haciendo el tránsito más lento y reteniendo gases en la fase lútea). Al iniciar la regla, las **prostaglandinas** pueden pasar al intestino provocando heces más sueltas.",
    actionableSteps: [
      "Bebe agua tibia con limón o infusión de manzanilla y menta para favorecer la expulsión de gases y reducir espasmos viscerales.",
      "Evita bebidas carbonatadas, edulcorantes artificiales (sorbitol, maltitol) y exceso de legumbres sin remojar durante estos días.",
      "Realiza automasaje abdominal en el sentido de las agujas del reloj (siguiendo el recorrido del colon ascendente, transverso y descendente)."
    ],
    linkedRoutines: [
      { id: "routine-nut-3", name: "Té Premenstrual de Manzanilla y Menta", benefit: "Propiedades antiespasmódicas y carminativas naturales." },
      { id: "routine-mt-1", name: "Masaje Circular Abdominal con Fricción", benefit: "Promueve el drenaje linfático visceral y el tránsito intestinal." }
    ],
    verifiedResources: [
      { title: "Mayo Clinic — Distensión y Molestias Digestivas", url: "https://www.mayoclinic.org/es/diseases-conditions/gas-and-gas-pains/symptoms-causes/syc-20372709", type: "web", icon: "🏥" }
    ],
    redFlags: "Distensión dura y dolorosa con vómitos persistentes o incapacidad total para expulsar gases requiere evaluación médica."
  },

  // =========================================================================
  // 4. FERTILIDAD & REPRODUCCIÓN
  // =========================================================================
  {
    id: "fertility-ovulation-window",
    category: "fertility_ovulation",
    title: "Ventana Fértil y Probabilidad de Embarazo",
    synonyms: ["quedar embarazada", "embarazo", "probabilidad de embarazo", "puedo quedar embarazada", "dias fertiles", "ventana fertil", "cuando puedo ovular", "fertilidad"],
    biologicalExplanation: "La ventana fértil abarca aproximadamente **6 días**: los 5 días previos a la ovulación más el día de la ovulación misma. Esto se debe a que los espermatozoides pueden sobrevivir de 3 a 5 días en las criptas del cuello uterino si existe moco cervical fértil, mientras que el óvulo vive entre 12 y 24 horas tras ser liberado.",
    actionableSteps: [
      "Revisa la tarjeta de predicción en tu Dashboard: nuestro modelo Kalman proyecta tu ventana fértil con intervalos de confianza.",
      "Monitorea el moco cervical: cuando adquiere textura elástica, transparente y resbaladiza (filante), la fertilidad es máxima.",
      "Ten presente que el estrés, viajes o enfermedades pueden retrasar la ovulación sin previo aviso, desplazando la ventana fértil."
    ],
    linkedRoutines: [
      { id: "routine-py-3", name: "Yoga Suave de Apertura Pélvica", benefit: "Optimiza la circulación hacia los órganos reproductivos." }
    ],
    verifiedResources: [
      { title: "ACOG — Planificación del Embarazo y Días Fértiles", url: "https://www.acog.org/womens-health/faqs/planning-your-pregnancy", type: "web", icon: "🌐" },
      { title: "OMS — Salud Reproductiva y Fertilidad", url: "https://www.who.int/es/news-room/fact-sheets/detail/infertility", type: "web", icon: "🏥" }
    ],
    redFlags: "Si buscas embarazo y no lo consigues tras 12 meses de relaciones regulares sin protección (o 6 meses si tienes más de 35 años), consulta a fertilidad."
  },
  {
    id: "fertility-implantation-bleeding",
    category: "fertility_ovulation",
    title: "Sangrado de Implantación vs Menstruación",
    synonyms: ["sangrado de implantacion", "manchado marron", "sangrado leve", "sera embarazo", "mancha rosa", "implantacion", "retraso con manchado"],
    biologicalExplanation: "El sangrado de implantación ocurre en un tercio de los embarazos cuando el blastocisto se adhiere a la pared endometrial rica en capilares sanguíneos (aprox. 6 a 12 días post-fecundación). A diferencia de la regla, es muy escaso (gotitas rosadas o marrones), no tiene coágulos y dura de 24 a 48 horas.",
    actionableSteps: [
      "Compara con tu menstruación habitual: el sangrado de implantación no aumenta de volumen ni empapa una toalla sanitaria.",
      "Para confirmar con certeza, realiza una prueba de embarazo en orina (hCG) a partir del primer día de retraso de tu fecha esperada de regla.",
      "Evita el consumo de alcohol, tabaco o antiinflamatorios si sospechas de una posible concepción."
    ],
    linkedRoutines: [
      { id: "routine-br-1", name: "Respiración Somática 4-7-8", benefit: "Calma la ansiedad y reduce el cortisol durante la espera de resultados." }
    ],
    verifiedResources: [
      { title: "Mayo Clinic — Sangrado de Implantación", url: "https://www.mayoclinic.org/es/healthy-lifestyle/pregnancy-week-by-week/expert-answers/implantation-bleeding/faq-20058257", type: "web", icon: "🏥" }
    ],
    redFlags: "Sangrado abundante acompañado de dolor pélvico punzante lateral intenso puede sugerir un embarazo ectópico y requiere atención médica inmediata."
  },

  // =========================================================================
  // 5. ANTICONCEPCIÓN & MEDICAMENTOS
  // =========================================================================
  {
    id: "contraception-missed-pill",
    category: "contraception_meds",
    title: "Anticonceptivos Orales y Olvido de Tomas",
    synonyms: ["olvide la pastilla", "se me olvido la pastilla", "pastilla anticonceptiva", "anticonceptivos", "pildora", "tome tarde la pastilla", "que pasa si olvido"],
    biologicalExplanation: "Las píldoras combinadas (estrógeno + progestágeno) suprimen el pico de LH impidiendo la ovulación y espesan el moco cervical. El riesgo de escape ovulatorio tras un olvido depende de la semana del blíster (la primera y tercera semana son las de mayor criticidad).",
    actionableSteps: [
      "**Menos de 12 horas de retraso:** Tómala inmediatamente; la protección anticonceptiva se mantiene.",
      "**Más de 12 horas (o más de 1 pastilla):** Toma la última pastilla olvidada de inmediato (aunque tomes 2 juntas) y utiliza método de barrera (preservativo) durante los siguientes 7 días.",
      "Si el olvido ocurrió en la semana 1 y tuviste relaciones sin protección en los 5 días previos, consulta la necesidad de anticoncepción de emergencia."
    ],
    linkedRoutines: [
      { id: "routine-br-2", name: "Respiración Cuadrada (Box Breathing)", benefit: "Restaura el enfoque mental y disipa la alarma simpática." }
    ],
    verifiedResources: [
      { title: "ACOG — Píldoras Anticonceptivas y Guía de Olvidos", url: "https://www.acog.org/womens-health/faqs/combined-hormonal-birth-control", type: "web", icon: "🌐" }
    ],
    redFlags: "Síntomas como dolor severo en pantorrillas, dificultad respiratoria súbita o dolor torácico tomando anticonceptivos combinados requieren urgencias médicas."
  },
  {
    id: "contraception-emergency-pill",
    category: "contraception_meds",
    title: "Pastilla de Emergencia (Postday / Levonorgestrel)",
    synonyms: ["pastilla del dia despues", "postday", "pastilla de emergencia", "levonorgestrel", "pildora de emergencia", "tome la postday"],
    biologicalExplanation: "Contiene una dosis concentrada de progestágeno (Levonorgestrel) o modulador de receptores de progesterona (Acetato de Ulipristal) que **retrasa o inhibe la ovulación** para evitar el encuentro entre óvulo y espermatozoide. No es abortiva ni interrumpe una implantación ya consolidada.",
    actionableSteps: [
      "Debe tomarse lo antes posible tras la relación sin protección (máxima eficacia dentro de las primeras 24-72 horas).",
      "Es común que altere temporalmente el ciclo actual, adelantando o retrasando la regla entre 3 y 7 días.",
      "Si vomitas dentro de las 2 horas posteriores a la toma, debes repetir la dosis ya que el principio activo no se habrá absorbido."
    ],
    linkedRoutines: [
      { id: "routine-nut-1", name: "Infusión de Jengibre y Limón", benefit: "Calma las posibles náuseas secundarias al progestágeno concentrado." }
    ],
    verifiedResources: [
      { title: "OMS — Anticoncepción de Urgencia", url: "https://www.who.int/es/news-room/fact-sheets/detail/emergency-contraception", type: "web", icon: "🌐" }
    ],
    redFlags: "Retraso superior a más de 10 días tras la fecha esperada requiere realizar prueba de embarazo."
  },

  // =========================================================================
  // 6. CONDICIONES GINECOLÓGICAS FRECUENTES
  // =========================================================================
  {
    id: "condition-pcos",
    category: "medical_conditions",
    title: "Síndrome de Ovario Poliquístico (SOP)",
    synonyms: ["sop", "sindrome de ovario poliquistico", "ovarios poliquisticos", "resistencia a la insulina", "acne hormonal", "vellos", "hirsutismo", "regla irregular"],
    biologicalExplanation: "Es un desorden endocrino-metabólico caracterizado por disfunción ovulatoria (anovulación/oligomenorrea), hiperandrogenismo (acné, hirsutismo) y presencia de múltiples folículos antrales detenidos en ecografía. Frecuentemente se asocia a **resistencia a la insulina**.",
    actionableSteps: [
      "Prioriza una alimentación antiinflamatoria de bajo índice glucémico rica en fibra, proteínas y grasas saludables.",
      "El ejercicio de fuerza y caminatas diarias mejoran directamente los transportadores GLUT-4 en el músculo, bajando la insulina.",
      "Consulta con tu médica o ginecóloga sobre suplementos como el **Mio-Inositol y D-Quiro-Inositol (ratio 40:1)** para favorecer la ovulación espontánea."
    ],
    linkedRoutines: [
      { id: "routine-nut-2", name: "Snack de Manzana con Mantequilla de Maní", benefit: "Grasas y fibra que estabilizan la glucosa postprandial." },
      { id: "routine-py-3", name: "Yoga Suave de Apertura Pélvica", benefit: "Reduce el cortisol que compite con la producción hormonal ovárica." }
    ],
    verifiedResources: [
      { title: "ACOG — Síndrome de Ovario Poliquístico (SOP)", url: "https://www.acog.org/womens-health/faqs/polycystic-ovary-syndrome-pcos", type: "web", icon: "🌐" }
    ],
    redFlags: "Periodos ausentes por más de 90 días requieren consulta para inducir sangrado y proteger el endometrio de hiperplasia."
  },
  {
    id: "condition-endometriosis",
    category: "medical_conditions",
    title: "Endometriosis y Adenomiosis",
    synonyms: ["endometriosis", "adenomiosis", "dolor incapacitante", "dolor en las relaciones", "dolor al orinar", "dolor al defecar con la regla", "adherencias"],
    biologicalExplanation: "Presencia de tejido similar al endometrio fuera de la cavidad uterina (en ovarios, peritoneo, ligamentos o intestino). Este tejido responde a los cambios hormonales cíclicos, sangrando e induciendo inflamación crónica, fibrosis y adherencias neurogénicas.",
    actionableSteps: [
      "Aplica calor constante y posturas somáticas que reduzcan la presión en el suelo pélvico (Postura del Niño, Piernas en la Pared).",
      "Nutrición rica en polifenoles, cúrcuma y ácidos grasos Omega-3 (EPA/DHA) para modular las citoquinas inflamatorias (IL-6, TNF-alfa).",
      "Lleva un registro minucioso de tus síntomas en Pochirocho para presentar un informe objetivo a tu especialista en endometriosis."
    ],
    linkedRoutines: [
      { id: "routine-py-1", name: "Secuencia Restaurativa para Cólicos", benefit: "Descomprime el paquete neurovascular pélvico sin esfuerzo abdominal." },
      { id: "routine-mt-2", name: "Masaje Lumbosacro y Puntos Gatillo", benefit: "Modula los puntos miofasciales de dolor referido pélvico." },
      { id: "routine-aud-1", name: "ASMR Tapping en Caja de Cartón", benefit: "Desvía el foco de atención nociceptivo mediante estimulación sensorial." }
    ],
    verifiedResources: [
      { title: "OMS — Datos y Cifras sobre la Endometriosis", url: "https://www.who.int/es/news-room/fact-sheets/detail/endometriosis", type: "web", icon: "🌐" },
      { title: "ACOG — Endometriosis y Manejo del Dolor", url: "https://www.acog.org/womens-health/faqs/endometriosis", type: "web", icon: "🏥" }
    ],
    redFlags: "Dolor pélvico severo invalidante con sangrado rectal cíclico o hematuria durante la menstruación requiere valoración multidisciplinar urgente."
  },

  // =========================================================================
  // 7. NUTRICIÓN SOMÁTICA & FITOTERAPIA
  // =========================================================================
  {
    id: "nutrition-seed-cycling",
    category: "nutrition_herbs",
    title: "Ciclado de Semillas (Seed Cycling) para Equilibrio Hormonal",
    synonyms: ["seed cycling", "ciclado de semillas", "semillas de lino", "semillas de calabaza", "semillas de sesamo", "semillas de girasol", "remedios naturales"],
    biologicalExplanation: "Estrategia nutricional que aporta micronutrientes, ácidos grasos esenciales y lignanos específicos en cada fase: en folicular favorece el metabolismo estrogénico mediante lignanos y zinc; en lútea apoya la síntesis de progesterona mediante selenio, vitamina E y ácidos grasos.",
    actionableSteps: [
      "**Fase Folicular y Ovulatoria (Días 1 a 14):** 1 cucharada diaria de semillas de lino + 1 cucharada de semillas de calabaza (molidas frescas).",
      "**Fase Lútea (Días 15 a 28):** 1 cucharada diaria de semillas de sésamo (ajonjolí) + 1 cucharada de semillas de girasol (molidas).",
      "Añádelas a tu avena tibia, smoothies o ensaladas."
    ],
    linkedRoutines: [
      { id: "routine-nut-5", name: "Bowl de Avena Tibia con Canela y Manzana", benefit: "Base ideal para incorporar las semillas molidas del día." }
    ],
    verifiedResources: [
      { title: "ACOG — Nutrición y Salud Hormonal", url: "https://www.acog.org/womens-health/faqs/nutrition-during-pregnancy", type: "web", icon: "🌐" }
    ],
    redFlags: "Si presentas alergias a semillas o frutos secos, sustituye por suplementación de omega-3 y zinc supervisada."
  },
  {
    id: "nutrition-magnesium-benefits",
    category: "nutrition_herbs",
    title: "El Rol del Magnesio en la Salud Menstrual",
    synonyms: ["magnesio", "glicinato de magnesio", "citrato de magnesio", "suplementos para colicos", "que tomar para el dolor"],
    biologicalExplanation: "El magnesio actúa como un antagonista natural del calcio a nivel del miometrio, impidiendo la contracción tetánica excesiva del músculo liso uterino. Además, modula el receptor NMDA en el sistema nervioso central, reduciendo la ansiedad y el insomnio premenstrual.",
    actionableSteps: [
      "Prioriza formas biodisponibles como el **Glicinato de Magnesio** (ideal para relajación y sueño) o **Citrato de Magnesio** (apoya digestión).",
      "Aporta magnesio dietético con cacao puro 85%+, semillas de calabaza, almendras, espinacas cocidas y avena integral.",
      "Consúmelo preferentemente 30 minutos antes de dormir durante la segunda mitad de tu ciclo."
    ],
    linkedRoutines: [
      { id: "routine-nut-2", name: "Snack de Manzana con Mantequilla de Maní", benefit: "Fuente natural de magnesio vegetal y grasas saludables." },
      { id: "routine-aud-7", name: "Sonidos de Lluvia en la Ventana para Dormir", benefit: "Sinergia acústica para potenciar la relajación del magnesio." }
    ],
    verifiedResources: [
      { title: "Mayo Clinic — Suplementos de Magnesio y Beneficios", url: "https://www.mayoclinic.org/es/drugs-supplements/magnesium-supplement-oral-route-parenteral-route/description/drg-20070730", type: "web", icon: "🏥" }
    ],
    redFlags: "Pacientes con insuficiencia renal deben consultar a su nefróloga antes de suplementar magnesio."
  }
];
