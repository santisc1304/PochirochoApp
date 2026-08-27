# Especificaciones de Diseño e Interfaz de Usuario (Frontend UX/UI)

> **Fecha de Actualización:** Julio 2026  
> **Plataforma Target:** iOS (iPhone & iPad) | **Framework UI:** SwiftUI  
> **Estética:** Apple Futuristic Glassmorphism, SF Typography, Micro-animaciones físicas y Sistema de Avatares Interactivos.

---

## 1. Sistema de Diseño y Personalización Cromática

La aplicación se alinea strictly con los estándares de *Human Interface Guidelines (HIG)* de Apple, incorporando una estética futurista, cálida y empática cargada de materiales **Glassmorphic** (`.ultraThinMaterial`), desenfoques de fondo (*background blur*), bordes sutiles iluminados y tipografía dinámica *SF Pro Display* y *SF Pro Rounded*.

### 1.1 Personalización de Colores por Fase Hormonal (Predeterminados vs. Personalizados)
Al iniciar la app por primera vez, la usuaria tiene control total sobre el esquema cromático. Puede optar por la **Paleta Predeterminada de la App** o personalizar el color de cada fase según sus preferencias:

```
 ┌────────────────────────────────────────────────────────────────────────┐
 │                   PALETA PREDETERMINADA DE FASES                       │
 ├──────────────────┬─────────────────┬───────────────────┬───────────────┤
 │  Fase Menstrual  │  Fase Folicular │  Fase Ovulatoria  │  Fase Lútea   │
 │ Rojo Carmesí     │ Amarillo Sol    │ Morado Místico    │ Azul Profundo │
 │ (#E63946)        │ (#F4A261)       │ (#7209B7)         │ (#1D3557)     │
 └──────────────────┴─────────────────┴───────────────────┴───────────────┘
```

#### Selector de Temas (Custom Color Picker):
- **Opción A (Predeterminada):** Sistema armónico preconfigurado por la app.
- **Opción B (Personalizada):** La usuaria abre un selector circular de color (*Color Picker Glassmorphic*) para asignar su tono preferido a cada una de las 4 fases. Toda la UI (anillos, tarjetas, indicadores del calendario y notificaciones) adaptará automáticamente esos colores.

---

## 2. Sistema de Avatares Compañeros (Mascotas de Ciclo)

La app introduce un sistema de avatares interactivos que actúan como "compañeros de salud". La usuaria selecciona su mascota en el onboarding inicial.

### 2.1 Opciones de Avatares Seleccionables (5 Avatares Propios):
1. 🐱 **Gatita ("MaoMao"):** Curiosa, cariñosa, amante del descanso en la fase menstrual.
2. 🐒 **Monito ("Luffy"):** Enérgico, alegre, expresivo y muy ágil.
3. 🐧 **Pingüino ("Pipo"):** Empático, tierno, fan del calor en los días de cólicos.
4. 🐸 **Ranita ("Naveen"):** Calmado, experto en meditación, respiración y paz mental.
5. 🦔 **Erizo ("Amy"):** Tierna, dulce, siempre lista para acurrucarse y ofrecer confort en los días de mayor sensibilidad.

### 2.2 Roles y Comportamiento del Avatar:
- **Expresividad Dinámica:** El avatar reacciona visualmente según la fase hormonal y los síntomas registrados (ej. si hay cólicos severos, el avatar aparece con una mantita y una taza de té).
- **Notificaciones Personalizadas:** Envía recordatorios diarios con el tono característico de la mascota elegida (ej. *"¡Hola! Tu Pingüino Pipo te recuerda beber agua y preparar tu compresa tibia para hoy 🐧☕"*).

---

## 3. Experiencia de Onboarding (Primer Ingreso Paso a Paso)

El flujo de bienvenida equilibra la personalización estética inicial con la captura precisa de datos clínicos.

```
 [ PANTALLA 1 ] ──► [ PANTALLA 2 ] ──► [ PANTALLA 3 ] ──► [ PANTALLA 4 ] ──► [ PANTALLA 5 ]
  Selección de      Elección de        Recolección       Conexión           Seguridad
  Colores por       Mascota Companion  Datos Clínicos    HealthKit          Biométrica
  Fase (Preset      (Gato, Mono,       (LMP, Duración,   (Importar          (Face ID /
  o Custom)         Pingüino, etc.)    Anticoncepción)   Historial)         Touch ID)
```

