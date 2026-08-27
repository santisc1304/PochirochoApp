# Investigación Técnica y Clínica: Apps de Seguimiento del Ciclo Menstrual (Benchmark Flo, Clue y Estado del Arte)

> **Fecha de creación:** Julio 2026  
> **Proyecto:** Tracker del Ciclo Menstrual para iOS (iPhone)  
> **Propósito:** Documento de investigación exhaustivo para el análisis de funcionalidades, algoritmos de predicción, evaluación de riesgo de embarazo, registro de síntomas y estrategias de mitigación del dolor.

---

## 1. Introducción y Objetivos de la Investigación

El seguimiento de la salud menstrual y reproductiva a través de aplicaciones móviles ha evolucionado significativamente, pasando de simples calendarios de conteo a sofisticados sistemas bioanalíticos alimentados por algoritmos predictivos e inteligencia artificial. Aplicaciones líderes como **Flo**, **Clue**, **Natural Cycles** y **Stardust** atienden a millones de usuarias en todo el mundo.

El objetivo de este documento es recopilar, analizar y sistematizar los principios científicos, médicos, algorítmicos y de experiencia de usuario (UX/UI) que utilizan estas aplicaciones para:
1. Predecir con alta exactitud las fechas del ciclo menstrual y la ovulación.
2. Determinar la ventana fértil y evaluar el riesgo estimado de embarazo.
3. Registrar múltiples dimensiones de salud (flujo, sexo protegido/no protegido, dolor, ánimo, biomarcadores).
4. Ofrecer recomendaciones clínicas comprobadas para mitigar el dolor menstrual (dismenorrea) y premenstrual (SPM).
5. Proporcionar orientación holística según la fase fisiológica del ciclo.
6. Garantizar la máxima privacidad de datos íntimos en dispositivos iOS (iPhone).

---

## 2. Análisis Comparativo de Apps Líderes

### 2.1 Flo Health
- **Enfoque Principal:** Salud integral femenina, algoritmos basados en Machine Learning (ML), personalización mediante inteligencia artificial y contenidos educativos supervisados por médicos.
- **Puntos Fuertes:**
  - Formulario inicial (Onboarding) sumamente detallado que ajusta el modelo base al perfil de la usuaria.
  - Registro de más de 50 síntomas distribuidos en categorías intuitivas.
  - Detección de patrones mediante gráficos correlacionales (ej. relación entre estrés y retrasos del ciclo).
  - Algoritmo adaptable que re-calcula las proyecciones en tiempo real según los registros diarios.
- **Riesgo de Embarazo / Fertilidad:** Muestra la "Ventana Fértil" (Días de alta probabilidad) y el "Día estimado de ovulación". Deja explícito que no es un método anticonceptivo certificado.

### 2.2 Clue
- **Enfoque Principal:** Precisión científica, lenguaje médico neutro y sin estereotipos de género, alta privacidad de datos (sujeta al GDPR europeo).
- **Puntos Fuertes:**
  - Algoritmos transparentes basados en la variabilidad histórica y la desviación estándar de los ciclos.
  - Registro sin fricción mediante iconos rápidos y organizados.
  - Excelente manejo de ciclos irregulares o condiciones como PCOS (Síndrome de Ovario Poliquístico).

### 2.3 Natural Cycles
- **Enfoque Principal:** Anticoncepción digital y planificación familiar certificada (FDA Cleared / CE Mark).
- **Puntos Fuertes:**
  - Algoritmo patentado que exige la medición diaria de la **Temperatura Corporal Basal (TCB)** o sincronización con wearables (Oura Ring, Apple Watch).
  - Determina días "Rojos" (riesgo de embarazo / requiere anticoncepción) y días "Verdes" (sin riesgo).

### 2.4 Stardust
- **Enfoque Principal:** Estética moderna, privacidad reforzada ("Encryption at rest & transit / Zero-knowledge architecture") y correlación fisiológica-hormonal.

---

## 3. Algoritmos y Modelos Matemáticos para la Predicción del Ciclo

Para predecir el inicio de la siguiente menstruación y la ventana de ovulación, las aplicaciones combinan métodos estadísticos básicos con modelos dinámicos adaptativos.

```
       [ Historial de Ciclos (Días) ]
                     │
                     ▼
  [ Filtrado de Outliers (Outlier Detection) ]
                     │
                     ▼
    [ Media Móvil Ponderada / Bayesian Model ] ──► [ Predicción Fecha de Inicio ]
                     │
                     ▼
   [ Descuento Fase Lútea (Estándar 14 días / TCB) ]
                     │
                     ▼
       [ Estimación Día de Ovulación ]
                     │
                     ▼
[ Ventana Fértil: (Ovulación - 5 días) a (Ovulación + 1 día) ]
```

