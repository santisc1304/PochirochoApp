# Especificaciones de Backend, Algoritmos Avanzados y Arquitectura de Datos (App Centrada en Tracker Menstrual)

> **Fecha de Actualización:** Agosto 2026  
> **Plataforma Target:** iOS (CoreML / SwiftData / HealthKit / Supabase Híbrido)  
> **Patrón de Arquitectura:** Clean Architecture Centrada en Tracker Menstrual + Hub de Recompensas & Logros

---

## 🚨 REGLA ARQUITECTÓNICA OBLIGATORIA: CERO ARCHIVOS MONOLÍTICOS

> **PRINCIPIO DE MODULARIDAD EN BACKEND:**  
> Queda estrictamente prohibido crear archivos gigantes monolíticos (ej. un solo archivo de 8,000 líneas).  
> La capa de datos, servicios, modelos de datos e inferencia debe estructurarse en **archivos `.swift` independientes y desacoplados**:

```
 Core/
   ├── Models/
   │     ├── UserProfileModel.swift       (Modelo de Usuario SwiftData)
   │     ├── AchievementModel.swift       (Modelo de Logros & Desafíos)
   │     ├── RewardItemModel.swift        (Modelo de Ítems de la Tienda)
   │     └── MotivationNoteModel.swift    (Modelo de Notas de Motivación)
   ├── Security/
   │     └── CryptoKitManager.swift       (Encriptación AES-256)
   └── Sync/
         └── SupabaseClientManager.swift  (Cliente Híbrido Supabase)
 TrackerMenstrualEngine/
   ├── Models/
   │     ├── CycleModel.swift             (Modelo de Ciclos)
   │     └── DailyLogModel.swift          (Modelo de Registros Diarios)
   ├── PredictionEngines/
   │     ├── KalmanCycleFilter.swift      (Filtrado de Kalman & DLM)
   │     ├── ProbabilisticFertilityEngine.swift (Probabilidad Fertilidad)
   │     ├── CoreMLEnsemblePredictor.swift(Modelo ML CoreML)
   │     └── EMACyclePredictor.swift      (Media Móvil Exponencial)
   └── Rules/
         └── PainReliefRulesEngine.swift  (Motor de Alivio del Dolor: Yoga, Pilates, Estiramientos)
 HomeRewardsEngine/
   ├── ShopRewardsEngine.swift            (Motor de Economía, Puntos & Tienda)
   ├── AchievementsEngine.swift           (Verificador de Desafíos & Medallas)
   └── MotivationNotesEngine.swift        (Motor de Mensajes Inspiracionales)
```

---

## 1. Visión General de la Arquitectura Backend

El sistema está diseñado bajo **Clean Architecture**, estructurado de forma que la **aplicación está centrada en la Función del Tracker Menstrual como objeto principal**, apoyada en el Home por **3 Nodos Periféricos de Economía y Experiencia (Tienda, Logros y Motivación)**.