1. **Fase de Personalización de Diseño:**
   - **Paso 1 (Paleta de Colores):** Elección entre la paleta predeterminada o creación de una paleta personalizada por fase.
   - **Paso 2 (Elección del Companion):** Presentación animada de las 5 mascotas (Gatito, Monito, Pingüino, Ranita, Erizo) para elegir al compañero ideal.
2. **Fase de Recolección de Datos Clínicos:**
   - **Paso 3 (Fecha de Última Menstruación - LMP):** Selección en calendario interactivo.
   - **Paso 4 (Duración de Ciclo y Periodo):** Sliders táctiles hácticos (Ciclo: 21-45 días, Periodo: 2-10 días).
   - **Paso 5 (Regularidad y Anticoncepción):** Identificación de método (Pastillas, DIU, Barrera, Ninguno) y regularidad.
   - **Paso 6 (Importación con Apple HealthKit):** Botón glassmorphic para importar ciclos históricos guardados en la app *Salud* del iPhone.
   - **Paso 7 (Protección Biométrica):** Configuración de Face ID / Touch ID.

---

## 4. Experiencia Diaria de Usuaria Recurrente en el Módulo Tracker Menstrual

Al abrir la app normalmente, se desencadena una **secuencia animada interactiva única y fluida**:

```
 ┌────────────────────────────────────────────────────────────────────────┐
 │                      SECUENCIA ANIMADA DE ENTRADA                      │
 ├────────────────────────────────────────────────────────────────────────┤
 │ 1. EL AVATAR ENTRA CON ALEGRÍA                                         │
 │    Muestra saludo animado ("¡Qué alegría verte de nuevo!").            │
 │                                                                        │
 │ 2. CAÍDA DEL BLOQUE DE INFORMACIÓN                                     │
 │    Desde la parte superior cae un bloque glassmorphic con rebote       │
 │    físico (.spring animation).                                         │
 │                                                                        │
 │ 3. REACCIÓN Y ESQUIVA DEL AVATAR                                       │
 │    El avatar nota el bloque cayendo justo sobre él, se asusta          │
 │    ligeramente y da un salto hacia un lado esquivándolo justo a tiempo.│
 │                                                                        │
 │ 4. CONSEJO Y RECALCULO                                                 │
 │    El avatar observa el bloque y entrega tips y recomendaciones        │
 │    personalizadas para el día de la fase activa.                       │
 └────────────────────────────────────────────────────────────────────────┘
```

### 4.1 Estructura Visual de la Pantalla Principal (Dashboard)

```
┌────────────────────────────────────────────────────────┐
│  [ Header: Saludo + Icono Ajustes/FaceID ]              │
│                                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 🔘 BOTÓN PROMINENTE: "REGISTRAR DETALLES"        │  │
│  └──────────────────────────────────────────────────┘  │
│                                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │ BLOQUE FLOTANTE (Glassmorphism + Caída Spring):  │  │
│  │ • DÍAS DEL CICLO: Día 14 (Fase Ovulatoria)       │  │
│  │ • PROBABILIDAD DE EMBARAZO: Elevada              │  │
│  │ • CUENTA REGRESIVA: Faltan 14 días p/Fase Lútea │  │
│  └──────────────────────────────────────────────────┘  │
│                                                        │
│            ┌──────────────────────────┐                │
│            │   AVATAR ANIMADO (PET)   │                │
│            │ (Esquivó bloque & habla) │                │
│            └──────────────────────────┘                │
│  ┌──────────────────────────────────────────────────┐  │
│  │ BUBBLE DE DIÁLOGO DEL AVATAR:                    │  │
│  │ "¡Hoy tu energía está al máximo! Ideal para      │  │
│  │ ejercicio intenso. Recuerda beber 2L de agua 💧" │  │
│  └──────────────────────────────────────────────────┘  │
│                                                        │
│         [ RUEDA DE NAVEGACIÓN EN SEMICÍRCULO ]         │
└────────────────────────────────────────────────────────┘
```