### 3.1 Método del Calendario Estándar y Medias Móviles Ponderadas (EMA)
- **Fórmula de Duración Media ($\bar{C}$):**  
  En lugar de un promedio aritmético simple de todos los ciclos registrados (el cual se distorsiona con ciclos anómalos), se aplica una **Media Móvil Exponencial (EMA)** que da mayor peso a los últimos 3 a 6 ciclos:
  $$\text{EMA}_t = \alpha \cdot C_t + (1 - \alpha) \cdot \text{EMA}_{t-1}$$
  Donde $C_t$ es la duración del ciclo actual, $\text{EMA}_{t-1}$ es el promedio anterior y $\alpha = \frac{2}{N+1}$ (con $N \approx 4$ ciclos).

### 3.2 Filtrado de Anomalías (Outliers)
- Se descartan ciclos que se alejan más de 2 desviaciones estándar ($\sigma$) de la media de la usuaria o aquellos menores a 21 días / mayores a 45 días (frecuentemente anovulatorios o causados por factores externos severos como enfermedad o medicación de emergencia).

### 3.3 Integración Sintotérmica (Signos Biológicos Reales)
La predicción basada únicamente en el calendario tiene un margen de error del 20-30% debido a la variación de la fase folicular. Por ello, los sistemas avanzados integran:
1. **Temperatura Corporal Basal (TCB):** Tras la ovulación, la progesterona eleva la temperatura basal entre **0.2 °C y 0.5 °C (0.4 °F - 1.0 °F)**. El algoritmo detecta el "salto térmico" sostenido durante 3 días consecutivos para confirmar que la ovulación ya ocurrió.
2. **Moco Cervical / Flujo Vaginal:** El estrógeno pico antes de la ovulación produce moco tipo "clara de huevo" (transparente, elástico, acuoso). El algoritmo adelanta/confirma la ventana de alta fertilidad al registrarse esta característica.
3. **Kits de Hormona Luteinizante (LH):** Un pico de LH en orina (resultado positivo en test) predice la ovulación en las siguientes 24-48 horas.

### 3.4 Actualización Bayesiana e Inteligencia Artificial
- Flo utiliza un modelo predictivo bayesiano donde la probabilidad a priori de la duración del ciclo se actualiza dinámicamente cada día según los síntomas registrados (ej. cambios en senos, cólicos premenstruales, cambios en la libido o test de LH).

---

## 4. Registro y Captura de Datos (ParámetrosClínicos y Estilo de Vida)

Para lograr máxima exactitud y utilidad, el módulo de registro diario debe estructurarse en categorías claras:

### 4.1 Sangrado y Flujo Menstrual
- **Intensidad:**
  - Spotting / Manchado (gotas o manchado leve)
  - Leve (requiere pocos protectores al día)
  - Moderado (flujo estándar)
  - Abundante (requiere cambio frecuente cada 2-3 horas)
  - Muy abundante / Menorragia (presencia de coágulos grandes, posible alerta de salud)
- **Propiedades:** Color (rojo brillante, oscuro/marrón, rosado), presencia de coágulos.

### 4.2 Actividad Sexual y Anticoncepción
- **Relaciones Sexuales:**
  - Sin protección (Unprotected sex)
  - Con protección (Condón, DIU, pastilla anticonceptiva, preservativo femenino, método de barrera)
  - Orgasmo / Masturbación
  - Sin sexo / Libido alta / Libido baja / Deseo sexual ausente
- **Anticonceptivos y Medicación:**
  - Píldora tomada a tiempo / Píldora olvidada
  - Anticonceptivo de emergencia (Píldora del día después - *recalcula el ciclo por alteración hormonal*)
  - DIU / Parche / Implante / Inyección

### 4.3 Síntomas Físicos y Dolor
- **Dolor / Dismenorrea:**
  - Cólicos menstruales (Sin dolor, Leve, Moderado, Severo, Incapacitante)
  - Dolor de espalda baja / Lumbalgia
  - Dolor pélvico / Mastalgia (dolor o sensibilidad en senos)
  - Dolor de cabeza / Migraña catamenial
- **Otros Síntomas Físicos:**
  - Hinchazón / Retención de líquidos (Bloating)
  - Náuseas / Trastornos digestivos (diarrea, estreñimiento)
  - Acné / Brotes en la piel
  - Fatiga / Cansancio extremo
  - Sofocos / Sudores nocturnos