```
 ┌────────────────────────────────────────────────────────────────────────┐
 │                PANTALLA PRINCIPAL (HOME) / HUB DE NODOS                │
 ├────────────────────────────────────────────────────────────────────────┤
 │ [ Nodo Central Rojo: Tracker Menstrual ]                               │
 │ [ Nodo 1: Tienda ]  [ Nodo 2: Logros ]  [ Nodo 3: Notas Motivación ]  │
 └───────────────────┬────────────────────────────────┬───────────────────┘
                     │                                │
    ┌────────────────┴───────────────┐┌───────────────┴───────────────┐
    │ CORE COMPARTIDO (SHARED SYSTEM)││ ENGINE DE ECONOMÍA Y HABITOS  │
    │ • UserProfile & Preferences    ││ • ShopRewardsEngine           │
    │ • SwiftData Core Container     ││ • AchievementsEngine          │
    │ • Security & CryptoKit Engine  ││ • MotivationNotesEngine       │
    │ • HealthKit Bridge             ││ • Streak Counter              │
    └────────────────┬───────────────┘└───────────────┬───────────────┘
                     │                                │
 ┌───────────────────┴────────────────────────────────┴──────────────────┐
 │ TRACKER MENSTRUAL ENGINE (OBJETO PRINCIPAL DE LA APP - 100% ACTIVO)    │
 │ • Predictive Data Science Engine (Bayesian DLM + CoreML Ensemble)      │
 │ • Sintotérmico & Procesador de Señal de Hormona LH                    │
 │ • Probabilistic Fertility & Sperm Decay Model                          │
 │ • Symptom Relief Rules Engine (Yoga, Pilates sin equipo, Estiramientos)│
 └───────────────────────────────────────────────────────────────────────┘
```──────────────────────────────────────────────────┘
 ┌───────────────────────────────────────────────────────────────────────┐
 │ MÓDULOS FUTUROS 2, 3 Y 4 (SLOTS PLUGGABLE REUTILIZABLES)              │
 │ • Interfaces tipo 'AppModuleProtocol' que consumen datos del Core.   │
 └───────────────────────────────────────────────────────────────────────┘
```

### 1.1 Contrato del Gateway de Módulos (`AppModuleProtocol`)
Para garantizar que cualquier módulo nuevo se conecte sin tocar el código existente:

```swift
import SwiftUI
import SwiftData

/// Contrato universal que debe implementar cada funcionalidad independiente de la app
protocol AppModuleProtocol {
    var id: String { get }
    var nombreDisplay: String { get }
    var iconoSystem: String { get }
    var colorTema: Color { get }
    var esHabilitado: Bool { get }
    
    @ViewBuilder
    func construirVistaPrincipal() -> AnyView
}

/// Registro Dinámico de Módulos
final class ModuleRegistry: ObservableObject {
    @Published var modulosRegistrados: [any AppModuleProtocol] = []
    
    func registrarModulo(_ modulo: any AppModuleProtocol) {
        modulosRegistrados.append(modulo)
    }
}
```

---

## 2. Modelos de Ciencia de Datos y Algoritmos Avanzados de Predicción del Módulo 1 (Estado del Arte)

Para superar en precisión a aplicaciones líderes como Flo y Clue, implementamos un **Modelo Ensamble Híbrido Ponderado (Super Learner / Stacking Ensemble)** que combina análisis de series temporales, aprendizaje estadístico bayesiano y aprendizaje automático en dispositivo (*On-Device Machine Learning con CoreML*).

```
[ Registros Históricos + Biomarcadores Diarios (TCB, LH, Flujo, Síntomas) ]
                                  │
                                  ▼
 ┌──────────────────────────────────────────────────────────────────┐
 │                   MODELO ENSAMBLE TRIPLE (STACKING)              │
 ├────────────────────────┬────────────────────────┬────────────────┤
 │ 1. Filtro Kalman /     │ 2. Motor Sintotérmico  │ 3. Modelo ML   │
 │    Bayesian DLM        │    Fisiológico (ACOG)  │    (CoreML)    │
 └────────────────────────┴────────────────────────┴────────────────┘
                                  │
                                  ▼
 [ Meta-Clasificador Ponderado por Desviación Individual σ_u ]
                                  │
                                  ▼
 [ Distribución de Probabilidad Continua de Menstruación & Ovulación ]