#### A. Botón Prominente "Registrar Detalles"
Ubicado en la zona superior para acceso instantáneo. Al pulsarse, despliega una **Ventana Flotante / Bottom Sheet Glassmorphic** para registrar:
* **Sangrado:** Manchado (spotting), Mediano, Alto. Opción *"Registrar inicio de período"* para actualizar el Día 1.
* **Dolor y Cólicos:** Cólicos menstruales, Dolor de senos, Dolor de espalda baja.
* **Estrés y Emociones:** Estrés (Alto, Moderado, Bajo), Emociones específicas (Irritable, Feliz, Sensible, Ansiosa).
* **Actividad Sexual y Anticoncepción:** Sexo con/sin protección, Píldora tomada a tiempo/olvidada, método activo.
* **Flujo Vaginal:** Color y consistencia (Transparente, Cremoso, Clara de huevo).

#### B. Recálculo en Tiempo Real por el Avatar:
Al guardar el registro diario, el avatar realiza un **animación de reflexión ("Recalculando...")** y actualiza inmediatamente la información del bloque (ej. si el período se adelantó o retrasó, explica la razón probable basada en el estrés o síntomas registrados).

---

## 5. Rueda de Navegación en Semicírculo (Glassmorphic Semi-Circle Wheel)

En lugar de la barra de pestañas plana tradicional (*Tab Bar*), la parte inferior de la pantalla cuenta con una **Rueda Giratoria en Semicírculo de Cristal (`.ultraThinMaterial`)**. La usuaria puede deslizar el semicírculo para rotar entre las 5 secciones principales:

```
                  ┌──────────────────────┐
                  │ 1. PRINCIPAL (HOME)  │
                  ├──────────────────────┤
                  │ 2. CALENDARIO        │
                  ├──────────────────────┤
                  │ 3. EJERCICIOS Y ALIVIO│
                  ├──────────────────────┤
                  │ 4. ANÁLISIS & SALUD  │
                  ├──────────────────────┤
                  │ 5. AGENTE IA SALUD   │
                  └──────────────────────┘
            ◠◠◠◠◠◠◠◠◠◠◠◠◠◠◠◠◠◠◠◠◠◠◠◠◠◠◠◠◠◠◠◠◠◠◠◠◠
          (   [🏠]   [📅]   [🧘]   [📊]   [🤖]   )
           └───────────────────────────────────┘
```

---

## 6. Especificación de las Secciones del Semicírculo del Tracker Menstrual

### 6.1 Sección 2: Calendario Interactivo de Estética Impecable
* **Detalle por Día (Day Inspector):** Al pulsar sobre cualquier fecha previa, se abre una tarjeta glassmorphic que muestra exactamente los síntomas registrados, notas, flujo, sexo y nivel de dolor de ese día específico.
* **Calculadora & Planificador de Fechas Especiales (Future Date Phase Predictor):** Permite a la usuaria seleccionar o buscar cualquier fecha futura especial (ej. un viaje, boda, examen o vacaciones). Utilizando el algoritmo predictivo de la app (Filtro Kalman Bayesiano / DLM), calcula de forma precisa en qué día del ciclo y fase hormonal caerá esa fecha (ej. *"Para el 15 de Octubre estarás en el Día 12 - Fase Ovulatoria ✨ con energía al máximo y 0% probabilidad de cólicos"*), sugiriendo recomendaciones anticipadas de preparación.

---

### 6.2 Sección 3: Alivio Específico de Dolores (Inspirado en "Función ejercicios.png")
Diseñado exclusivamente para la mitigación terapéutica del dolor durante la fase menstrual y premenstrual, incorporando disciplinas de movimiento suave sin equipo:

```
┌────────────────────────────────────────────────────────┐
│  CENTRO DE ALIVIO DE DOLORES (TERAPÉUTICO)              │
├────────────────────────────────────────────────────────┤
│  CATEGORÍAS (Cuadrados Glassmorphism):                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐│
│  │ 🧘 YOGA  │  │🤸 PILATES│  │🤸 ESTIR. │  │ 🧠 MEDIT.││
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘│
│  ┌──────────┐  ┌──────────┐                            │
│  │ 💆 MASAJES│  │ 🫁 RESP. │                            │
│  └──────────┘  └──────────┘                            │
├────────────────────────────────────────────────────────┤
│  RUTINAS SUGERIDAS (Tarjetas de Alivio):               │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 🤸 Estiramientos para Alivio de Cólicos          │  │
│  │ ⏱️ 10 min • Enfoque Pélvico y Lumbar • Sin Equipo│  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 🤸 Pilates Suave en Casa (Fortalecimiento Core)  │  │
│  │ ⏱️ 15 min • Suave • Sin Equipamiento             │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 🧘 Yoga Suave para Alivio de Tensión Menstrual   │  │
│  │ ⏱️ 12 min • Intensidad Suave • Solo              │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 💆 Masaje Lumbar y Pélvico en Pareja             │  │
│  │ ⏱️ 15 min • Alivio de Tensión • En Pareja         │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
```