### 4.4 Estados de Ánimo y Salud Mental
- **Emociones:** Tranquila, Feliz, Irritable, Ansiosa, Con altibajos emocionales (Mood swings), Triste, Estresada, Sensible.
- **Energía y Sueño:** Horas de sueño, calidad del descanso, nivel de energía (alta, media, baja).

### 4.5 Biometría y Pruebas
- Temperatura Corporal Basal (TCB en °C / °F).
- Resultado de Test de Ovulación (LH positivo / negativo).
- Resultado de Test de Embarazo (Positivo / Negativo).
- Peso y Actividad física (Pasos, ejercicio).

---

## 5. Cálculo y Evaluación del Riesgo de Embarazo (Ventana Fértil)

### 5.1 Fisiología de la Ventana Fértil
- **Duración del óvulo:** Viable durante **12 a 24 horas** tras ser liberado del ovario.
- **Supervivencia del espermatozoide:** Puede sobrevivir hasta **5 días (120 horas)** en el tracto reproductivo femenino si hay moco cervical fértil.
- **Ventana Fértil Teórica:** Comprende los **5 días previos a la ovulación + el día de la ovulación** (total: 6 días por ciclo).

### 5.2 Algoritmo de Categorización de Riesgo
Basado en el día del ciclo actual ($d$) respecto al día estimado de ovulación ($O$):

$$\text{Categoría de Riesgo} = \begin{cases} 
\text{Máximo / Pico de Fertilidad} & \text{si } d \in [O-1, O] \\
\text{Alto Riesgo} & \text{si } d \in [O-5, O-2] \text{ o } d = O+1 \\
\text{Medio Riesgo} & \text{si } d \in [O-7, O-6] \\
\text{Bajo Riesgo} & \text{resto del ciclo} 
\end{cases}$$

If sex is logged:
- **Sexo Sin Protección + Días de Alto/Pico Riesgo:** Eleva el indicador visual a **"Riesgo de Embarazo Elevado"**.
- **Uso de Anticonceptivo de Emergencia:** Notifica sobre el posible retraso u alteración del ciclo subsiguiente.

### 5.3 Consideración Médica y Legal Obligatoria
Ninguna aplicación de ciclo (salvo las certificadas como dispositivo médico anticonceptivo como Natural Cycles) debe comercializarse como método anticonceptivo. La app debe mostrar de forma clara advertencias que protejan la salud de la usuaria.

---

## 6. Estrategias Clínicas y Mitigación del Dolor (Fase Menstrual y Premenstrual)

El dolor durante la fase menstrual (Dismenorrea Primaria) es provocado por el exceso de **prostaglandinas (PGF2$\alpha$ y PGE2)**, que inducen contracciones uterinas intensas y reducen el flujo sanguíneo local (isquemia). En la fase premenstrual (SPM), los cambios de progesterona y estrógeno causan retención de líquidos, migrañas y sensibilidad al dolor.

### 6.1 Mitigación del Dolor Menstrual (Cólicos / Dismenorrea)

#### A. Terapias No Farmacológicas (Primera Línea de Alivio en App)
1. **Termoterapia Local (Calor Aplicado):**
   - *Mecanismo:* La aplicación de calor en el bajo vientre (38 °C – 40 °C) vasodilata los vasos sanguíneos uterinos, aumentando la oxigenación del tejido y relajando la musculatura lisa.
   - *Evidencia:* Estudios clínicos demuestran que el calor continuo es tan efectivo como el ibuprofeno para mitigar los cólicos.
2. **Suplementación Nutricional Dirigida:**
   - **Magnesio (Glicinado o Citrato, 300–400 mg/día):** Relaja la musculatura uterina y bloquea los canales de calcio implicados en la contracción musculocutánea.
   - **Vitamina B6 (Pyridoxina, 50–100 mg/día):** Cofactor en la síntesis de dopamina y serotonina, reduce la severidad de las contracciones.
   - **Omega-3 (EPA/DHA, 1000–2000 mg/día):** Compite con el ácido araquidónico, reduciendo la producción de prostaglandinas inflamatorias.
3. **Infusiones y Fitoterapia:**
   - **Té de Jengibre (Zingiber officinale):** Inhibe la vía de la ciclooxigenasa (COX), reduciendo la síntesis de prostaglandinas de forma análoga a los AINEs leves.
   - **Té de Manzanilla:** Contiene apigenina y glicina, que alivian los espasmos musculares y calman el sistema nervioso.