```

---

### 2.1 Modelo 1: Dynamic Linear Model (DLM) y Filtrado de Kalman Bayesiano (`KalmanCycleFilter.swift`)
A diferencia del promedio simple o EMA convencional, el **Filtrado de Kalman** estima el estado oculto de la duración del ciclo ($x_t$) separando la variabilidad biológica real del ruido aleatorio de medición:

$$\begin{aligned}
\text{Ecuación de Estado:} \quad x_t &= x_{t-1} + w_t, \quad w_t \sim \mathcal{N}(0, W) \\
\text{Ecuación de Observación:} \quad y_t &= x_t + v_t, \quad v_t \sim \mathcal{N}(0, V)
\end{aligned}$$

* **Ajuste Dinámico por Anomalías (Huber Loss Filter):**  
  Si la observación $y_t$ se desvía más de $2.5\sigma$ del estado estimado, el algoritmo reemplaza el error cuadrático por una pérdida lineal de Huber para amortiguar el impacto de ciclos atípicos por viajes, enfermedad o estrés.

---

### 2.2 Modelo 2: Probabilidad Continua de Fertilidad y Función de Decaimiento de Esperma (`ProbabilisticFertilityEngine.swift`)

En lugar de reglas estáticas fijas, utilizamos una **Función de Densidad de Probabilidad (PDF)** continua para el riesgo de embarazo en el día del ciclo $d$, combinada con la **Función de Decaimiento Exponencial de Supervivencia Espermática**:

$$S(t) = S_0 \cdot e^{-\lambda t}$$

Donde $t$ es el tiempo en días previo a la ovulación ($O$), $S_0 = 1.0$ y $\lambda \approx 0.45$ (tasa de decaimiento fisiológico en presencia de moco cervical fértil).

#### Cálculo de Probabilidad Diaria de Concepción $P(\text{Concepción} \mid d)$:

$$P(\text{Concepción} \mid d) = P(\text{Ovulación} = d) \times \left( \sum_{k=0}^{5} P(\text{Coito en } d-k) \cdot S(k) \right) \times V_{\text{óvulo}}$$

Donde $V_{\text{óvulo}} = 1.0$ durante las primeras 12-24 horas post-ovulación y cae a $0.0$ posteriormente.

---

### 2.3 Modelo 3: Aprendizaje Automático On-Device con CoreML (`CoreMLEnsemblePredictor.swift`)

La app entrena o ejecuta un modelo ligero de **Random Forest Regressor / XGBoost** en CoreML que toma **más de 18 características (features)** del historial de la usuaria:

```swift
struct CoreMLInputFeatures {
    let duracionCicloAnterior: Double
    let variabilidadHistoricaSigma: Double
    let edadUsuaria: Double
    let scoreSintomasLuteos: Double // Cambios en senos, estado de ánimo
    let presenciaMocoClaraHuevo: Double // 0.0 o 1.0
    let testLHOvulacion: Double // 0.0 (Negativo) o 1.0 (Positivo)
    let diferenciaTemperaturaBasal: Double // ΔTCB respecto a media de 6 días
    let nivelEstresRegistrado: Double
}
```

* **Actualización Bayesiana en Tiempo Real:** Cada vez que la usuaria registra síntomas diarios, el modelo recalcula la probabilidad posterior $P(\text{Período en día } t \mid \text{Síntomas}_t)$ mediante **Regla de Bayes**:
  $$P(A \mid B) = \frac{P(B \mid A) \cdot P(A)}{P(B)}$$

---

### 2.5 Modelo 5: Predictor de Fase para Fechas Especiales Futuras (`FutureDatePhasePredictor.ts`)

Para proyectar el estado fisiológico de la usuaria en una fecha futura arbitraria $t_{\text{objetivo}}$ (ej. un viaje o evento a 3 meses vista):

1. **Estimación del Número de Ciclos Futuros ($k$):**
   $$k = \left\lfloor \frac{t_{\text{objetivo}} - t_{\text{LMP}}}{\hat{C}} \right\rfloor$$
   Donde $\hat{C}$ es la duración esperada del ciclo calculada por el Filtro de Kalman Bayesiano y $t_{\text{LMP}}$ es el inicio del último período.

2. **Cálculo del Día del Ciclo Proyectado ($d_{\text{proyectado}}$):**
   $$d_{\text{proyectado}} = \left( (t_{\text{objetivo}} - t_{\text{LMP}}) \bmod \hat{C} \right) + 1$$

3. **Inferencia de Fase Hormonal y Probabilidad de Sintomatología:**
   $$\text{Fase}(d_{\text{proyectado}}) = \begin{cases}
   \text{Fase Menstrual} & \text{si } 1 \le d_{\text{proyectado}} \le L_{\text{periodo}} \\
   \text{Fase Folicular} & \text{si } L_{\text{periodo}} < d_{\text{proyectado}} \le (\hat{O} - 5) \\
   \text{Fase Ovulatoria} & \text{si } (\hat{O} - 5) < d_{\text{proyectado}} \le (\hat{O} + 1) \\
   \text{Fase Lútea} & \text{si } (\hat{O} + 1) < d_{\text{proyectado}} \le \hat{C}
   \end{cases}$$
   Donde $\hat{O} = \hat{C} - 14$ es el día estimado de ovulación. El sistema calcula el intervalo de confianza $\pm \sigma_k = \sqrt{k} \cdot \sigma_{\text{ciclo}}$ para comunicar a la usuaria el margen de precisión según la lejanía del evento.

---

## 3. Motor de Inferencia Clínico y Alivio del Dolor (`PainReliefRulesEngine.swift`)

El backend evalúa las reglas clínicas para dismenorrea primaria y síndrome premenstrual:

```swift
final class SymptomReliefEngine {
    static func evaluarProtocoloAlivio(registro: RegistroDiario, fase: FaseHormonal) -> [RecomendacionAlivio] {
        var recomendaciones: [RecomendacionAlivio] = []
        
        if registro.nivelColicos >= 2 && (fase == .menstrual || fase == .luteaTardia) {
            recomendaciones.append(RecomendacionAlivio(
                titulo: "Termoterapia Dirigida",
                descripcion: "Aplicación de calor a 38-40°C en zona pélvica durante 20 min.",
                categoria: .termoterapia
            ))
            recomendaciones.append(RecomendacionAlivio(
                titulo: "Suplementación de Magnesio & Infusión antiinflamatoria",
                descripcion: "Magnesio Glicinado (300mg) e infusión de Jengibre para bloquear síntesis de PGF2α.",
                categoria: .suplemento
            ))
            recomendaciones.append(RecomendacionAlivio(
                titulo: "Estiramiento Pélvico (Postura del Niño)",
                descripcion: "Descompresión lumbosacra asistida por 5 minutos.",
                categoria: .ejercicio
            ))
        }
        return recomendaciones
    }
}
```

---

## 4. Tubería de Integración con Apple HealthKit (`HealthKitManager.swift`)

Intercambio bidireccional de datos con identificadores nativos de Apple:
* `HKCategoryTypeIdentifierMenstrualFlow`
* `HKCategoryTypeIdentifierIntercourse`
* `HKCategoryTypeIdentifierCervicalMucusQuality`
* `HKQuantityTypeIdentifierBasalBodyTemperature`

---

## 5. Modelo de Datos Local (SwiftData Scalable Schema)

```swift
import SwiftData
import Foundation