* **Cuadrados Glassmorphic de Categoría:** Botones superiores de cristal (*Yoga Suave, Pilates en Casa sin Equipo, Estiramientos para Cólicos Menstruales, Meditación Guiada, Masajes Solos/Pareja, Respiración Pélvica*).
* **Tarjetas de Rutinas Sugeridas:** Listado visual estructurado por tiempo estimado, nivel de intensidad e instrucciones paso a paso asistidas por la mascota avatar para descompresión lumbosacra y liberación de tensión pélvica.

---

### 6.3 Sección 4: Análisis de Salud y Tendencias (Health Trends)
* **Gráficos de Variabilidad:** Curvas de nivel de estrés, patrón de cólicos mes a mes y comparación de duración de ciclos.
* **Detección de Patrones:** Alertas como *"Tus migrañas suelen aparecer 2 días antes de tu fase menstrual"*.
* **Exportador a PDF:** Generador de reportes médicos formateados para ginecología.

---

### 6.4 Sección 5: Agente IA de Salud (Asistente Conversacional)
* **Interfaz de Chat Futurista:** Chat estilo SwiftUI con mensajes en burbujas glassmorphic y presencia visual del avatar elegido en la esquina superior.
* **Base de Conocimiento Clínico:** Entrenado para responder dudas sobre ciclo, fertilidad, síntomas y métodos anticonceptivos.
* **Protocolo de Seguridad y Recomendación Externa:** Si la usuaria consulta sobre síntomas severos o dudas complejas que exceden la orientación básica, el agente:
  1. Brinda una explicación comprensible y tranquila.
  2. **Recomienda videos educativos y páginas médicas verificadas** (ej. artículos de salud femenina validados).
  3. Recomienda consultar a un profesional médico si detecta banderas rojas (*Red Flags*).

---

## 7. Pregunta Técnica: Uso de Android Studio para Visualizar la App en Móvil

1. **Naturaleza de las Plataformas:**
   * **Android Studio** utiliza el **Emulador de Android (AVD)**, diseñado exclusivamente para Android.
   * **iOS (iPhone)** utiliza el sistema **macOS** y el entorno oficial de Apple llamado **Xcode** con su **iOS Simulator**.
2. **¿Se puede usar Android Studio para ver una App nativa de Apple (SwiftUI)?**
   * **No directamente para iOS nativo:** Android Studio no ejecuta el simulador de iPhone.
3. **Alternativa Recomendada:**
   * **Prototipo Web Interactivo:** Construiremos una Web App interactiva (React/Vite + Glassmorphism) en este proyecto para que puedas probar todas las animaciones, el avatar, la caída del bloque con rebote y la rueda giratoria directamente desde cualquier navegador o teléfono móvil.

---

## 8. Pantalla Principal de la App (Home Screen & Gateway de Nodos)

Al abrir la aplicación, la usuaria es recibida por la **Pantalla Principal (Home Screen)** con la estética visual inspirada en los diseños originales de la aplicación. Esta pantalla actúa como un Hub focalizado donde el **Tracker Menstrual es el objeto principal de la app**.

```
┌────────────────────────────────────────────────────────┐
│  PANTALLA PRINCIPAL (HOME SCREEN & HUB DE NODOS)       │
├────────────────────────────────────────────────────────┤
│                                                        │
│             ┌────────────────────────────┐             │
│             │  💌 NODO 3: NOTAS DE       │             │
│             │     MOTIVACIÓN             │             │
│             └──────────────┬─────────────┘             │
│                            │                           │
│  ┌──────────────────┐      │      ┌──────────────────┐ │
│  │ 🛍️ NODO 1: TIENDA │     │      │ 🏆 NODO 2: LOGROS│ │
│  │    DE RECOMPENSAS│ ────┼───── │    Y METAS       │ │
│  └────────┬─────────┘      │      └────────┬─────────┘ │
│           │                │               │           │
│           └────────────────┼───────────────┘           │
│                            │                           │
│              ┌─────────────▼────────────┐              │
│              │ 🔴 MÓDULO PRINCIPAL:     │              │
│              │    TRACKER MENSTRUAL     │              │
│              │    (Botón Grande Rojo    │              │
│              │     en el Centro)        │              │
│              └──────────────────────────┘              │
│                                                        │
└────────────────────────────────────────────────────────┘
```