4. **Movimiento Terapéutico y Estiramientos:**
   - Posturas de Yoga: *Child’s Pose* (Postura del Niño), *Cat-Cow* (Gato-Vaca), *Supta Baddha Konasana* (Reclinado en mariposa).
   - *Efecto:* Descargan la presión lumbosacra y mejoran el riego sanguíneo en la pelvis.
5. **Estimulación Eléctrica Transcutánea (TENS):**
   - Bloquea la transmisión de las señales de dolor a nivel de la médula espinal (Teoría de la Puerta de Entrada).

#### B. Consideraciones Farmacológicas (Educativas)
- **AINEs (Ibuprofeno, Naproxeno):** Inhibidores de la COX-2. La app debe recomendar tomarlos **al inicio de las primeras molestias** (o 24h antes del sangrado) para evitar la acumulación inicial de prostaglandinas.

---

### 6.2 Mitigación de Síntomas Premenstruales (SPM / TDPM)

1. **Estabilización de la Glucemia:**
   - Recomendar comidas frecuentes con carbohidratos complejos + proteína + grasas saludables para evitar picos de insulina que exacerban la irritabilidad y el dolor de cabeza.
2. **Reducción de Inflamación y Retención:**
   - Reducir el consumo de sodio, cafeína y alcohol durante los 7-10 días previos al período.
   - **Suplementación de Calcio (1000 mg/día) + Vitamina D3:** Comprobado clínicamente para reducir los síntomas emocionales y físicos del SPM.
3. **Higiene del Sueño y Reducción de Estrés:**
   - Ejercicios de respiración guiada (4-7-8) y meditación para amortiguar el cortisol pico en la fase lútea tardía.

---

## 7. Recomendaciones de Salud Personalizadas según la Fase del Ciclo

Para dar un valor superior a la usuaria, la app dividirá sus recomendaciones en **4 Fases Clave**:

```
 ┌────────────────────────────────────────────────────────────────────────┐
 │                         FASES DEL CICLO HORMONAL                      │
 ├──────────────┬──────────────────┬─────────────────┬────────────────────┤
 │  MENSTRUAL   │    FOLICULAR     │   OVULATORIA    │       LÚTEA        │
 │  (Días 1-5)  │   (Días 6-13)    │  (Días 14-16)   │    (Días 17-28)    │
 └──────────────┴──────────────────┴─────────────────┴────────────────────┘
```

### 7.1 Fase Menstrual (Días 1-5) | Estrógeno y Progesterona Bajos
- **Fisiología:** Desprendimiento del endometrio. Energía física más baja del ciclo.
- **Nutrición:** Alimentos ricos en Hierro (lentejas, carnes magras, espinacas) + Vitamina C para favorecer su absorción. Alimentos calientes y reconstituyentes (sopas, guisos).
- **Ejercicio:** Descanso activo, caminatas suaves, yoga restaurativo, estiramientos pélvicos.
- **Cuidado Personal:** Aplicación de calor, descanso prioritario, hidratación abundante.

### 7.2 Fase Folicular (Días 6-13) | Estrógeno en Aumento
- **Fisiología:** Maduración del folículo en el ovario. El incremento de estrógeno regenera el endometrio y aumenta la energía, resistencia física y agilidad mental.
- **Nutrición:** Proteínas magras, vegetales fermentados (kimchi, yogur, kéfir) para metabolizar el estrógeno en el hígado y gut micobioma.
- **Ejercicio:** Entrenamiento de fuerza, cardio de moderada a alta intensidad, entrenamientos HIIT.
- **Enfoque Mental:** Planificación de proyectos, aprendizaje de nuevas habilidades, networking.

### 7.3 Fase Ovulatoria (Días 14-16) | Pico de Estrógeno y LH
- **Fisiología:** Liberación del óvulo. Pico máximo de testosterona y estrógeno. Libido en su punto más alto, máxima energía y sociabilidad.
- **Nutrición:** Alimentos ricos en antioxidantes (frutos rojos, vegetales de hoja verde), fibra para eliminar el exceso de estrógeno.
- **Ejercicio:** Máximo rendimiento deportivo, levantamiento de pesas pesadas, spinning, carreras.
- **Enfoque Mental:** Comunicación, presentaciones, conversaciones importantes, alta sociabilidad.