// MARK: - Core Profile
@Model
final class PerfilUsuario {
    @Attribute(.unique) var id: UUID
    var nombre: String
    var fechaNacimiento: Date?
    var mascotaSeleccionada: String // "Gatito", "Monito", "Pinguino", "Ranita", "Erizo"
    var esquemaColoresModo: String // "Predeterminado", "Custom"
    var coloresFasesCustom: [String: String]
    
    @Relationship(deleteRule: .cascade) var registrosDiarios: [RegistroDiario]
    @Relationship(deleteRule: .cascade) var historialCiclos: [CicloMenstrual]
    
    init(nombre: String = "Usuaria", mascota: String = "Gatito") {
        self.id = UUID()
        self.nombre = nombre
        self.mascotaSeleccionada = mascota
        self.esquemaColoresModo = "Predeterminado"
        self.coloresFasesCustom = [:]
        self.registrosDiarios = []
        self.historialCiclos = []
    }
}

// MARK: - Módulo 1 Tracker Menstrual Entities
@Model
final class CicloMenstrual {
    @Attribute(.unique) var id: UUID
    var fechaInicio: Date
    var fechaFin: Date?
    var duracionDias: Int?
    var esAnomalo: Bool
    
    init(fechaInicio: Date) {
        self.id = UUID()
        self.fechaInicio = fechaInicio
        self.esAnomalo = false
    }
}