### 8.1 Componente Central: Módulo Grande Rojo del Tracker Menstrual
* **Diseño Visual:** Destacado de forma prominente en el centro de la pantalla con un gradiente vibrante **Rojo Carmesí (#E63946)**, bordes neón sutiles y acabado Glassmorphic (`.ultraThinMaterial`).
* **Interacción:** Al presionar este botón central, realiza una transición fluida (zoom expandible con física `.spring`) para ingresar a la **Función Principal del Tracker Menstrual** (Dashboard con avatar animado, rueda semicircular, calendario, alivio, análisis y agente IA).

### 8.2 Nodos Circundantes (3 Secciones de Apoyo Alrededor del Centro):
Alrededor del módulo central rojo se posicionan exactamente **3 Nodos/Secciones funcionales**:

1. 🛍️ **Nodo 1: Tienda de Recompensas por Puntos Ganados**
   * **Propósito:** Permite a la usuaria canjear los puntos/monedas acumulados al registrar hábitos de salud diarios, rutinas de alivio o días de racha.
   * **Recompensas Desbloqueables:** Disfraces y accesorios para las mascotas avatar (Milo, Kiko, Pipo, Rana Zen, Spike), paletas cromáticas exclusivas y temas de la app.

2. 🏆 **Nodo 2: Logros y Metas Recompensadas**
   * **Propósito:** Muestra la lista de desafíos de salud y constancia completados por la usuaria.
   * **Dinámica:** Cumplir un logro (ej. *"Racha de 7 días de registro"*, *"Completar 3 rutinas de alivio de cólicos"*) otorga medallas coleccionables y otorga recompensas inmediatas en puntos para la tienda.

3. 💌 **Nodo 3: Notas de Motivación para la Usuaria**
   * **Propósito:** Un espacio íntimo de inspiración diaria con mensajes cálidos y afirmativos adaptados al estado de ánimo y momento de la usuaria.
   * **Personalización:** Los mensajes y contenido específico de este nodo serán determinados dinámicamente según las notas proporcionadas por el usuario.

---

## 9. 🚨 Regla Arquitectónica: Estructura Modular de Archivos (Cero Archivos Monolíticos)

> **PRINCIPIO DE MODULARIDAD EN CÓDIGO:**  
> Queda estrictamente prohibido crear archivos gigantes monolíticos.  
> La interfaz debe organizarse en **archivos `.swift` pequeños, atómicos y especializados**:

```
Views/
  ├── Home/
  │     ├── MainHomeScreenView.swift       (Pantalla Principal con Botón Central y 3 Nodos)
  │     ├── CentralTrackerButtonView.swift (Módulo Grande Rojo del Tracker)
  │     ├── RewardShopNodeView.swift       (Nodo de Tienda de Recompensas)
  │     ├── AchievementsNodeView.swift     (Nodo de Logros y Metas)
  │     └── MotivationNotesNodeView.swift  (Nodo de Notas de Motivación)
  └── TrackerMenstrual/
        ├── TrackerDashboardView.swift     (Dashboard Principal del Tracker)
        ├── FallingHeaderCardView.swift    (Bloque Flotante con Caída y Rebote)
        ├── SymptomModalSheetView.swift    (Bottom Sheet de Registro de Síntomas)
        ├── CycleWheelNavView.swift        (Rueda Semicircular de Navegación)
        ├── CalendarView.swift             (Calendario Predictivo e Inspector)
        ├── PainReliefView.swift           (Sección de Alivio: Yoga, Pilates, Estiramientos)
        ├── HealthTrendsView.swift         (Análisis de Salud y Exportación PDF)
        └── HealthAIAgentChatView.swift    (Agente Conversacional IA)
```