### 7.4 Fase Lútea (Días 17-28) | Progesterona Dominante
- **Fisiología:** El cuerpo lúteo secreta progesterona para preparar el endometrio. Aumenta la temperatura corporal y la tasa metabólica (requiere ~100-300 kcal extras al día). En la segunda mitad (lútea tardía), si no hay embarazo, caen drásticamente las hormonas, detonando el SPM.
- **Nutrición:** Carbohidratos complejos (camote, avena, quínoa), alimentos ricos en magnesio y B6.
- **Ejercicio:** Actividad física moderada al inicio, migrando a pilates, caminatas y natación suave hacia el final de la fase.
- **Enfoque Mental:** Organización, tareas analíticas, autocuidado, preparación para la menstruación.

---

## 8. Arquitectura Técnica y Consideraciones para iOS (iPhone)

Dado que el objetivo final es construir una **App nativa para iPhone**, se deben considerar las mejores prácticas de la plataforma Apple:

### 8.1 Sincronización con Apple HealthKit
Apple HealthKit posee categorías nativas estandarizadas para la salud menstrual:
- `HKCategoryTypeIdentifierMenstrualFlow` (Unspecified, Light, Medium, Heavy, Spotting)
- `HKCategoryTypeIdentifierIntercourse` (Protection Used, Protection Not Used)
- `HKCategoryTypeIdentifierCervicalMucusQuality` (Dry, Sticky, Creamy, Watery, Egg White)
- `HKCategoryTypeIdentifierOvulationTestResult` (Negative, Luteinizing Hormone Surge, Indeterminate)
- `HKQuantityTypeIdentifierBasalBodyTemperature` (Temperatura en grados)

*Ventaja:* Permite leer automáticamente datos guardados por el Apple Watch (como temperatura en la muñeca mientras se duerme) y mantener sincronización con la app Salud de iOS.

### 8.2 Privacidad de Datos Extrema (Privacy-First)
Dado el contexto regulatorio y la sensibilidad de los datos de salud reproductiva:
1. **Almacenamiento Local Primero (On-Device Storage):** Uso de **SwiftData** / **CoreData** con la base de datos totalmente encriptada.
2. **Encriptación de Datos en Reposo (CryptoKit & Keychain):** Las claves de cifrado se custodian en el **Secure Enclave** del iPhone.
3. **Bloqueo Biométrico:** Integración con **Face ID / Touch ID** para abrir la app.
4. **Modo Anónimo (Sin Registro Obligatorio):** Permitir usar la app sin asociar un correo electrónico ni servidor externo.

---

## 9. Resumen de Funcionalidades Propuestas para Nuestra App

A partir de esta investigación, estructuraremos las funciones clave para la **Primera Etapa** de nuestra app:

1. **Onboarding Inteligente:** Captura de fechas previas, duración media de ciclos y anticoncepción.
2. **Pantalla Principal (Dashboard Cíclico):**
   - Indicador visual del día del ciclo y fase fisiológica actual (Menstrual, Folicular, Ovulatoria, Luteal).
   - Indicador de estado de fertilidad / riesgo de embarazo.
   - Acceso rápido al botón de registro diario (+).
3. **Módulo de Registro Diario Completo:**
   - Nivel de sangrado (Spotting, Leve, Moderado, Abundante).
   - Relaciones sexuales (Con/Sin protección, Orgasmo, Libido).
   - Nivel de dolor (Cólicos, Espalda, Senos, Cabeza) y síntomas físicos.
   - Estado de ánimo y nivel de energía.
4. **Centro de Alivio del Dolor (Menstrual & SPM):**
   - Guías interactivas de termoterapia, estiramientos guiados (Yoga para el periodo), recomendaciones de suplementación (Magnesio, B6, Jengibre) y consejos nutricionales.
5. **Recomendaciones de Salud por Fase:**
   - Consejos diarios adaptados a la fase hormonal activa (Nutrición, Ejercicio, Cuidado Personal).
6. **Módulo de Algoritmo Predictivo Local:**
   - Cálculo por Media Móvil Ponderada con descarte de anomalías.
   - Sincronización bidireccional con Apple HealthKit.
7. **Privacidad y Seguridad:**
   - Almacenamiento local encriptado y autenticación con Face ID.

---

## 10. Conclusión y Próximos Pasos

Esta fase investigativa confirma que una app de seguimiento menstrual de primer nivel debe combinar **precisión matemática** (algoritmos adaptativos), **respaldo clínico** (guías de mitigación del dolor y fases hormonales), **excelencia en experiencia de usuario** (registro en 1 toque) y **privacidad absoluta en iOS**.

**Siguiente paso recomendado:** Crear el documento de **Especificaciones Técnicas y de Diseño (`especificaciones_app.md`)** donde filtraremos y definiremos al detalle las historias de usuario, modelo de datos en Swift, vistas de SwiftUI y arquitectura de la primera versión para iPhone.