@Model
final class RegistroDiario {
    @Attribute(.unique) var id: UUID
    var fecha: Date
    var nivelSangrado: String
    var esInicioPeriodo: Bool
    var nivelColicos: Int
    var dolorSenos: Bool
    var dolorEspaldaBaja: Bool
    var nivelEstres: String
    var emocionesEspecificas: [String]
    var sexoProtegido: Bool?
    var pildoraTomada: Bool?
    var temperaturaBasal: Double?
    var resultadoLH: String?
    
    init(fecha: Date) {
        self.id = UUID()
        self.fecha = fecha
        self.nivelSangrado = "Ninguno"
        self.esInicioPeriodo = false
        self.nivelColicos = 0
        self.dolorSenos = false
        self.dolorEspaldaBaja = false
        self.nivelEstres = "Bajo"
        self.emocionesEspecificas = []
    }
}
```

---

## 6. Dictamen Técnico: Almacenamiento Local (Zero-Knowledge) y Sincronización

### **Arquitectura Local First & Privacidad Absoluta:**
* **Tracker Menstrual & Salud Hormonal:** Almacenamiento **100% LOCAL** en el iPhone (`SwiftData` + `CryptoKit` AES-256). Garantiza privacidad total (Zero-Knowledge), funcionamiento instantáneo offline y costo cero de servidores.
* **Economía de Recompensas, Logros y Notas de Motivación:** Gestión local en SwiftData con respaldo opcional en **Supabase** para guardar progreso de logros, inventarios de la tienda y notas motivacionales recibidas.

 ┌────────────────────────────────────────────────────────────────────────┐
 │                   ARQUITECTURA LOCAL FIRST & PRIVACIDAD                │
 ├────────────────────────────────────────────────────────────────────────┤
 │ 1. DATOS SENSIBLES DE SALUD (Tracker Menstrual & Síntomas):            │
 │    --> Se guardan 100% LOCALMENTE en el dispositivo (AES-256).        │
 │    --> Privacidad absoluta (Zero-Knowledge) y funcionamiento 100%     │
 │        offline.                                                        │
 │                                                                        │
 │ 2. TIENDA DE RECOMPENSAS, LOGROS Y NOTAS DE MOTIVACIÓN:                │
 │    --> Se gestionan localmente y se pueden sincronizar con SUPABASE    │
 │        para conservar los puntos, ítems desbloqueados y medallas.      │
 └────────────────────────────────────────────────────────────────────────┘

---

## 10. Adaptación de la Arquitectura Backend para Web PWA (TypeScript / Web Standards)

Para garantizar la ejecución 100% offline y la paridad funcional con iOS nativo, mapeamos la pila tecnológica a estándares Web PWA:

```
 ┌─────────────────────────────┬─────────────────────────────┐
 │    TECNOLOGÍA NATIVA iOS    │   EQUIVALENTE WEB PWA       │
 ├─────────────────────────────┼─────────────────────────────┤
 │ SwiftData / CoreData        │ IndexedDB (vía Dexie.js)    │
 │ CryptoKit (AES-256)         │ Web Crypto API              │
 │ CoreML Machine Learning     │ TypeScript Matrix Math      │
 │ HealthKit                   │ Apple Health XML Import     │
 │ Swift Service Protocol      │ TypeScript Module Contract  │
 │ App Lifecycle Cache         │ Service Worker (PWA Cache)  │
 └─────────────────────────────┴─────────────────────────────┘
```

---

## 11. Especificaciones de Backend para Módulo de Tienda & Economía de Recompensas (`ShopRewardsEngine.ts`)

### 11.1 Lógica de Racha Diaria (Daily Habit Streak Counter)
* **Conteo de Racha:** Si la usuaria realiza al menos un registro diario (síntomas, rutina de alivio o ejercicio), el acumulador `rachaDias` incrementa en $+1$. Si pasan $>36$ horas sin registro, la racha se reinicia (salvo uso de "Escudo de Racha" congelable).

### 11.2 Tabla de Recompensas y Conversión de Monedas:
$$M_{\text{total}} = M_{\text{registro}} + M_{\text{ejercicio}} + M_{\text{bono\_racha}}$$

* **Registro Diario de Síntomas:** $+10 \text{ Monedas}$
* **Completar Rutina de Alivio o Ejercicio:** $+25 \text{ Monedas}$
* **Bono por Racha de 7 Días:** $+100 \text{ Monedas}$

### 11.3 Catálogo Local de Desbloqueables:
1. **Avatares Companion:** Desbloqueo de disfraces y accesorios para Milo, Kiko, Pipo, Rana Zen y Spike (500 Monedas).
2. **Temas Cromáticos Neon & Glass:** Paletas de colores exclusivas para las fases del ciclo (300 Monedas).
3. **Insignias y Medallas:** Trofeos coleccionables de consistencia de salud.

---

## 12. Especificaciones de Arquitectura para Recursos Multimedia (Imágenes & Animaciones de Ejercicios)

### 12.1 Directiva de Almacenamiento e Integridad
Para garantizar una ejecución instantánea, **100% Offline (Local-First)** y prevenir problemas de memoria o rendimiento en dispositivos móviles:

1. **Almacenamiento Físico de Archivos Multimedia (`Assets` / `Public`):**
   - Todos los recursos pesados como imágenes de rutinas (`.webp`, `.png`), GIFs animados y videos ilustrativos (`.mp4`, `.webm`) se almacenan **exclusivamente en la estructura de archivos local del proyecto**:
     ```
     frontend/assets/exercises/
     ├── echoes_of_the_soul_preview.webp
     ├── echoes_of_the_soul_anim.gif
     ├── pelvic_release_preview.webp
     ├── pelvic_release_anim.gif
     └── ...
     ```

2. **Registro de Referencias en la Base de Datos (IndexedDB / SwiftData):**
   - La base de datos local **NUNCA** debe almacenar datos binarios (`BLOB` / `ByteArrays`) de imágenes ni animaciones.
   - En su lugar, el esquema del ejercicio almacena **únicamente cadenas de texto con las rutas relativas o nombres de archivo**:

   ```typescript
   export interface ExerciseModel {
     id: string;
     catId: string;
     title: string;
     category: string;
     duration: string;
     instructor: string;
     instructorIcon: string;
     intensity: string;
     isFavorite: boolean;
     previewImagePath: string;   // Ej: "assets/exercises/echoes_preview.webp"
     animationGifPath: string;   // Ej: "assets/exercises/echoes_anim.gif"
     videoUrl?: string;          // Ej: "assets/exercises/echoes_routine.webm"
     desc: string;
     steps: string[];
     spikeTip: string;
   }
   ```

### 12.2 Beneficios Clave
- **Cero Latencia & Zero-Lag:** La carga de imágenes y GIFs ocurre directamente desde la caché nativa del dispositivo.
- **Base de Datos Ligera:** Las tablas de la base de datos se mantienen ultra livianas (un par de kilobytes por registro).
- **Funcionamiento Autónomo:** La usuaria puede seguir haciendo sus ejercicios en zonas sin cobertura o modo avión.
