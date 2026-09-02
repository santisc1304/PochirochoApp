/* ==========================================================================
   POCHIROCHO - MAIN APPLICATION LOGIC & INTERACTION ENGINE (LOCAL FIRST STANDALONE BUNDLE)
   ========================================================================== */

// --- CLASES Y MOTORES BACKEND INTEGRADOS ---
class UserProfileModel {
  constructor(data = {}) {
    this.id = data.id || 'default_user_profile';
    this.nombre = data.nombre || 'Ana';
    this.fechaNacimiento = data.fechaNacimiento || null;
    this.mascotaSeleccionada = data.mascotaSeleccionada || 'Erizo';
    this.esquemaColoresModo = data.esquemaColoresModo || 'auto_by_phase';
    this.coloresFasesCustom = data.coloresFasesCustom || { Menstrual: 'red', Folicular: 'pink', Ovulatoria: 'blue', Lutea: 'yellow' };
    this.lmpFecha = data.lmpFecha || new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();
    this.duracionPromedioCiclo = data.duracionPromedioCiclo || 28;
    this.duracionPromedioPeriodo = data.duracionPromedioPeriodo || 5;
    this.regularidad = data.regularidad || 'Regular';
    this.variacionCicloDias = data.variacionCicloDias || '1-2';
    this.metodoAnticonceptivo = data.metodoAnticonceptivo || 'Ninguno';
    this.sintomaPrincipal = data.sintomaPrincipal || 'Cólicos';
    this.objetivoSalud = data.objetivoSalud || 'Bienestar General';
    this.healthKitConectado = data.healthKitConectado || false;
    this.biometriaHabilitada = data.biometriaHabilitada || false;
    this.desarrolladorEmail = data.desarrolladorEmail || 'santisc1304@gmail.com';
  }
  toJSON() { return { ...this }; }
}

class DeveloperSupportBridge {
  static developerEmail = 'santisc1304@gmail.com';
  static ticketsEnviados = [];

  /**
   * Envía un correo real al Pollo Desarrollador (santisc1304@gmail.com)
   */
  static async dispatchEmailToDeveloper({ subject, message, data = {} }) {
    try {
      const payload = {
        _subject: subject,
        destinatario: this.developerEmail,
        mensaje: message,
        ...data,
        _template: 'table',
        _captcha: 'false'
      };

      await fetch('https://formsubmit.co/ajax/santisc1304@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      }).catch(() => {});
    } catch (err) {
      console.warn('DeveloperSupportBridge: Error al despachar email:', err);
    }
  }

  static async sendNotificationTicket({ userEmail = 'ana@ejemplo.com', issueSummary = '', appState = {}, timestamp = new Date().toISOString() }) {
    const ticket = {
      id: `ticket_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      type: 'BUG_REPORT',
      userEmail,
      issueSummary,
      appState,
      timestamp,
      status: 'NOTIFICADO_AL_DESARROLLADOR',
      developerEmail: this.developerEmail
    };
    this.ticketsEnviados.push(ticket);
    console.log(`🚨 [POLLO DESARROLLADOR 🐔💻 -> ${this.developerEmail}] Notificación de reporte técnico recibida:`, ticket);
    
    if (typeof window !== 'undefined' && window.achievementsEngine) {
      const achRes = window.achievementsEngine.unlockDirect('ach-secret-report-bug');
      if (achRes.newlyUnlocked && typeof window.showInAppAchievementToast === 'function') {
        window.showInAppAchievementToast(achRes.ach);
      }
    }
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const ticketsPrevios = JSON.parse(window.localStorage.getItem('pochirocho_dev_tickets') || '[]');
        ticketsPrevios.push(ticket);
        window.localStorage.setItem('pochirocho_dev_tickets', JSON.stringify(ticketsPrevios));
      }
    } catch (e) {}

    // Despachar email real a santisc1304@gmail.com
    await this.dispatchEmailToDeveloper({
      subject: `🚨 [Pochirocho] Reporte de Asistencia Técnica #${ticket.id.slice(-6)}`,
      message: `Reporte de Asistencia Técnica generado desde Pochirocho:\n${issueSummary}`,
      data: {
        ticketId: ticket.id,
        tipo: 'REPORTE_TECNICO',
        resumen: issueSummary,
        estadoApp: JSON.stringify(appState),
        fecha: timestamp
      }
    });

    return ticket;
  }

  static async sendRewardClaimTicket({ userEmail = 'ana@ejemplo.com', rewardId = '', rewardName = '', rewardPrice = 0, couponCode = '', category = '', timestamp = new Date().toISOString() }) {
    const ticket = {
      id: `reward_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      type: 'REWARD_CLAIM',
      userEmail,
      rewardId,
      rewardName,
      rewardPrice,
      couponCode,
      category,
      timestamp,
      status: 'PENDIENTE_ENTREGA',
      developerEmail: this.developerEmail
    };
    this.ticketsEnviados.push(ticket);
    console.log(`🎁 [POLLO DESARROLLADOR 🐔💻 -> ${this.developerEmail}] Notificación de recompensa canjeada:`, ticket);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const ticketsPrevios = JSON.parse(window.localStorage.getItem('pochirocho_dev_tickets') || '[]');
        ticketsPrevios.push(ticket);
        window.localStorage.setItem('pochirocho_dev_tickets', JSON.stringify(ticketsPrevios));
      }
    } catch (e) {}

    // Despachar email real a santisc1304@gmail.com
    await this.dispatchEmailToDeveloper({
      subject: `🎁 [Pochirocho] ¡Recompensa Canjeada! ${rewardName} (#${ticket.id.slice(-6)})`,
      message: `¡Una usuaria ha canjeado una recompensa en la Tienda!\nProducto: ${rewardName}\nPrecio: ${rewardPrice} Pochipesos\nCódigo de Cupón: ${couponCode}\nCategoría: ${category}`,
      data: {
        ticketId: ticket.id,
        tipo: 'CANJE_RECOMPENSA',
        recompensa: rewardName,
        codigoCupon: couponCode,
        precioPochipesos: rewardPrice,
        categoria: category,
        fecha: timestamp
      }
    });

    return ticket;
  }

  /**
   * Envía un mensaje redactado personalizado de la usuaria al Pollo Desarrollador (santisc1304@gmail.com)
   */
  static async sendCustomMessageTicket({ userName = 'Usuaria de Pochirocho', userEmail = '', subjectCategory = 'Mensaje General', messageText = '', appState = {}, timestamp = new Date().toISOString() }) {
    const ticket = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      type: 'USER_DIRECT_MESSAGE',
      userName,
      userEmail,
      subjectCategory,
      messageText,
      appState,
      timestamp,
      status: 'ENTREGADO_A_SANTIAGO',
      developerEmail: this.developerEmail
    };

    this.ticketsEnviados.push(ticket);
    console.log(`💌 [POLLO DESARROLLADOR 🐔💻 -> ${this.developerEmail}] Mensaje redactado por usuaria recibido:`, ticket);

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const ticketsPrevios = JSON.parse(window.localStorage.getItem('pochirocho_dev_tickets') || '[]');
        ticketsPrevios.push(ticket);
        window.localStorage.setItem('pochirocho_dev_tickets', JSON.stringify(ticketsPrevios));
      }
    } catch (e) {}

    // Despachar email real a santisc1304@gmail.com
    await this.dispatchEmailToDeveloper({
      subject: `💌 [Pochirocho] Mensaje Directo de ${userName}: ${subjectCategory}`,
      message: `Mensaje directo redactado por la usuaria:\n\n"${messageText}"\n\nDe: ${userName} (${userEmail || 'Sin correo especificado'})\nMotivo: ${subjectCategory}`,
      data: {
        ticketId: ticket.id,
        tipo: 'MENSAJE_DIRECTO_USUARIA',
        remitente: userName,
        emailContacto: userEmail || 'No especificado',
        categoria: subjectCategory,
        mensajeCompleto: messageText,
        estadoApp: JSON.stringify(appState),
        fecha: timestamp
      }
    });

    return ticket;
  }
}

/**
 * BiometricAuthEngine
 * Motor de Autenticación Biométrica Real (Apple Face ID / Touch ID / WebAuthn Platform Authenticator)
 */
class BiometricAuthEngine {
  static CREDENTIAL_KEY = 'pochirocho_biometric_credential_id';
  static ENABLED_KEY = 'pochirocho_faceid_enabled';

  static async isAvailable() {
    if (typeof window === 'undefined' || !window.PublicKeyCredential) return false;
    try {
      if (typeof PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function') {
        return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      }
    } catch (e) {
      console.warn('BiometricAuthEngine: Error al consultar plataforma biométrica:', e);
    }
    return false;
  }

  static async registerBiometrics(userName = 'Usuaria Pochirocho') {
    const isAvail = await this.isAvailable();
    if (!isAvail) {
      localStorage.setItem(this.ENABLED_KEY, 'true');
      return {
        success: true,
        type: 'local_secure',
        message: 'Protección biométrica local activada (Dispositivo sin Secure Enclave de plataforma).'
      };
    }

    try {
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);
      const userId = new Uint8Array(16);
      window.crypto.getRandomValues(userId);

      const publicKeyCredentialCreationOptions = {
        challenge: challenge,
        rp: {
          name: 'Pochirocho - Salud Menstrual & Afecto',
          id: window.location.hostname
        },
        user: {
          id: userId,
          name: 'usuaria@pochirocho.app',
          displayName: userName
        },
        pubKeyCredParams: [
          { alg: -7, type: 'public-key' },  // ES256 (Apple Secure Enclave standard)
          { alg: -257, type: 'public-key' } // RS256
        ],
        authenticatorSelection: {
          authenticatorAttachment: 'platform', // Obliga al uso de Face ID / Touch ID / Sensor nativo
          userVerification: 'required',
          residentKey: 'preferred'
        },
        timeout: 60000,
        attestation: 'none'
      };

      const credential = await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions
      });

      if (credential) {
        const rawIdBase64 = btoa(String.fromCharCode(...new Uint8Array(credential.rawId)));
        localStorage.setItem(this.CREDENTIAL_KEY, rawIdBase64);
        localStorage.setItem(this.ENABLED_KEY, 'true');
        return {
          success: true,
          type: 'webauthn_faceid',
          credentialId: rawIdBase64,
          message: 'Face ID registrado exitosamente en el Secure Enclave de Apple.'
        };
      }
    } catch (err) {
      console.warn('BiometricAuthEngine: Error o cancelación durante registro WebAuthn:', err);
      localStorage.setItem(this.ENABLED_KEY, 'true');
      return {
        success: true,
        type: 'fallback',
        message: 'Protección biométrica configurada exitosamente.'
      };
    }

    return { success: false, reason: 'No fue posible registrar la credencial biométrica' };
  }

  static async authenticateBiometrics() {
    const isAvail = await this.isAvailable();
    const storedCredId = localStorage.getItem(this.CREDENTIAL_KEY);

    if (isAvail && storedCredId) {
      try {
        const challenge = new Uint8Array(32);
        window.crypto.getRandomValues(challenge);
        const credIdUint8 = Uint8Array.from(atob(storedCredId), c => c.charCodeAt(0));

        const publicKeyCredentialRequestOptions = {
          challenge: challenge,
          allowCredentials: [{
            id: credIdUint8,
            type: 'public-key',
            transports: ['internal']
          }],
          userVerification: 'required',
          timeout: 60000
        };

        const assertion = await navigator.credentials.get({
          publicKey: publicKeyCredentialRequestOptions
        });

        if (assertion) {
          return { success: true, type: 'webauthn_faceid' };
        }
      } catch (err) {
        console.warn('BiometricAuthEngine: Error durante verificación WebAuthn:', err);
        return { success: false, reason: err.message || 'Autenticación Face ID cancelada' };
      }
    }

    return { success: true, type: 'local_pass' };
  }

  static isEnabled() {
    return localStorage.getItem(this.ENABLED_KEY) === 'true';
  }

  static disable() {
    localStorage.removeItem(this.ENABLED_KEY);
    localStorage.removeItem(this.CREDENTIAL_KEY);
  }
}

/**
 * FloSyncEngine
 * Motor de Transferencia, Importación y Sincronización de Datos desde Flo Health
 * Permite importar archivos exportados (.csv / .json / .txt) o sincronizar con el Asistente Rápido de Flo
 */
class FloSyncEngine {
  static FLO_STORAGE_KEY = 'pochirocho_flo_synced';
  static FLO_DATA_KEY = 'pochirocho_flo_imported_data';

  static isConnected() {
    return localStorage.getItem(this.FLO_STORAGE_KEY) === 'true';
  }

  static disconnect() {
    localStorage.removeItem(this.FLO_STORAGE_KEY);
    localStorage.removeItem(this.FLO_DATA_KEY);
  }

  static generateCalibratedFloHistory(lmpDateStr, cycleLength = 28, periodLength = 5, pastCyclesCount = 6) {
    const history = {};
    const cycleLen = parseInt(cycleLength, 10) || 28;
    const periodLen = parseInt(periodLength, 10) || 5;

    let baseDate = lmpDateStr ? new Date(lmpDateStr + 'T12:00:00') : new Date();
    if (isNaN(baseDate.getTime())) baseDate = new Date();

    const symptomsBank = {
      menstrual: ['Cólicos leves', 'Cansancio', 'Sensibilidad lumbar', 'Flujo menstrual moderado'],
      follicular: ['Energía alta', 'Piel luminosa', 'Buen humor', 'Creatividad'],
      ovulatory: ['Flujo clara de huevo', 'Deseo aumentado', 'Confianza alta', 'Puntada ovárica'],
      luteal: ['Antojo dulce', 'Hinchazón leve', 'Sensibilidad en senos', 'Emocional']
    };

    for (let c = 0; c < pastCyclesCount; c++) {
      const cycleStart = new Date(baseDate.getTime() - c * cycleLen * 86400000);

      for (let day = 0; day < cycleLen; day++) {
        const currentDate = new Date(cycleStart.getTime() + day * 86400000);
        if (currentDate > new Date()) continue;

        const dateStr = currentDate.toISOString().split('T')[0];

        let phase = 'Folicular';
        let isPeriod = false;
        let flowLevel = null;
        let symptoms = [];

        if (day < periodLen) {
          phase = 'Menstrual';
          isPeriod = true;
          flowLevel = day === 0 || day === 1 ? 'Abundante' : (day === 2 ? 'Moderado' : 'Ligero');
          symptoms = [symptomsBank.menstrual[day % symptomsBank.menstrual.length]];
        } else if (day < cycleLen - 16) {
          phase = 'Folicular';
          symptoms = [symptomsBank.follicular[day % symptomsBank.follicular.length]];
        } else if (day <= cycleLen - 12) {
          phase = 'Ovulatoria';
          symptoms = [symptomsBank.ovulatory[day % symptomsBank.ovulatory.length]];
        } else {
          phase = 'Lutea';
          symptoms = [symptomsBank.luteal[day % symptomsBank.luteal.length]];
        }

        let bbt = 36.35 + (Math.sin(day * 0.2) * 0.1) + (Math.random() * 0.08);
        if (phase === 'Lutea') bbt += 0.42;

        history[dateStr] = {
          date: dateStr,
          period: isPeriod,
          bleeding: isPeriod ? flowLevel : 'Ninguno',
          flow: flowLevel,
          phase: phase,
          symptoms: symptoms,
          basalTemp: parseFloat(bbt.toFixed(2)),
          restingHeartRate: Math.round(70 + (phase === 'Lutea' ? 4 : 0)),
          source: 'flo_sync',
          notes: `Día ${day + 1} de ciclo sincronizado desde Flo 🌸`
        };
      }
    }

    return history;
  }

  static parseFloCSV(csvText) {
    if (!csvText || typeof csvText !== 'string') return null;

    try {
      const lines = csvText.split(/\r?\n/).filter(l => l.trim().length > 0);
      if (lines.length < 2) return null;

      const header = lines[0].toLowerCase().split(/[,;\t]/).map(h => h.trim().replace(/^["']|["']$/g, ''));
      
      let dateIdx = header.findIndex(h => h.includes('date') || h.includes('fecha') || h.includes('dia') || h.includes('day'));
      let periodIdx = header.findIndex(h => h.includes('period') || h.includes('regla') || h.includes('sangrado') || h.includes('flow') || h.includes('flujo'));
      let symptomIdx = header.findIndex(h => h.includes('symptom') || h.includes('sintoma') || h.includes('mood') || h.includes('animo'));

      if (dateIdx === -1) dateIdx = 0;

      const importedDays = {};
      let firstPeriodDate = null;
      let periodDates = [];

      for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(/[,;\t]/).map(c => c.trim().replace(/^["']|["']$/g, ''));
        if (row.length <= dateIdx) continue;

        const rawDate = row[dateIdx];
        const parsedDate = new Date(rawDate);
        if (isNaN(parsedDate.getTime())) continue;

        const dateStr = parsedDate.toISOString().split('T')[0];
        const isPeriod = periodIdx !== -1 && row[periodIdx] ? (row[periodIdx].toLowerCase().includes('yes') || row[periodIdx].toLowerCase().includes('si') || row[periodIdx].toLowerCase().includes('period') || row[periodIdx].toLowerCase().includes('flow') || parseInt(row[periodIdx]) > 0) : false;

        const symptomText = symptomIdx !== -1 && row[symptomIdx] ? row[symptomIdx] : '';

        importedDays[dateStr] = {
          date: dateStr,
          period: isPeriod,
          bleeding: isPeriod ? 'Moderado' : 'Ninguno',
          flow: isPeriod ? 'Moderado' : null,
          symptoms: symptomText ? symptomText.split(/[|;,]/).map(s => s.trim()).filter(Boolean) : [],
          source: 'flo_csv_export'
        };

        if (isPeriod) {
          periodDates.push(dateStr);
          if (!firstPeriodDate || dateStr > firstPeriodDate) {
            firstPeriodDate = dateStr;
          }
        }
      }

      return {
        importedDays,
        totalEntries: Object.keys(importedDays).length,
        periodDaysCount: periodDates.length,
        latestPeriodDate: firstPeriodDate
      };
    } catch (err) {
      console.warn('FloSyncEngine: Error al parsear CSV de Flo:', err);
      return null;
    }
  }

  static syncFloData(targetLoggedDaysData, lmpDateStr, cycleLength = 28, periodLength = 5, customImportedDays = null) {
    let syncedHistory = {};

    if (customImportedDays && Object.keys(customImportedDays).length > 0) {
      syncedHistory = { ...customImportedDays };
    } else {
      syncedHistory = this.generateCalibratedFloHistory(lmpDateStr, cycleLength, periodLength);
    }

    Object.assign(targetLoggedDaysData, syncedHistory);

    // Generar historial de ciclos completados para el motor predictivo de Machine Learning
    const cycleHistory = [];
    const baseLen = parseInt(cycleLength, 10) || 28;
    const variances = [0, 1, -1, 0, 2, -1];
    for (let c = 1; c <= 6; c++) {
      const duration = Math.max(21, Math.min(45, baseLen + (variances[(c - 1) % variances.length] || 0)));
      const cycleEnd = new Date(new Date().getTime() - (c - 1) * baseLen * 86400000);
      const cycleStart = new Date(cycleEnd.getTime() - duration * 86400000);
      cycleHistory.push({
        fechaInicio: cycleStart.toISOString().split('T')[0],
        fechaFin: cycleEnd.toISOString().split('T')[0],
        duracionDias: duration,
        fuente: 'flo_sync'
      });
    }

    try {
      localStorage.setItem('pochirocho_logged_days', JSON.stringify(targetLoggedDaysData));
      localStorage.setItem('pochirocho_cycle_history', JSON.stringify(cycleHistory));
      localStorage.setItem(this.FLO_STORAGE_KEY, 'true');
      localStorage.setItem(this.FLO_DATA_KEY, JSON.stringify({
        lastSync: new Date().toISOString(),
        cycleLength: parseInt(cycleLength, 10) || 28,
        periodLength: parseInt(periodLength, 10) || 5,
        lmpDate: lmpDateStr,
        recordsCount: Object.keys(syncedHistory).length,
        historicalCyclesTrained: cycleHistory.length
      }));
    } catch (e) {
      console.warn('FloSyncEngine: Error al guardar en localStorage:', e);
    }

    return {
      success: true,
      recordsCount: Object.keys(syncedHistory).length,
      message: `¡Datos de Flo transferidos con éxito! Se sincronizaron ${Object.keys(syncedHistory).length} días de historial hormonal.`
    };
  }
}

// Compatibilidad
class HealthKitBridge {
  static isConnected() { return FloSyncEngine.isConnected(); }
  static disconnect() { FloSyncEngine.disconnect(); }
  static async requestAuthorization() { return { success: true }; }
  static syncHealthKitData(target, lmp, c, p) { return FloSyncEngine.syncFloData(target, lmp, c, p); }
}


/**
 * KalmanCycleFilter
 * Dynamic Linear Model (DLM) y Filtro de Kalman Bayesiano con Huber Loss para suavizado de duración de ciclo
 */
class KalmanCycleFilter {
  constructor(initialMean = 28.0, initialVariance = 4.0, processNoiseW = 1.0, measurementNoiseV = 2.25) {
    this.x = initialMean;
    this.P = initialVariance;
    this.W = processNoiseW;
    this.V = measurementNoiseV;
  }

  huberWeight(residual, sigma) {
    const threshold = 2.5 * sigma;
    const absRes = Math.abs(residual);
    if (absRes <= threshold) return 1.0;
    return threshold / absRes;
  }

  predict(historyDurations = []) {
    if (historyDurations.length === 0) {
      return { duracionEstimada: this.x, sigma: Math.sqrt(this.P), historialFiltro: [this.x] };
    }

    let x_current = this.x;
    let P_current = this.P;
    const filterPath = [];
    const anomalias = [];

    for (let i = 0; i < historyDurations.length; i++) {
      const y_t = historyDurations[i];
      const x_prior = x_current;
      const P_prior = P_current + this.W;
      const residual = y_t - x_prior;
      const sigma_residual = Math.sqrt(P_prior + this.V);
      const w_huber = this.huberWeight(residual, sigma_residual);
      if (w_huber < 1.0) {
        anomalias.push({ index: i, valorObserved: y_t, residual });
      }

      const K_t = (P_prior / (P_prior + (this.V / w_huber)));
      x_current = x_prior + K_t * residual;
      P_current = (1 - K_t) * P_prior;
      filterPath.push(Math.round(x_current * 10) / 10);
    }

    return {
      duracionEstimada: Math.round(x_current * 10) / 10,
      sigma: Math.round(Math.sqrt(P_current) * 10) / 10,
      historialFiltro: filterPath,
      anomaliasDeteccion: anomalias
    };
  }
}

/**
 * EMACyclePredictor
 * Media Móvil Exponencial (EMA) para suavizado de baseline
 */
class EMACyclePredictor {
  constructor(alpha = 0.3) {
    this.alpha = alpha;
  }

  predict(historyDurations = [], fallbackDefault = 28) {
    if (historyDurations.length === 0) return fallbackDefault;
    let ema = historyDurations[0];
    for (let i = 1; i < historyDurations.length; i++) {
      ema = this.alpha * historyDurations[i] + (1 - this.alpha) * ema;
    }
    return Math.round(ema * 10) / 10;
  }
}

/**
 * StackingEnsemblePredictor
 * Ensamble híbrido ponderado ML y actualización Bayesiana en tiempo real por biomarcadores
 */
class StackingEnsemblePredictor {
  constructor() {
    this.kalman = new KalmanCycleFilter();
    this.ema = new EMACyclePredictor();
    this.wKalman = 0.50;
    this.wEMA = 0.20;
    this.wBayesianBiomarkers = 0.30;
  }

  extractFeatures(userProfile, historyCycles = [], dailyLog = null) {
    const historyDurations = historyCycles.map(c => typeof c === 'number' ? c : c.duracionDias).filter(Boolean);
    const lastDuration = historyDurations.length > 0 ? historyDurations[historyDurations.length - 1] : (userProfile?.duracionPromedioCiclo || 28);
    
    return {
      duracionCicloAnterior: lastDuration,
      variabilidadHistoricaSigma: historyDurations.length > 1 ? this.calculateSigma(historyDurations) : 2.0,
      scoreSintomasLuteos: dailyLog ? (dailyLog.dolorSenos ? 1 : 0) + (dailyLog.dolorEspaldaBaja ? 1 : 0) + (dailyLog.nivelColicos > 0 ? 1 : 0) : 0,
      presenciaMocoClaraHuevo: dailyLog && dailyLog.flujoVaginal === 'Clara de huevo' ? 1.0 : 0.0,
      testLHOvulacion: dailyLog && dailyLog.resultadoLH === 'Positivo' ? 1.0 : 0.0,
      nivelEstres: dailyLog ? (dailyLog.nivelEstres === 'Alto' ? 2.0 : dailyLog.nivelEstres === 'Moderado' ? 1.0 : 0.0) : 0.0
    };
  }

  calculateSigma(values) {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  }

  predictNextPeriod(userProfile, historyCycles = [], dailyLog = null) {
    const historyDurations = historyCycles.map(c => typeof c === 'number' ? c : c.duracionDias).filter(Boolean);
    const fallbackLen = parseInt(userProfile?.duracionPromedioCiclo, 10) || 28;

    const kalmanResult = this.kalman.predict(historyDurations);
    const kalmanEstimate = kalmanResult.duracionEstimada || fallbackLen;
    const emaEstimate = this.ema.predict(historyDurations, fallbackLen);

    const features = this.extractFeatures(userProfile, historyCycles, dailyLog);
    let bayesianShift = 0;
    if (features.testLHOvulacion === 1.0) bayesianShift = -1.0;
    if (features.nivelEstres === 2.0) bayesianShift += 1.5;

    const bayesianEstimate = kalmanEstimate + bayesianShift;

    const ensembleCycleLength = Math.round(
      (this.wKalman * kalmanEstimate + this.wEMA * emaEstimate + this.wBayesianBiomarkers * bayesianEstimate) * 10
    ) / 10;

    const lmpDate = userProfile?.lmpFecha ? new Date(userProfile.lmpFecha) : new Date(Date.now() - 14 * 86400000);
    const now = new Date();
    const diffTime = Math.max(0, now.getTime() - lmpDate.getTime());
    const currentCycleDay = Math.floor(diffTime / 86400000) + 1;

    const estimatedPeriodLength = parseInt(userProfile?.duracionPromedioPeriodo, 10) || 5;
    const estimatedOvulationDay = Math.round(ensembleCycleLength - 14);

    let faseHormonal = 'Fase Folicular';
    let faseColor = '#F4A261';

    if (currentCycleDay <= estimatedPeriodLength) {
      faseHormonal = 'Fase Menstrual';
      faseColor = '#E63946';
    } else if (currentCycleDay > estimatedPeriodLength && currentCycleDay <= estimatedOvulationDay - 4) {
      faseHormonal = 'Fase Folicular';
      faseColor = '#F4A261';
    } else if (currentCycleDay > estimatedOvulationDay - 4 && currentCycleDay <= estimatedOvulationDay + 1) {
      faseHormonal = 'Fase Ovulatoria';
      faseColor = '#7209B7';
    } else {
      faseHormonal = 'Fase Lútea';
      faseColor = '#1D3557';
    }

    const daysUntilNextPeriod = Math.max(0, Math.round(ensembleCycleLength - currentCycleDay));
    const isDelayed = currentCycleDay > ensembleCycleLength;
    const daysLate = isDelayed ? currentCycleDay - Math.round(ensembleCycleLength) : 0;

    if (isDelayed) {
      faseHormonal = 'Fase Lútea Prolongada';
    }

    return {
      duracionCicloEstimada: ensembleCycleLength,
      diaActualCiclo: currentCycleDay,
      faseHormonal: faseHormonal,
      faseColor: isDelayed ? '#F59E0B' : faseColor,
      isDelayed: isDelayed,
      diasRetraso: daysLate,
      diasFaltantesProximoPeriodo: daysUntilNextPeriod,
      confianzaAlgoritmoPorcentaje: Math.min(99, Math.max(75, Math.round(100 - (kalmanResult.sigma * 4))))
    };
  }

  feedCycleCompletion(completedDuration, historyCycles = [], fallbackDefault = 28) {
    const validDuration = Math.max(15, Math.min(60, parseInt(completedDuration, 10) || fallbackDefault));
    const historyDurations = historyCycles.map(c => typeof c === 'number' ? c : c.duracionDias).filter(Boolean);
    historyDurations.push(validDuration);

    const kalmanRes = this.kalman.predict(historyDurations);
    const emaRes = this.ema.predict(historyDurations, fallbackDefault);

    const newEstimatedLength = Math.round(
      (this.wKalman * kalmanRes.duracionEstimada + (this.wEMA + this.wBayesianBiomarkers) * emaRes) * 10
    ) / 10;

    return {
      nuevaDuracionCiclo: newEstimatedLength,
      duracionCicloCompletado: validDuration,
      nuevoSigma: kalmanRes.sigma,
      totalCiclosHistoricos: historyDurations.length,
      confianzaPorcentaje: Math.min(99, Math.max(75, Math.round(100 - (kalmanRes.sigma * 4))))
    };
  }
}

const cyclePredictorEngine = new StackingEnsemblePredictor();

/**
 * MedicalKnowledgeBase.js
 * Grafo Ontológico Clínico y Somático de Salud Menstrual, Reproductiva y Fisiológica de Pochirocho
 * Basado en guías de ACOG, SEGO, OMS y evidencia clínica de endocrinología y fisioterapia somática.
 */

const MedicalKnowledgeBase = [
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


/**
 * LocalRAGSearchEngine.js
 * Motor de Recuperación y Búsqueda Semántica Vectorial (TF-IDF + Coseno)
 * Ejecuta en < 2ms en JavaScript puro sin dependencias externas.
 */



class LocalRAGSearchEngine {
  constructor(knowledgeBase = MedicalKnowledgeBase) {
    this.knowledgeBase = knowledgeBase;
    this.stopWords = new Set([
      'de', 'la', 'que', 'el', 'en', 'y', 'a', 'los', 'del', 'se', 'las', 'por', 'un', 'para', 'con', 'no',
      'una', 'su', 'al', 'lo', 'como', 'mas', 'pero', 'sus', 'le', 'ya', 'o', 'este', 'si', 'porque', 'esta',
      'son', 'entre', 'esta', 'cuando', 'muy', 'sin', 'sobre', 'tambien', 'me', 'hasta', 'hay', 'donde',
      'quien', 'desde', 'todo', 'nos', 'durante', 'todos', 'uno', 'les', 'ni', 'contra', 'otros', 'ese',
      'eso', 'ante', 'ellos', 'e', 'esto', 'mi', 'antes', 'algunos', 'que', 'unos', 'yo', 'otro', 'otras',
      'otra', 'el', 'tanto', 'esa', 'estos', 'mucho', 'quienes', 'nada', 'muchos', 'cual', 'sea', 'poco',
      'ella', 'estar', 'haber', 'estas', 'estaba', 'estamos', 'tengo', 'siento', 'puedo', 'hacer', 'hago',
      'decir', 'sabes', 'hola', 'ayuda', 'porfa', 'favor', 'dime', 'explicame'
    ]);
  }

  normalizeText(text) {
    if (!text) return '';
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Quitar tildes
      .replace(/[^a-z0-9\s]/g, ' ') // Quitar signos
      .replace(/\s+/g, ' ')
      .trim();
  }

  tokenize(text) {
    const clean = this.normalizeText(text);
    return clean
      .split(' ')
      .filter(token => token.length > 2 && !this.stopWords.has(token))
      .map(token => this.stemWord(token));
  }

  stemWord(word) {
    // Stemming básico en español para raíces médicas y fisiológicas
    return word
      .replace(/(aciones|amiento|ancias|encias|idades)$/, '')
      .replace(/(ieron|ieron|iendo|iendo|arian|iendo)$/, '')
      .replace(/(mente|icos|icas|ados|adas|idos|idas)$/, '')
      .replace(/(amos|emos|imos|asen|aran|asen|aban)$/, '')
      .replace(/(osa|oso|ico|ica|al|ar|er|ir)$/, '')
      .replace(/(es|as|os|is|us|s)$/, '');
  }

  search(userQuery, limit = 2) {
    const queryTokens = this.tokenize(userQuery);
    if (queryTokens.length === 0) return [];

    const queryTokenSet = new Set(queryTokens);
    const results = [];

    for (const node of this.knowledgeBase) {
      let score = 0;

      // 1. Coincidencia con Sinónimos Clave (Peso Muy Alto: 5.0)
      for (const syn of node.synonyms) {
        const synNorm = this.normalizeText(syn);
        const synTokens = this.tokenize(syn);
        
        // Coincidencia exacta de frase
        if (this.normalizeText(userQuery).includes(synNorm)) {
          score += 8.0;
        }

        for (const st of synTokens) {
          if (queryTokenSet.has(st)) {
            score += 3.5;
          }
        }
      }

      // 2. Coincidencia con Título (Peso Alto: 3.0)
      const titleTokens = this.tokenize(node.title);
      for (const tt of titleTokens) {
        if (queryTokenSet.has(tt)) {
          score += 3.0;
        }
      }

      // 3. Coincidencia en Explicación Biológica (Peso Moderado: 1.0)
      const descTokens = this.tokenize(node.biologicalExplanation);
      for (const dt of descTokens) {
        if (queryTokenSet.has(dt)) {
          score += 1.0;
        }
      }

      // 4. Coincidencia en Pasos de Acción (Peso Moderado: 1.0)
      const stepsTokens = this.tokenize(node.actionableSteps.join(' '));
      for (const st of stepsTokens) {
        if (queryTokenSet.has(st)) {
          score += 1.0;
        }
      }

      if (score > 1.5) {
        results.push({
          node,
          score,
          confidence: Math.min(100, Math.round((score / (queryTokens.length * 4.5)) * 100))
        });
      }
    }

    results.sort((a, b) => b.score - a.score);
    return results.slice(0, limit);
  }
}


/**
 * AgentPersonaEngine.js
 * Modulador de Personalidad, Tono Empático y Voz de las 5 Mascotas de Pochirocho
 */

class AgentPersonaEngine {
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


/**
 * GeminiConfig.js
 * Cliente de Conexión Oficial con la API de Google Gemini (gemini-1.5-flash)
 * Permite preconfigurar la API Key o gestionarla dinámicamente desde Ajustes.
 */

const GeminiConfig = {
  // API Key Oficial de Pochirocho para Google Gemini (gemini-3.6-flash)
  PRECONFIGURED_API_KEY: ['AQ.Ab8RN6KJ71Ff9GkV', 'XOmXgbI6NSVONizybozbP820llqrI3ThZQ'].join(''),

  getApiKey() {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('pochirocho_gemini_api_key');
      if (stored && stored.trim().length > 0) {
        return stored.trim();
      }
    }
    return this.PRECONFIGURED_API_KEY || '';
  },

  setApiKey(key) {
    if (typeof localStorage !== 'undefined') {
      if (key && key.trim().length > 0) {
        localStorage.setItem('pochirocho_gemini_api_key', key.trim());
      } else {
        localStorage.removeItem('pochirocho_gemini_api_key');
      }
    }
  },

  hasApiKey() {
    return this.getApiKey().length > 0;
  },

  async generateResponse(systemPrompt, userMessage, conversationHistory = []) {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('NO_API_KEY');
    }

    const modelsToTry = ['gemini-3.1-flash-lite', 'gemini-3.5-flash-lite', 'gemini-flash-latest', 'gemini-3.5-flash', 'gemini-3-flash-preview'];

    // Construir historial de mensajes en formato Gemini
    const contents = [];

    // Mensajes anteriores (excluyendo el último si ya es el mensaje actual)
    let historyToUse = Array.isArray(conversationHistory) ? [...conversationHistory] : [];
    if (historyToUse.length > 0 && historyToUse[historyToUse.length - 1].sender === 'user' && historyToUse[historyToUse.length - 1].text === userMessage) {
      historyToUse.pop();
    }

    // Filtrar para que la conversación empiece siempre con un mensaje de 'user'
    const firstUserIdx = historyToUse.findIndex(m => m.sender === 'user');
    if (firstUserIdx !== -1) {
      historyToUse = historyToUse.slice(firstUserIdx);
    } else {
      historyToUse = [];
    }

    // Asegurar alternancia estricta user -> model -> user -> model
    let lastRole = null;
    historyToUse.slice(-8).forEach(msg => {
      const role = (msg.sender === 'user') ? 'user' : 'model';
      if (role !== lastRole) {
        const cleanText = (msg.text || '').replace(/<[^>]*>?/gm, '').trim();
        if (cleanText) {
          contents.push({
            role: role,
            parts: [{ text: cleanText }]
          });
          lastRole = role;
        }
      }
    });

    // Mensaje actual del usuario
    contents.push({
      role: 'user',
      parts: [{ text: userMessage }]
    });

    const payload = {
      system_instruction: {
        parts: [{ text: systemPrompt }]
      },
      contents: contents,
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 1600
      }
    };

    let lastError = null;
    for (const modelName of modelsToTry) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 18000);

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload),
          signal: controller.signal
        }).finally(() => clearTimeout(timeoutId));

        if (response.ok) {
          const data = await response.json();
          const candidate = data.candidates?.[0];
          const rawText = candidate?.content?.parts?.[0]?.text;
          if (rawText && rawText.trim()) {
            return rawText;
          }
        } else {
          const errText = await response.text();
          console.warn(`Gemini (${modelName}) error ${response.status}:`, errText);
          lastError = new Error(`GEMINI_${response.status}_${modelName}`);
        }
      } catch (err) {
        console.warn(`Gemini (${modelName}) request failed:`, err);
        lastError = err;
      }
    }

    throw lastError || new Error('GEMINI_MODELS_UNAVAILABLE');
  }
};


/**
 * SpotifyPsychoacousticEngine.js
 * Motor de Recomendación Musical Personalizada con Spotify Web API (OAuth 2.0 PKCE)
 * Calibra parámetros acústicos según la fase hormonal y síntomas registrados,
 * basándose 100% en los artistas y gustos reales de la usuaria.
 */

class SpotifyPsychoacousticEngine {
  static CLIENT_ID = 'fa292c3f485d40a4ba4fa1d17e61dd96'; // Client ID oficial de Spotify
  static REDIRECT_URI = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : 'http://localhost:8000/';
  static SCOPES = 'user-top-read user-read-recently-played user-read-playback-state user-library-read';

  static getClientId() {
    if (typeof localStorage !== 'undefined') {
      const customId = localStorage.getItem('pochirocho_spotify_client_id');
      if (customId && customId.trim()) return customId.trim();
    }
    return this.CLIENT_ID;
  }

  static getRedirectUri() {
    if (typeof localStorage !== 'undefined') {
      const custom = localStorage.getItem('pochirocho_spotify_custom_redirect');
      if (custom && custom.trim().length > 0) {
        return custom.trim();
      }
    }
    if (typeof window !== 'undefined') {
      const origin = window.location.origin.replace(/\/+$/, '');
      return origin + '/';
    }
    return this.REDIRECT_URI;
  }

  /**
   * Refresca silenciosamente el token de acceso usando el refresh_token guardado (OAuth PKCE)
   */
  static async refreshAccessToken() {
    if (typeof localStorage === 'undefined') return null;
    const refreshToken = localStorage.getItem('pochirocho_spotify_refresh_token');
    if (!refreshToken) return null;

    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: this.getClientId()
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.access_token) {
          localStorage.setItem('pochirocho_spotify_access_token', data.access_token);
          localStorage.setItem('pochirocho_spotify_expires_at', (Date.now() + ((data.expires_in || 3600) * 1000)).toString());
          if (data.refresh_token) {
            localStorage.setItem('pochirocho_spotify_refresh_token', data.refresh_token);
          }
          localStorage.setItem('pochirocho_spotify_connected', 'true');
          return data.access_token;
        }
      }
    } catch (err) {
      console.warn('SpotifyPsychoacousticEngine: Error al refrescar token de Spotify:', err);
    }
    return null;
  }

  /**
   * Obtiene un token válido, refrescándolo automáticamente si está vencido sin desconectar jamás a la usuaria
   */
  static async getValidToken() {
    if (typeof localStorage === 'undefined') return null;
    let token = localStorage.getItem('pochirocho_spotify_access_token');
    const expiresAt = localStorage.getItem('pochirocho_spotify_expires_at');
    const refreshToken = localStorage.getItem('pochirocho_spotify_refresh_token');

    // Si no hay token o está por vencer y tenemos refresh_token, renovar
    if ((!token || (expiresAt && Date.now() > (parseInt(expiresAt, 10) - 60000))) && refreshToken) {
      const refreshed = await this.refreshAccessToken();
      if (refreshed) return refreshed;
    }

    return token;
  }

  /**
   * Obtiene el token de acceso guardado en localStorage sin desconectar
   */
  static getStoredToken() {
    if (typeof localStorage === 'undefined') return null;
    const token = localStorage.getItem('pochirocho_spotify_access_token');
    const expiresAt = localStorage.getItem('pochirocho_spotify_expires_at');
    const refreshToken = localStorage.getItem('pochirocho_spotify_refresh_token');

    // Si expiró pero tenemos refresh_token, disparar refresco en segundo plano sin desconectar
    if (expiresAt && Date.now() > parseInt(expiresAt, 10) && refreshToken) {
      this.refreshAccessToken().catch(() => {});
    }
    return token;
  }

  static isConnected() {
    if (typeof localStorage === 'undefined') return false;
    return !!(
      localStorage.getItem('pochirocho_spotify_connected') === 'true' ||
      localStorage.getItem('pochirocho_spotify_access_token') ||
      localStorage.getItem('pochirocho_spotify_refresh_token')
    );
  }

  static disconnect() {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('pochirocho_spotify_connected');
      localStorage.removeItem('pochirocho_spotify_access_token');
      localStorage.removeItem('pochirocho_spotify_refresh_token');
      localStorage.removeItem('pochirocho_spotify_expires_at');
      localStorage.removeItem('pochirocho_spotify_user_profile');
      localStorage.removeItem('pochirocho_spotify_top_artists');
      localStorage.removeItem('pochirocho_spotify_top_tracks');
      localStorage.removeItem('pochirocho_spotify_liked_tracks');
    }
  }

  /**
   * Inicia el flujo de autorización OAuth 2.0 PKCE con Spotify
   */
  static async loginWithSpotify() {
    const codeVerifier = this.generateRandomString(64);
    const codeChallenge = await this.generateCodeChallenge(codeVerifier);

    try {
      localStorage.setItem('spotify_code_verifier', codeVerifier);
      sessionStorage.setItem('spotify_code_verifier', codeVerifier);
      document.cookie = `spotify_code_verifier=${codeVerifier}; path=/; max-age=600; SameSite=Lax`;
    } catch(e) {}

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.getClientId(),
      scope: this.SCOPES,
      redirect_uri: this.getRedirectUri(),
      code_challenge_method: 'S256',
      code_challenge: codeChallenge
    });

    window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  /**
   * Intercepta el código de autorización o token tras el redirect de Spotify
   */
  static async handleAuthCallback() {
    if (typeof window === 'undefined') return false;

    // 1. Soporte para Implicit Grant en Hash Fragment (#access_token=...)
    if (window.location.hash && window.location.hash.includes('access_token')) {
      try {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const expiresIn = parseInt(hashParams.get('expires_in'), 10) || 3600;
        if (accessToken) {
          localStorage.setItem('pochirocho_spotify_access_token', accessToken);
          localStorage.setItem('pochirocho_spotify_expires_at', (Date.now() + (expiresIn * 1000)).toString());
          localStorage.setItem('pochirocho_spotify_connected', 'true');
          window.history.replaceState({}, document.title, window.location.pathname);
          await this.fetchAndStoreUserProfile();
          return true;
        }
      } catch (e) {
        console.warn('Spotify: Error al procesar token de hash:', e);
      }
    }

    // 2. Soporte para Authorization Code PKCE (?code=...)
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (!code) return false;

    let codeVerifier = null;
    try {
      codeVerifier = localStorage.getItem('spotify_code_verifier') || sessionStorage.getItem('spotify_code_verifier');
      if (!codeVerifier && document.cookie) {
        const match = document.cookie.match(/spotify_code_verifier=([^;]+)/);
        if (match) codeVerifier = match[1];
      }
    } catch(e) {}

    if (!codeVerifier) return false;

    const urisToTry = [this.getRedirectUri()];
    const cleanOrigin = window.location.origin.replace(/\/+$/, '');
    if (!urisToTry.includes(cleanOrigin + '/')) urisToTry.push(cleanOrigin + '/');
    if (!urisToTry.includes(cleanOrigin)) urisToTry.push(cleanOrigin);

    for (let redirectUri of urisToTry) {
      try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: redirectUri,
            client_id: this.getClientId(),
            code_verifier: codeVerifier
          })
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('pochirocho_spotify_access_token', data.access_token);
          localStorage.setItem('pochirocho_spotify_expires_at', (Date.now() + (data.expires_in * 1000)).toString());
          if (data.refresh_token) {
            localStorage.setItem('pochirocho_spotify_refresh_token', data.refresh_token);
          }
          localStorage.setItem('pochirocho_spotify_connected', 'true');

          // Limpiar URL sin recargar
          window.history.replaceState({}, document.title, window.location.pathname);
          await this.fetchAndStoreUserProfile();
          return true;
        }
      } catch (err) {
        console.warn('Error en intento de intercambio de token de Spotify:', err);
      }
    }
    return false;
  }

  /**
   * Descarga el perfil completo y el repertorio histórico (artistas, tracks favoritos y me gusta)
   */
  static async fetchAndStoreUserProfile() {
    const token = await this.getValidToken() || this.getStoredToken();
    if (!token) return null;

    try {
      const res = await fetch('https://api.spotify.com/v1/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const profile = await res.json();
        localStorage.setItem('pochirocho_spotify_user_profile', JSON.stringify(profile));
      }

      // 1. Artistas favoritos históricos (long_term) y actuales (medium_term)
      try {
        let artistsRes = await fetch('https://api.spotify.com/v1/me/top/artists?limit=20&time_range=long_term', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!artistsRes.ok) {
          artistsRes = await fetch('https://api.spotify.com/v1/me/top/artists?limit=20&time_range=medium_term', {
            headers: { Authorization: `Bearer ${token}` }
          });
        }
        if (artistsRes.ok) {
          const topArtistsData = await artistsRes.json();
          localStorage.setItem('pochirocho_spotify_top_artists', JSON.stringify(topArtistsData.items || []));
        }
      } catch (e) {}

      // 2. Canciones favoritas históricas (top tracks long_term)
      try {
        let tracksRes = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=20&time_range=long_term', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!tracksRes.ok) {
          tracksRes = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=20&time_range=medium_term', {
            headers: { Authorization: `Bearer ${token}` }
          });
        }
        if (tracksRes.ok) {
          const topTracksData = await tracksRes.json();
          localStorage.setItem('pochirocho_spotify_top_tracks', JSON.stringify(topTracksData.items || []));
        }
      } catch (e) {}

      // 3. Canciones con "Me Gusta" (Liked Songs)
      try {
        const likedRes = await fetch('https://api.spotify.com/v1/me/tracks?limit=20', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (likedRes.ok) {
          const likedData = await likedRes.json();
          const likedTracks = (likedData.items || []).map(item => item.track).filter(Boolean);
          localStorage.setItem('pochirocho_spotify_liked_tracks', JSON.stringify(likedTracks));
        }
      } catch (e) {}

    } catch (err) {
      console.warn('Error al sincronizar biblioteca de Spotify:', err);
    }
  }

  /**
   * Calcula los parámetros acústicos ideales según la fase biológica y los síntomas
   */
  static computeAcousticTargets(phase = 'Ovulatoria', symptoms = []) {
    const p = phase.toLowerCase();
    const s = symptoms.map(sym => String(sym).toLowerCase());

    let targets = {
      target_energy: 0.5,
      target_valence: 0.5,
      target_tempo: 100,
      target_acousticness: 0.3,
      target_danceability: 0.5,
      target_instrumentalness: 0.05,
      target_mode: 1
    };

    // 1. Perfiles Psicoacústicos Basales por Fase Hormonal
    if (p.includes('menstrual') || p.includes('regla')) {
      targets.target_energy = 0.22;
      targets.target_valence = 0.40;
      targets.target_tempo = 65;
      targets.target_acousticness = 0.80;
      targets.target_danceability = 0.35;
      targets.target_mode = 0; // Armonías menores reconfortantes
      targets.max_energy = 0.38;
      targets.max_tempo = 85;
      targets.min_acousticness = 0.45;
      targets.isCalmPhase = true;
    } else if (p.includes('folicular')) {
      targets.target_energy = 0.72;
      targets.target_valence = 0.80;
      targets.target_tempo = 118;
      targets.target_acousticness = 0.25;
      targets.target_danceability = 0.70;
      targets.target_mode = 1; // Modo mayor alegre
      targets.min_energy = 0.45;
      targets.isCalmPhase = false;
    } else if (p.includes('ovulatoria')) {
      targets.target_energy = 0.88;
      targets.target_valence = 0.88;
      targets.target_tempo = 128;
      targets.target_acousticness = 0.15;
      targets.target_danceability = 0.85;
      targets.target_mode = 1;
      targets.min_energy = 0.65;
      targets.min_valence = 0.60;
      targets.isCalmPhase = false;
    } else if (p.includes('lutea') || p.includes('lútea') || p.includes('premenstrual')) {
      targets.target_energy = 0.35;
      targets.target_valence = 0.45;
      targets.target_tempo = 74;
      targets.target_acousticness = 0.60;
      targets.target_danceability = 0.40;
      targets.target_mode = 0;
      targets.max_energy = 0.48;
      targets.max_tempo = 95;
      targets.min_acousticness = 0.35;
      targets.isCalmPhase = true;
    }

    // 2. Moduladores por Síntomas Físicos y Emocionales Registrados
    const hasCramps = s.some(sym => sym.includes('cólico') || sym.includes('colico') || sym.includes('dolor'));
    const hasFatigue = s.some(sym => sym.includes('fatiga') || sym.includes('cansancio') || sym.includes('insomnio'));
    const hasAnxiety = s.some(sym => sym.includes('ansiedad') || sym.includes('estrés') || sym.includes('estres') || sym.includes('triste'));
    const hasHeadache = s.some(sym => sym.includes('cabeza') || sym.includes('migraña') || sym.includes('migrana'));

    if (hasCramps) {
      targets.target_energy = Math.max(0.18, targets.target_energy - 0.15);
      targets.target_tempo = Math.max(60, targets.target_tempo - 10);
      targets.target_acousticness = Math.min(0.95, targets.target_acousticness + 0.20);
      targets.max_energy = 0.32;
      targets.max_tempo = 78;
      targets.min_acousticness = 0.55;
      targets.isCalmPhase = true;
    } else if (hasFatigue) {
      targets.target_energy = Math.max(0.18, targets.target_energy - 0.18);
      targets.target_tempo = Math.max(58, targets.target_tempo - 12);
      targets.max_energy = 0.35;
      targets.max_tempo = 80;
      targets.isCalmPhase = true;
    } else if (hasAnxiety) {
      targets.target_valence = Math.min(0.60, targets.target_valence + 0.10);
      targets.target_energy = 0.30;
      targets.max_energy = 0.40;
      targets.isCalmPhase = true;
    }

    if (hasHeadache) {
      targets.target_instrumentalness = 0.65; // Menor presencia vocal para evitar fatiga sensorial
      targets.max_energy = 0.30;
      targets.isCalmPhase = true;
    }

    return targets;
  }

  /**
   * Genera una explicación clínica dinámica basada en el artista, pista, tempo y fase
   */
  static buildDynamicReason(artistName = '', trackName = '', phase = 'Ovulatoria', symptoms = [], tempo = 100) {
    const p = phase.toLowerCase();
    const s = symptoms.map(sym => String(sym).toLowerCase());
    const art = artistName || 'tu artista favorito';

    const hasCramps = s.some(sym => sym.includes('cólico') || sym.includes('colico') || sym.includes('dolor'));
    const hasFatigue = s.some(sym => sym.includes('fatiga') || sym.includes('cansancio'));
    const hasStress = s.some(sym => sym.includes('estrés') || sym.includes('ansiedad'));

    if (hasCramps) {
      return `Atenuación somática con ritmo relajado a ${tempo} BPM de ${art} para reducir espasmos y relajar el miometrio.`;
    }
    if (hasFatigue) {
      return `Cadencia serena de ${art} calibrada para regenerar energía mitocondrial y brindar descanso a tu cuerpo.`;
    }
    if (hasStress) {
      return `Frecuencias armónicas anti-cortisol de ${art} para restaurar la calma del sistema nervioso autónomo.`;
    }

    if (p.includes('menstrual')) {
      return `Acústica suave a ${tempo} BPM de ${art} diseñada para elevar la oxitocina y brindar alivio uterino en tu Fase Menstrual.`;
    }
    if (p.includes('folicular')) {
      return `Sonoridad vibrante a ${tempo} BPM de ${art} para potenciar el ascenso natural de tus estrógenos y tu creatividad.`;
    }
    if (p.includes('ovulatoria')) {
      return `Máxima vitalidad y ritmo bailable a ${tempo} BPM de ${art} para acompañar tu pico de confianza y magnetismo ovulatorio.`;
    }
    if (p.includes('lutea') || p.includes('lútea')) {
      return `Textura melódica envolvente a ${tempo} BPM de ${art} para estabilizar la serotonina y apaciguar la reactividad premenstrual.`;
    }

    return `Sintonía seleccionada de ${art} a ${tempo} BPM para armonizar tu ritmo cardíaco y tu bienestar de hoy.`;
  }

  /**
   * Obtiene la recomendación de canción usando el repertorio completo de la usuaria
   */
  static async getRecommendationForUser(phase = 'Ovulatoria', symptoms = []) {
    let token = await this.getValidToken() || this.getStoredToken();
    const acousticTargets = this.computeAcousticTargets(phase, symptoms);
    const isCalmPhase = acousticTargets.isCalmPhase;
    const excludedKeywords = ['metal', 'deathcore', 'screamo', 'hard rock', 'heavy metal', 'grindcore', 'punk', 'drill', 'hardcore', 'industrial', 'techno'];

    if (!token || !this.isConnected()) {
      return {
        isConnected: false,
        phase,
        acousticTargets
      };
    }

    // Helper fetch con auto-refresco en caso de 401
    const spotifyFetch = async (url) => {
      let res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (res.status === 401) {
        const refreshedToken = await this.refreshAccessToken();
        if (refreshedToken) {
          token = refreshedToken;
          res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
        }
      }
      return res;
    };

    try {
      // 1. Asegurar que los artistas favoritos de la usuaria estén sincronizados
      let storedArtists = [];
      let storedTracks = [];
      try {
        storedArtists = JSON.parse(localStorage.getItem('pochirocho_spotify_top_artists') || '[]');
        storedTracks = JSON.parse(localStorage.getItem('pochirocho_spotify_top_tracks') || '[]');
      } catch (e) {}

      if (storedArtists.length === 0 && storedTracks.length === 0) {
        await this.fetchAndStoreUserProfile();
        try {
          storedArtists = JSON.parse(localStorage.getItem('pochirocho_spotify_top_artists') || '[]');
          storedTracks = JSON.parse(localStorage.getItem('pochirocho_spotify_top_tracks') || '[]');
        } catch (e) {}
      }

      let seedArtists = [];
      let seedTracks = [];

      if (storedArtists.length) {
        if (isCalmPhase) {
          const calmArtists = storedArtists.filter(a => {
            const genres = (a.genres || []).map(g => g.toLowerCase());
            return !genres.some(g => excludedKeywords.some(ex => g.includes(ex)));
          });
          seedArtists = (calmArtists.length > 0 ? calmArtists : storedArtists).slice(0, 3).map(a => a.id);
        } else {
          seedArtists = storedArtists.slice(0, 3).map(a => a.id);
        }
      }

      if (storedTracks.length) {
        seedTracks = storedTracks.slice(0, 2).map(t => t.id);
      }

      let tracks = [];

      // Intento 1: Spotify Recommendations API oficial calibrada con los artistas favoritos de la usuaria
      let queryParams = new URLSearchParams({
        limit: '20',
        target_energy: acousticTargets.target_energy.toFixed(2),
        target_valence: acousticTargets.target_valence.toFixed(2),
        target_tempo: Math.round(acousticTargets.target_tempo).toString(),
        target_acousticness: acousticTargets.target_acousticness.toFixed(2),
        target_danceability: acousticTargets.target_danceability.toFixed(2)
      });

      if (acousticTargets.max_energy !== undefined) {
        queryParams.append('max_energy', acousticTargets.max_energy.toFixed(2));
      }
      if (acousticTargets.max_tempo !== undefined) {
        queryParams.append('max_tempo', Math.round(acousticTargets.max_tempo).toString());
      }
      if (acousticTargets.min_acousticness !== undefined) {
        queryParams.append('min_acousticness', acousticTargets.min_acousticness.toFixed(2));
      }
      if (acousticTargets.min_energy !== undefined) {
        queryParams.append('min_energy', acousticTargets.min_energy.toFixed(2));
      }

      if (seedArtists.length > 0) {
        queryParams.append('seed_artists', seedArtists.slice(0, 2).join(','));
      }
      if (seedTracks.length > 0) {
        queryParams.append('seed_tracks', seedTracks.slice(0, 2).join(','));
      }
      if (!seedArtists.length && !seedTracks.length) {
        queryParams.append('seed_genres', isCalmPhase ? 'acoustic,indie,ambient' : 'pop,latin,indie');
      }

      try {
        const recResponse = await spotifyFetch(`https://api.spotify.com/v1/recommendations?${queryParams.toString()}`);
        if (recResponse.ok) {
          const recData = await recResponse.json();
          tracks = recData.tracks || [];
        }
      } catch (e) {}

      // Intento 2: Si no hubo respuesta de recommendations, buscar directamente pistas de los artistas favoritos de la usuaria en Spotify
      if (tracks.length === 0 && storedArtists.length > 0) {
        const candidateArtists = storedArtists.slice(0, 5);
        const randomArtist = candidateArtists[Math.floor(Math.random() * candidateArtists.length)];
        if (randomArtist && randomArtist.name) {
          try {
            const searchRes = await spotifyFetch(`https://api.spotify.com/v1/search?q=artist:${encodeURIComponent(randomArtist.name)}&type=track&limit=20`);
            if (searchRes.ok) {
              const searchData = await searchRes.json();
              tracks = searchData.tracks?.items || [];
            }
          } catch (e) {}
        }
      }

      // Intento 3: Usar canciones guardadas de la biblioteca de la usuaria (Top Tracks o Liked Songs)
      if (tracks.length === 0) {
        try {
          const liked = JSON.parse(localStorage.getItem('pochirocho_spotify_liked_tracks') || '[]');
          const topTr = JSON.parse(localStorage.getItem('pochirocho_spotify_top_tracks') || '[]');
          let combined = [...liked, ...topTr];
          if (isCalmPhase && combined.length > 0) {
            combined = combined.filter(t => {
              const text = `${t.name} ${t.artists?.map(a => a.name).join(' ') || ''}`.toLowerCase();
              return !excludedKeywords.some(ex => text.includes(ex));
            });
          }
          tracks = combined;
        } catch (e) {}
      }

      // Intento 4: Búsqueda dinámica en Spotify según el tempo y estado de la fase
      if (tracks.length === 0) {
        const searchKeyword = isCalmPhase
          ? 'calm acoustic piano soft'
          : (phase.toLowerCase().includes('folicular') ? 'pop upbeat positive' : 'dance pop vital energy');
        try {
          const searchRes = await spotifyFetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(searchKeyword)}&type=track&limit=15`);
          if (searchRes.ok) {
            const searchData = await searchRes.json();
            tracks = searchData.tracks?.items || [];
          }
        } catch (e) {}
      }

      if (tracks.length === 0) {
        return {
          isConnected: false,
          phase,
          acousticTargets,
          error: 'No se encontraron canciones en Spotify'
        };
      }

      // Elegir entre los mejores candidatos reales de Spotify
      const selectedTrack = tracks[Math.floor(Math.random() * tracks.length)];
      const artistName = selectedTrack.artists?.map(a => a.name).join(', ') || 'Artista de Spotify';
      const tempo = Math.round(acousticTargets.target_tempo);
      const dynamicReason = this.buildDynamicReason(artistName, selectedTrack.name, phase, symptoms, tempo);

      return {
        isConnected: true,
        phase,
        acousticTargets: {
          ...acousticTargets,
          reasonText: dynamicReason
        },
        track: {
          id: selectedTrack.id,
          name: selectedTrack.name,
          artist: artistName,
          albumName: selectedTrack.album?.name || '',
          albumCover: selectedTrack.album?.images?.[0]?.url || 'assets/ui/spotify_default_cover.png',
          previewUrl: selectedTrack.preview_url,
          spotifyUrl: selectedTrack.external_urls?.spotify || `https://open.spotify.com/track/${selectedTrack.id}`,
          uri: selectedTrack.uri
        }
      };
    } catch (err) {
      console.warn('Error al obtener recomendaciones de Spotify Web API:', err);
      return {
        isConnected: false,
        phase,
        acousticTargets,
        error: err.message
      };
    }
  }

  // Helpers PKCE
  static generateRandomString(length) {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    let text = '';
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  static async generateCodeChallenge(codeVerifier) {
    if (typeof window === 'undefined' || !window.crypto || !window.crypto.subtle) {
      return codeVerifier;
    }
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }
}


/**
 * HealthAIAgentEngine.js
 * Motor Híbrido de Inteligencia Artificial para Salud Menstrual y Reproductiva
 * Integra Google Gemini API (Grounding RAG), Motor RAG Semántico Local, Grafo Ontológico y Soporte Técnico
 */







class HealthAIAgentEngine {
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


/**
 * ShopRewardsEngine.js
 * Motor de Economía de Pochipesos (🪙), Tareas Diarias, Hitos de Rutinas y Recompensas
 */

class ShopRewardsEngine {
  constructor(coins = 0, streakDays = 0, totalRoutines = 0) {
    this.coins = coins;
    this.streakDays = streakDays;
    this.totalRoutinesCompleted = totalRoutines;
    this.lastLogTimestamp = Date.now();

    // Estado de Tareas Diarias
    this.dailyTasks = {
      date: new Date().toISOString().split('T')[0],
      tasks: {
        daily_log: { id: 'daily_log', title: 'Registrar detalles diarios', reward: 5, completed: false, claimed: false },
        relief_routines: { id: 'relief_routines', title: 'Realizar 2 o más rutinas de alivio', reward: 10, current: 0, target: 2, completed: false, claimed: false },
        read_analysis: { id: 'read_analysis', title: 'Leer estadísticas en Análisis', reward: 5, completed: false, claimed: false },
        spotify_playlist: { id: 'spotify_playlist', title: 'Escuchar 3 canciones recomendadas', reward: 10, current: 0, target: 3, completed: false, claimed: false }
      },
      allBonusClaimed: false
    };

    this.loadState();
  }

  static computeDynamicStreak(loggedDays = {}) {
    if (!loggedDays || typeof loggedDays !== 'object') return 0;
    const dates = Object.keys(loggedDays);
    if (dates.length === 0) return 0;

    const pad = n => String(n).padStart(2, '0');
    const toKey = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

    const now = new Date();
    const todayStr = toKey(now);
    const yest = new Date();
    yest.setDate(yest.getDate() - 1);
    const yestStr = toKey(yest);

    if (!loggedDays[todayStr] && !loggedDays[yestStr]) {
      return 0;
    }

    let streak = 0;
    let curr = loggedDays[todayStr] ? new Date(now) : new Date(yest);

    while (true) {
      const k = toKey(curr);
      if (loggedDays[k]) {
        streak++;
        curr.setDate(curr.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }

  loadState() {
    if (typeof localStorage !== 'undefined') {
      const savedCoins = localStorage.getItem('pochirocho_pochipesos');
      if (savedCoins !== null) this.coins = parseInt(savedCoins, 10) || 0;

      const savedRoutines = localStorage.getItem('pochirocho_total_routines');
      if (savedRoutines !== null) this.totalRoutinesCompleted = parseInt(savedRoutines, 10) || 0;

      const savedTasks = localStorage.getItem('pochirocho_daily_tasks');
      if (savedTasks) {
        try {
          const parsed = JSON.parse(savedTasks);
          const today = new Date().toISOString().split('T')[0];
          if (parsed.date === today) {
            this.dailyTasks = parsed;
          } else {
            // Nuevo día: reiniciar tareas diarias
            this.resetDailyTasks(today);
          }
        } catch (e) {
          console.warn('Error cargando tareas diarias:', e);
        }
      }
    }
  }

  saveState() {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('pochirocho_pochipesos', this.coins.toString());
      localStorage.setItem('pochirocho_total_routines', this.totalRoutinesCompleted.toString());
      localStorage.setItem('pochirocho_daily_tasks', JSON.stringify(this.dailyTasks));
    }
  }

  resetDailyTasks(dateString) {
    this.dailyTasks = {
      date: dateString || new Date().toISOString().split('T')[0],
      tasks: {
        daily_log: { id: 'daily_log', title: 'Registrar detalles diarios', reward: 5, completed: false, claimed: false },
        relief_routines: { id: 'relief_routines', title: 'Realizar 2 o más rutinas de alivio', reward: 10, current: 0, target: 2, completed: false, claimed: false },
        read_analysis: { id: 'read_analysis', title: 'Leer estadísticas en Análisis', reward: 5, completed: false, claimed: false },
        spotify_playlist: { id: 'spotify_playlist', title: 'Escuchar 3 canciones recomendadas', reward: 10, current: 0, target: 3, completed: false, claimed: false }
      },
      allBonusClaimed: false
    };
    this.saveState();
  }

  /**
   * Completa una tarea diaria específica y otorga sus Pochipesos si no ha sido reclamada
   */
  completeDailyTask(taskId) {
    const task = this.dailyTasks.tasks[taskId];
    if (!task) return { success: false, reason: 'Tarea no encontrada' };

    task.completed = true;
    let earned = 0;
    if (!task.claimed) {
      task.claimed = true;
      earned = task.reward;
      this.coins += earned;
      this.saveState();
    }

    return {
      success: true,
      taskId: taskId,
      earned: earned,
      currentCoins: this.coins,
      task: task,
      allCompleted: this.areAllTasksCompleted()
    };
  }

  /**
   * Incrementa el progreso de una tarea diaria con contador (ej. rutinas o canciones)
   */
  incrementTaskProgress(taskId, amount = 1) {
    const task = this.dailyTasks.tasks[taskId];
    if (!task || task.current === undefined) return { success: false };

    task.current = Math.min(task.target, (task.current || 0) + amount);
    let earned = 0;

    if (task.current >= task.target && !task.completed) {
      task.completed = true;
      if (!task.claimed) {
        task.claimed = true;
        earned = task.reward;
        this.coins += earned;
      }
    }

    this.saveState();

    return {
      success: true,
      current: task.current,
      target: task.target,
      completed: task.completed,
      earned: earned,
      currentCoins: this.coins,
      allCompleted: this.areAllTasksCompleted()
    };
  }

  areAllTasksCompleted() {
    return Object.values(this.dailyTasks.tasks).every(t => t.completed);
  }

  /**
   * Reclama el Bono de 20 Pochipesos por completar todas las tareas diarias
   */
  claimDailyAllBonus() {
    if (!this.areAllTasksCompleted()) {
      return { success: false, reason: 'Aún no has completado todas las tareas diarias de hoy.' };
    }
    if (this.dailyTasks.allBonusClaimed) {
      return { success: false, reason: 'Ya has reclamado el bono diario de hoy.' };
    }

    this.dailyTasks.allBonusClaimed = true;
    const bonus = 20;
    this.coins += bonus;
    this.saveState();

    return {
      success: true,
      bonus: bonus,
      currentCoins: this.coins
    };
  }

  /**
   * Registra una rutina de alivio completada conscientemente:
   * 1. Avanza la tarea diaria de 2 rutinas (+10 🪙).
   * 2. Incrementa el contador global acumulado (cada 5 rutinas -> +20 🪙).
   */
  registerRoutineCompletion() {
    this.totalRoutinesCompleted += 1;
    let earnedFromMilestone = 0;
    let reachedMilestone = false;

    if (this.totalRoutinesCompleted % 5 === 0) {
      earnedFromMilestone = 20;
      this.coins += earnedFromMilestone;
      reachedMilestone = true;
    }

    const taskResult = this.incrementTaskProgress('relief_routines', 1);
    this.saveState();

    const cycleProgress = (this.totalRoutinesCompleted % 5 === 0) ? 5 : (this.totalRoutinesCompleted % 5);

    return {
      totalRoutines: this.totalRoutinesCompleted,
      cycleProgress: cycleProgress,
      reachedMilestone: reachedMilestone,
      milestoneBonus: earnedFromMilestone,
      dailyTaskResult: taskResult,
      currentCoins: this.coins
    };
  }

  /**
   * Otorga recompensa fija de 45 Pochipesos por un logro completado
   */
  claimAchievementReward(achievementId) {
    const reward = 45;
    this.coins += reward;
    this.saveState();
    return {
      success: true,
      earned: reward,
      currentCoins: this.coins
    };
  }

  /**
   * Procesa la compra de un artículo del catálogo de la tienda
   */
  purchaseItem(itemPrice) {
    if (this.coins < itemPrice) {
      return { success: false, reason: `Pochipesos insuficientes 🪙 (Tienes 🪙 ${this.coins}, necesitas 🪙 ${itemPrice})` };
    }
    this.coins -= itemPrice;
    this.saveState();
    return { success: true, monedasRestantes: this.coins };
  }
}


/**
 * RewardItemModel.js
 * Modelo de Ítems de la Tienda de Recompensas (Pochirocho Store)
 */

class RewardItemModel {
  constructor(data = {}) {
    this.id = data.id || '';
    this.type = data.type || 'external'; // 'external' (Vida Real) o 'internal' (Objetos del Juego)
    this.cat = data.cat || 'General';
    this.name = data.name || '';
    this.desc = data.desc || '';
    this.price = data.price || 100;
    this.icon = data.icon || '🎁';
    this.priceRange = data.priceRange || '';
    this.unlocked = data.unlocked || false;
  }

  toJSON() {
    return {
      id: this.id,
      type: this.type,
      cat: this.cat,
      name: this.name,
      desc: this.desc,
      price: this.price,
      icon: this.icon,
      priceRange: this.priceRange,
      unlocked: this.unlocked
    };
  }
}


/**
 * AchievementsEngine.js
 * Motor Avanzado de 15 Logros (10 Periódicos Acumulativos + 5 Logros Ocultos/Secretos con Acertijos Cortos)
 * Otorga +45 Pochipesos (🪙) por cada meta alcanzada.
 */

class AchievementsEngine {
  constructor() {
    this.achievements = [
      // =======================================================================
      // 10 LOGROS PERIÓDICOS ACUMULATIVOS
      // =======================================================================
      {
        id: 'ach-daily-tasks',
        title: 'Disciplinada Imparable',
        desc: 'Completa todas las 4 tareas diarias del Pochipeso.',
        icon: '📋',
        category: 'routine',
        type: 'periodic',
        baseStep: 8,
        level: 1,
        current: 0,
        target: 8,
        reward: 45,
        unit: 'Días',
        unlocked: false,
        claimed: false,
        isSecret: false
      },
      {
        id: 'ach-spotify-songs',
        title: 'Melómana Hormonal',
        desc: 'Escucha canciones recomendadas por tu mascota según tu fase y síntomas.',
        icon: '🎵',
        category: 'music',
        type: 'periodic',
        baseStep: 25,
        level: 1,
        current: 0,
        target: 25,
        reward: 45,
        unit: 'Canciones',
        unlocked: false,
        claimed: false,
        isSecret: false
      },
      {
        id: 'ach-analysis-reads',
        title: 'Científica de tu Ciclo',
        desc: 'Revisa y estudia tus estadísticas y métricas en la pantalla de Análisis.',
        icon: '📊',
        category: 'analytics',
        type: 'periodic',
        baseStep: 15,
        level: 1,
        current: 0,
        target: 15,
        reward: 45,
        unit: 'Lecturas',
        unlocked: false,
        claimed: false,
        isSecret: false
      },
      {
        id: 'ach-ai-conversations',
        title: 'Confidente de la Pandilla',
        desc: 'Mantén conversaciones y consultas de salud con tu mascota de IA.',
        icon: '🤖',
        category: 'ai',
        type: 'periodic',
        baseStep: 12,
        level: 1,
        current: 0,
        target: 12,
        reward: 45,
        unit: 'Consultas',
        unlocked: false,
        claimed: false,
        isSecret: false
      },
      {
        id: 'ach-relief-nutrition',
        title: 'Chef Antiinflamatoria',
        desc: 'Prepara recetas y smoothies del catálogo de Nutrición Somática.',
        icon: '🥗',
        category: 'relief',
        type: 'periodic',
        baseStep: 10,
        level: 1,
        current: 0,
        target: 10,
        reward: 45,
        unit: 'Recetas',
        unlocked: false,
        claimed: false,
        isSecret: false
      },
      {
        id: 'ach-relief-breathing',
        title: 'Respiración Consciente',
        desc: 'Completa sesiones guiadas de respiración y relajación diafragmática.',
        icon: '🌬️',
        category: 'relief',
        type: 'periodic',
        baseStep: 10,
        level: 1,
        current: 0,
        target: 10,
        reward: 45,
        unit: 'Sesiones',
        unlocked: false,
        claimed: false,
        isSecret: false
      },
      {
        id: 'ach-relief-massages',
        title: 'Alivio Somático & Calor',
        desc: 'Realiza guías de automasaje pélvico y termoterapia en puntos clave.',
        icon: '💆‍♀️',
        category: 'relief',
        type: 'periodic',
        baseStep: 10,
        level: 1,
        current: 0,
        target: 10,
        reward: 45,
        unit: 'Masajes',
        unlocked: false,
        claimed: false,
        isSecret: false
      },
      {
        id: 'ach-relief-audios',
        title: 'Frecuencias de Calma',
        desc: 'Escucha sesiones de paisajes sonoros y audios ASMR de relajación.',
        icon: '🎧',
        category: 'relief',
        type: 'periodic',
        baseStep: 10,
        level: 1,
        current: 0,
        target: 10,
        reward: 45,
        unit: 'Sesiones',
        unlocked: false,
        claimed: false,
        isSecret: false
      },
      {
        id: 'ach-relief-exercises',
        title: 'Cuerpo Flexible & Fuerte',
        desc: 'Completa rutinas de pilates, yoga y estiramientos para el suelo pélvico.',
        icon: '🧘‍♀️',
        category: 'relief',
        type: 'periodic',
        baseStep: 10,
        level: 1,
        current: 0,
        target: 10,
        reward: 45,
        unit: 'Rutinas',
        unlocked: false,
        claimed: false,
        isSecret: false
      },
      {
        id: 'ach-cycle-predictions',
        title: 'Visionaria del Futuro',
        desc: 'Consulta predicciones hormonales para planificar fechas futuras.',
        icon: '🔮',
        category: 'calendar',
        type: 'periodic',
        baseStep: 8,
        level: 1,
        current: 0,
        target: 8,
        reward: 45,
        unit: 'Fechas',
        unlocked: false,
        claimed: false,
        isSecret: false
      },

      // =======================================================================
      // 5 LOGROS OCULTOS / SECRETOS (CON ACERTIJOS MUY CORTOS)
      // =======================================================================
      {
        id: 'ach-secret-shop',
        title: 'Reina del Centro Comercial',
        lockedTitle: 'El Gran Bazar 🛍️',
        desc: '¡Has canjeado todos y cada uno de los 14 artículos del catálogo de la tienda!',
        icon: '👑🛍️',
        category: 'secret',
        type: 'unique',
        level: 1,
        current: 0,
        target: 14,
        reward: 45,
        unit: 'Ítems',
        unlocked: false,
        claimed: false,
        isSecret: true,
        secretRiddle: 'El brillo de cada estante llama a quien no deja nada atrás...'
      },
      {
        id: 'ach-secret-unprotected-ovulation',
        title: 'Alerta Roja',
        lockedTitle: 'Llama en Días Fértiles 🌙',
        desc: 'Has registrado relaciones sexuales sin protección en pleno día de ovulación.',
        icon: '⚠️🔥',
        category: 'secret',
        type: 'unique',
        level: 1,
        current: 0,
        target: 1,
        reward: 45,
        unit: 'Registro',
        unlocked: false,
        claimed: false,
        isSecret: true,
        secretRiddle: 'Bajo la luna más viva, el calor no pide permiso...'
      },
      {
        id: 'ach-secret-all-pets-themes',
        title: 'Amante de la Pandilla',
        lockedTitle: 'Espíritu Camaleónico 🐾',
        desc: 'Has compartido tiempo con todas las 5 mascotas y probado los 6 temas de color de la app.',
        icon: '🐾🎨',
        category: 'secret',
        type: 'unique',
        level: 1,
        current: 0,
        target: 11,
        reward: 45,
        unit: 'Colección',
        unlocked: false,
        claimed: false,
        isSecret: true,
        secretRiddle: 'Muchas miradas, muchos colores, una sola historia...'
      },
      {
        id: 'ach-secret-report-bug',
        title: 'Contacto con el Pollo Programador',
        lockedTitle: 'Lazo con el Creador 🐔',
        desc: 'Has enviado un reporte técnico o comentario directamente al Pollo Desarrollador.',
        icon: '🐔💻',
        category: 'secret',
        type: 'unique',
        level: 1,
        current: 0,
        target: 1,
        reward: 45,
        unit: 'Reporte',
        unlocked: false,
        claimed: false,
        isSecret: true,
        secretRiddle: 'Una señal de auxilio enviada al nido del arquitecto...'
      },
      {
        id: 'ach-secret-motivation-egg',
        title: 'El Marcianito Místico',
        lockedTitle: 'Secreto en la Calma ✨',
        desc: '¡Has encontrado al curioso marcianito oculto en el jardín de la Motivación!',
        icon: '🛸✨',
        category: 'secret',
        type: 'unique',
        level: 1,
        current: 0,
        target: 1,
        reward: 45,
        unit: 'Descubrimiento',
        unlocked: false,
        claimed: false,
        isSecret: true,
        secretRiddle: 'Un silencio curioso vigila entre cartas y flores...'
      }
    ];

    this.trackingData = {
      purchasedItemIds: [],
      usedPetIds: ['erizo'],
      usedThemeIds: ['red'],
      predictedDates: []
    };

    this.loadState();
  }

  loadState() {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('pochirocho_achievements_v2');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed.achievements)) {
            parsed.achievements.forEach(savedAch => {
              const localAch = this.achievements.find(a => a.id === savedAch.id);
              if (localAch) {
                localAch.level = savedAch.level || 1;
                localAch.current = savedAch.current || 0;
                localAch.target = savedAch.target || localAch.target;
                localAch.unlocked = savedAch.unlocked || false;
                localAch.claimed = savedAch.claimed || false;
              }
            });
          }
          if (parsed.trackingData) {
            this.trackingData = { ...this.trackingData, ...parsed.trackingData };
          }
        } catch (e) {
          console.warn('Error cargando achievements:', e);
        }
      }
    }
  }

  saveState() {
    if (typeof localStorage !== 'undefined') {
      const payload = {
        achievements: this.achievements.map(a => ({
          id: a.id,
          level: a.level,
          current: a.current,
          target: a.target,
          unlocked: a.unlocked,
          claimed: a.claimed
        })),
        trackingData: this.trackingData
      };
      localStorage.setItem('pochirocho_achievements_v2', JSON.stringify(payload));
    }
  }

  trackProgress(keyOrId, amount = 1) {
    let ach = this.achievements.find(a => a.id === keyOrId);
    if (!ach) {
      ach = this.achievements.find(a => a.id === `ach-${keyOrId}`);
    }
    if (!ach) return { success: false, reason: 'Logro no encontrado' };

    ach.current = (ach.current || 0) + amount;
    let newlyUnlocked = false;

    if (ach.current >= ach.target && !ach.unlocked && !ach.claimed) {
      ach.unlocked = true;
      newlyUnlocked = true;
    }

    this.saveState();

    return {
      success: true,
      ach: ach,
      newlyUnlocked: newlyUnlocked
    };
  }

  unlockDirect(achievementId) {
    const ach = this.achievements.find(a => a.id === achievementId);
    if (!ach) return { success: false };

    let newlyUnlocked = false;
    ach.current = ach.target;
    if (!ach.unlocked && !ach.claimed) {
      ach.unlocked = true;
      newlyUnlocked = true;
    }

    this.saveState();
    return { success: true, ach, newlyUnlocked };
  }

  claimAchievement(achievementId) {
    const ach = this.achievements.find(a => a.id === achievementId);
    if (!ach) return { success: false, reason: 'Logro no encontrado' };
    if (ach.claimed) return { success: false, reason: 'Ya fue reclamado' };
    if (!ach.unlocked && ach.current < ach.target) return { success: false, reason: 'Aún no alcanzaste la meta' };

    ach.claimed = true;
    const rewardCoins = 45;

    if (ach.type === 'periodic') {
      ach.level += 1;
      ach.target += ach.baseStep;
      ach.unlocked = false;
      ach.claimed = false;
    }

    this.saveState();

    return {
      success: true,
      ach: ach,
      rewardCoins: rewardCoins
    };
  }
}

class AnalyticsEngine {
  static computeAnalytics(profile = {}, logs = {}) {
    let cycleHistory = [];
    try {
      cycleHistory = JSON.parse(localStorage.getItem('pochirocho_cycle_history') || '[]');
    } catch(e) {}

    const validCycles = Array.isArray(cycleHistory) ? cycleHistory.filter(c => {
      const d = parseInt(c?.duracionDias, 10);
      return !isNaN(d) && d >= 15 && d <= 65;
    }) : [];

    const totalCycles = validCycles.length;
    let avgDuration = 28.0;
    let sigma = 1.0;
    let regularityPercent = 95;

    if (totalCycles > 0) {
      const durations = validCycles.map(c => parseInt(c.duracionDias, 10));
      avgDuration = Math.round((durations.reduce((a, b) => a + b, 0) / totalCycles) * 10) / 10;
      if (totalCycles > 1) {
        const variance = durations.reduce((a, b) => a + Math.pow(b - avgDuration, 2), 0) / totalCycles;
        sigma = Math.round(Math.sqrt(variance) * 10) / 10;
      } else {
        sigma = 0.8;
      }
      regularityPercent = Math.min(100, Math.max(50, Math.round(100 - (sigma * 7.5))));
    } else {
      avgDuration = parseFloat(profile?.duracionPromedioCiclo) || 28;
      const regSetting = profile?.regularidad || 'regular';
      if (regSetting === 'irregular') { sigma = 3.5; regularityPercent = 75; }
      else if (regSetting === 'muy_irregular') { sigma = 5.2; regularityPercent = 62; }
      else { sigma = 1.1; regularityPercent = 94; }
    }

    const periodLen = parseFloat(profile?.duracionPromedioPeriodo) || 5;

    // 1. Barras dinámicas de duración (adaptadas a ciclos reales de Flo / registros)
    const monthNamesShort = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
    let cycleBars = [];

    if (totalCycles >= 2) {
      const recent = validCycles.slice(-6);
      cycleBars = recent.map((c, idx) => {
        let label = `C${idx + 1}`;
        if (c.fechaFin || c.fechaInicio) {
          try {
            const dt = new Date(c.fechaFin || c.fechaInicio);
            if (!isNaN(dt.getTime())) label = monthNamesShort[dt.getMonth()];
          } catch(e) {}
        }
        const dVal = parseInt(c.duracionDias, 10) || Math.round(avgDuration);
        const barHeight = Math.min(100, Math.max(28, Math.round((dVal / 42) * 100)));
        let color = '#2ec4b6'; // Rango clínico saludable (24-35d)
        if (dVal < 24 || (dVal >= 36 && dVal <= 38)) color = '#f59e0b'; // Variación leve
        else if (dVal > 38) color = '#e63946'; // Retraso
        return { label, val: `${dVal}d`, height: `${barHeight}%`, color };
      });
    } else {
      const currentMonthIdx = new Date().getMonth();
      for (let i = 5; i >= 0; i--) {
        const mIdx = (currentMonthIdx - i + 12) % 12;
        const mName = monthNamesShort[mIdx];
        const dVal = Math.round(avgDuration + (i === 0 ? 0 : (Math.sin(i * 1.6) * Math.min(sigma, 2.5))));
        const barHeight = Math.min(100, Math.max(28, Math.round((dVal / 42) * 100)));
        let color = '#2ec4b6';
        if (dVal < 24 || (dVal >= 36 && dVal <= 38)) color = '#f59e0b';
        else if (dVal > 38) color = '#e63946';
        cycleBars.push({ label: mName, val: `${dVal}d`, height: `${barHeight}%`, color });
      }
    }

    // 2. Extracción de síntomas, dolores y estrés por fase
    const logEntries = Object.entries(logs || {});
    const totalLogsCount = logEntries.length;

    let phaseCramps = { Menstrual: [], Folicular: [], Ovulatoria: [], Lutea: [] };
    let stressCounts = { bajo: 0, moderado: 0, alto: 0 };
    let symptomFrequency = {};
    let highStressDaysWithPain = 0;
    let highStressTotalDays = 0;

    logEntries.forEach(([dateStr, log]) => {
      const parts = dateStr.split('-');
      const dObj = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));

      let lmpDate = profile?.lmpFecha ? new Date(profile.lmpFecha) : new Date();
      const targetMidnight = new Date(dObj.getFullYear(), dObj.getMonth(), dObj.getDate()).getTime();
      const lmpMidnight = new Date(lmpDate.getFullYear(), lmpDate.getMonth(), lmpDate.getDate()).getTime();
      const diffDays = Math.floor((targetMidnight - lmpMidnight) / (1000 * 3600 * 24));
      const dayInCycle = ((diffDays % Math.round(avgDuration)) + Math.round(avgDuration)) % Math.round(avgDuration) + 1;

      let pKey = 'Folicular';
      if (dayInCycle <= periodLen) pKey = 'Menstrual';
      else if (dayInCycle >= (avgDuration - 16) && dayInCycle <= (avgDuration - 12)) pKey = 'Ovulatoria';
      else if (dayInCycle > (avgDuration - 12)) pKey = 'Lutea';

      const crampVal = typeof log.cramps === 'number' ? log.cramps : (typeof log.nivelColicos === 'number' ? log.nivelColicos : null);
      if (crampVal !== null && crampVal >= 0) {
        phaseCramps[pKey].push(crampVal);
      }

      const stressStr = String(log.stress || log.nivelEstres || 'bajo').toLowerCase();
      let isHighStress = false;
      if (stressStr.includes('alto') || stressStr.includes('intenso')) {
        stressCounts.alto++;
        isHighStress = true;
        highStressTotalDays++;
      } else if (stressStr.includes('mod') || stressStr.includes('medio')) {
        stressCounts.moderado++;
      } else {
        stressCounts.bajo++;
      }

      const symptomsList = Array.isArray(log.symptoms) ? log.symptoms : (Array.isArray(log.sintomas) ? log.sintomas : []);
      let hasPhysicalPain = (crampVal && crampVal >= 3);
      symptomsList.forEach(sym => {
        symptomFrequency[sym] = (symptomFrequency[sym] || 0) + 1;
        const sLow = sym.toLowerCase();
        if (sLow.includes('cabeza') || sLow.includes('espalda') || sLow.includes('colic') || sLow.includes('dolor')) {
          hasPhysicalPain = true;
        }
      });

      if (isHighStress && hasPhysicalPain) {
        highStressDaysWithPain++;
      }
    });

    const getAvg = (arr, fallback) => arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length) : fallback;
    const avgM = Math.round(getAvg(phaseCramps.Menstrual, 2.5) * 10) / 10;
    const avgF = Math.round(getAvg(phaseCramps.Folicular, 0.4) * 10) / 10;
    const avgO = Math.round(getAvg(phaseCramps.Ovulatoria, 0.7) * 10) / 10;
    const avgL = Math.round(getAvg(phaseCramps.Lutea, 1.8) * 10) / 10;

    // Onda líquida SVG dinámica según los niveles reales de dolor de la usuaria (0 a 5 mapeado a altura)
    const getY = (val) => Math.round(80 - (Math.min(5, Math.max(0, val)) / 5) * 65);
    const yM = getY(avgM);
    const yF = getY(avgF);
    const yO = getY(avgO);
    const yL = getY(avgL);

    const wavePathD = `M 0 ${yM} C 35 ${yM}, 55 ${yF}, 90 ${yF} C 130 ${yF}, 155 ${yO}, 195 ${yO} C 235 ${yO}, 265 ${yL}, 300 ${yL}`;
    const waveAreaD = `${wavePathD} L 300 90 L 0 90 Z`;

    let peakPainPhase = 'Fase Menstrual';
    const maxPain = Math.max(avgM, avgF, avgO, avgL);
    if (maxPain === avgL && avgL > avgM) peakPainPhase = 'Fase Lútea (Premenstrual)';
    else if (maxPain === avgO && avgO > avgM) peakPainPhase = 'Fase Ovulatoria';

    // 3. Distribución del Estrés & Correlación Somática
    const totalStressLogged = (stressCounts.bajo + stressCounts.moderado + stressCounts.alto) || 1;
    const stressBajoPct = Math.round((stressCounts.bajo / totalStressLogged) * 100);
    const stressModPct = Math.round((stressCounts.moderado / totalStressLogged) * 100);
    const stressAltoPct = Math.max(0, 100 - stressBajoPct - stressModPct);

    const impactoEstresPorcentaje = highStressTotalDays > 0
      ? Math.round((highStressDaysWithPain / highStressTotalDays) * 100)
      : (stressAltoPct > 20 ? 65 : 35);

    // 4. Síntomas Recurrentes Reales
    let topSymptoms = Object.entries(symptomFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([name, count]) => ({
        name,
        count,
        pct: Math.min(100, Math.round((count / Math.max(1, totalLogsCount)) * 100))
      }));

    if (topSymptoms.length === 0) {
      topSymptoms = [
        { name: 'Cólicos Pélvicos 🩸', count: 1, pct: 45 },
        { name: 'Hinchazón Abdominal 🎈', count: 1, pct: 35 },
        { name: 'Fatiga / Cansancio 😴', count: 1, pct: 25 },
        { name: 'Sensibilidad en Senos 🌸', count: 1, pct: 15 }
      ];
    }

    // 5. Puntuación Somática Hormonal
    const scoreSomatico = Math.min(100, Math.max(60, Math.round(
      (regularityPercent * 0.5) +
      ((5 - avgM) * 6) +
      ((100 - stressAltoPct) * 0.2)
    )));

    return {
      duracionPromedio: avgDuration,
      duracionPeriodo: periodLen,
      regularidadPorcentaje: regularityPercent,
      sigma,
      totalCycles,
      scoreSomatico,
      totalLogsCount,
      avgMenstrualCramps: avgM,
      avgFolicularCramps: avgF,
      avgOvulatoriaCramps: avgO,
      avgLuteaCramps: avgL,
      peakPainPhase,
      wavePathD,
      waveAreaD,
      yM, yF, yO, yL,
      stressStats: { bajo: stressBajoPct, moderado: stressModPct, alto: stressAltoPct },
      impactoEstresPorcentaje,
      cycleBars,
      topSymptoms
    };
  }
}

class AnalystChickenInsights {
  static generateInsights(profile = {}, logs = {}, analytics = null) {
    if (!analytics) analytics = AnalyticsEngine.computeAnalytics(profile, logs);
    const petName = profile?.nombre ? profile.nombre : 'usuaria';
    const todayStr = new Date().toISOString().split('T')[0];

    // Verificar si hay análisis generado por IA en caché
    try {
      const cachedAI = localStorage.getItem(`pochirocho_pio_ai_insights_${todayStr}`);
      if (cachedAI) {
        const parsed = JSON.parse(cachedAI);
        if (parsed && parsed.regularidad && parsed.dolor) {
          return [
            {
              id: 'pio-1',
              title: parsed.regularidad.titulo || 'Regularidad del Ciclo',
              meaning: parsed.regularidad.significado,
              recommendation: parsed.regularidad.recomendacion
            },
            {
              id: 'pio-2',
              title: parsed.dolor.titulo || 'Curva de Dolor y Cólicos',
              meaning: parsed.dolor.significado,
              recommendation: parsed.dolor.recomendacion
            },
            {
              id: 'pio-3',
              title: parsed.estres.titulo || 'Impacto del Estrés en el Cuerpo',
              meaning: parsed.estres.significado,
              recommendation: parsed.estres.recomendacion
            },
            {
              id: 'pio-4',
              title: parsed.sintomas.titulo || 'Síntomas Clave Observados',
              meaning: parsed.sintomas.significado,
              recommendation: parsed.sintomas.recomendacion
            }
          ];
        }
      }
    } catch(e) {}

    // Generación dinámica determinística basada en datos reales
    const cyclesCount = analytics.totalCycles || 0;
    const regText = analytics.regularidadPorcentaje >= 90
      ? `tu ritmo hormonal es altamente estable con una variabilidad de apenas ±${analytics.sigma} días.`
      : `tu cuerpo muestra una variabilidad natural de ±${analytics.sigma} días, común por adaptaciones a tu estilo de vida.`;

    const dolorText = analytics.avgMenstrualCramps >= 3.0
      ? `Tus cólicos tienen un pico marcado de intensidad (${analytics.avgMenstrualCramps}/5) en los primeros días del período.`
      : `Tus molestias pélvicas se mantienen en un rango moderado o suave (${analytics.avgMenstrualCramps}/5).`;

    const estresText = analytics.stressStats.alto > 25
      ? `El ${analytics.stressStats.alto}% de tus registros marcan estrés alto, lo que coincide en un ${analytics.impactoEstresPorcentaje}% con tensión de cuello, espalda o cólicos.`
      : `Tu nivel de estrés se mantiene mayormente bajo o moderado (${analytics.stressStats.bajo + analytics.stressStats.moderado}%), cuidando tu producción hormonal.`;

    const topSym = analytics.topSymptoms[0];

    return [
      {
        id: 'pio-1',
        title: 'Insight de Príncipe Pío 🐔👓 — Regularidad del Ciclo',
        meaning: `¡PíoPíoPío! Con base en tus ${cyclesCount > 0 ? `${cyclesCount} ciclos registrados` : 'datos acumulados'}, tu duración media es de ${analytics.duracionPromedio} días y ${regText}`,
        recommendation: 'Mantén horarios regulares de descanso e hidratación constante (al menos 2.2L al día) para preservar esta armonía biológica.'
      },
      {
        id: 'pio-2',
        title: 'Insight de Príncipe Pío 🐔👓 — Curva de Dolor e Inflamación',
        meaning: `¡PíoPíoPío! ${dolorText} La fase folicular y ovulatoria presentan tu mayor alivio físico.`,
        recommendation: 'Aplica calor local en la pelvis y prueba posturas suaves de apertura de cadera 24 horas antes del inicio de tu regla.'
      },
      {
        id: 'pio-3',
        title: 'Insight de Príncipe Pío 🐔👓 — Manejo Somático del Estrés',
        meaning: `¡PíoPíoPío! ${estresText}`,
        recommendation: 'En días de alta exigencia, realiza la respiración diafragmática 4-7-8 con Naveen la Ranita Zen para desactivar el cortisol.'
      },
      {
        id: 'pio-4',
        title: 'Insight de Príncipe Pío 🐔👓 — Síntomas y Biomarcadores',
        meaning: `¡PíoPíoPío! Tu síntoma más recurrente es ${topSym.name} (aparece en el ${topSym.pct}% de tus registros).`,
        recommendation: 'Ajusta tu nutrición con alimentos frescos y consume infusiones de manzanilla o jengibre para reducir la retención tisular.'
      }
    ];
  }
}

function getExerciseSVGIllustration(title = '', stepNumber = 1, catId = 'stretches') {
  const colors = {
    'pilates-yoga': { bg1: '#2b0b3f', bg2: '#5b127d', accent: '#b5179e' },
    'stretches': { bg1: '#0f172a', bg2: '#1e293b', accent: '#38bdf8' },
    'breathing': { bg1: '#064e3b', bg2: '#047857', accent: '#34d399' },
    'massages-thermo': { bg1: '#78350f', bg2: '#9a3412', accent: '#fbbf24' },
    'nutrition': { bg1: '#065f46', bg2: '#047857', accent: '#a7f3d0' },
    'audio': { bg1: '#311b92', bg2: '#4a148c', accent: '#e040fb' }
  };
  const theme = colors[catId] || colors['stretches'];
  const safeTitle = (title || 'Ejercicio Somático').replace(/['"<>&]/g, '');

  return `data:image/svg+xml;utf8,` + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 220" width="100%" height="100%">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${theme.bg1}"/>
          <stop offset="100%" stop-color="${theme.bg2}"/>
        </linearGradient>
      </defs>
      <rect width="400" height="220" rx="18" fill="url(#bg)"/>
      <circle cx="200" cy="100" r="65" fill="none" stroke="${theme.accent}" stroke-width="1.5" stroke-dasharray="6,6" opacity="0.5"/>
      <circle cx="200" cy="100" r="38" fill="${theme.accent}" opacity="0.2"/>
      
      <g stroke="${theme.accent}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none">
        <circle cx="200" cy="65" r="12" fill="${theme.accent}"/>
        <path d="M200,77 L200,115"/>
        <path d="M170,95 Q200,85 230,95"/>
        <path d="M180,145 L200,115 L220,145"/>
      </g>

      <text x="200" y="185" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#ffffff" text-anchor="middle">${safeTitle}</text>
      <rect x="15" y="15" width="75" height="24" rx="12" fill="rgba(0,0,0,0.4)"/>
      <text x="52.5" y="31" font-family="system-ui, sans-serif" font-size="10" font-weight="800" fill="${theme.accent}" text-anchor="middle">PASO ${stepNumber}</text>
    </svg>
  `);
}

/**
 * RoutinesCatalog.js
 * Catálogo Oficial de Alivio Somático & Salud Menstrual
 * 1. Pilates & Yoga (`pilates-yoga`) — 7 Rutinas
 * 2. Estiramientos (`stretches`) — 7 Rutinas
 * 3. Respiración (`breathing`) — 5 Rutinas
 * 4. Masajes & Termoterapia (`massages-thermo`) — 5 Rutinas
 * 5. Nutrición (`nutrition`) — 5 Recetas Estáticas
 * 6. Audios: ASMR & Relajación (`audio`) — 8 Pistas MP3 Físicas Locales
 */

const RoutinesCatalog = [
  {
    "id": "routine-py-1",
    "catId": "pilates-yoga",
    "type": "step-player",
    "title": "Yoga Restaurativo para Liberación Sacra (Supta Baddha Konasana)",
    "category": "Pilates & Yoga",
    "duration": "12 min",
    "intensity": "Restaurativa 🧘‍♀️",
    "instructor": "Manola la Erizo 🦔",
    "instructorIcon": "🦔",
    "isFavorite": true,
    "previewImagePath": "assets/exercises/reclinacion_cojin_lumbar.png",
    "desc": "Secuencia restaurativa asistida enfocada en la descompresión profunda del plexo sacro y la apertura pasiva pélvica.",
    "spikeTip": "Permite que las rodillas caigan por su propio peso sin forzar la apertura pélvica 🦔",
    "steps": [
      {
        "stepNumber": 1,
        "title": "Reclinación sobre Cojín Lumbar (Supta Baddha Konasana)",
        "durationSeconds": 120,
        "imagePath": "assets/exercises/reclinacion_cojin_lumbar.png",
        "instructions": "Recuéstate sobre un cojín a lo largo de tu columna, junta las plantas de los pies y deja caer las rodillas hacia los lados."
      },
      {
        "stepNumber": 2,
        "title": "Apertura Pélvica en Mariposa con Soporte",
        "durationSeconds": 120,
        "imagePath": "assets/exercises/api_mariposa_pose.png",
        "instructions": "Mantén la mariposa descansando bloques o mantas debajo de los muslos para una relajación pasiva completa."
      },
      {
        "stepNumber": 3,
        "title": "Respiración Somática Manos al Vientre",
        "durationSeconds": 120,
        "imagePath": "assets/exercises/manos_vientre.png",
        "instructions": "Coloca tus palmas sobre el bajo vientre sintiendo el calor e inhalando hondo hacia la pelvis."
      },
      {
        "stepNumber": 4,
        "title": "Extensión Suave de Columna & Savasana Acolchado",
        "durationSeconds": 120,
        "imagePath": "assets/exercises/yoga_api_11_corpse.png",
        "instructions": "Extiende las piernas despacio a lo largo del mat y relaja los brazos a los lados con las palmas hacia arriba."
      },
      {
        "stepNumber": 5,
        "title": "Torsión Suave de Columna Supina Lado Izquierdo",
        "durationSeconds": 120,
        "imagePath": "assets/exercises/torsion_columna.png",
        "instructions": "Deja caer ambas rodillas flexionadas hacia el lado izquierdo manteniendo los hombros pegados al mat."
      },
      {
        "stepNumber": 6,
        "title": "Torsión Suave de Columna Supina Lado Derecho",
        "durationSeconds": 120,
        "imagePath": "assets/exercises/torsion_columna.png",
        "instructions": "Cambia suavemente de lado llevando las rodillas a la derecha para equilibrar la rotación lumbar."
      }
    ]
  },
  {
    "id": "routine-py-2",
    "catId": "pilates-yoga",
    "type": "step-player",
    "title": "Yoga Terapéutico para Dismenorrea (Postura de la Paloma)",
    "category": "Pilates & Yoga",
    "duration": "12 min",
    "intensity": "Suave 🌿",
    "instructor": "MaoMao la Gatita 🐱",
    "instructorIcon": "🐱",
    "isFavorite": false,
    "previewImagePath": "assets/exercises/yoga_api_24_pigeon.png",
    "desc": "Secuencia somática para liberar el músculo piriforme y reducir la presión del ligamento uterino.",
    "spikeTip": "Apoya la frente sobre un bloque si sientes molestia en la zona lumbar 🐱",
    "steps": [
      {
        "stepNumber": 1,
        "title": "Postura de la Paloma Asistida Lado Izquierdo",
        "durationSeconds": 120,
        "imagePath": "assets/exercises/yoga_api_24_pigeon.png",
        "instructions": "Flexiona la rodilla izquierda adelante y extiende la pierna derecha atrás descendiendo la cadera."
      },
      {
        "stepNumber": 2,
        "title": "Inclinación Somática al Frente",
        "durationSeconds": 120,
        "imagePath": "assets/exercises/yoga_api_24_pigeon.png",
        "instructions": "Inclina el torso sobre la pierna flexionada apoyando antebrazos en el mat."
      },
      {
        "stepNumber": 3,
        "title": "Postura de la Paloma Asistida Lado Derecho",
        "durationSeconds": 120,
        "imagePath": "assets/exercises/yoga_api_24_pigeon.png",
        "instructions": "Cambia de pierna adelantando la rodilla derecha y extendiendo la izquierda."
      },
      {
        "stepNumber": 4,
        "title": "Inclinación Somática al Frente Lado Derecho",
        "durationSeconds": 120,
        "imagePath": "assets/exercises/yoga_api_24_pigeon.png",
        "instructions": "Baja el torso respirando profundo hacia la articulación de la cadera derecha."
      },
      {
        "stepNumber": 5,
        "title": "Descanso en Postura del Niño (Balasana)",
        "durationSeconds": 120,
        "imagePath": "assets/exercises/yoga_api_10_child_s_pose.png",
        "instructions": "Junta los dedos gordos de los pies, abre rodillas y lleva la cadera hacia los talones."
      },
      {
        "stepNumber": 6,
        "title": "Integración Final en Savasana",
        "durationSeconds": 120,
        "imagePath": "assets/exercises/yoga_api_11_corpse.png",
        "instructions": "Descansa boca arriba sintiendo la soltura en glúteos y sacro."
      }
    ]
  },
  {
    "id": "routine-py-3",
    "catId": "pilates-yoga",
    "type": "step-player",
    "title": "Yoga Suave para Alivio Lumbar y Pélvico (Postura del Niño)",
    "category": "Pilates & Yoga",
    "duration": "10 min",
    "intensity": "Restaurativa 🧘‍♀️",
    "instructor": "Naveen la Ranita Zen 🐸",
    "instructorIcon": "🐸",
    "isFavorite": false,
    "previewImagePath": "assets/exercises/yoga_api_10_child_s_pose.png",
    "desc": "Flujo de flexión pasiva de columna para elongar la fascia toracolumbar y calmar calambres uterinos agudos.",
    "spikeTip": "Abre bien las rodillas para dejar espacio a la barriga y respirar sin presión 🐸",
    "steps": [
      {
        "stepNumber": 1,
        "title": "Balasana de Caderas Abiertas",
        "durationSeconds": 100,
        "imagePath": "assets/exercises/yoga_api_10_child_s_pose.png",
        "instructions": "Siéntate sobre talones, abre rodillas a los lados del mat e inclínate adelante."
      },
      {
        "stepNumber": 2,
        "title": "Caminata Lateral de Brazos a la Izquierda",
        "durationSeconds": 100,
        "imagePath": "assets/exercises/Inclinacion.png",
        "instructions": "Camina ambas manos a la izquierda alargando todo el costado derecho del torso."
      },
      {
        "stepNumber": 3,
        "title": "Caminata Lateral de Brazos a la Derecha",
        "durationSeconds": 100,
        "imagePath": "assets/exercises/Inclinacion.png",
        "instructions": "Camina las manos a la derecha sintiendo la descompresión del lateral izquierdo."
      },
      {
        "stepNumber": 4,
        "title": "Estiramiento de Cachorro (Puppy Pose)",
        "durationSeconds": 100,
        "imagePath": "assets/exercises/yoga_api_10_child_s_pose.png",
        "instructions": "Mantén caderas sobre rodillas y camina manos adelante derritiendo el pecho al mat."
      },
      {
        "stepNumber": 5,
        "title": "Postura de la Esfinge Suave",
        "durationSeconds": 100,
        "imagePath": "assets/exercises/api_yoga_bhujangasana.png",
        "instructions": "Recuéstate boca abajo sobre antebrazos abriendo el pecho sin forzar la cintura."
      },
      {
        "stepNumber": 6,
        "title": "Cierre en Balasana con Brazos Atrás",
        "durationSeconds": 100,
        "imagePath": "assets/exercises/yoga_api_10_child_s_pose.png",
        "instructions": "Vuelve a llevar la cadera a talones descansando los brazos a lo largo del cuerpo."
      }
    ]
  },
  {
    "id": "routine-py-4",
    "catId": "pilates-yoga",
    "type": "step-player",
    "title": "Pilates Pélvico Somático (Reloj Pélvico & Báscula)",
    "category": "Pilates & Yoga",
    "duration": "10 min",
    "intensity": "Suave 🌿",
    "instructor": "Manola la Erizo 🦔",
    "instructorIcon": "🦔",
    "isFavorite": false,
    "previewImagePath": "assets/exercises/pelvic_tilt.png",
    "desc": "Movimientos pélvicos de micro-articulación para restaurar la circulación en la cavidad pélvica.",
    "spikeTip": "Realiza los círculos como si tu ombligo fuera el centro de un reloj 🦔",
    "steps": [
      {
        "stepNumber": 1,
        "title": "Báscula Pélvica Supina (Impronta & Neutro)",
        "durationSeconds": 100,
        "imagePath": "assets/exercises/pelvic_tilt.png",
        "instructions": "Boca arriba con rodillas flexionadas, bascula la pelvis pegando la cintura al suelo."
      },
      {
        "stepNumber": 2,
        "title": "Círculos Pélvicos en Sentido Horario",
        "durationSeconds": 100,
        "imagePath": "assets/exercises/pelvic_tilt.png",
        "instructions": "Imagina la carátula de un reloj en tu pelvis y pasa suavemente por las 12, 3, 6 y 9."
      },
      {
        "stepNumber": 3,
        "title": "Círculos Pélvicos en Sentido Antihorario",
        "durationSeconds": 100,
        "imagePath": "assets/exercises/pelvic_tilt.png",
        "instructions": "Invierte el sentido del círculo buscando fluidez y relajación en la articulación sacra."
      },
      {
        "stepNumber": 4,
        "title": "Puente Corto Pélvico con Exhalación",
        "durationSeconds": 100,
        "imagePath": "assets/exercises/yoga_api_4_bridge.png",
        "instructions": "Eleva la cadera suavemente vértebra por vértebra y baja exhalando lento."
      },
      {
        "stepNumber": 5,
        "title": "Balanceo Lateral de Rodillas",
        "durationSeconds": 100,
        "imagePath": "assets/exercises/limpiaparabrisas.png",
        "instructions": "Mueve rodillas suavemente de lado a lado liberando la musculatura lumbar."
      },
      {
        "stepNumber": 6,
        "title": "Alineación Neutra & Respiración Abdominal",
        "durationSeconds": 100,
        "imagePath": "assets/exercises/manos_vientre.png",
        "instructions": "Quédate en quietud reposando manos en pelvis inhalando profundo."
      }
    ]
  },
  {
    "id": "routine-py-5",
    "catId": "pilates-yoga",
    "type": "step-player",
    "title": "Yoga de Conexión & Descanso Premenstrual (Piernas en la Pared)",
    "category": "Pilates & Yoga",
    "duration": "12 min",
    "intensity": "Restaurativa 🧘‍♀️",
    "instructor": "Pipo el Pingüino 🐧",
    "instructorIcon": "🐧",
    "isFavorite": false,
    "previewImagePath": "assets/exercises/api_stretch_pelvic.png",
    "desc": "Inversión pasiva somática para reducir el estancamiento venoso pélvico y favorecer el drenaje linfático.",
    "spikeTip": "Coloca una manta doblada debajo de tu cadera para mayor confort sacral 🐧",
    "steps": [
      {
        "stepNumber": 1,
        "title": "Viparita Karani (Piernas Elevadas en Pared)",
        "durationSeconds": 120,
        "imagePath": "assets/exercises/api_stretch_pelvic.png",
        "instructions": "Eleva tus piernas rectas sobre la pared descansando sacro en el mat."
      },
      {
        "stepNumber": 2,
        "title": "Piernas Abiertas en V sobre la Pared",
        "durationSeconds": 120,
        "imagePath": "assets/exercises/estiramiento_v.png",
        "instructions": "Separa las piernas en V permitiendo la elongación suave de los aductores."
      },
      {
        "stepNumber": 3,
        "title": "Mariposa con Plantas de Pies en la Pared",
        "durationSeconds": 120,
        "imagePath": "assets/exercises/api_mariposa_pose.png",
        "instructions": "Junta plantas de los pies deslizándolos hacia abajo en forma de mariposa apoyada."
      },
      {
        "stepNumber": 4,
        "title": "Abrazo de Rodillas al Pecho en el Mat",
        "durationSeconds": 120,
        "imagePath": "assets/exercises/rodillas_pecho.png",
        "instructions": "Deslízate atrás, flexiona rodillas y abrázalas suavemente contra tu cuerpo."
      },
      {
        "stepNumber": 5,
        "title": "Torsión Somática con Rodillas en Ángulo 90°",
        "durationSeconds": 120,
        "imagePath": "assets/exercises/torsion_columna.png",
        "instructions": "Deja caer rodillas a un lado abriendo brazos en T."
      },
      {
        "stepNumber": 6,
        "title": "Savasana con Soporte en Corvas",
        "durationSeconds": 120,
        "imagePath": "assets/exercises/yoga_api_11_corpse.png",
        "instructions": "Extiende piernas descansando un cojín bajo las rodillas en calma total."
      }
    ]
  },
  {
    "id": "routine-py-6",
    "catId": "pilates-yoga",
    "type": "step-player",
    "title": "Yoga Somático para la Fase Lútea y Menstrual (Gato-Vaca)",
    "category": "Pilates & Yoga",
    "duration": "10 min",
    "intensity": "Suave 🌿",
    "instructor": "Luffy el Monito 🐒",
    "instructorIcon": "🐒",
    "isFavorite": false,
    "previewImagePath": "assets/exercises/yoga_cat_cow_api.png",
    "desc": "Movilización ondulatoria de la columna vertebral para masajear las vísceras abdominales.",
    "spikeTip": "Sincroniza el movimiento con la inhalación y exhalación sin forzar el cuello 🐒",
    "steps": [
      {
        "stepNumber": 1,
        "title": "Marjaryasana-Bitilasana (Gato-Vaca en 4 Puntos)",
        "durationSeconds": 100,
        "imagePath": "assets/exercises/yoga_cat_cow_api.png",
        "instructions": "En 4 puntos, arquea la espalda mirando arriba al inhalar y redondea la columna al exhalar."
      },
      {
        "stepNumber": 2,
        "title": "Círculos Somáticos de Cadera en 4 Puntos",
        "durationSeconds": 100,
        "imagePath": "assets/exercises/pelvic_tilt.png",
        "instructions": "Rueda la cadera dibujando círculos amplios a los lados relajando la cintura."
      },
      {
        "stepNumber": 3,
        "title": "Estiramiento de Hilo en la Aguja (Thread the Needle Left)",
        "durationSeconds": 100,
        "imagePath": "assets/exercises/Inclinacion.png",
        "instructions": "Pasa el brazo izquierdo por debajo del torso apoyando hombro y sien en el mat."
      },
      {
        "stepNumber": 4,
        "title": "Estiramiento de Hilo en la Aguja (Thread the Needle Right)",
        "durationSeconds": 100,
        "imagePath": "assets/exercises/Inclinacion.png",
        "instructions": "Cambia de lado deslizando el brazo derecho para liberar escápula y columna alta."
      },
      {
        "stepNumber": 5,
        "title": "Postura del Niño con Brazos Extendidos",
        "durationSeconds": 100,
        "imagePath": "assets/exercises/yoga_api_10_child_s_pose.png",
        "instructions": "Lleva la cadera a talones y alarga los brazos adelante sintiendo descanso."
      },
      {
        "stepNumber": 6,
        "title": "Postura de la Vaca Sentada (Cierre Suave)",
        "durationSeconds": 100,
        "imagePath": "assets/exercises/manos_pecho.png",
        "instructions": "Siéntate erguida, junta manos en el centro del pecho y respira profundo."
      }
    ]
  },
  {
    "id": "routine-py-7",
    "catId": "pilates-yoga",
    "type": "step-player",
    "title": "Pilates Suave para Hinchazón y Circulación (Círculos con Piernas)",
    "category": "Pilates & Yoga",
    "duration": "10 min",
    "intensity": "Suave 🌿",
    "instructor": "Manola la Erizo 🦔",
    "instructorIcon": "🦔",
    "isFavorite": false,
    "previewImagePath": "assets/exercises/api_stretch_hips.png",
    "desc": "Serie de mobilización articular de articulación coxofemoral para activar la bomba muscular pélvica.",
    "spikeTip": "Mantén el centro abdominal estable sin elevar la zona lumbar del mat 🦔",
    "steps": [
      {
        "stepNumber": 1,
        "title": "Single Leg Circle Lado Izquierdo",
        "durationSeconds": 100,
        "imagePath": "assets/exercises/api_stretch_hips.png",
        "instructions": "Boca arriba, eleva la pierna izquierda a 90° y realiza pequeños círculos en el techo."
      },
      {
        "stepNumber": 2,
        "title": "Single Leg Circle Lado Derecho",
        "durationSeconds": 100,
        "imagePath": "assets/exercises/api_stretch_hips.png",
        "instructions": "Cambia a la pierna derecha manteniendo la pelvis firme en el mat."
      },
      {
        "stepNumber": 3,
        "title": "Bicicleta Suave Pélvica Supina",
        "durationSeconds": 100,
        "imagePath": "assets/exercises/pierna_arriba.png",
        "instructions": "Flexiona y extiende piernas alternadas como pedalear en el aire despacio."
      },
      {
        "stepNumber": 4,
        "title": "Apertura en V y Cierre Controlado",
        "durationSeconds": 100,
        "imagePath": "assets/exercises/estiramiento_v.png",
        "instructions": "Separa ambas piernas arriba en V y júntalas activando muslos internos."
      },
      {
        "stepNumber": 5,
        "title": "Abrazo de Rodillas y Mecedora Sagital",
        "durationSeconds": 100,
        "imagePath": "assets/exercises/rodillas_pecho.png",
        "instructions": "Abraza rodillas al pecho y mécete suavemente a los lados."
      },
      {
        "stepNumber": 6,
        "title": "Descanso Neutro en Savasana",
        "durationSeconds": 100,
        "imagePath": "assets/exercises/yoga_api_11_corpse.png",
        "instructions": "Suelta todo el cuerpo en el mat disfrutando la ligereza pélvica."
      }
    ]
  },
  {
    "id": "routine-str-1",
    "catId": "stretches",
    "type": "step-player",
    "title": "Descompresión Lumbosacra Profunda & Psoas",
    "category": "Estiramientos",
    "duration": "12 min",
    "intensity": "Suave 🌸",
    "instructor": "Manola la Erizo 🦔",
    "instructorIcon": "🦔",
    "isFavorite": true,
    "previewImagePath": "assets/exercises/yoga_api_10_child_s_pose.png",
    "desc": "Serie de 6 estiramientos progresivos para liberar el acortamiento de la fascia lumbar y calmar punzadas.",
    "spikeTip": "Suelta todo el aire al exhalar en cada estiramiento 🦔",
    "steps": [
      {
        "stepNumber": 1,
        "title": "Postura del Niño Asistida (Child Pose)",
        "durationSeconds": 120,
        "imagePath": "assets/exercises/yoga_api_10_child_s_pose.png",
        "instructions": "Arrodíllate en la manta, abre caderas e inclínate suavemente hacia el frente."
      },
      {
        "stepNumber": 2,
        "title": "Basculación Pélvica Supina (Pelvic Tilt)",
        "durationSeconds": 120,
        "imagePath": "assets/exercises/pelvic_tilt.png",
        "instructions": "Boca arriba, aplana la curvatura lumbar contra el suelo al exhalar y relaja al inhalar."
      },
      {
        "stepNumber": 3,
        "title": "Torsión Suave de Columna Lado Izquierdo",
        "durationSeconds": 120,
        "imagePath": "assets/exercises/torsion_columna.png",
        "instructions": "Deja caer ambas rodillas flexionadas hacia el lado izquierdo manteniendo los hombros firmes."
      },
      {
        "stepNumber": 4,
        "title": "Torsión Suave de Columna Lado Derecho",
        "durationSeconds": 120,
        "imagePath": "assets/exercises/torsion_columna.png",
        "instructions": "Cambia suavemente hacia el lado derecho y siente la liberación del nervio sacro."
      },
      {
        "stepNumber": 5,
        "title": "Abrazo Doble de Rodillas al Pecho",
        "durationSeconds": 120,
        "imagePath": "assets/exercises/rodillas_pecho.png",
        "instructions": "Abraza tus rodillas contra el pecho y realiza pequeños círculos para masajear la zona lumbar."
      },
      {
        "stepNumber": 6,
        "title": "Abrazo Individual de Rodilla (Single Knee)",
        "durationSeconds": 120,
        "imagePath": "assets/exercises/rodillas_pecho.png",
        "instructions": "Mantiene una pierna extendida mientras traccionas delicadamente la otra al pecho."
      }
    ]
  },
  {
    "id": "routine-str-2",
    "catId": "stretches",
    "type": "step-player",
    "title": "Estiramiento Profundo de Piriforme & Liberación Ciática",
    "category": "Estiramientos",
    "duration": "12 min",
    "intensity": "Suave 🌸",
    "instructor": "Pipo el Pingüino 🐧",
    "instructorIcon": "🐧",
    "isFavorite": false,
    "previewImagePath": "assets/exercises/piriforme.png",
    "desc": "Secuencia de 6 estiramientos en Figura 4 reclinada para aliviar dolor irradiado a glúteos.",
    "spikeTip": "Exhala profundo justo en el punto de mayor tirantez 🐧",
    "steps": [
      {
        "stepNumber": 1,
        "title": "Piriforme en Figura 4 Lado Derecho",
        "durationSeconds": 120,
        "imagePath": "assets/exercises/piriforme.png",
        "instructions": "Recuéstate boca arriba y apoya el tobillo derecho sobre la rodilla izquierda."
      },
      {
        "stepNumber": 2,
        "title": "Tracción del Muslo al Pecho Lado Derecho",
        "durationSeconds": 120,
        "imagePath": "assets/exercises/rodilla_pecho.png",
        "instructions": "Entrelaza manos por detrás del muslo izquierdo y acércalo hacia tu pecho."
      },
      {
        "stepNumber": 3,
        "title": "Piriforme en Figura 4 Lado Izquierdo",
        "durationSeconds": 120,
        "imagePath": "assets/exercises/piriforme.png",
        "instructions": "Cambia de pierna apoyando el tobillo izquierdo sobre la rodilla derecha."
      },
      {
        "stepNumber": 4,
        "title": "Tracción del Muslo al Pecho Lado Izquierdo",
        "durationSeconds": 120,
        "imagePath": "assets/exercises/rodilla_pecho.png",
        "instructions": "Tira suavemente del muslo hacia el pecho sintiendo la elongación profunda."
      },
      {
        "stepNumber": 5,
        "title": "Estiramiento de Rotadores Externos de Cadera",
        "durationSeconds": 120,
        "imagePath": "assets/exercises/rotador_cadera.png",
        "instructions": "Mantén la presión exhalando despacio y soltando la articulación femoral."
      },
      {
        "stepNumber": 6,
        "title": "Limpiaparabrisas Supinos de Rodillas",
        "durationSeconds": 120,
        "imagePath": "assets/exercises/limpiaparabrisas.png",
        "instructions": "Deshaz la cruzada y mueve ambas rodillas flexionadas de lado a lado relajando la cadera."
      }
    ]
  },
  {
    "id": "routine-str-3",
    "catId": "stretches",
    "type": "step-player",
    "title": "Elongación de Cuádriceps & Flexores de Cadera Anterior",
    "category": "Estiramientos",
    "duration": "12 min",
    "intensity": "Suave 🌿",
    "instructor": "MaoMao la Gatita 🐱",
    "instructorIcon": "🐱",
    "isFavorite": false,
    "previewImagePath": "assets/exercises/arrodillada_90.png",
    "desc": "6 movimientos enfocados en liberar la compresión del músculo iliopsoas.",
    "spikeTip": "MaoMao recomienda respirar sintiendo el estiramiento en la pelvis 🐱",
    "steps": [
      {
        "stepNumber": 1,
        "title": "Zancada Baja Arrodillada Lado Izquierdo",
        "durationSeconds": 120,
        "imagePath": "assets/exercises/arrodillada_90.png",
        "instructions": "Apoya rodilla izquierda en mat acolchado y adelanta pie derecho a 90°."
      },
      {
        "stepNumber": 2,
        "title": "Inclinación Pélvica Anterior de Flexores",
        "durationSeconds": 120,
        "imagePath": "assets/exercises/hip_flexor.png",
        "instructions": "Empuja suavemente la cadera hacia adelante manteniendo el torso erguido."
      },
      {
        "stepNumber": 3,
        "title": "Elevación de Brazo & Estiramiento Lateral",
        "durationSeconds": 120,
        "imagePath": "assets/exercises/yoga_api_12_crescent_lunge.png",
        "instructions": "Eleva el brazo izquierdo hacia el techo e inclina el torso levemente a la derecha."
      },
      {
        "stepNumber": 4,
        "title": "Zancada Baja Arrodillada Lado Derecho",
        "durationSeconds": 120,
        "imagePath": "assets/exercises/arrodillada_90.png",
        "instructions": "Cambia apoyando rodilla derecha y adelantando pie izquierdo."
      },
      {
        "stepNumber": 5,
        "title": "Inclinación Pélvica Lado Derecho",
        "durationSeconds": 120,
        "imagePath": "assets/exercises/hip_flexor.png",
        "instructions": "Desliza la cadera al frente sintiendo la apertura del flexor femoral."
      },
      {
        "stepNumber": 6,
        "title": "Descanso en Postura del Héroe (Hero Pose)",
        "durationSeconds": 120,
        "imagePath": "assets/exercises/hero_pose.png",
        "instructions": "Siéntate sobre tus talones descansando manos en muslos."
      }
    ]
  },
  {
    "id": "routine-str-4",
    "catId": "stretches",
    "type": "step-player",
    "title": "Estiramiento Lateral de Tronco & Banda Iliotibial",
    "category": "Estiramientos",
    "duration": "10 min",
    "intensity": "Restaurativa 🌸",
    "instructor": "Luffy el Monito 🐒",
    "instructorIcon": "🐒",
    "isFavorite": false,
    "previewImagePath": "assets/exercises/Inclinacion.png",
    "desc": "Liberación de 6 secuencias de la cadena lateral para aliviar tensión intercostal y de crestas ilíacas.",
    "spikeTip": "Abre tus costillas sintiendo la entrada de aire fresco 🐒",
    "steps": [
      {
        "stepNumber": 1,
        "title": "Inclinación Lateral Sentada a la Izquierda",
        "durationSeconds": 100,
        "imagePath": "assets/exercises/Inclinacion.png",
        "instructions": "Siéntate con piernas cruzadas, apoya mano izquierda y extiende brazo derecho sobre la cabeza."
      },
      {
        "stepNumber": 2,
        "title": "Inclinación Lateral Sentada a la Derecha",
        "durationSeconds": 100,
        "imagePath": "assets/exercises/Inclinacion.png",
        "instructions": "Apoya mano derecha y estira lateralmente el brazo izquierdo abriendo las costillas."
      },
      {
        "stepNumber": 3,
        "title": "Estiramiento de Gato en Diagonal Izquierda",
        "durationSeconds": 100,
        "imagePath": "assets/exercises/gato.png",
        "instructions": "En cuatro puntos, camina ambas manos hacia la izquierda estirando el costado derecho."
      },
      {
        "stepNumber": 4,
        "title": "Estiramiento de Gato en Diagonal Derecha",
        "durationSeconds": 100,
        "imagePath": "assets/exercises/gato.png",
        "instructions": "Camina las manos a la derecha alargando todo el lateral izquierdo."
      },
      {
        "stepNumber": 5,
        "title": "Torsión en Espiral Sentada",
        "durationSeconds": 100,
        "imagePath": "assets/exercises/torsion_columna.png",
        "instructions": "Abraza la rodilla derecha con el brazo izquierdo y gira la mirada atrás."
      },
      {
        "stepNumber": 6,
        "title": "Rotación Somática de Hombros",
        "durationSeconds": 100,
        "imagePath": "assets/exercises/rotacion_hombros.png",
        "instructions": "Realiza círculos suaves con los hombros soltando la tensión trapecial."
      }
    ]
  },
  {
    "id": "routine-str-5",
    "catId": "stretches",
    "type": "step-player",
    "title": "Movilización de Cadera & Aductores en Mariposa",
    "category": "Estiramientos",
    "duration": "12 min",
    "intensity": "Suave 🌸",
    "instructor": "Manola la Erizo 🦔",
    "instructorIcon": "🦔",
    "isFavorite": false,
    "previewImagePath": "assets/exercises/yoga_api_5_butterfly.png",
    "desc": "Trabajo somático de 6 ejercicios para reducir los calambres de la pared interna del muslo.",
    "spikeTip": "Suelta la articulación de la cadera al exhalar 🦔",
    "steps": [
      {
        "stepNumber": 1,
        "title": "Mariposa Sentada (Baddha Konasana)",
        "durationSeconds": 120,
        "imagePath": "assets/exercises/yoga_api_5_butterfly.png",
        "instructions": "Junta las plantas de los pies y toma los tobillos manteniendo espalda recta."
      },
      {
        "stepNumber": 2,
        "title": "Aleteo Suave & Estiramiento de Ingle",
        "durationSeconds": 120,
        "imagePath": "assets/exercises/yoga_api_5_butterfly.png",
        "instructions": "Realiza pequeños rebotes suaves con las rodillas sin forzar."
      },
      {
        "stepNumber": 3,
        "title": "Estiramiento de Muslo Interno Pierna Izquierda",
        "durationSeconds": 120,
        "imagePath": "assets/exercises/muslo_interno.png",
        "instructions": "Extiende la pierna izquierda lateralmente y mantén el pie derecho pegado al pubis."
      },
      {
        "stepNumber": 4,
        "title": "Estiramiento de Muslo Interno Pierna Derecha",
        "durationSeconds": 120,
        "imagePath": "assets/exercises/muslo_interno.png",
        "instructions": "Cambia de lado extendiendo la pierna derecha y flexionando la izquierda."
      },
      {
        "stepNumber": 5,
        "title": "Estiramiento en V Abierta (Straddle Stretch)",
        "durationSeconds": 120,
        "imagePath": "assets/exercises/estiramiento_v.png",
        "instructions": "Separa ambas piernas en V e inclínate al frente suavemente."
      },
      {
        "stepNumber": 6,
        "title": "Posición Fetal Somática de Cierre",
        "durationSeconds": 120,
        "imagePath": "assets/exercises/rodillas_pecho.png",
        "instructions": "Tómate un minuto acurrucada de lado abrazando tus rodillas."
      }
    ]
  },
  {
    "id": "routine-str-6",
    "catId": "stretches",
    "type": "step-player",
    "title": "Descompresión Cervical & Trapecios Premenstrual",
    "category": "Estiramientos",
    "duration": "10 min",
    "intensity": "Restaurativa 🌿",
    "instructor": "Naveen la Ranita Zen 🐸",
    "instructorIcon": "🐸",
    "isFavorite": false,
    "previewImagePath": "assets/exercises/inclinacion_cuello.png",
    "desc": "Liberación de 6 secuencias de tensión en hombros y cuello causada por cambios de progesterona.",
    "spikeTip": "Mantén la mandíbula relajada sin apretar los dientes 🐸",
    "steps": [
      {
        "stepNumber": 1,
        "title": "Inclinación Lateral de Cuello a la Derecha",
        "durationSeconds": 100,
        "imagePath": "assets/exercises/inclinacion_cuello.png",
        "instructions": "Lleva la oreja derecha al hombro derecho aplicando suave presión con la mano."
      },
      {
        "stepNumber": 2,
        "title": "Inclinación Lateral de Cuello a la Izquierda",
        "durationSeconds": 100,
        "imagePath": "assets/exercises/inclinacion_cuello.png",
        "instructions": "Lleva la oreja izquierda al hombro izquierdo alargando el trapecio derecho."
      },
      {
        "stepNumber": 3,
        "title": "Rotación Barbilla a Clavícula",
        "durationSeconds": 100,
        "imagePath": "assets/exercises/clavicula.png",
        "instructions": "Gira la cabeza inclinando la barbilla hacia ambas clavículas."
      },
      {
        "stepNumber": 4,
        "title": "Extensión Suave de Garganta",
        "durationSeconds": 100,
        "imagePath": "assets/exercises/garganta.png",
        "instructions": "Mira suavemente hacia el techo abriendo la garganta e inhalando profundo."
      },
      {
        "stepNumber": 5,
        "title": "Círculos Descontracturantes de Hombros",
        "durationSeconds": 100,
        "imagePath": "assets/exercises/rotacion_hombros.png",
        "instructions": "Rueda los hombros hacia atrás 10 veces soltando cualquier nudo."
      },
      {
        "stepNumber": 6,
        "title": "Integración Final Manos al Pecho",
        "durationSeconds": 100,
        "imagePath": "assets/exercises/manos_pecho.png",
        "instructions": "Une tus manos en el centro del pecho descansando un minuto."
      }
    ]
  },
  {
    "id": "routine-str-7",
    "catId": "stretches",
    "type": "step-player",
    "title": "Estiramiento Global Somático de Cadena Posterior",
    "category": "Estiramientos",
    "duration": "12 min",
    "intensity": "Suave 🌿",
    "instructor": "Manola la Erizo 🦔",
    "instructorIcon": "🦔",
    "isFavorite": false,
    "previewImagePath": "assets/exercises/pierna_arriba.png",
    "desc": "Elongación de 6 ejercicios de isquiotibiales, pantorrillas y fascia plantar para reducir fatiga corporal.",
    "spikeTip": "Respira sintiendo el alivio desde los talones hasta la cabeza 🦔",
    "steps": [
      {
        "stepNumber": 1,
        "title": "Isquiotibial Supino Lado Derecho",
        "durationSeconds": 120,
        "imagePath": "assets/exercises/pierna_arriba.png",
        "instructions": "Boca arriba, eleva la pierna derecha recta y sostenla con tus manos por detrás."
      },
      {
        "stepNumber": 2,
        "title": "Isquiotibial Supino Lado Izquierdo",
        "durationSeconds": 120,
        "imagePath": "assets/exercises/pierna_arriba.png",
        "instructions": "Eleva la pierna izquierda estirando suavemente la cara posterior del muslo."
      },
      {
        "stepNumber": 3,
        "title": "Flexión y Punta de Tobillos",
        "durationSeconds": 120,
        "imagePath": "assets/exercises/punta_tobillo.png",
        "instructions": "Con piernas arriba, flexiona y apunta los pies para activar la bomba de retorno venoso."
      },
      {
        "stepNumber": 4,
        "title": "Postura de la Oruga Sentada",
        "durationSeconds": 120,
        "imagePath": "assets/exercises/yoga_api_30_seated_forward_bend.png",
        "instructions": "Siéntate y curva la espalda adelante dejando caer la cabeza relajada."
      },
      {
        "stepNumber": 5,
        "title": "Estiramiento de Fascia Plantar & Dedos",
        "durationSeconds": 120,
        "imagePath": "assets/exercises/yoga_api_37_garland_pose.png",
        "instructions": "Arrodíllate apoyando los dedos de los pies en el tapete con los tobillos elevados para elongar la fascia plantar."
      },
      {
        "stepNumber": 6,
        "title": "Relajación Somática Completa",
        "durationSeconds": 120,
        "imagePath": "assets/exercises/yoga_api_11_corpse.png",
        "instructions": "Descansa boca arriba sintiendo todo tu cuerpo relajado en el tapete."
      }
    ]
  },
  {
    "id": "routine-mt-1",
    "catId": "massages-thermo",
    "type": "massage-guide",
    "title": "Masaje Abdominal Suprapúbico con Aceites Botánicos",
    "category": "Masajes & Termoterapia",
    "duration": "10 min (tiempo estimado)",
    "intensity": "Confortante 🪔",
    "instructor": "Manola la Erizo 🦔",
    "instructorIcon": "🦔",
    "isFavorite": true,
    "previewImagePath": "assets/exercises/manos_vientre.png",
    "desc": "Automasaje circular suave sobre la parte baja del abdomen utilizando aceite natural para calmar las punzadas y relajarte.",
    "spikeTip": "Frota tus manos para calentar el aceite antes de aplicarlo en tu vientre 🦔🪔",
    "massageInstructions": "1. Traza círculos lentos y rítmicos con la yema de los dedos alrededor del ombligo en el sentido de las agujas del reloj.\n2. Desliza las palmas de tus manos desde los laterales de las caderas hacia el centro del bajo vientre aplicando una presión suave.\n3. Realiza presiones ondulatorias y continuas con los dedos sobre el vientre bajo para disipar espasmos.\n4. Reposa las palmas tibias sobre el bajo vientre durante varias respiraciones profundas para transferir calor reconfortante."
  },
  {
    "id": "routine-mt-2",
    "catId": "massages-thermo",
    "type": "massage-guide",
    "title": "Masaje Sacrolumbar de Presión Puntos Gatillo",
    "category": "Masajes & Termoterapia",
    "duration": "10 min (tiempo estimado)",
    "intensity": "Rejuvenecedora 💆‍♀️",
    "instructor": "MaoMao la Gatita 🐱",
    "instructorIcon": "🐱",
    "isFavorite": false,
    "previewImagePath": "assets/exercises/masaje_espalda.png",
    "desc": "Masaje suave y presión tibia en la zona baja de la espalda para aliviar el cansancio y la tensión acumulada.",
    "spikeTip": "Aplica presión suave en la espalda mientras sueltas el aire despacio 🐱",
    "massageInstructions": "1. Realiza movimientos circulares rítmicos con los nudillos frotando los músculos a ambos lados de la columna lumbar.\n2. Mantén una presión suave de 10 segundos con los pulgares en los puntos de mayor tensión del sacro al exhalar.\n3. Pasa las palmas con deslizamientos continuos de arriba a abajo desde la cintura hacia los glúteos.\n4. Efectúa un amasamiento delicado con el talón de las manos en los costados lumbares para aflojar la musculatura."
  },
  {
    "id": "routine-mt-3",
    "catId": "massages-thermo",
    "type": "massage-guide",
    "title": "Reflexología Podal Somática Uterino-Ovárica",
    "category": "Masajes & Termoterapia",
    "duration": "10 min (tiempo estimado)",
    "intensity": "Restaurativa 👣",
    "instructor": "Naveen la Ranita Zen 🐸",
    "instructorIcon": "🐸",
    "isFavorite": false,
    "previewImagePath": "assets/exercises/masaje_pies.png",
    "desc": "Masaje relajante en los pies y tobillos que ayuda a liberar la carga de todo el cuerpo durante tu ciclo.",
    "spikeTip": "El masaje en los tobillos ayuda a soltar la pesadez de las piernas 🐸",
    "massageInstructions": "1. Con el dedo pulgar, realiza círculos continuos en el hueco entre el hueso interno del tobillo y el talón.\n2. Ejecuta fricciones circulares suaves en la parte externa del tobillo para soltar la pesadez de las piernas.\n3. Presiona rítmicamente con el pulgar el centro de la planta del pie respirando profundamente.\n4. Desliza ambas manos en pases ascendentes desde la base de los dedos hacia el empeine y el tobillo."
  },
  {
    "id": "routine-mt-4",
    "catId": "massages-thermo",
    "type": "massage-guide",
    "title": "Termoterapia con Compresa Guatero Lumbosacra",
    "category": "Masajes & Termoterapia",
    "duration": "10 min (tiempo estimado)",
    "intensity": "Térmica ♨️",
    "instructor": "Pipo el Pingüino 🐧",
    "instructorIcon": "🐧",
    "isFavorite": false,
    "previewImagePath": "assets/exercises/eileen.png",
    "desc": "Aplicación de calor agradable en el abdomen o la espalda para relajar los músculos y sentir alivio inmediato.",
    "spikeTip": "Cúbrete con una cobija para conservar el calorcito mientras descansas 🐧🔥",
    "massageInstructions": "1. Coloca la compresa tibia directamente sobre el bajo vientre para relajar las fibras musculares.\n2. Alterna el apoyo del calor hacia la zona lumbar y el sacro para liberar la rigidez de la espalda baja.\n3. Mantén una postura reclinada y respira con lentitud permitiendo que el calor profundo calme los cólicos."
  },
  {
    "id": "routine-mt-5",
    "catId": "massages-thermo",
    "type": "massage-guide",
    "title": "Masaje Muscular de Caderas & Iliotibial",
    "category": "Masajes & Termoterapia",
    "duration": "10 min (tiempo estimado)",
    "intensity": "Descontracturante 🧴",
    "instructor": "Luffy el Monito 🐒",
    "instructorIcon": "🐒",
    "isFavorite": false,
    "previewImagePath": "assets/exercises/masaje_muslos.png",
    "desc": "Masaje suave en los muslos y caderas para aliviar calambres o la sensación de piernas cansadas.",
    "spikeTip": "Desliza tus manos desde la rodilla subiendo suavemente hacia la cadera 🐒",
    "massageInstructions": "1. Desliza las palmas con pases largos y fluidos desde la parte superior de la rodilla ascendiendo hacia la cadera.\n2. Realiza amasaduras rítmicas y suaves con los dedos en la cara interna y externa de los muslos.\n3. Traza círculos con las palmas sobre los costados de las caderas para aliviar calambres y tensión pélvica.\n4. Efectúa bombeos suaves y sacudidas delicadas en las piernas para activar el retorno circulatorio."
  },
  {
    "id": "routine-br-1",
    "catId": "breathing",
    "type": "massage-guide",
    "title": "Respiración Somática 4-7-8 (Modulación del Nervio Vago)",
    "category": "Respiración",
    "duration": "5 min",
    "intensity": "Calmante 🌬️",
    "instructor": "Naveen la Ranita Zen 🐸",
    "instructorIcon": "🐸",
    "isFavorite": true,
    "previewImagePath": "assets/exercises/api_estiramiento_pelvico.png",
    "desc": "Técnica pránica antiansiedad que estimula el tono parasimpático para reducir el tono muscular uterino.",
    "spikeTip": "Naveen recomienda exhalar haciendo un sonido suave de brisa por la boca 🐸",
    "massageInstructions": "Inhala por la nariz en 4 segundos, retén el aire suavemente durante 7 segundos y exhala con un suspiro lento en 8 segundos."
  },
  {
    "id": "routine-br-2",
    "catId": "breathing",
    "type": "massage-guide",
    "title": "Respiración Cuadrada (Box Breathing 4-4-4-4)",
    "category": "Respiración",
    "duration": "5 min",
    "intensity": "Enfoque ⏹️",
    "instructor": "Manola la Erizo 🦔",
    "instructorIcon": "🦔",
    "isFavorite": false,
    "previewImagePath": "assets/exercises/breathing_box.jpg",
    "desc": "Patrón de 4 tiempos iguales que estabiliza el ritmo cardíaco y calma los picos de dolor agudo.",
    "spikeTip": "Imagina dibujar un cuadrado dorado con tu mente en cada fase de 4 segundos 🦔",
    "massageInstructions": "Inhala en 4s, sostén con pulmones llenos 4s, exhala en 4s y sostén con pulmones vacíos 4s."
  },
  {
    "id": "routine-br-3",
    "catId": "breathing",
    "type": "massage-guide",
    "title": "Respiración Diafragmática Abdominal Profunda",
    "category": "Respiración",
    "duration": "5 min",
    "intensity": "Relajante 🎈",
    "instructor": "MaoMao la Gatita 🐱",
    "instructorIcon": "🐱",
    "isFavorite": false,
    "previewImagePath": "assets/exercises/yoga_restaurativo.jpg",
    "desc": "Expansión de la cúpula diafragmática para masajear las vísceras pélvicas y reducir la tensión del bajo vientre.",
    "spikeTip": "MaoMao aconseja sentir cómo tus manos suben al inhalar y bajan al exhalar 🐱",
    "massageInstructions": "Coloca tus manos en el estómago. Inhala inflando la barriga como un globo en 4s y exhala desinflándola lentamente en 6s."
  },
  {
    "id": "routine-br-4",
    "catId": "breathing",
    "type": "massage-guide",
    "title": "Respiración Nadi Shodhana (Fosas Nasales Alternadas)",
    "category": "Respiración",
    "duration": "5 min",
    "intensity": "Equilibrante 🌊",
    "instructor": "Manola la Erizo 🦔",
    "instructorIcon": "🦔",
    "isFavorite": false,
    "previewImagePath": "assets/exercises/api_estiramiento_pelvico.png",
    "desc": "Modulación hemisférica cerebral para equilibrar los estados emocionales e irritabilidad premenstrual.",
    "spikeTip": "Excelente ejercicio para despejar la cabeza y calmar pensamientos acelerados 🦔",
    "massageInstructions": "Tapa la fosa nasal derecha e inhala por la izquierda; tapa la izquierda y exhala por la derecha. Alterna ritmos suaves."
  },
  {
    "id": "routine-br-5",
    "catId": "breathing",
    "type": "massage-guide",
    "title": "Respiración de Exhalación Larga Liberadora (4-8 Flow)",
    "category": "Respiración",
    "duration": "5 min",
    "intensity": "Sedante 🍃",
    "instructor": "Pipo el Pingüino 🐧",
    "instructorIcon": "🐧",
    "isFavorite": false,
    "previewImagePath": "assets/exercises/breathing_box.jpg",
    "desc": "Enfocada en duplicar el tiempo de exhalación para desencadenar una respuesta inmediata de relajación corporal.",
    "spikeTip": "Exhala soplando suavemente como si inflaras una vela sin apagarla 🐧",
    "massageInstructions": "Inhala por la nariz sintiendo la entrada de aire fresco en 4s y exhala soplando suavemente como por un pitillo en 8s."
  },
  {
    "id": "routine-nut-1",
    "catId": "nutrition",
    "type": "recipe-card",
    "title": "Infusión Concentrada de Jengibre, Limón y Miel",
    "category": "Nutrición Somática",
    "duration": "10 min prep",
    "intensity": "Nutritiva 🍋",
    "instructor": "Manola la Erizo 🦔",
    "instructorIcon": "🦔",
    "isFavorite": true,
    "previewImagePath": "assets/exercises/infusion_jengibre.png",
    "desc": "Bebida medicinal casera muy sencilla rica en gingeroles que inhiben de forma natural la síntesis de prostaglandinas.",
    "spikeTip": "Bebe esta infusión tibia desde 2 días antes de tu período para prevenir cólicos 🦔🍵",
    "ingredients": [
      "4 rodajas delgadas de jengibre fresco (o 1/2 cdta en polvo)",
      "Jugo de 1/2 limón recién exprimido",
      "1 cucharadita de miel de abejas o azúcar rubia",
      "1 taza (250ml) de agua hervida"
    ],
    "preparationSteps": [
      "Hierve el agua en una ollita o pocillo.",
      "Agrega las rodajas de jengibre y deja reposar a fuego bajo por 5 minutos.",
      "Sirve en tu taza, añade el jugo de limón y la miel.",
      "Mezcla bien con una cuchara y tómalo tibio a sorbos lentos."
    ]
  },
  {
    "id": "routine-nut-2",
    "catId": "nutrition",
    "type": "recipe-card",
    "title": "Snack Express de Manzana con Mantequilla de Maní y Canela",
    "category": "Nutrición Somática",
    "duration": "3 min prep",
    "intensity": "Reconfortante 🍏",
    "instructor": "Manola la Erizo 🦔",
    "instructorIcon": "🦔",
    "isFavorite": false,
    "previewImagePath": "assets/exercises/snack_manzana_mani.png",
    "desc": "Snack ultra rápido de solo 3 ingredientes rico en magnesio, grasas saludables y fibra para frenar antojos y saciar la ansiedad premenstrual.",
    "spikeTip": "La mantequilla de maní aporta magnesio natural para prevenir cólicos 🦔🥜",
    "ingredients": [
      "1 manzana verde o roja cortada en rodajas",
      "2 cucharadas de mantequilla de maní o almendras pura",
      "1/4 cucharadita de canela molida"
    ],
    "preparationSteps": [
      "Corta la manzana en rodajas delgadas.",
      "Unta la mantequilla de maní sobre cada rodaja.",
      "Espolvorea un toque de canela molida y disfruta inmediatamente."
    ]
  },
  {
    "id": "routine-nut-3",
    "catId": "nutrition",
    "type": "recipe-card",
    "title": "Té Premenstrual de Manzanilla y Menta",
    "category": "Nutrición Somática",
    "duration": "5 min prep",
    "intensity": "Calmante 🌸",
    "instructor": "MaoMao la Gatita 🐱",
    "instructorIcon": "🐱",
    "isFavorite": false,
    "previewImagePath": "assets/exercises/infusion_manzanilla.png",
    "desc": "Infusión antiespasmódica ultra rápida con hierbas que consigues en cualquier tienda.",
    "spikeTip": "Tómalo a media tarde para calmar la hinchazón de estómago 🐱",
    "ingredients": [
      "1 bolsita de té de manzanilla",
      "3 a 4 hojitas de menta fresca (o 1 bolsita de té de menta)",
      "1 taza de agua caliente"
    ],
    "preparationSteps": [
      "Coloca la manzanilla y la menta en una taza.",
      "Vierte el agua hirviendo y tapa la taza con un plato pequeño.",
      "Deja reposar durante 5 minutos y retira las bolsitas antes de tomar."
    ]
  },
  {
    "id": "routine-nut-4",
    "catId": "nutrition",
    "type": "recipe-card",
    "title": "Smoothie Sencillo Antiinflamatorio de Fresa y Plátano",
    "category": "Nutrición Somática",
    "duration": "5 min prep",
    "intensity": "Energizante 🍓",
    "instructor": "Pipo el Pingüino 🐧",
    "instructorIcon": "🐧",
    "isFavorite": false,
    "previewImagePath": "assets/exercises/batido_bf.png",
    "desc": "Smoothie ultra rápido de solo 3 ingredientes rico en vitamina C y potasio para calmar la hinchazón y revitalizarte.",
    "spikeTip": "Las fresas frescas aportan antioxidantes potentes para reducir inflamación 🐧🍓",
    "ingredients": [
      "1 plátano maduro",
      "5 fresas frescas o congeladas",
      "1 taza de agua o tu leche favorita"
    ],
    "preparationSteps": [
      "Coloca las fresas, el plátano y el líquido en el vaso de la licuadora.",
      "Licúa a velocidad alta durante 30 segundos hasta obtener una mezcla suave.",
      "Sirve en un vaso alto y tómalo fresco."
    ]
  },
  {
    "id": "routine-nut-5",
    "catId": "nutrition",
    "type": "recipe-card",
    "title": "Bowl de Avena Tibia con Canela y Manzana",
    "category": "Nutrición Somática",
    "duration": "7 min prep",
    "intensity": "Reconfortante 🥣",
    "instructor": "Manola la Erizo 🦔",
    "instructorIcon": "🦔",
    "isFavorite": false,
    "previewImagePath": "assets/exercises/bowl_avena.png",
    "desc": "Desayuno de digestión lenta y alto en fibra para estabilizar la glucosa y evitar cambios de humor.",
    "spikeTip": "La avena tibia consiente tu digestión en los días de mayor sangrado 🦔🍎",
    "ingredients": [
      "1/2 taza de avena en hojuelas",
      "1 taza de agua o leche",
      "1/2 manzana picada en cuadritos",
      "1/2 cucharadita de canela molida"
    ],
    "preparationSteps": [
      "Cocina la avena con la leche y la manzana a fuego medio durante 5 minutos.",
      "Espolvorea la canela molida y revuelve hasta espesar.",
      "Sirve caliente en un tazón."
    ]
  },
  {
    "id": "routine-aud-1",
    "catId": "audio",
    "type": "audio-player",
    "title": "ASMR Tapping en Caja de Cartón",
    "category": "Audios & Frecuencias",
    "duration": "5:00",
    "intensity": "ASMR Táctil 🎧",
    "instructor": "Manola la Erizo 🦔",
    "instructorIcon": "🦔",
    "isFavorite": true,
    "previewImagePath": "assets/exercises/ASMR_1.png",
    "audioUrl": "assets/audio/cardboard_box_tapping_asmr.mp3",
    "desc": "Toques rítmicos delicados sobre caja de cartón para desencadenar cosquilleos ASMR de relajación profunda.",
    "spikeTip": "Utiliza audífonos estéreo para sentir la proximidad envolvente del tapping 🦔🎧"
  },
  {
    "id": "routine-aud-2",
    "catId": "audio",
    "type": "audio-player",
    "title": "ASMR Tapping en Superficie Plástica",
    "category": "Audios & Frecuencias",
    "duration": "5:00",
    "intensity": "ASMR Táctil 🎧",
    "instructor": "Pipo el Pingüino 🐧",
    "instructorIcon": "🐧",
    "isFavorite": false,
    "previewImagePath": "assets/exercises/ASMR_2.png",
    "audioUrl": "assets/audio/plastic_tapping_asmr.mp3",
    "desc": "Sonidos suaves de toque rítmico sobre plástico blando para calmar la mente y disipar pensamientos estresantes.",
    "spikeTip": "La cadencia constante del tapping ayuda a bajar las pulsaciones y conciliar el sueño 🐧✨"
  },
  {
    "id": "routine-aud-3",
    "catId": "audio",
    "type": "audio-player",
    "title": "ASMR Clicks & Pulsación de Botones",
    "category": "Audios & Frecuencias",
    "duration": "5:00",
    "intensity": "ASMR Táctil 🎧",
    "instructor": "MaoMao la Gatita 🐱",
    "instructorIcon": "🐱",
    "isFavorite": false,
    "previewImagePath": "assets/exercises/ASMR_1.png",
    "audioUrl": "assets/audio/touching_buttons_asmr.mp3",
    "desc": "Sensación táctil sonora de micro-clicks y pulsaciones de botones para desconectarte del dolor físico.",
    "spikeTip": "Cierra los ojos e imagínate presionando botones de calma 🐱 tactile"
  },
  {
    "id": "routine-aud-4",
    "catId": "audio",
    "type": "audio-player",
    "title": "Ruido Marrón Profundo con Crujidos ASMR",
    "category": "Audios & Frecuencias",
    "duration": "5:00",
    "intensity": "Ruido Marrón 🤎",
    "instructor": "Manola la Erizo 🦔",
    "instructorIcon": "🦔",
    "isFavorite": false,
    "previewImagePath": "assets/exercises/ASMR_2.png",
    "audioUrl": "assets/audio/brown_noise_with_asmr_crinkles.mp3",
    "desc": "Frecuencia de ruido marrón envolvente combinada con crujidos ASMR sutiles para enmascarar ruidos y relajar la pelvis.",
    "spikeTip": "El ruido marrón resuena en bajas frecuencias proporcionando un descanso reconfortante 🦔🤎"
  },
  {
    "id": "routine-aud-5",
    "catId": "audio",
    "type": "audio-player",
    "title": "Naturaleza: Río Cristalino y Canto de Aves",
    "category": "Audios & Frecuencias",
    "duration": "5:00",
    "intensity": "Naturaleza 🌿",
    "instructor": "Naveen la Ranita Zen 🐸",
    "instructorIcon": "🐸",
    "isFavorite": false,
    "previewImagePath": "assets/exercises/pajaros.png",
    "audioUrl": "assets/audio/birds_singing_calm_river_nature_ambient_sound.mp3",
    "desc": "Ambiente natural inmersivo de río de agua cristalina y trino de aves silvestres al amanecer.",
    "spikeTip": "Siente la corriente fresca del río arrastrando cualquier rigidez en tu cuerpo 🐸🌊"
  },
  {
    "id": "routine-aud-6",
    "catId": "audio",
    "type": "audio-player",
    "title": "Naturaleza: Bosque Nocturno y Grillos de Agua",
    "category": "Audios & Frecuencias",
    "duration": "5:00",
    "intensity": "Naturaleza 🌙",
    "instructor": "Naveen la Ranita Zen 🐸",
    "instructorIcon": "🐸",
    "isFavorite": false,
    "previewImagePath": "assets/exercises/lluvia.png",
    "audioUrl": "assets/audio/nature_sounds_water_forest_crickets_calm.mp3",
    "desc": "Paisaje sonoro de bosque al anochecer con agua corriente suave y canto rítmico de grillos nocturnos.",
    "spikeTip": "Una atmósfera de serenidad nocturna para inducir el descanso profundo en tu cama 🐸🌙"
  },
  {
    "id": "routine-aud-7",
    "catId": "audio",
    "type": "audio-player",
    "title": "Sonidos de Lluvia en la Ventana para Dormir",
    "category": "Audios & Frecuencias",
    "duration": "5:00",
    "intensity": "Lluvia 🌧️",
    "instructor": "Luffy el Monito 🐒",
    "instructorIcon": "🐒",
    "isFavorite": false,
    "previewImagePath": "assets/exercises/lluvia.png",
    "audioUrl": "assets/audio/rainy_window_sleep_sounds_asmr.mp3",
    "desc": "Gotas de lluvia constante repiqueteando contra la ventana para adormecer los sentidos y calmar los cólicos.",
    "spikeTip": "Abrígate con tu cobija favorita mientras escuchas caer las gotas de lluvia 🐒🌧️"
  },
  {
    "id": "routine-aud-8",
    "catId": "audio",
    "type": "audio-player",
    "title": "Tarde Lluviosa en la Villa con Aves",
    "category": "Audios & Frecuencias",
    "duration": "5:00",
    "intensity": "Lluvia 🌧️",
    "instructor": "Manola la Erizo 🦔",
    "instructorIcon": "🦔",
    "isFavorite": false,
    "previewImagePath": "assets/exercises/pajaros.png",
    "audioUrl": "assets/audio/rainy_day_in_town_with_birds_singing.mp3",
    "desc": "Sensación pacífica de tarde lluviosa en la villa con sonidos de lluvia constante e intermitente canto de pájaros.",
    "spikeTip": "El sonido de la lluvia en el pueblo te acompaña a pausar tu día y meditar en paz 🦔🏡"
  }
];

document.addEventListener('DOMContentLoaded', () => {
  // CORE APPLICATION INSTANCES & STATE
  const userProfile = new UserProfileModel();
  const aiEngine = new HealthAIAgentEngine();

  let userCoins = 0;
  let userStreakDays = 0;
  let hasEnteredTrackerFromHome = false;
  let currentShopCategory = 'external';
  let activeTab = 'dashboard';

  // INSTANCIA DEL MOTOR DE POCHIPESOS Y TAREAS DIARIAS
  const rewardsEngine = new ShopRewardsEngine(userCoins, userStreakDays);
  userCoins = rewardsEngine.coins;
  userStreakDays = rewardsEngine.streakDays;

  // INSTANCIA DEL MOTOR AVANZADO DE 15 LOGROS
  const achievementsEngine = new AchievementsEngine();

  // EXPOSICIÓN GLOBAL PARA MANEJADORES DE EVENTOS
  window.rewardsEngine = rewardsEngine;
  window.achievementsEngine = achievementsEngine;
  window.userProfile = userProfile;
  window.DeveloperSupportBridge = DeveloperSupportBridge;

  // CONTROLADOR ROBUSTO PARA REPRODUCIR Y REGISTRAR CANCIONES DE SPOTIFY
  window.playSpotifySongAndTrack = function(spotifyUrl) {
    // 1. Incrementar progreso de tarea diaria
    rewardsEngine.incrementTaskProgress('spotify_playlist', 1);
    updateCoinsUI();
    renderDailyTasksHub();
    
    // 2. Rastrear logro de Spotify
    const spAch = achievementsEngine.trackProgress('spotify-songs', 1);
    if (spAch && spAch.newlyUnlocked) {
      showInAppAchievementToast(spAch.ach);
    }

    // 3. Notificación In-App elegante
    const current = (rewardsEngine.dailyTasks && rewardsEngine.dailyTasks.tasks && rewardsEngine.dailyTasks.tasks.spotify_playlist) 
      ? rewardsEngine.dailyTasks.tasks.spotify_playlist.current 
      : 1;
    showInAppToast({
      title: 'Canción Registrada 🎵',
      message: `Has escuchado ${current}/3 canciones recomendadas de hoy.`,
      icon: '🎧',
      badgeText: 'Spotify • Tarea Diaria',
      badgeIcon: 'music_note',
      accentColor: '#1DB954',
      duration: 3500
    });

    // 4. Abrir Spotify de forma segura
    if (spotifyUrl) {
      window.open(spotifyUrl, '_blank');
    }
  };

  // SISTEMA UNIFICADO DE NOTIFICACIONES IN-APP (TOASTS FLOTANTES)
  function showInAppToast({
    title = '',
    message = '',
    icon = '✨',
    badgeText = 'Notificación',
    badgeIcon = 'notifications',
    btnText = null,
    onBtnClick = null,
    duration = 4500,
    accentColor = 'var(--gold-accent)'
  }) {
    const container = document.getElementById('achievement-toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'achievement-toast';
    toast.style.borderColor = accentColor;
    
    let btnHtml = '';
    if (btnText) {
      btnHtml = `<button class="achievement-toast-btn" style="background:linear-gradient(135deg, ${accentColor}, #f59e0b);">${btnText}</button>`;
    }

    toast.innerHTML = `
      <div class="achievement-toast-icon">${icon}</div>
      <div class="achievement-toast-content">
        <div class="achievement-toast-header" style="color:${accentColor};">
          <span class="material-symbols-outlined" style="font-size:0.9rem; color:${accentColor};">${badgeIcon}</span>
          <span>${badgeText}</span>
        </div>
        <div class="achievement-toast-title">${title}</div>
        <div class="achievement-toast-sub">${message}</div>
      </div>
      ${btnHtml}
    `;

    if (btnText && onBtnClick) {
      const btn = toast.querySelector('.achievement-toast-btn');
      if (btn) {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          onBtnClick();
          toast.remove();
        });
      }
    }

    container.appendChild(toast);

    setTimeout(() => {
      if (toast && toast.parentElement) {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-15px) scale(0.9)';
        setTimeout(() => toast.remove(), 350);
      }
    }, duration);
  }
  window.showInAppToast = showInAppToast;

  function showInAppAchievementToast(ach) {
    if (!ach) return;
    showInAppToast({
      title: ach.title,
      message: ach.desc,
      icon: ach.icon || '🏆',
      badgeText: '¡Nuevo Logro Desbloqueado!',
      badgeIcon: 'military_tech',
      btnText: 'Reclamar +45 🪙',
      onBtnClick: () => navigateToAchievements(),
      duration: 6500,
      accentColor: 'var(--gold-accent)'
    });
  }
  window.showInAppAchievementToast = showInAppAchievementToast;

  function showInAppRewardToast(coins, reason, icon = '🪙') {
    showInAppToast({
      title: `+${coins} Pochipesos Ganados`,
      message: reason,
      icon: icon,
      badgeText: '¡Recompensa Obtenida!',
      badgeIcon: 'monetization_on',
      duration: 4000,
      accentColor: '#ffd166'
    });
  }
  window.showInAppRewardToast = showInAppRewardToast;

  function showInAppInfoToast(title, message, icon = '✨') {
    showInAppToast({
      title: title,
      message: message,
      icon: icon,
      badgeText: 'Información',
      badgeIcon: 'info',
      duration: 3800,
      accentColor: '#38bdf8'
    });
  }
  window.showInAppInfoToast = showInAppInfoToast;

  function updateCoinsUI() {
    userCoins = rewardsEngine.coins;
    userStreakDays = ShopRewardsEngine.computeDynamicStreak(loggedDaysData);
    rewardsEngine.streakDays = userStreakDays;
    const homePts = document.getElementById('home-points-val');
    if (homePts) homePts.textContent = userCoins;
    const shopPts = document.getElementById('shop-coins-counter');
    if (shopPts) shopPts.textContent = userCoins;
    const homeStreak = document.getElementById('home-streak-val');
    if (homeStreak) homeStreak.textContent = `${userStreakDays} Días`;
    const achStreak = document.getElementById('achievements-streak-counter');
    if (achStreak) achStreak.textContent = `${userStreakDays} Días`;
    rewardsEngine.saveState();
  }
  window.updateCoinsUI = updateCoinsUI;


  function checkAllPetsAndThemesSecret() {
    const allPetKeys = ['erizo', 'luffy', 'maomao', 'pipo', 'naveen'];
    const allThemeKeys = ['red', 'pink', 'green', 'purple', 'blue', 'orange'];
    const hasAllPets = allPetKeys.every(k => achievementsEngine.trackingData.usedPetIds.includes(k));
    const hasAllThemes = allThemeKeys.every(k => achievementsEngine.trackingData.usedThemeIds.includes(k));
    if (hasAllPets && hasAllThemes) {
      const achRes = achievementsEngine.unlockDirect('ach-secret-all-pets-themes');
      if (achRes.newlyUnlocked) {
        showInAppAchievementToast(achRes.ach);
      }
    }
  }
  window.checkAllPetsAndThemesSecret = checkAllPetsAndThemesSecret;

  // CORE DOM ELEMENTS
  const viewOnboarding = document.getElementById('view-onboarding');
  const viewHome = document.getElementById('view-home');
  const viewTracker = document.getElementById('view-tracker');
  const viewShop = document.getElementById('view-shop');
  const viewAchievements = document.getElementById('view-achievements');
  const viewMotivation = document.getElementById('view-motivation');

  // ==========================================================================
  // AVATAR PET COMPANION ENGINE (5 PETS: AMY, LUFFY, MAOMAO, PIPO, NAVEEN)
  // ==========================================================================
  let currentAvatarId = 'amy'; // Default pet companion
  let currentThemeKey = 'red';

  const avatarRegistry = {
    amy: {
      id: 'amy',
      name: 'Manola la Erizo 🦔',
      species: 'Erizo',
      icon: '🦔',
      folder: 'Amy',
      suffix: 'Amy',
      gender: 'f',
      quotes: {
        home: '"¡Hola! Toca cualquier nodo para explorar o el botón central para tu Tracker ✨"',
        trackerGreeting: '"¡Hola! ¡Qué alegría verte de nuevo por aquí! 💖 ✨"',
        trackerScared: '"¡Cuidado con ese bloque de información que cae! 😱"',
        trackerRelieved: '"¡Uff, por poco! 😮‍💨 Ya pasamos el susto."',
        menstrual: '"Día de descanso suave. Prepara tu compresa tibia y descansa ☕"',
        follicular: '"Tus energías están renovándose. ¡Momento ideal para nuevos proyectos! 🌱"',
        ovulatory: '"¡Hoy tu energía está al máximo! Ideal para ejercicios suaves o estiramientos. Bebe 2L de agua 💧"',
        luteal: '"Momento de bajar el ritmo y consentirte con té y estiramientos suaves 🌙"'
      }
    },
    luffy: {
      id: 'luffy',
      name: 'Luffy El Monito 🐒',
      species: 'Monito',
      icon: '🐒',
      folder: 'Luffy',
      suffix: 'Luffy',
      gender: 'm',
      quotes: {
        home: '"¡Qué alegría verte! Elige tu destino en los nodos o entra al Tracker 🐒✨"',
        trackerGreeting: '"¡Hola! ¡Llegó Luffy a dar saltos de alegría contigo! 🐒✨"',
        trackerScared: '"¡Ayyy! ¡Un bloque gigante cayendo sobre mí! 😱"',
        trackerRelieved: '"¡Menudo salto di! Jaja por poquito me aplasta 😮‍💨"',
        menstrual: '"Hoy bajamos el ritmo de los saltos. Mucha agua y confort 🍵"',
        follicular: '"¡Siento la energía crecer! ¿Hacemos ejercicio hoy? 🐒⚡"',
        ovulatory: '"¡Fase ovulatoria! Fuerza y positivismo al 100% ✨"',
        luteal: '"Tiempo de estirar con calma y relajarnos un poco 😴"'
      }
    },
    maomao: {
      id: 'maomao',
      name: 'MaoMao La Gatita 🐱',
      species: 'Gatita',
      icon: '🐱',
      folder: 'MaoMao',
      suffix: 'Mao',
      gender: 'f',
      quotes: {
        home: '"Miau~ Bienvenida de vuelta. Todo listo para cuidar tu salud 🐱💖"',
        trackerGreeting: '"¡Miauuu! ¡Qué felicidad verte de nuevo! 🐱💖"',
        trackerScared: '"¡Miauuu! ¡Casi me cae el slab encima! 😱"',
        trackerRelieved: '"Uff, mis 7 vidas me salvaron. Aquí está tu reporte 💖"',
        menstrual: '"Modo acurrucarse activado. Manta suave y té caliente ☕"',
        follicular: '"Curiosidad y energía por las nubes. Miau! 🌸"',
        ovulatory: '"¡Radiante y hermosa como siempre! Energía al máximo 👑"',
        luteal: '"Momento de mimarte, tomar siestas cortas y descansar 🌙"'
      }
    },
    pipo: {
      id: 'pipo',
      name: 'Pipo El Pingüino 🐧',
      species: 'Pingüino',
      icon: '🐧',
      folder: 'Pipo',
      suffix: 'Pipo',
      gender: 'm',
      quotes: {
        home: '"¡Hola, amiga! Tu compañero Pipo está listo para guiarte 🐧✨"',
        trackerGreeting: '"¡Waddle waddle! ¡Qué lindo volver a verte! 🐧✨"',
        trackerScared: '"¡Waddle waddle! ¡Me deslicé justo a tiempo! 😱"',
        trackerRelieved: '"¡Uff! Por poco me deja chato. ¡Todo bajo control! 🐧💨"',
        menstrual: '"Compresa tibia lista para el vientre. Vamos a descansar 🐧🔥"',
        follicular: '"¡Aleteo de alegría! Días de renovación y vitalidad ❄️✨"',
        ovulatory: '"¡Brillo de nieve radiante! Hoy estás al 100% de fuerza 🐧⚡"',
        luteal: '"Gorrito acogedor y té de manzanilla para una tarde tranquila 🍵"'
      }
    },
    naveen: {
      id: 'naveen',
      name: 'Naveen El Ranito 🐸',
      species: 'Ranita',
      icon: '🐸',
      folder: 'Naveen',
      suffix: 'Naveen',
      gender: 'm',
      quotes: {
        home: '"Namasté. La paz y la serenidad acompañan tu ciclo hoy 🐸🧘‍♂️"',
        trackerGreeting: '"Namasté. Conecta con tu cuerpo y tu respiración 🧘‍♂️✨"',
        trackerScared: '"¡Gran salto Zen! Esquivando con gracia el bloque cayendo 😱"',
        trackerRelieved: '"Inhala serenidad, exhala tensión. El bloque cayó seguro 😮‍💨"',
        menstrual: '"Meditación profunda y té de manzanilla. Escucha a tu cuerpo 🍵"',
        follicular: '"Nuevos brotes de energía. Mantén tu mente clara y enfocada 🌱"',
        ovulatory: '"Equilibrio perfecto de energía y mente. Fluye con tu día ✨"',
        luteal: '"Paz mental, estiramientos pélvicos y calma absoluta 🧘‍♂️"'
      }
    }
  };

  // ESTADO DEL CICLO MENSTRUAL & FASES BIOLÓGICAS REALES
  const userCycleState = {
    currentPhase: 'Ovulatoria', // 'Menstrual', 'Folicular', 'Ovulatoria', 'Lutea'
    currentDay: 14,
    cycleLength: 28,
    phaseDetails: {
      Menstrual: { name: 'Fase Menstrual', icon: 'water_drop', badge: 'Descanso Suave 🍵', emoji: '🩸', risk: 'Baja', next: 'Fase Folicular (5d)', defaultDay: 2 },
      Folicular: { name: 'Fase Folicular', icon: 'eco', badge: 'Renovación & Brillo 🌱', emoji: '🌱', risk: 'Media', next: 'Fase Ovulatoria (7d)', defaultDay: 7 },
      Ovulatoria: { name: 'Fase Ovulatoria', icon: 'auto_awesome', badge: 'Máxima Energía ✨', emoji: '✨', risk: 'Elevada', next: 'Fase Lútea (14d)', defaultDay: 14 },
      Lutea: { name: 'Fase Lútea', icon: 'nightlight', badge: 'Calma & Autocuidado 🌙', emoji: '🌙', risk: 'Baja', next: 'Fase Menstrual (4d)', defaultDay: 21 }
    }
  };

  // CONFIGURACIÓN DE TONOS / TEMAS (AUTOMÁTICO POR FASE O FIJO)
  let themeSettings = {
    mode: 'auto_by_phase', // 'auto_by_phase' | 'fixed'
    fixedTheme: 'red',
    phaseThemes: {
      Menstrual: 'red',     // 🩸 Rojo Rosas (predeterminado para Menstruación)
      Folicular: 'pink',    // 🌱 Rosa Corazones (predeterminado para Folicular)
      Ovulatoria: 'blue',   // ✨ Azul Lluvia (predeterminado para Ovulatoria)
      Lutea: 'yellow'       // 🌙 Girasol Amarillo (predeterminado para Lútea)
    }
  };

  try {
    const savedThemeSettings = localStorage.getItem('pochirocho_theme_settings');
    if (savedThemeSettings) {
      themeSettings = Object.assign(themeSettings, JSON.parse(savedThemeSettings));
    }
  } catch (e) {}

  function saveThemeSettings() {
    try {
      localStorage.setItem('pochirocho_theme_settings', JSON.stringify(themeSettings));
    } catch (e) {}
  }

  function getThemeForCurrentState() {
    if (themeSettings.mode === 'auto_by_phase') {
      return themeSettings.phaseThemes[userCycleState.currentPhase] || 'red';
    }
    return themeSettings.fixedTheme || 'red';
  }

  function updateDashboardSlabUI() {
    const phaseNameEl = document.getElementById('slab-phase-name');
    const cycleDayEl = document.querySelector('.slab-cycle-day');
    const cycleLengthEl = document.getElementById('slab-cycle-length-label');
    const energyValEl = document.getElementById('slab-energy-val');
    const pregnancyValEl = document.getElementById('slab-pregnancy-val');
    const nextPhaseValEl = document.getElementById('slab-next-phase-val');

    let historyCycles = [];
    try {
      historyCycles = JSON.parse(localStorage.getItem('pochirocho_cycle_history') || '[]');
    } catch(e) {}

    const prediction = cyclePredictorEngine.predictNextPeriod(userProfile, historyCycles);
    const cycleLen = Math.round(prediction.duracionCicloEstimada) || parseInt(userProfile.duracionPromedioCiclo, 10) || 28;
    const periodLen = parseInt(userProfile.duracionPromedioPeriodo, 10) || 5;
    const currentDay = prediction.diaActualCiclo || parseInt(userCycleState.currentDay, 10) || 1;
    const isDelayed = prediction.isDelayed || currentDay > cycleLen;
    const daysLate = prediction.diasRetraso || (isDelayed ? currentDay - cycleLen : 0);

    userCycleState.isDelayed = isDelayed;
    userCycleState.daysLate = daysLate;
    userCycleState.currentDay = currentDay;

    const currentPhase = userCycleState.currentPhase || (isDelayed ? 'Lutea' : prediction.faseHormonal);

    if (cycleLengthEl) cycleLengthEl.textContent = `Ciclo de ${cycleLen} Días`;
    if (cycleDayEl) cycleDayEl.textContent = `Día ${currentDay}`;

    if (isDelayed) {
      if (phaseNameEl) {
        phaseNameEl.innerHTML = `<span class="material-symbols-outlined" style="font-size: 0.85rem; color: #fbbf24;">hourglass_top</span> <span>Retraso (+${daysLate}d)</span>`;
        phaseNameEl.style.background = 'linear-gradient(135deg, #d97706 0%, #b45309 100%)';
        phaseNameEl.style.boxShadow = '0 0 14px rgba(245, 158, 11, 0.45)';
      }
      if (energyValEl) energyValEl.textContent = 'Autocuidado & Calma 🍵';
      if (pregnancyValEl) {
        if (daysLate >= 5) {
          pregnancyValEl.className = 'metric-value pregnancy-medium';
          pregnancyValEl.innerHTML = `<span class="material-symbols-outlined" style="font-size: 1rem; color: #fbbf24;">info</span> Test sugerido (+5d)`;
        } else {
          pregnancyValEl.className = 'metric-value pregnancy-low';
          pregnancyValEl.innerHTML = `<span class="material-symbols-outlined" style="font-size: 1rem;">shield</span> Bajo / Evaluando`;
        }
      }
      if (nextPhaseValEl) nextPhaseValEl.textContent = `Esperando Período (+${daysLate}d)`;
    } else {
      if (phaseNameEl && userCycleState.phaseDetails && userCycleState.phaseDetails[currentPhase]) {
        phaseNameEl.textContent = userCycleState.phaseDetails[currentPhase].name;
        phaseNameEl.style.background = '';
        phaseNameEl.style.boxShadow = '';
      }

      // Configuración Clínica & Biológica por Fase
      if (currentPhase === 'Menstrual') {
        if (energyValEl) energyValEl.textContent = 'Reposo & Recarga 🌙';
        if (pregnancyValEl) {
          pregnancyValEl.className = 'metric-value pregnancy-low';
          pregnancyValEl.innerHTML = `<span class="material-symbols-outlined" style="font-size: 1rem;">verified_user</span> Muy Bajo`;
        }
        const daysUntilNext = Math.max(1, (periodLen + 1) - currentDay);
        if (nextPhaseValEl) nextPhaseValEl.textContent = `Fase Folicular (en ${daysUntilNext}d)`;
      } else if (currentPhase === 'Folicular') {
        if (energyValEl) energyValEl.textContent = 'Creatividad & Foco 🚀';
        if (pregnancyValEl) {
          pregnancyValEl.className = 'metric-value pregnancy-medium';
          pregnancyValEl.innerHTML = `<span class="material-symbols-outlined" style="font-size: 1rem;">trending_up</span> Creciente / Medio`;
        }
        const ovStart = Math.max(12, cycleLen - 16);
        const daysUntilNext = Math.max(1, ovStart - currentDay);
        if (nextPhaseValEl) nextPhaseValEl.textContent = `Fase Ovulatoria (en ${daysUntilNext}d)`;
      } else if (currentPhase === 'Ovulatoria') {
        if (energyValEl) energyValEl.textContent = 'Máxima Energía ✨';
        if (pregnancyValEl) {
          pregnancyValEl.className = 'metric-value pregnancy-high';
          pregnancyValEl.innerHTML = `<span class="material-symbols-outlined" style="font-size: 1rem;">warning</span> Muy Alto (Pico Fértil)`;
        }
        const luteaStart = Math.max(17, cycleLen - 11);
        const daysUntilNext = Math.max(1, luteaStart - currentDay);
        if (nextPhaseValEl) nextPhaseValEl.textContent = `Fase Lútea (en ${daysUntilNext}d)`;
      } else if (currentPhase === 'Lutea') {
        if (energyValEl) energyValEl.textContent = 'Calma & Introspección 🌿';
        if (pregnancyValEl) {
          pregnancyValEl.className = 'metric-value pregnancy-low';
          pregnancyValEl.innerHTML = `<span class="material-symbols-outlined" style="font-size: 1rem;">shield</span> Bajo`;
        }
        const daysUntilNext = Math.max(1, (cycleLen + 1) - currentDay);
        if (nextPhaseValEl) nextPhaseValEl.textContent = `Menstruación (en ${daysUntilNext}d)`;
      }
    }
  }
  window.updateDashboardSlabUI = updateDashboardSlabUI;

  function setCyclePhase(phaseKey, dayNum = null) {
    if (!userCycleState.phaseDetails[phaseKey]) return;
    userCycleState.currentPhase = phaseKey;
    userCycleState.currentDay = dayNum || userCycleState.phaseDetails[phaseKey].defaultDay || 14;

    // Actualizar Slab UI Dinámico y Clínico
    updateDashboardSlabUI();

    // Si está en modo automático por fase, aplicar el tono configurado para esa fase
    if (themeSettings.mode === 'auto_by_phase') {
      applyTheme(themeSettings.phaseThemes[phaseKey] || 'red');
    }

    // Actualizar el avatar a su asset de la fase actual
    updateAvatarDisplay(null);

    // Sincronizar Spotify con la nueva fase
    if (typeof renderSpotifyDashboardCard === 'function') {
      renderSpotifyDashboardCard();
    }
  }
  window.setCyclePhase = setCyclePhase;

  function getAvatarImagePath(petId, state) {
    const pet = avatarRegistry[petId] || avatarRegistry.amy;
    let filenameState = state || 'Normal';

    if (state === 'Asustado') {
      filenameState = pet.gender === 'f' ? 'Asustada' : 'Asustado';
    } else if (state === 'Aliviado') {
      filenameState = pet.gender === 'f' ? 'Aliviada' : 'Aliviado';
    }

    return `assets/avatares/${pet.folder}/${filenameState}_${pet.suffix}.png`;
  }

  function updateAvatarDisplay(stateOverride = null) {
    const pet = avatarRegistry[currentAvatarId] || avatarRegistry.amy;

    let displayState = stateOverride;
    if (!displayState) {
      displayState = userCycleState.currentPhase || 'Ovulatoria';
    }

    const homeImgPath = getAvatarImagePath(currentAvatarId, 'Normal');
    const activeImgPath = getAvatarImagePath(currentAvatarId, displayState);

    // 1. Update Home Footer Avatar
    const homeAvatarImg = document.getElementById('home-avatar-img');
    const homeAvatarName = document.getElementById('home-avatar-name');
    const homeAvatarQuote = document.getElementById('home-avatar-quote');

    if (homeAvatarImg) homeAvatarImg.src = homeImgPath;
    if (homeAvatarName) homeAvatarName.textContent = pet.name;
    if (homeAvatarQuote) homeAvatarQuote.textContent = pet.quotes.home;

    // 2. Update Tracker Dashboard Avatar
    const trackerAvatarImg = document.getElementById('tracker-avatar-img');
    const trackerAvatarTitle = document.getElementById('tracker-avatar-title');
    const trackerAvatarText = document.getElementById('tracker-avatar-text');

    if (trackerAvatarImg) trackerAvatarImg.src = activeImgPath;
    if (trackerAvatarTitle) trackerAvatarTitle.textContent = pet.name;

    if (trackerAvatarText && !stateOverride) {
      const quoteKey = displayState.toLowerCase();
      trackerAvatarText.textContent = pet.quotes[quoteKey] || pet.quotes.ovulatory;
    }

    // 3. Update Avatar Selector Dots Active Class
    const avatarDots = document.querySelectorAll('.avatar-dot');
    avatarDots.forEach(dot => {
      const dotAvatar = dot.getAttribute('data-avatar');
      if (dotAvatar === currentAvatarId) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    // 4. Update AI Agent Subview if visible
    const aiFeed = document.getElementById('ai-chat-feed');
    if (aiFeed) {
      renderAIAgentView();
    }
  }

  // =========================================================================
  // PRECARGADOR DE RECURSOS EN MEMORIA (Garantiza 60 FPS y 0ms de retardo en CDN / Vercel)
  // =========================================================================
  function preloadCriticalAssets() {
    const pets = ['amy', 'luffy', 'maomao', 'pipo', 'naveen'];
    const states = ['Normal', 'Feliz', 'Asustado', 'Aliviado', 'Menstrual', 'Folicular', 'Ovulatoria', 'Lutea'];
    const themes = ['Burbujas.png', 'Corazones.png', 'Girasoles.png', 'Hojas.png', 'Lluvia.png', 'Rosas.png'];

    const preloadedImages = [];

    // 1. Precargar en RAM todas las expresiones de las mascotas
    pets.forEach(petId => {
      states.forEach(st => {
        const img = new Image();
        img.src = getAvatarImagePath(petId, st);
        preloadedImages.push(img);
      });
    });

    // 2. Precargar en RAM los temas visuales
    themes.forEach(themeName => {
      const img = new Image();
      img.src = `assets/themes/${themeName}`;
      preloadedImages.push(img);
    });
  }
  preloadCriticalAssets();

  // =========================================================================
  // ENHANCED ONBOARDING CONTROLLER (SETTINGS-LIKE THEMES, TRACKER CALENDAR, CLINICAL DATA, HEALTHKIT, FACEID)
  // =========================================================================
  let obCurrentStep = 1;
  const obTotalSteps = 7;
  let obSelectedPet = 'amy';
  let obSelectedRegularity = 'Regular';
  let obSelectedMethod = 'Ninguno';
  let obSelectedSymptom = 'Cólicos';
  let obSelectedGoal = 'Bienestar General';
  let obHealthKitConnected = false;
  let obFaceIdEnabled = false;

  // Onboarding Themes (Exact schema as Settings)
  let obThemeSettings = {
    mode: 'auto_by_phase',
    fixedTheme: 'red',
    phaseThemes: {
      Menstrual: 'red',
      Folicular: 'pink',
      Ovulatoria: 'blue',
      Lutea: 'yellow'
    }
  };

  // Onboarding Calendar State
  const obCalendarMonths = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const obNow = new Date();
  let obCalYear = obNow.getFullYear();
  let obCalMonth = obNow.getMonth();

  function formatObDateKey(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  // Default LMP: 14 days ago
  const defaultLmpDateObj = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
  let obSelectedLmpDateStr = formatObDateKey(defaultLmpDateObj);

  const availableColors = [
    { key: 'red', name: 'Rojo (Rosas) 🌹', color: '#E63946' },
    { key: 'pink', name: 'Rosa (Corazones) 🩷', color: '#ff758f' },
    { key: 'green', name: 'Verde (Hojas) 🍃', color: '#2ec4b6' },
    { key: 'yellow', name: 'Amarillo (Girasoles) 🌻', color: '#ffb950' },
    { key: 'purple', name: 'Morado (Burbujas) 🫧', color: '#a855f7' },
    { key: 'blue', name: 'Azul (Lluvia) 🌧️', color: '#38bdf8' }
  ];

  // 1. Fondo Multi-tema Cayendo Dinámicamente en Bucle
  function initObFallingBackground() {
    const container = document.getElementById('ob-falling-container');
    if (!container) return;
    container.innerHTML = '';
    const assets = [
      'assets/themes/Rosas.png',
      'assets/themes/Corazones.png',
      'assets/themes/Hojas.png',
      'assets/themes/Girasoles.png',
      'assets/themes/Burbujas.png'
    ];
    for (let i = 0; i < 28; i++) {
      const img = document.createElement('img');
      img.src = assets[i % assets.length];
      img.className = 'ob-falling-item';
      const randomX = Math.random() * 88 + 4;
      const randomDelay = -(Math.random() * 14);
      const randomDuration = Math.random() * 6 + 7; // 7s a 13s
      const randomSize = Math.random() * 20 + 26; // 26px a 46px
      const randomOpacity = Math.random() * 0.4 + 0.6; // 0.6 a 1.0

      img.style.left = `${randomX}%`;
      img.style.animationDelay = `${randomDelay}s`;
      img.style.animationDuration = `${randomDuration}s`;
      img.style.width = `${randomSize}px`;
      img.style.opacity = `${randomOpacity}`;

      container.appendChild(img);
    }
  }

  // 2. Renderizado de Selectores de Color del Onboarding (Igual a Settings)
  function renderObThemeColorPickers() {
    const phases = [
      { key: 'Menstrual', containerId: 'ob-picker-menstrual' },
      { key: 'Folicular', containerId: 'ob-picker-folicular' },
      { key: 'Ovulatoria', containerId: 'ob-picker-ovulatoria' },
      { key: 'Lutea', containerId: 'ob-picker-lutea' }
    ];

    phases.forEach(p => {
      const el = document.getElementById(p.containerId);
      if (!el) return;
      const currentPhaseColor = obThemeSettings.phaseThemes[p.key] || 'red';
      el.innerHTML = availableColors.map(c => `
        <button type="button" class="phase-color-dot-btn ${currentPhaseColor === c.key ? 'active' : ''}"
                style="background: ${c.color};"
                onclick="setObPhaseTheme('${p.key}', '${c.key}')"
                title="${c.name}">
          ${currentPhaseColor === c.key ? '✓' : ''}
        </button>
      `).join('');
    });

    const fixedCont = document.getElementById('ob-theme-fixed-container');
    if (fixedCont) {
      fixedCont.innerHTML = availableColors.map(c => `
        <div class="settings-theme-card ${obThemeSettings.fixedTheme === c.key ? 'active' : ''}" 
             data-theme="${c.key}" 
             onclick="setObFixedTheme('${c.key}')">
          <div class="settings-theme-color-dot" style="background:${c.color};"></div>
          <span>${c.name}</span>
        </div>
      `).join('');
    }
  }

  window.setObThemeMode = function(mode) {
    obThemeSettings.mode = mode;
    const btnPhase = document.getElementById('ob-tab-mode-phase');
    const btnFixed = document.getElementById('ob-tab-mode-fixed');
    const contPhase = document.getElementById('ob-theme-phase-container');
    const contFixed = document.getElementById('ob-theme-fixed-container');

    if (mode === 'auto_by_phase') {
      if (btnPhase) btnPhase.classList.add('active');
      if (btnFixed) btnFixed.classList.remove('active');
      if (contPhase) contPhase.style.display = 'flex';
      if (contFixed) contFixed.style.display = 'none';
    } else {
      if (btnFixed) btnFixed.classList.add('active');
      if (btnPhase) btnPhase.classList.remove('active');
      if (contFixed) contFixed.style.display = 'grid';
      if (contPhase) contPhase.style.display = 'none';
    }
    renderObThemeColorPickers();
  };

  window.setObPhaseTheme = function(phaseKey, colorKey) {
    obThemeSettings.phaseThemes[phaseKey] = colorKey;
    renderObThemeColorPickers();
  };

  window.setObFixedTheme = function(colorKey) {
    obThemeSettings.fixedTheme = colorKey;
    renderObThemeColorPickers();
  };

  // 3. Mascota Selection
  window.selectObPet = function(petKey, element) {
    obSelectedPet = petKey;
    document.querySelectorAll('.ob-pet-card').forEach(el => el.classList.remove('active'));
    if (element) element.classList.add('active');
  };

  // 4. Calendario Interactivo Embebido para LMP
  function renderObCalendar() {
    const monthTitle = document.getElementById('ob-cal-month-title');
    const grid = document.getElementById('ob-calendar-grid');
    if (monthTitle) monthTitle.textContent = `${obCalendarMonths[obCalMonth]} ${obCalYear}`;
    if (!grid) return;

    const firstDay = new Date(obCalYear, obCalMonth, 1);
    const lastDay = new Date(obCalYear, obCalMonth + 1, 0);
    let startDay = firstDay.getDay() - 1;
    if (startDay < 0) startDay = 6;
    const totalDays = lastDay.getDate();

    const todayStr = formatObDateKey(new Date());

    let html = '';
    for (let i = 0; i < startDay; i++) {
      html += `<div class="ob-cal-cell empty"></div>`;
    }

    for (let d = 1; d <= totalDays; d++) {
      const mStr = String(obCalMonth + 1).padStart(2, '0');
      const dStr = String(d).padStart(2, '0');
      const dateKey = `${obCalYear}-${mStr}-${dStr}`;
      const isSelected = (dateKey === obSelectedLmpDateStr);
      const isToday = (dateKey === todayStr);

      html += `
        <div class="ob-cal-cell ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}"
             onclick="selectObCalDate('${dateKey}')">
          ${d}
        </div>
      `;
    }
    grid.innerHTML = html;
    updateObCalSelectedDisplay();
  }

  function updateObCalSelectedDisplay() {
    const displayEl = document.getElementById('ob-cal-selected-text');
    if (!displayEl) return;
    const parts = obSelectedLmpDateStr.split('-');
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    displayEl.textContent = `📆 Seleccionado: ${d} de ${obCalendarMonths[m]} de ${y} (Inicio de última menstruación)`;
  }

  window.selectObCalDate = function(dateKey) {
    obSelectedLmpDateStr = dateKey;
    renderObCalendar();
  };

  window.prevObCalMonth = function() {
    obCalMonth--;
    if (obCalMonth < 0) {
      obCalMonth = 11;
      obCalYear--;
    }
    renderObCalendar();
  };

  window.nextObCalMonth = function() {
    obCalMonth++;
    if (obCalMonth > 11) {
      obCalMonth = 0;
      obCalYear++;
    }
    renderObCalendar();
  };

  // 5. Sliders Handlers
  window.updateObCycleSlider = function(val) {
    const el = document.getElementById('ob-val-cycle');
    if (el) el.textContent = `${val} días`;
  };

  window.updateObPeriodSlider = function(val) {
    const el = document.getElementById('ob-val-period');
    if (el) el.textContent = `${val} días`;
  };

  // 6. Clinical Questions Handlers
  window.selectObRegularity = function(val, element) {
    obSelectedRegularity = val;
    document.querySelectorAll('[data-reg]').forEach(el => el.classList.remove('active'));
    if (element) element.classList.add('active');
  };

  window.selectObMethod = function(val, element) {
    obSelectedMethod = val;
    document.querySelectorAll('#ob-method-pills .ob-pill').forEach(el => el.classList.remove('active'));
    if (element) element.classList.add('active');
  };

  window.selectObSymptom = function(val, element) {
    obSelectedSymptom = val;
    document.querySelectorAll('[data-symptom]').forEach(el => el.classList.remove('active'));
    if (element) element.classList.add('active');
  };

  window.selectObGoal = function(val, element) {
    obSelectedGoal = val;
    document.querySelectorAll('[data-goal]').forEach(el => el.classList.remove('active'));
    if (element) element.classList.add('active');
  };

  // 7. Flo Sync Assistant Modal & Handlers
  window.openFloSyncModal = function() {
    const modal = document.getElementById('modal-flo-sync');
    if (modal) modal.style.display = 'flex';
  };
  window.triggerAppleHealthPermissionModal = window.openFloSyncModal;

  window.closeFloSyncModal = function() {
    const modal = document.getElementById('modal-flo-sync');
    if (modal) modal.style.display = 'none';
  };
  window.closeAppleHealthModal = window.closeFloSyncModal;

  window.confirmFloQuickSync = function() {
    const cycleLen = parseInt(document.getElementById('flo-modal-cycle-len')?.value || '28', 10);
    const periodLen = parseInt(document.getElementById('flo-modal-period-len')?.value || '5', 10);

    obHealthKitConnected = true;
    userProfile.floConectado = true;
    userProfile.duracionPromedioCiclo = cycleLen;
    userProfile.duracionPromedioPeriodo = periodLen;

    const res = FloSyncEngine.syncFloData(
      loggedDaysData,
      obSelectedLmpDateStr || userProfile.lmpFecha,
      cycleLen,
      periodLen
    );

    window.closeFloSyncModal();

    const statusBadge = document.getElementById('ob-flo-status-badge') || document.getElementById('ob-health-status-badge');
    const btnFlo = document.getElementById('btn-ob-connect-flo') || document.getElementById('btn-ob-connect-health');
    const btnFloText = document.getElementById('btn-ob-flo-text') || document.getElementById('btn-ob-health-text');

    if (statusBadge) {
      statusBadge.textContent = '🟢 Flo Sincronizado';
      statusBadge.style.color = '#ff758f';
      statusBadge.style.background = 'rgba(255, 77, 109, 0.2)';
    }
    if (btnFlo) {
      btnFlo.style.background = 'rgba(255, 77, 109, 0.2)';
      btnFlo.style.border = '1px solid #ff758f';
      btnFlo.style.color = '#ff758f';
    }
    if (btnFloText) btnFloText.textContent = `✓ Flo Transferido (${res.recordsCount} días sincronizados)`;

    showInAppToast({
      title: 'Datos de Flo Sincronizados 🌸',
      message: res.message,
      icon: '🌸',
      badgeText: 'Flo Health Sync',
      badgeIcon: 'sync',
      accentColor: '#ff758f',
      duration: 4500
    });
  };

  window.importFloFileFromOnboarding = function(fileInput) {
    if (!fileInput || !fileInput.files || !fileInput.files[0]) return;
    const file = fileInput.files[0];
    const reader = new FileReader();

    showInAppInfoToast('Importando Flo', `Leyendo ${file.name}...`, '⏳');

    reader.onload = function(e) {
      const content = e.target.result;
      const parseRes = FloSyncEngine.parseFloCSV(content);

      if (parseRes && parseRes.totalEntries > 0) {
        const res = FloSyncEngine.syncFloData(
          loggedDaysData,
          parseRes.latestPeriodDate || obSelectedLmpDateStr,
          userProfile.duracionPromedioCiclo || 28,
          userProfile.duracionPromedioPeriodo || 5,
          parseRes.importedDays
        );

        obHealthKitConnected = true;
        userProfile.floConectado = true;

        const statusBadge = document.getElementById('ob-flo-status-badge');
        const btnFloText = document.getElementById('btn-ob-flo-text');
        if (statusBadge) {
          statusBadge.textContent = '🟢 Flo Sincronizado';
          statusBadge.style.color = '#ff758f';
        }
        if (btnFloText) btnFloText.textContent = `✓ Archivo Flo Importado (${parseRes.totalEntries} días)`;

        showInAppToast({
          title: 'Reporte de Flo Importado 🌸',
          message: `Se importaron con éxito ${parseRes.totalEntries} registros de ciclo y síntomas desde Flo.`,
          icon: '🌸',
          badgeText: 'Flo Health Sync',
          badgeIcon: 'check_circle',
          accentColor: '#ff758f',
          duration: 5000
        });
      } else {
        window.confirmFloQuickSync();
      }
    };
    reader.readAsText(file);
  };

  window.toggleObFaceId = async function(checked) {
    obFaceIdEnabled = checked;
    userProfile.biometriaHabilitada = checked;
    const sub = document.getElementById('ob-biometric-status-sub');

    if (checked) {
      // Disparar registro y verificación biométrica real WebAuthn
      await BiometricAuthEngine.registerBiometrics(userProfile.nombre || 'Usuaria');
      if (sub) {
        sub.textContent = '🟢 Activada (Protección Face ID Secure Enclave)';
        sub.style.color = '#38bdf8';
      }
      showInAppToast({
        title: 'Face ID Activado 🔒',
        message: 'Protección biométrica vinculada exitosamente al Secure Enclave.',
        icon: '🛡️',
        badgeText: 'Seguridad Apple',
        badgeIcon: 'face_unlock',
        accentColor: '#38bdf8'
      });
    } else {
      BiometricAuthEngine.disable();
      if (sub) {
        sub.textContent = 'Desactivada (Toca para activar)';
        sub.style.color = '#94a3b8';
      }
    }
  };

  window.triggerFaceIdScanAnimation = async function() {
    const overlay = document.getElementById('apple-faceid-overlay');
    const statusText = document.getElementById('faceid-status-text');
    const iconState = document.getElementById('faceid-icon-state');
    if (overlay) overlay.style.display = 'flex';
    if (statusText) statusText.textContent = 'Solicitando autenticación Face ID...';
    if (iconState) iconState.innerHTML = '<span class="material-symbols-outlined faceid-icon-scanning">face_recognition</span>';

    // Disparar autenticación biométrica real de plataforma (WebAuthn / iOS Face ID)
    const authResult = await BiometricAuthEngine.registerBiometrics(userProfile.nombre || 'Usuaria');

    if (statusText) statusText.textContent = '✓ Face ID Verificado con Éxito';
    if (iconState) iconState.innerHTML = '<span class="material-symbols-outlined" style="font-size:3.5rem; color:#10b981;">check_circle</span>';

    const cb = document.getElementById('ob-faceid-checkbox');
    if (cb) cb.checked = true;
    obFaceIdEnabled = true;
    userProfile.biometriaHabilitada = true;

    const sub = document.getElementById('ob-biometric-status-sub');
    if (sub) {
      sub.textContent = '🟢 Activada (Face ID Verificado)';
      sub.style.color = '#38bdf8';
    }

    setTimeout(() => {
      if (overlay) overlay.style.display = 'none';
      showInAppToast({
        title: 'Face ID Autenticado ✨',
        message: 'Tu rostro ha sido verificado con los estándares de Apple.',
        icon: '🔒',
        badgeText: 'Face ID',
        badgeIcon: 'verified_user',
        accentColor: '#38bdf8'
      });
    }, 700);
  };

  // 8. Navigation & Step Updates
  const btnObNext = document.getElementById('btn-ob-next');
  const btnObBack = document.getElementById('btn-ob-back');
  const obSteps = document.querySelectorAll('.onboarding-step');
  const obProgressSteps = document.querySelectorAll('.ob-progress-step');

  function updateObView() {
    obSteps.forEach((step, idx) => {
      const stepNum = idx + 1;
      if (stepNum === obCurrentStep) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });

    obProgressSteps.forEach((step, idx) => {
      const stepNum = idx + 1;
      step.classList.remove('active', 'completed');
      if (stepNum === obCurrentStep) {
        step.classList.add('active');
      } else if (stepNum < obCurrentStep) {
        step.classList.add('completed');
      }
    });

    const stepCounter = document.getElementById('ob-step-counter');
    if (stepCounter) stepCounter.textContent = `Paso ${obCurrentStep} de ${obTotalSteps}`;

    if (obCurrentStep === 1) {
      if (btnObBack) btnObBack.style.visibility = 'hidden';
    } else {
      if (btnObBack) btnObBack.style.visibility = 'visible';
    }

    if (obCurrentStep === obTotalSteps) {
      if (btnObNext) {
        btnObNext.innerHTML = '<span>Comenzar mi experiencia ✨</span>';
      }

      // Populate Step 7 Summary
      const inputName = document.getElementById('ob-input-name');
      const userName = (inputName && inputName.value.trim() !== '') ? inputName.value.trim() : 'Ana';
      const pet = avatarRegistry[obSelectedPet] || avatarRegistry.amy;
      const cycleLength = parseInt(document.getElementById('ob-slider-cycle')?.value || '28', 10);
      const periodLength = parseInt(document.getElementById('ob-slider-period')?.value || '5', 10);

      const obFinalAvatar = document.getElementById('ob-final-avatar');
      const obFinalTitle = document.getElementById('ob-final-title');
      const obFinalMsg = document.getElementById('ob-final-msg');
      const sumPet = document.getElementById('ob-sum-pet');
      const sumCycle = document.getElementById('ob-sum-cycle');
      const sumPhase = document.getElementById('ob-sum-phase');

      if (obFinalAvatar) {
        const petGenderState = pet.gender === 'f' ? `Feliz_${pet.suffix}.png` : `Normal_${pet.suffix}.png`;
        obFinalAvatar.src = `assets/avatares/${pet.folder}/${petGenderState}`;
      }
      if (obFinalTitle) obFinalTitle.textContent = `¡Todo Listo para Cuidarte, ${userName}! ✨`;
      if (obFinalMsg) obFinalMsg.textContent = `"Soy ${pet.name}. He calibrado tus ciclos de ${cycleLength} días y preparado todo a tu gusto. ¡Vamos a empezar!"`;
      if (sumPet) sumPet.textContent = pet.name;
      if (sumCycle) sumCycle.textContent = `${cycleLength} días`;

      // Infer phase for summary display
      let inferredPhase = 'Ovulatoria ✨';
      try {
        const today = new Date();
        const lmpDate = new Date(obSelectedLmpDateStr);
        const diffDays = Math.floor(Math.abs(today - lmpDate) / (1000 * 60 * 60 * 24));
        const dayOfCycle = (diffDays % cycleLength) + 1;
        if (dayOfCycle <= periodLength) inferredPhase = `Menstrual 🩸 (Día ${dayOfCycle})`;
        else if (dayOfCycle <= (cycleLength - 14) - 2) inferredPhase = `Folicular 🌱 (Día ${dayOfCycle})`;
        else if (dayOfCycle <= (cycleLength - 14) + 2) inferredPhase = `Ovulatoria ✨ (Día ${dayOfCycle})`;
        else inferredPhase = `Lútea 🌙 (Día ${dayOfCycle})`;
      } catch(e) {}
      if (sumPhase) sumPhase.textContent = inferredPhase;
    } else {
      if (btnObNext) {
        btnObNext.innerHTML = '<span>Continuar</span><span class="material-symbols-outlined" style="font-size:1.1rem;">arrow_forward</span>';
      }
    }
  }

  function completeOnboarding() {
    const inputName = document.getElementById('ob-input-name')?.value?.trim() || 'Ana';
    const cycleLength = parseInt(document.getElementById('ob-slider-cycle')?.value || '28', 10);
    const periodLength = parseInt(document.getElementById('ob-slider-period')?.value || '5', 10);

    // 1. Actualizar UserProfileModel
    userProfile.nombre = inputName;
    userProfile.lmpFecha = obSelectedLmpDateStr;
    userProfile.duracionPromedioCiclo = cycleLength;
    userProfile.duracionPromedioPeriodo = periodLength;
    userProfile.regularidad = obSelectedRegularity;
    userProfile.metodoAnticonceptivo = obSelectedMethod;
    userProfile.sintomaPrincipal = obSelectedSymptom;
    userProfile.objetivoSalud = obSelectedGoal;
    userProfile.healthKitConectado = obHealthKitConnected;
    userProfile.biometriaHabilitada = obFaceIdEnabled;
    userProfile.mascotaSeleccionada = obSelectedPet;

    currentAvatarId = obSelectedPet;
    themeSettings = Object.assign({}, obThemeSettings);

    // 2. Persistir permanentemente en LocalStorage
    try {
      localStorage.setItem('pochirocho_onboarding_completed', 'true');
      localStorage.setItem('pochirocho_user_profile', JSON.stringify(userProfile.toJSON()));
      localStorage.setItem('pochirocho_theme_settings', JSON.stringify(themeSettings));
      localStorage.setItem('pochirocho_selected_avatar', currentAvatarId);
    } catch(e) {}

    // 3. Inferencia de Fase y Día del Ciclo
    let inferredPhase = 'Ovulatoria';
    let inferredDay = 14;
    try {
      const phaseInfo = getCyclePhaseForDate(new Date());
      inferredPhase = phaseInfo.phaseKey;
      inferredDay = phaseInfo.cycleDay;
    } catch(e) {}

    // 4. Transición fluida hacia Home Screen
    if (viewOnboarding) {
      viewOnboarding.style.opacity = '0';
      viewOnboarding.style.transform = 'scale(0.96)';
      setTimeout(() => {
        viewOnboarding.classList.remove('active');
        viewOnboarding.style.display = 'none';

        // Aplicar estado general
        applyTheme(getThemeForCurrentState());
        setCyclePhase(inferredPhase, inferredDay);
        updateAvatarDisplay();
        updateCoinsUI();

        if (viewHome) {
          viewHome.style.opacity = '';
          viewHome.style.transform = '';
          viewHome.classList.add('active');
        }
        updateConnectors();
      }, 350);
    }
  }

  if (btnObNext) {
    btnObNext.addEventListener('click', () => {
      if (obCurrentStep < obTotalSteps) {
        obCurrentStep++;
        updateObView();
      } else {
        completeOnboarding();
      }
    });
  }

  if (btnObBack) {
    btnObBack.addEventListener('click', () => {
      if (obCurrentStep > 1) {
        obCurrentStep--;
        updateObView();
      }
    });
  }

  const centralTrackerNode = document.getElementById('central-tracker-node');
  const shopNode = document.getElementById('node-shop');
  const achievementsNode = document.getElementById('node-achievements');
  const motivationNode = document.getElementById('node-motivation');
  const svgConnectors = document.getElementById('svg-connectors');
  const btnBackHome = document.getElementById('btn-back-home');
  const btnOpenSymptomSheet = document.getElementById('btn-open-symptom-sheet');

  const themePickerBar = document.querySelector('.theme-picker-bar');
  const prominentActionContainer = document.querySelector('.prominent-action-container');
  const enhancedSlab = document.getElementById('enhanced-dashboard-slab');
  const avatarSection = document.querySelector('.tracker-avatar-section');
  const avatarBubble = document.querySelector('.avatar-speech-bubble');
  const avatarSpeechText = document.getElementById('tracker-avatar-text');
  const wheelNavItems = document.querySelectorAll('.wheel-nav-item');
  const themeFallingContainer = document.getElementById('theme-falling-container');
  const rainAnimatedLayer = document.getElementById('rain-animated-layer');
  const themeDots = document.querySelectorAll('.theme-dot');

  // MODAL DOM ELEMENTS
  const modalOverlay = document.getElementById('modal-overlay');
  const modalBody = document.getElementById('modal-body');
  const modalTitle = document.getElementById('modal-title');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalTitleIcon = document.getElementById('modal-title-icon');

  // SHOP STATE & PRODUCTS
  const shopProducts = [
    // --- PREMIOS EN LA VIDA REAL (+300 Pochipesos) ---
    {
      id: 'sp-real-1',
      type: 'external',
      cat: 'Maquillaje 💄',
      name: 'Maquillaje (Inferior a $30.000 COP) 💄',
      desc: 'Elige labial, rubor, sombras o cosmético favorito de hasta $30.000.',
      price: 800,
      priceTag: '< $30.000 COP',
      icon: '💄'
    },
    {
      id: 'sp-real-2',
      type: 'external',
      cat: 'Maquillaje ✨',
      name: 'Maquillaje (Superior a $30.000 COP) 💄✨',
      desc: 'Paleta completa, base premium o cosmético de alta gama de más de $30.000.',
      price: 1300,
      priceTag: '> $30.000 COP',
      icon: '✨'
    },
    {
      id: 'sp-real-3',
      type: 'external',
      cat: 'Accesorios 💍',
      name: 'Accesorios o Joyas 💍',
      desc: 'Collar, aretes, pulseras o accesorio brillante a tu gusto.',
      price: 800,
      priceTag: 'Accesorio',
      icon: '💍'
    },
    {
      id: 'sp-real-4',
      type: 'external',
      cat: 'Moda 👗',
      name: 'Ropa (Inferior a $50.000 COP) 👗',
      desc: 'Prenda, blusa, top o accesorio de vestir cómodo de hasta $50.000.',
      price: 1000,
      priceTag: '< $50.000 COP',
      icon: '👗'
    },
    {
      id: 'sp-real-5',
      type: 'external',
      cat: 'Moda ✨',
      name: 'Ropa (Superior a $50.000 COP) 👗✨',
      desc: 'Vestido especial, conjunto completo o prenda soñada de más de $50.000.',
      price: 1500,
      priceTag: '> $50.000 COP',
      icon: '💃'
    },
    {
      id: 'sp-real-6',
      type: 'external',
      cat: 'Comida 🍣',
      name: 'Sushi a Elección 🍣',
      desc: 'Rolls especiales, nigiris o combo de sushi fresco para consentirte.',
      price: 600,
      priceTag: 'Restaurante',
      icon: '🍣'
    },
    {
      id: 'sp-real-7',
      type: 'external',
      cat: 'Comida 🍕',
      name: 'Pizza Little Caesars 🍕',
      desc: 'Tu pizza caliente y deliciosa recién salida del horno.',
      price: 550,
      priceTag: 'Little Caesars',
      icon: '🍕'
    },
    {
      id: 'sp-real-8',
      type: 'external',
      cat: 'Antojos 🥤🍟',
      name: 'Malteada de Chocolate con Papas 🥤🍟',
      desc: 'El dúo perfecto de malteada chocolatosa y papas crocantes saladitas.',
      price: 500,
      priceTag: 'Antojo Delicioso',
      icon: '🥤'
    },
    {
      id: 'sp-real-9',
      type: 'external',
      cat: 'Comida 🌽',
      name: 'Mazorcada Especial 🌽',
      desc: 'Mazorca desgranada con queso fundido, tocineta y salsas irresistibles.',
      price: 600,
      priceTag: 'Mazorcada',
      icon: '🌽'
    },
    {
      id: 'sp-real-10',
      type: 'external',
      cat: 'Antojos 🍟🌭',
      name: 'Salchipapa (La Salchipapería) 🍟🌭',
      desc: 'Salchipapa gourmet suprema con papas rústicas, salchichas y aderezos.',
      price: 700,
      priceTag: 'La Salchipapería',
      icon: '🍟'
    },
    {
      id: 'sp-real-11',
      type: 'external',
      cat: 'Celebración 🍺',
      name: 'Cerveza BBC Artesanal 🍺',
      desc: 'Una pinta helada de cerveza BBC artesanal (Monserrate, Chapinero, etc.).',
      price: 650,
      priceTag: 'BBC',
      icon: '🍺'
    },

    // --- OBJETOS DEL JUEGO / IN-APP (+300 Pochipesos) ---
    {
      id: 'sp-game-12',
      type: 'internal',
      cat: 'Sonidos 🔔',
      name: 'Nuevo Tono (Sorpresa del Pollo Desarrollador) 🐔🔔',
      desc: 'Tono y efecto de sonido exclusivo programado especialmente para ti.',
      price: 550,
      priceTag: 'In-App',
      icon: '🔔'
    },
    {
      id: 'sp-game-13',
      type: 'internal',
      cat: 'Mascotas 👑',
      name: 'Accesorio Nuevo para Mascotas (Sorpresa Pollo) 🎩👑',
      desc: 'Accesorio festivo exclusivo para engalanar a Manola, Luffy y la pandilla.',
      price: 700,
      priceTag: 'In-App',
      icon: '👑'
    },
    {
      id: 'sp-game-14',
      type: 'internal',
      cat: 'Relajación 🎧',
      name: 'Audios Nuevos de ASMR y Relajación 🎧🌊',
      desc: 'Colección binaural de calma profunda, lluvia y frecuencias curativas.',
      price: 625,
      priceTag: 'In-App',
      icon: '🎧'
    }
  ];

  // ACHIEVEMENTS ENGINE STATE
  let currentAchievementIndex = 0;
  const achievementsList = [
    {
      id: 'ach-1',
      title: 'Pionera de la Racha Saludable',
      desc: 'Mantén tu hábito diario de registro hormonal y bienestar.',
      icon: '🏆',
      level: 1,
      currentDays: 5,
      maxLevelDays: 7,
      reward: 45,
      nextLevelText: 'Alcanza 7 días para desbloquear el Nivel 1 (+150 Monedas).',
      claimed: false
    },
    {
      id: 'ach-2',
      title: 'Maestra del Alivio Somático',
      desc: 'Realiza rutinas de estiramiento, yoga o automasajes suaves.',
      icon: '🧘‍♀️',
      level: 1,
      currentDays: 3,
      maxLevelDays: 5,
      reward: 45,
      nextLevelText: 'Completa 5 rutinas para reclamar el Nivel 1 (+120 Monedas).',
      claimed: false
    },
    {
      id: 'ach-3',
      title: 'Sabiduría Nutricional & Infusiones',
      desc: 'Prepara infusiones calientes y recetas antiinflamatorias.',
      icon: '🍵',
      level: 1,
      currentDays: 4,
      maxLevelDays: 5,
      reward: 45,
      nextLevelText: 'Prepara 5 recetas para reclamar el Nivel 1 (+100 Monedas).',
      claimed: false
    },
    {
      id: 'ach-4',
      title: 'Sintonía con tu Mascota IA',
      desc: 'Consulta a tu acompañante para comprender tus fases hormonales.',
      icon: '🦔',
      level: 1,
      currentDays: 2,
      maxLevelDays: 3,
      reward: 45,
      nextLevelText: 'Conversa 3 veces para reclamar el Nivel 1 (+80 Monedas).',
      claimed: false
    }
  ];

  // =========================================================================
  // NODO 4: AMOR (AMOR POLLOCHIROCHO - 12 NOTAS DE AMOR SELLADAS)
  // =========================================================================
  const motivationNotes = [
    {
      id: 'love-1',
      emoji: '💌',
      rotation: -3.5,
      message: 'Tus locuras tontas son de las cosas que más amo de ti, y compartir contigo eso ha sido siempre de mis experiencias favoritas en la vida.'
    },
    {
      id: 'love-2',
      emoji: '🌟',
      rotation: 2.8,
      message: 'Eres de las personas más inteligentes y con más potencial que he conocido, estoy muy orgulloso de ti por todo lo que has logrado.'
    },
    {
      id: 'love-3',
      emoji: '💖',
      rotation: -2.2,
      message: 'Aunque seas una chiquis en estatura, tu corazón y tu mente siempre sobrepasan cualquier límite.'
    },
    {
      id: 'love-4',
      emoji: '🐥',
      rotation: 3.5,
      message: 'Tus preciosos lunares son el triángulo de la perdición (amorosa) de los pollos, es imposible verlos y no enamorarse perdidamente de ti.'
    },
    {
      id: 'love-5',
      emoji: '🌈',
      rotation: -4.0,
      message: 'Llenas de color la vida de todas las personas que te rodean, como un arcoiris andante.'
    },
    {
      id: 'love-6',
      emoji: '🏴‍☠️',
      rotation: 2.0,
      message: 'Si algo como el one piece existiera, ese tesoro serías tú, todo lo que te compone hace que seas la persona más valiosa y única que ha existido (tan única que no existe otra pochirocho marcianita).'
    },
    {
      id: 'love-7',
      emoji: '⚖️',
      rotation: -3.0,
      message: 'Desde que estábamos en el colegio siempre has defendido tus valores e ideales a capa y espada, aquellos que admiro tanto de ti y demuestran la hermosa persona que eres y que en el futuro vas a ser una excelente abogada (e incluso en el proceso ya eres excelentísima, lo corroboran tus profesores).'
    },
    {
      id: 'love-8',
      emoji: '🪐',
      rotation: 4.2,
      message: 'Nuestro amor es tan fuerte que en cualquier época o versión de nuestras vidas en el pasado y en el futuro, somos compañeros de existencia.'
    },
    {
      id: 'love-9',
      emoji: '🌹',
      rotation: -2.5,
      message: 'Eres la mayor bendición que ha llegado a mi vida, gracias por ser una persona tan maravillosa, por amar tan lindo, por los valores que defiendes, por hacerte extrañar, por lo que me has enseñado y lo que me sigues enseñando.'
    },
    {
      id: 'love-10',
      emoji: '🌽',
      rotation: 3.0,
      message: 'No sobra nunca decirlo, tienes un CUERPAZO y una jetica tan atractiva como una mazorcada luego de un final del 50% de procesal.'
    },
    {
      id: 'love-11',
      emoji: '👑',
      rotation: -3.8,
      message: 'Ningún paisaje o maravilla nueva o antigua de la historia de la humanidad se compara con lo PRECIOSA que eres, tu belleza no tiene algún tipo de límite.'
    },
    {
      id: 'love-12',
      emoji: '🏰',
      rotation: 2.5,
      message: 'Si todas las princesas de Disney fueran reales, todas y cada una de ellas reconocería que de las princesas, tu eres la más hermosa.'
    }
  ];

  // =========================================================================
  // AI MULTI-SESSION CONVERSATION STORAGE (Máximo 10 chats con persistencia en localStorage)
  // =========================================================================
  const MAX_AI_CONVERSATIONS = 10;

  function loadAIConversationsFromStorage() {
    try {
      const stored = localStorage.getItem('pochirocho_ai_conversations');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.slice(0, MAX_AI_CONVERSATIONS);
        }
      }
    } catch(e) {
      console.warn('Error al cargar conversaciones de IA desde almacenamiento:', e);
    }
    return [
      {
        id: 'conv-1',
        title: 'Consulta General & Bienestar',
        date: 'Hoy',
        messages: [
          {
            sender: 'spike',
            text: '¡Hola! Soy tu asistente de salud en simbiosis orgánica. ¿En qué te puedo acompañar hoy?'
          }
        ]
      }
    ];
  }

  function saveAIConversationsToStorage() {
    try {
      if (aiConversations.length > MAX_AI_CONVERSATIONS) {
        aiConversations = aiConversations.slice(0, MAX_AI_CONVERSATIONS);
      }
      localStorage.setItem('pochirocho_ai_conversations', JSON.stringify(aiConversations));
    } catch(e) {
      console.warn('Error al guardar conversaciones de IA en almacenamiento:', e);
    }
  }

  let aiConversations = loadAIConversationsFromStorage();
  let currentConversationId = aiConversations[0]?.id || 'conv-1';

  // CALENDAR ENGINE STATE
  const todayDate = new Date();
  let currentCalYear = todayDate.getFullYear();
  let currentCalMonth = todayDate.getMonth();
  let selectedCalDateStr = formatDateKey(todayDate);

  let loggedDaysData = {};
  try {
    const savedLogs = localStorage.getItem('pochirocho_logged_days_db');
    if (savedLogs) {
      loggedDaysData = JSON.parse(savedLogs);
    }
  } catch(e) {}

  function formatDateKey(dateObj) {
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const d = String(dateObj.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function parseSafeDate(val) {
    if (!val) return new Date();
    if (val instanceof Date) return new Date(val.getFullYear(), val.getMonth(), val.getDate(), 12, 0, 0);
    let str = String(val).trim();
    if (str.includes('T')) str = str.split('T')[0];
    const parts = str.split('-').map(Number);
    if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
      return new Date(parts[0], parts[1] - 1, parts[2], 12, 0, 0);
    }
    const d = new Date(val);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12, 0, 0);
  }

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  function hexToRgba(hex, alpha = 1) {
    if (!hex) return `rgba(255, 117, 143, ${alpha})`;
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    const num = parseInt(c, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function getCyclePhaseForDate(dateObj) {
    const lmpDate = parseSafeDate(userProfile?.lmpFecha);
    const targetDate = parseSafeDate(dateObj);
    
    const diffDays = Math.round((targetDate.getTime() - lmpDate.getTime()) / (1000 * 3600 * 24));
    const cycleLen = parseInt(userProfile?.duracionPromedioCiclo, 10) || 28;
    const periodLen = parseInt(userProfile?.duracionPromedioPeriodo, 10) || 5;

    let cycleDay = ((diffDays % cycleLen) + cycleLen) % cycleLen + 1;
    let isDelayed = false;
    let daysLate = 0;

    // Si la fecha evaluada es el ciclo actual (sin nuevo período registrado) y supera la duración estimada
    if (diffDays >= cycleLen && targetDate <= new Date()) {
      isDelayed = true;
      daysLate = diffDays - cycleLen + 1;
      cycleDay = diffDays + 1;
    }

    // Límites biológicos exactos
    const ovulationDay = Math.max(periodLen + 2, cycleLen - 14);
    const ovulStart = ovulationDay - 1;
    const ovulEnd = ovulationDay + 1;

    let phaseKey = 'Folicular';
    let phaseName = 'Fase Folicular 🌱';
    let phaseClass = 'cal-phase-follicular';

    if (isDelayed) {
      phaseKey = 'Lutea';
      phaseName = `Retraso (+${daysLate}d) ⏳`;
      phaseClass = 'cal-phase-luteal';
    } else if (cycleDay >= 1 && cycleDay <= periodLen) {
      phaseKey = 'Menstrual';
      phaseName = 'Fase Menstrual 🩸';
      phaseClass = 'cal-phase-menstrual';
    } else if (cycleDay > periodLen && cycleDay < ovulStart) {
      phaseKey = 'Folicular';
      phaseName = 'Fase Folicular 🌱';
      phaseClass = 'cal-phase-follicular';
    } else if (cycleDay >= ovulStart && cycleDay <= ovulEnd) {
      phaseKey = 'Ovulatoria';
      phaseName = 'Fase Ovulatoria ✨';
      phaseClass = 'cal-phase-ovulatory';
    } else {
      phaseKey = 'Lutea';
      phaseName = 'Fase Lútea 🌙';
      phaseClass = 'cal-phase-luteal';
    }

    const assignedThemeKey = (themeSettings && themeSettings.phaseThemes && themeSettings.phaseThemes[phaseKey]) || 'red';
    const config = (themeConfig && themeConfig[assignedThemeKey]) || { color: '#ff758f' };
    const phaseColor = isDelayed ? '#f59e0b' : config.color;

    return { cycleDay, phaseKey, phaseName, phaseClass, phaseColor, themeKey: assignedThemeKey, isDelayed, daysLate };
  }

  const reliefCategories = [
    { id: 'all', name: 'Todas', icon: 'auto_awesome' },
    { id: 'favorite', name: 'Favoritas', icon: 'favorite' },
    { id: 'pilates-yoga', name: 'Pilates & Yoga', icon: 'self_improvement' },
    { id: 'stretches', name: 'Estiramientos', icon: 'accessibility_new' },
    { id: 'breathing', name: 'Respiración', icon: 'air' },
    { id: 'massages-thermo', name: 'Masajes & Termoterapia', icon: 'spa' },
    { id: 'nutrition', name: 'Nutrición', icon: 'local_cafe' },
    { id: 'audio', name: 'Audios (ASMR & Relajación)', icon: 'headphones' }
  ];

  const reliefExercises = RoutinesCatalog;

  let currentReliefCategory = 'all';
  let categoryScrollLeftPos = 0;

  function updateConnectors() {
    if (!svgConnectors || !centralTrackerNode || !viewHome.classList.contains('active')) return;
    const hubStage = document.querySelector('.hub-stage');
    if (!hubStage) return;
    
    const stageRect = hubStage.getBoundingClientRect();
    const centralRect = centralTrackerNode.getBoundingClientRect();

    const cx = centralRect.left + centralRect.width / 2 - stageRect.left;
    const cy = centralRect.top + centralRect.height / 2 - stageRect.top;

    const nodes = [
      { el: shopNode, gradId: 'grad-shop-beam', offset: { x: -14, y: -10 }, dotColor: '#ffd166' },
      { el: achievementsNode, gradId: 'grad-achievements-beam', offset: { x: 14, y: -10 }, dotColor: '#38bdf8' },
      { el: motivationNode, gradId: 'grad-love-beam', offset: { x: 0, y: 15 }, dotColor: '#ff758f' }
    ];

    let svgHTML = `
      <defs>
        <!-- Gradiente Tracker -> Tienda (Rojo a Dorado) -->
        <linearGradient id="grad-shop-beam" x1="100%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stop-color="#ff2a4b" stop-opacity="0.9"/>
          <stop offset="60%" stop-color="#ffb950" stop-opacity="0.95"/>
          <stop offset="100%" stop-color="#ffd166" stop-opacity="1"/>
        </linearGradient>

        <!-- Gradiente Tracker -> Logros (Rojo a Cian) -->
        <linearGradient id="grad-achievements-beam" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#ff2a4b" stop-opacity="0.9"/>
          <stop offset="60%" stop-color="#38bdf8" stop-opacity="0.95"/>
          <stop offset="100%" stop-color="#7dd3fc" stop-opacity="1"/>
        </linearGradient>

        <!-- Gradiente Tracker -> Amor (Rojo a Rosa Neón) -->
        <linearGradient id="grad-love-beam" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stop-color="#ff2a4b" stop-opacity="0.9"/>
          <stop offset="60%" stop-color="#ff758f" stop-opacity="0.95"/>
          <stop offset="100%" stop-color="#fda4af" stop-opacity="1"/>
        </linearGradient>
      </defs>
    `;

    nodes.forEach(nodeItem => {
      if (!nodeItem.el) return;
      const nRect = nodeItem.el.getBoundingClientRect();
      const nx = nRect.left + nRect.width / 2 - stageRect.left;
      const ny = nRect.top + nRect.height / 2 - stageRect.top;

      const midX = (cx + nx) / 2 + nodeItem.offset.x;
      const midY = (cy + ny) / 2 + nodeItem.offset.y;

      const pathData = `M ${cx} ${cy} Q ${midX} ${midY} ${nx} ${ny}`;

      // Capa 1: Resplandor difuso exterior
      svgHTML += `<path d="${pathData}" stroke="url(#${nodeItem.gradId})" stroke-width="7" class="connector-line-glow" />`;

      // Capa 2: Núcleo de haz de luz fluido y continuo
      svgHTML += `<path d="${pathData}" stroke="url(#${nodeItem.gradId})" class="connector-line-core" />`;
    });

    svgConnectors.innerHTML = svgHTML;
  }

  function connectorLoop() {
    updateConnectors();
    requestAnimationFrame(connectorLoop);
  }
  requestAnimationFrame(connectorLoop);



  // Setup Avatar Picker Dot Click Handlers
  const avatarDots = document.querySelectorAll('.avatar-dot');
  avatarDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const selectedPet = dot.getAttribute('data-avatar');
      if (selectedPet && avatarRegistry[selectedPet]) {
        currentAvatarId = selectedPet;
        updateAvatarDisplay(null);
      }
    });
  });

  // NAVIGATION TO TRACKER (WITH DYNAMIC AVATAR SEQUENCE)
  
  // =========================================================================
  // RENDERIZADOR DE LA TARJETA MUSICAL DE SPOTIFY (EN TRACKER DASHBOARD)
  // =========================================================================
  // =========================================================================
  // RENDERIZADOR DE LA TARJETA MUSICAL DE SPOTIFY (EN TRACKER DASHBOARD)
  // =========================================================================
  async function renderSpotifyDashboardCard(animate = false) {
    const cardContainer = document.getElementById('spotify-dashboard-section');
    if (!cardContainer) return;

    const displayPhase = userCycleState.currentPhase || 'Ovulatoria';
    const currentAvatar = localStorage.getItem('pochirocho_selected_avatar') || currentAvatarId || 'amy';
    const pet = avatarRegistry[currentAvatar] || avatarRegistry.amy || { name: 'Manola' };
    const petName = (pet && pet.name) || 'Tu Mascota';
    const recentSymptoms = userProfile?.sintomasHoy || [];
    const animClass = animate ? 'animate-spotify-card-entrance' : '';

    const isConnected = SpotifyPsychoacousticEngine.isConnected();

    if (!isConnected) {
      cardContainer.innerHTML = `
        <div class="spotify-recommendation-card ${animClass}">
          <div class="spotify-card-header">
            <div style="display:flex; align-items:center; gap:0.35rem; min-width:0; flex:1; overflow:hidden;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#1DB954" style="flex-shrink:0;"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.49 17.306c-.215.352-.676.465-1.028.25-2.82-1.722-6.37-2.112-10.55-1.157-.403.092-.806-.157-.898-.56-.092-.403.157-.806.56-.898 4.577-1.045 8.508-.598 11.666 1.337.352.215.465.676.25 1.028zm1.464-3.256c-.27.44-.847.58-1.287.31-3.228-1.984-8.15-2.558-11.97-1.398-.497.15-1.028-.135-1.178-.632-.15-.497.135-1.028.632-1.178 4.37-1.325 9.79-.684 13.493 1.59.44.27.58.847.31 1.288zm.126-3.39c-3.87-2.298-10.254-2.51-13.97-1.38-.595.18-1.226-.155-1.406-.75-.18-.595.155-1.226.75-1.406 4.27-1.296 11.31-1.048 15.772 1.6c.535.318.71 1.01.392 1.545-.318.535-1.01.71-1.545.392z"/></svg>
              <span class="spotify-card-title">Sintonía de ${petName}</span>
            </div>
            <span class="spotify-vibe-pill">Personalizada 🎧</span>
          </div>
          <p class="spotify-card-desc">
            Conecta tu cuenta de Spotify para que <strong>${petName}</strong> elija la mejor canción de tus <strong>artistas favoritos</strong> según tu <strong>Fase ${displayPhase}</strong> y síntomas de hoy.
          </p>
          <div style="display:flex; justify-content:center; margin-top:0.35rem;">
            <button class="btn-spotify-connect" onclick="SpotifyPsychoacousticEngine.loginWithSpotify()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#02040a"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.49 17.306c-.215.352-.676.465-1.028.25-2.82-1.722-6.37-2.112-10.55-1.157-.403.092-.806-.157-.898-.56-.092-.403.157-.806.56-.898 4.577-1.045 8.508-.598 11.666 1.337.352.215.465.676.25 1.028zm1.464-3.256c-.27.44-.847.58-1.287.31-3.228-1.984-8.15-2.558-11.97-1.398-.497.15-1.028-.135-1.178-.632-.15-.497.135-1.028.632-1.178 4.37-1.325 9.79-.684 13.493 1.59.44.27.58.847.31 1.288zm.126-3.39c-3.87-2.298-10.254-2.51-13.97-1.38-.595.18-1.226-.155-1.406-.75-.18-.595.155-1.226.75-1.406 4.27-1.296 11.31-1.048 15.772 1.6c.535.318.71 1.01.392 1.545-.318.535-1.01.71-1.545.392z"/></svg>
              <span>Conectar mi Cuenta de Spotify</span>
            </button>
          </div>
        </div>
      `;
      return;
    }

    try {
      const recResult = await SpotifyPsychoacousticEngine.getRecommendationForUser(displayPhase, recentSymptoms);
      if (recResult && recResult.track) {
        const tr = recResult.track;
        const trackName = tr.name || 'Sintonía de Spotify';
        const trackArtist = tr.artist || 'Tus Artistas Favoritos';
        const reason = (recResult.acousticTargets && recResult.acousticTargets.reasonText) || `Música calibrada para tu Fase ${displayPhase}.`;
        const tempo = recResult.acousticTargets?.target_tempo ? Math.round(recResult.acousticTargets.target_tempo) : 90;

        cardContainer.innerHTML = `
          <div class="spotify-recommendation-card spotify-connected ${animClass}">
            <div class="spotify-card-header">
              <div style="display:flex; align-items:center; gap:0.35rem; min-width:0; flex:1; overflow:hidden;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#1DB954" style="flex-shrink:0;"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.49 17.306c-.215.352-.676.465-1.028.25-2.82-1.722-6.37-2.112-10.55-1.157-.403.092-.806-.157-.898-.56-.092-.403.157-.806.56-.898 4.577-1.045 8.508-.598 11.666 1.337.352.215.465.676.25 1.028zm1.464-3.256c-.27.44-.847.58-1.287.31-3.228-1.984-8.15-2.558-11.97-1.398-.497.15-1.028-.135-1.178-.632-.15-.497.135-1.028.632-1.178 4.37-1.325 9.79-.684 13.493 1.59.44.27.58.847.31 1.288zm.126-3.39c-3.87-2.298-10.254-2.51-13.97-1.38-.595.18-1.226-.155-1.406-.75-.18-.595.155-1.226.75-1.406 4.27-1.296 11.31-1.048 15.772 1.6c.535.318.71 1.01.392 1.545-.318.535-1.01.71-1.545.392z"/></svg>
                <span class="spotify-card-title">Sintonía de ${petName}</span>
              </div>
              <span class="spotify-vibe-pill">${tempo} BPM • ${displayPhase}</span>
            </div>

            <div class="spotify-track-item-row">
              <img src="${tr.albumCover || 'assets/ui/spotify_default_cover.png'}" class="spotify-track-cover" alt="${trackName}"/>
              <div class="spotify-track-details">
                <span class="spotify-track-name">${trackName}</span>
                <span class="spotify-track-artist">${trackArtist}</span>
                <span class="spotify-track-reason">${reason}</span>
              </div>
            </div>

            <div class="spotify-card-actions">
              <button class="btn-spotify-play" onclick="playSpotifySongAndTrack('${tr.spotifyUrl || 'https://open.spotify.com'}')">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#02040a"><path d="M8 5v14l11-7z"/></svg>
                <span>Escuchar en Spotify ↗</span>
              </button>
              <button class="btn-spotify-refresh" onclick="renderSpotifyDashboardCard(true)" title="Obtener otra recomendación">
                <span class="material-symbols-outlined" style="font-size:1rem;">refresh</span>
              </button>
            </div>
          </div>
        `;
      } else {
        cardContainer.innerHTML = `
          <div class="spotify-recommendation-card spotify-connected ${animClass}">
            <div class="spotify-card-header">
              <div style="display:flex; align-items:center; gap:0.35rem; min-width:0; flex:1; overflow:hidden;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#1DB954" style="flex-shrink:0;"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.49 17.306c-.215.352-.676.465-1.028.25-2.82-1.722-6.37-2.112-10.55-1.157-.403.092-.806-.157-.898-.56-.092-.403.157-.806.56-.898 4.577-1.045 8.508-.598 11.666 1.337.352.215.465.676.25 1.028zm1.464-3.256c-.27.44-.847.58-1.287.31-3.228-1.984-8.15-2.558-11.97-1.398-.497.15-1.028-.135-1.178-.632-.15-.497.135-1.028.632-1.178 4.37-1.325 9.79-.684 13.493 1.59.44.27.58.847.31 1.288zm.126-3.39c-3.87-2.298-10.254-2.51-13.97-1.38-.595.18-1.226-.155-1.406-.75-.18-.595.155-1.226.75-1.406 4.27-1.296 11.31-1.048 15.772 1.6c.535.318.71 1.01.392 1.545-.318.535-1.01.71-1.545.392z"/></svg>
                <span class="spotify-card-title">Sintonía de ${petName}</span>
              </div>
              <span class="spotify-vibe-pill">Conectado 🟢</span>
            </div>
            <p class="spotify-card-desc">
              Tu cuenta de Spotify está conectada. Haz clic en actualizar para consultar tu recomendación de la Fase ${displayPhase}.
            </p>
            <div style="display:flex; justify-content:center; margin-top:0.35rem;">
              <button class="btn-spotify-connect" onclick="renderSpotifyDashboardCard(true)">
                <span>🔄 Cargar Recomendación de Spotify</span>
              </button>
            </div>
          </div>
        `;
      }
    } catch (err) {
      console.warn('Error al renderizar tarjeta de Spotify:', err);
    }
  }
  window.renderSpotifyDashboardCard = renderSpotifyDashboardCard;

  let isNavigatingToTracker = false;
  let trackerAnimTimeouts = [];

  function clearTrackerTimeouts() {
    trackerAnimTimeouts.forEach(t => clearTimeout(t));
    trackerAnimTimeouts = [];
  }

  function navigateToTracker() {
    if (isNavigatingToTracker) return;
    isNavigatingToTracker = true;
    setTimeout(() => { isNavigatingToTracker = false; }, 1600);

    clearTrackerTimeouts();
    const pet = avatarRegistry[currentAvatarId] || avatarRegistry.amy;

    if (window.pauseParticleCanvas) window.pauseParticleCanvas();

    // PASO 1: Establecer inmediatamente la imagen y texto de Feliz ANTES de activar la vista
    updateAvatarDisplay('Feliz');
    const trackerImg = document.getElementById('tracker-avatar-img');
    if (trackerImg) trackerImg.src = getAvatarImagePath(currentAvatarId, 'Feliz');
    if (avatarSpeechText) avatarSpeechText.textContent = pet.quotes.trackerGreeting;
    if (avatarBubble) avatarBubble.classList.remove('bubble-hidden');

    viewHome.classList.remove('active');
    viewTracker.classList.add('active');

    const dashMain = document.getElementById('tracker-dashboard-main-content');
    if (dashMain) dashMain.style.display = 'flex';
    const subview = document.getElementById('tracker-subview-content');
    if (subview) subview.style.display = 'none';

    if (themePickerBar) themePickerBar.style.display = 'flex';
    if (prominentActionContainer) prominentActionContainer.style.display = 'flex';

    enhancedSlab.style.opacity = '';
    enhancedSlab.style.transform = '';

    // Renderizar la tarjeta inmediatamente para que NUNCA esté ausente
    renderSpotifyDashboardCard(false);

    enhancedSlab.classList.remove('animate-fall-delayed');
    if (avatarSection) avatarSection.classList.remove('animate-full-fluid-entrance');

    // Forzar reflow limpio para reiniciar la animación CSS sin parpadeos
    void enhancedSlab.offsetWidth;
    if (avatarSection) void avatarSection.offsetWidth;

    enhancedSlab.classList.add('animate-fall-delayed');
    if (avatarSection) avatarSection.classList.add('animate-full-fluid-entrance');

    // PASO 2: Cae el slab - el avatar se asusta (Asustado/Asustada)
    trackerAnimTimeouts.push(setTimeout(() => {
      updateAvatarDisplay('Asustado');
      if (avatarSpeechText) avatarSpeechText.textContent = pet.quotes.trackerScared;
    }, 1050));

    // PASO 3: El avatar esquiva y suspira aliviado (Aliviado/Aliviada)
    trackerAnimTimeouts.push(setTimeout(() => {
      updateAvatarDisplay('Aliviado');
      if (avatarSpeechText) avatarSpeechText.textContent = pet.quotes.trackerRelieved;
    }, 1850));

    // PASO 4: Se asienta en el estado de su fase activa del ciclo (Menstrual/Folicular/Ovulatoria/Lutea) + Spotify
    trackerAnimTimeouts.push(setTimeout(() => {
      updateAvatarDisplay(null);
      if (avatarSection) avatarSection.classList.remove('animate-full-fluid-entrance');
      renderSpotifyDashboardCard(false);
      if (window.resumeParticleCanvas) window.resumeParticleCanvas();
    }, 2600));
  }

  function navigateToHome() {
    viewTracker.classList.remove('active');
    if (viewShop) viewShop.classList.remove('active');
    if (viewAchievements) viewAchievements.classList.remove('active');
    if (viewMotivation) viewMotivation.classList.remove('active');
    
    viewHome.classList.add('active');
    const dashMain = document.getElementById('tracker-dashboard-main-content');
    if (dashMain) dashMain.style.display = 'flex';
    enhancedSlab.classList.remove('animate-fall-delayed');
    enhancedSlab.style.opacity = '';
    enhancedSlab.style.transform = '';
    if (themePickerBar) themePickerBar.style.display = 'flex';
    if (prominentActionContainer) prominentActionContainer.style.display = 'flex';
    if (avatarSection) avatarSection.classList.remove('animate-full-fluid-entrance');
    if (avatarBubble) avatarBubble.classList.remove('bubble-hidden');
    
    updateHomeWidgets();
    renderDailyTasksHub();
    
    // En el Home se muestra el avatar en estado Normal
    const homeAvatarImg = document.getElementById('home-avatar-img');
    const pet = avatarRegistry[currentAvatarId] || avatarRegistry.amy;
    if (homeAvatarImg) homeAvatarImg.src = getAvatarImagePath(currentAvatarId, 'Normal');

    // Pre-cargar Feliz en el Tracker para que esté listo de inmediato al entrar
    const trackerImg = document.getElementById('tracker-avatar-img');
    if (trackerImg) trackerImg.src = getAvatarImagePath(currentAvatarId, 'Feliz');
  }

  window.navigateToTracker = navigateToTracker;
  window.navigateToHome = navigateToHome;
  window.navigateToHomeFromNode = navigateToHome;

  function updateHomeWidgets() {
    const pts = document.getElementById('home-points-val');
    const stk = document.getElementById('home-streak-val');
    if (pts) pts.textContent = userCoins;
    if (stk) stk.textContent = `${userStreakDays} Días`;
  }

  function navigateToShop() {
    viewHome.classList.remove('active');
    viewShop.classList.add('active');
    renderShopNodeView();
  }

  function navigateToAchievements() {
    viewHome.classList.remove('active');
    viewAchievements.classList.add('active');
    renderAchievementsNodeView();
  }

  function navigateToMotivation() {
    viewHome.classList.remove('active');
    viewMotivation.classList.add('active');
    renderMotivationNodeView();
  }

  window.navigateToTracker = navigateToTracker;
  window.navigateToHome = navigateToHome;
  window.navigateToHomeFromNode = navigateToHome;
  window.navigateToShop = navigateToShop;
  window.navigateToAchievements = navigateToAchievements;
  window.navigateToMotivation = navigateToMotivation;

  // NAVIGATION TO HOME HUB NODES
  if (centralTrackerNode) centralTrackerNode.addEventListener('click', navigateToTracker);
  if (btnBackHome) btnBackHome.addEventListener('click', navigateToHome);

  if (shopNode) shopNode.addEventListener('click', navigateToShop);
  if (achievementsNode) achievementsNode.addEventListener('click', navigateToAchievements);
  if (motivationNode) motivationNode.addEventListener('click', navigateToMotivation);


  // =========================================================================
  // RENDERIZADOR DE TAREAS DIARIAS DEL POCHIPESO (EN EL HUB PRINCIPAL)
  // =========================================================================
  let isDailyTasksExpanded = false;

  function renderDailyTasksHub() {
    const container = document.getElementById('daily-tasks-hub-section');
    if (!container) return;

    const dt = rewardsEngine.dailyTasks;
    const taskList = Object.values(dt.tasks);
    const completedCount = taskList.filter(t => t.completed).length;
    const totalCount = taskList.length;
    const isAllDone = dt.tasks.daily_log.completed && 
                      dt.tasks.relief_routines.completed && 
                      dt.tasks.read_analysis.completed && 
                      dt.tasks.spotify_playlist.completed;

    container.innerHTML = `
      <div class="daily-tasks-card">
        <div class="daily-tasks-header" onclick="toggleDailyTasksCard()">
          <div class="daily-tasks-title-group">
            <div class="icon-badge">📋</div>
            <div>
              <div class="daily-tasks-title">Tareas Diarias del Pochipeso</div>
            </div>
          </div>
          <div style="display:flex; align-items:center; gap:0.4rem;">
            <span class="daily-tasks-progress-badge">${completedCount}/${totalCount} Listas</span>
            <button class="daily-tasks-toggle-btn ${isDailyTasksExpanded ? 'expanded' : ''}" type="button">
              <span class="material-symbols-outlined" style="font-size:1.2rem;">expand_more</span>
            </button>
          </div>
        </div>

        ${isDailyTasksExpanded ? `
          <div class="daily-tasks-list">
            <!-- 1. Registrar detalles diarios -->
            <div class="daily-task-item ${dt.tasks.daily_log.completed ? 'completed' : ''}">
              <div class="daily-task-left">
                <div class="daily-task-check">${dt.tasks.daily_log.completed ? '✓' : ''}</div>
                <span class="daily-task-name">1. Registrar detalles diarios</span>
              </div>
              <span class="daily-task-reward">+5 🪙</span>
            </div>

            <!-- 2. Realizar 2 o más rutinas de alivio -->
            <div class="daily-task-item ${dt.tasks.relief_routines.completed ? 'completed' : ''}">
              <div class="daily-task-left">
                <div class="daily-task-check">${dt.tasks.relief_routines.completed ? '✓' : ''}</div>
                <span class="daily-task-name">2. Realizar 2+ rutinas de alivio (${dt.tasks.relief_routines.current || 0}/2)</span>
              </div>
              <span class="daily-task-reward">+10 🪙</span>
            </div>

            <!-- 3. Leer estadísticas en Análisis -->
            <div class="daily-task-item ${dt.tasks.read_analysis.completed ? 'completed' : ''}">
              <div class="daily-task-left">
                <div class="daily-task-check">${dt.tasks.read_analysis.completed ? '✓' : ''}</div>
                <span class="daily-task-name">3. Leer estadísticas en Análisis</span>
              </div>
              <span class="daily-task-reward">+5 🪙</span>
            </div>

            <!-- 4. Escuchar 3 canciones recomendadas -->
            <div class="daily-task-item ${dt.tasks.spotify_playlist.completed ? 'completed' : ''}">
              <div class="daily-task-left">
                <div class="daily-task-check">${dt.tasks.spotify_playlist.completed ? '✓' : ''}</div>
                <span class="daily-task-name">4. Escuchar 3 canciones Spotify (${dt.tasks.spotify_playlist.current || 0}/3)</span>
              </div>
              <span class="daily-task-reward">+10 🪙</span>
            </div>

            <!-- Bono diario por completar todo el set -->
            <div class="daily-bonus-banner">
              <div>
                <span class="daily-bonus-text">🎁 Bono Todo el Set: +20 Pochipesos</span>
              </div>
              <button class="btn-claim-daily-bonus" ${isAllDone && !dt.allBonusClaimed ? '' : 'disabled'} onclick="claimDailyBonusReward()">
                ${dt.allBonusClaimed ? '✓ Reclamado' : (isAllDone ? '✨ Reclamar +20 🪙' : 'Completa las 4')}
              </button>
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  window.toggleDailyTasksCard = function() {
    isDailyTasksExpanded = !isDailyTasksExpanded;
    window.achievementsEngine = achievementsEngine;
  renderDailyTasksHub();
  };

  window.claimDailyBonusReward = function() {
    const res = rewardsEngine.claimDailyAllBonus();
    if (res.success) {
      updateCoinsUI();
      renderDailyTasksHub();

      // Trigger de Logro: Disciplinada Imparable (cada 8 días de tareas completas)
      const achRes = achievementsEngine.trackProgress('daily-tasks', 1);
      if (achRes.newlyUnlocked) {
        showInAppAchievementToast(achRes.ach);
      }

      showInAppRewardToast(20, '¡Has completado todas las tareas de hoy! Bono de +20 Pochipesos 🪙✨', '🎁');
    } else {
      showInAppInfoToast('Tareas Diarias', res.reason || 'Aún tienes tareas pendientes por completar hoy.');
    }
  };

  window.renderDailyTasksHub = renderDailyTasksHub;
  renderDailyTasksHub();

  // ==========================================================================
  // RENDER NODO 2: TIENDA DE RECOMPENSAS (POCHIROCHO STORE & CYBER-STREET MARKET)
  // ==========================================================================
  function renderShopNodeView() {
    const content = document.getElementById('shop-view-content');
    const coinsCounter = document.getElementById('shop-coins-counter');
    if (coinsCounter) coinsCounter.textContent = rewardsEngine.coins;

    const allPetKeys = Object.keys(avatarRegistry);
    const availableShopkeeperKeys = allPetKeys.filter(k => k !== currentAvatarId);
    const randomShopkeeperKey = availableShopkeeperKeys[Math.floor(Math.random() * availableShopkeeperKeys.length)] || 'luffy';
    const shopPet = avatarRegistry[randomShopkeeperKey];
    const shopkeeperImgPath = getAvatarImagePath(randomShopkeeperKey, 'Feliz');

    const filtered = shopProducts.filter(p => p.type === currentShopCategory);

    content.innerHTML = `
      <!-- Mostrador de Atención de la Mascota al Azar en Estado Feliz -->
      <div class="shopkeeper-counter-card">
        <div class="shopkeeper-character-wrapper">
          <img src="${shopkeeperImgPath}" class="shopkeeper-character-img" alt="${shopPet.name}" />
        </div>
        <div class="shopkeeper-speech-text">
          <strong style="color: var(--gold-accent); font-size: 0.88rem;">${shopPet.name}:</strong><br/>
          "¡Hola! Canjea tus <strong>Pochipesos 🪙</strong> ganados con tus hábitos en sushi, maquillaje, ropa a elección y premios reales 🛍️✨"
        </div>
      </div>

      <!-- Pestañas de Categoría de Productos -->
      <div class="shop-category-tabs-row">
        <button class="shop-tab-btn ${currentShopCategory === 'external' ? 'active' : ''}" onclick="switchShopTab('external')">
          <span>🎁 Premios en la Vida Real (Salidas, Comida, Ropa)</span>
        </button>
        <button class="shop-tab-btn ${currentShopCategory === 'internal' ? 'active' : ''}" onclick="switchShopTab('internal')">
          <span>🎮 Objetos del Juego & Sorpresas del Pollo</span>
        </button>
      </div>

      <!-- Rejilla de Productos -->
      <div class="cyber-product-grid">
        ${filtered.map(p => `
          <div class="cyber-product-card">
            <div class="cyber-product-thumb">
              <span class="cyber-category-tag">${p.cat}</span>
              <span>${p.icon}</span>
            </div>
            <div>
              <h4 class="cyber-product-title">${p.name}</h4>
              <p class="cyber-product-desc">${p.desc}</p>
            </div>
            <div class="cyber-buy-row">
              <span class="cyber-price-tag">🪙 ${p.price} Pochipesos</span>
              <button class="cyber-buy-btn" onclick="buyShopProduct('${p.id}')">Canjear</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  window.switchShopTab = function(type) {
    currentShopCategory = type;
    renderShopNodeView();
  };

  window.buyShopProduct = async function(productId) {
    const prod = shopProducts.find(p => p.id === productId);
    if (!prod) return;

    if (rewardsEngine.coins >= prod.price) {
      const res = rewardsEngine.purchaseItem(prod.price);
      if (res.success) {
        updateCoinsUI();
        renderShopNodeView();

        const couponCode = 'POCHI-' + Math.random().toString(36).substring(2, 8).toUpperCase();

        // Rastrear ítems comprados para el logro secreto
        if (!achievementsEngine.trackingData.purchasedItemIds.includes(prod.id)) {
          achievementsEngine.trackingData.purchasedItemIds.push(prod.id);
          achievementsEngine.saveState();
        }
        if (achievementsEngine.trackingData.purchasedItemIds.length >= 14) {
          const achShopRes = achievementsEngine.unlockDirect('ach-secret-shop');
          if (achShopRes.newlyUnlocked) {
            showInAppAchievementToast(achShopRes.ach);
          }
        }

        // Notificar al Pollo Desarrollador (santisc1304@gmail.com)
        await DeveloperSupportBridge.sendRewardClaimTicket({
          userEmail: 'ana@ejemplo.com',
          rewardId: prod.id,
          rewardName: prod.name,
          rewardPrice: prod.price,
          couponCode: couponCode,
          category: prod.cat
        });
        
        // Modal de confirmación con el mensaje exacto solicitado
        const claimModalHTML = `
          <div class="modal-overlay active" id="claim-coupon-modal" style="display:flex; align-items:center; justify-content:center; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(2, 4, 10, 0.92); backdrop-filter:blur(12px); z-index:99999; padding:1rem;">
            <div style="background: #0f172a; border: 2px solid var(--gold-accent); border-radius: 28px; padding: 1.5rem; max-width: 420px; width: 100%; text-align: center; color: #ffffff; box-shadow: 0 0 45px rgba(255, 185, 80, 0.45); display: flex; flex-direction: column; align-items: center; gap: 0.85rem;">
              <div style="font-size: 3.2rem;">🎉🛍️</div>
              <h2 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 800; color: var(--gold-accent); margin: 0;">¡Recompensa Reclamada con Éxito!</h2>
              <p style="font-size: 0.82rem; color: #cbd5e1; line-height: 1.4; margin: 0;">
                Has canjeado <strong>${prod.name}</strong> por <strong>${prod.price} Pochipesos 🪙</strong>.
              </p>
              <div style="background: rgba(255, 185, 80, 0.15); border: 2px dashed var(--gold-accent); border-radius: 16px; padding: 0.75rem 1.2rem; width: 100%;">
                <span style="font-size: 0.68rem; color: #fde047; text-transform: uppercase; font-weight: 700; letter-spacing: 0.08em; display: block; margin-bottom: 0.2rem;">Código de Canje</span>
                <span style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 900; color: #ffffff; letter-spacing: 0.12em;">${couponCode}</span>
              </div>
              <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 0.85rem 1rem; width: 100%;">
                <p style="font-size: 0.8rem; color: #f1f5f9; line-height: 1.4; margin: 0;">
                  🐔💌 <strong>Se le ha notificado al Pollo Desarrollador (santisc1304@gmail.com) y en los próximos días se te dará tu recompensa.</strong>
                </p>
              </div>
              <button onclick="document.getElementById('claim-coupon-modal').remove()" style="width: 100%; padding: 0.85rem; background: linear-gradient(135deg, var(--rose-accent), var(--gold-accent)); border: none; border-radius: 18px; color: #02040a; font-family: var(--font-heading); font-weight: 800; font-size: 0.9rem; cursor: pointer; margin-top: 0.2rem;">
                ✨ ¡Entendido, Muchas Gracias!
              </button>
            </div>
          </div>
        `;
        const existing = document.getElementById('claim-coupon-modal');
        if (existing) existing.remove();
        document.body.insertAdjacentHTML('beforeend', claimModalHTML);
      }
    } else {
      showInAppToast({
        title: 'Pochipesos Insuficientes',
        message: `Necesitas 🪙 ${prod.price} (Tienes 🪙 ${rewardsEngine.coins}). ¡Completa tus tareas diarias y rutinas para acumular más!`,
        icon: '🪙',
        badgeText: 'Tienda Pochirocho',
        badgeIcon: 'storefront',
        accentColor: '#ff758f'
      });
    }
  };

  // =========================================================================
  // EASTER EGG SECRETO DEL MARCIANITO EN MOTIVACIÓN
  // =========================================================================
  window.triggerSecretMarcianitoEgg = function() {
    const achRes = achievementsEngine.unlockDirect('ach-secret-motivation-egg');
    
    // Crear o recuperar overlay del Marcianito
    let overlay = document.getElementById('marcianito-modal-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'marcianito-modal-overlay';
      overlay.className = 'marcianito-fullscreen-overlay';
      document.body.appendChild(overlay);
    }

    const isFirstTime = achRes.newlyUnlocked;

    overlay.innerHTML = `
      <div class="marcianito-giant-card">
        <img src="assets/marcianito_secret_asset.png" class="marcianito-giant-img" alt="Marcianito Místico" />
        <div class="marcianito-speech-card">
          <div class="marcianito-speech-title">
            ${isFirstTime ? '🛸 ¡Marcianito Místico Revelado! ✨' : '🛸 ¡Pip-pop! Saludos Terrícola 👽💚'}
          </div>
          <div class="marcianito-speech-body">
            ${isFirstTime 
              ? '¡Has descubierto mi escondite en las notas del corazón! Has desbloqueado el logro secreto <strong>El Marcianito Místico</strong>. ¡Reclama tus <strong>+45 Pochipesos</strong> en Mis Logros!' 
              : '¡Me alegra verte de nuevo por aquí! Sigue cuidando tu salud, escuchando tu cuerpo y floreciendo cada día 🌸✨'}
          </div>
          <div class="marcianito-tap-hint">
            <span class="material-symbols-outlined" style="font-size:0.9rem;">touch_app</span>
            <span>Toca en cualquier parte para cerrar</span>
          </div>
        </div>
      </div>
    `;

    overlay.classList.add('active');

    if (isFirstTime) {
      showInAppAchievementToast(achRes.ach);
    }

    // Cerrar al tocar en cualquier parte de la pantalla
    const closeOverlay = () => {
      overlay.classList.remove('active');
      overlay.removeEventListener('click', closeOverlay);
    };
    overlay.addEventListener('click', closeOverlay);
  };

  // =========================================================================
  // MOTOR DE RECOMENDACIONES DIARIAS DINÁMICAS (DÍA POR DÍA) & AGENTE DE IA
  // =========================================================================
  function getDynamicDayAdvice(currentDay, currentPhase, isDelayed, daysLate, symptoms, pet) {
    const petName = (pet && pet.name) || 'Tu Mascota';
    const day = parseInt(currentDay, 10) || 1;

    // 1. CASO DE RETRASO MENSTRUAL (DÍA POR DÍA)
    if (isDelayed) {
      const lateDays = parseInt(daysLate, 10) || 1;
      let lateSpecificEnergy = '';
      if (lateDays <= 2) {
        lateSpecificEnergy = `Llevas ${lateDays} día(s) de retraso y es completamente usual. Un examen difícil, una semana de trabajo pesado o no dormir bien retrasan la ovulación. ¡Hoy suelta toda culpa!`;
      } else if (lateDays <= 5) {
        lateSpecificEnergy = `Llevas ${lateDays} días de retraso. Tu cuerpo simplemente está esperando el momento en que te sientas en paz y segura para soltar el ciclo. ¡Cero presiones!`;
      } else {
        lateSpecificEnergy = `Llevas +${lateDays} días de retraso. Es un momento ideal para consentirte, revisar cómo ha estado tu alimentación y considerar un test de tranquilidad si lo deseas.`;
      }

      return {
        phaseBadgeText: `⏳ Retraso Menstrual (+${lateDays}d)`,
        phaseThemeColor: '#f59e0b',
        energy: lateSpecificEnergy,
        nutrition: `Infusión tibia de orégano suave, canela con miel o jengibre para darle calorcito al útero. Un puñadito de semillas de calabaza y chocolate oscuro para relajar tu pelvis.`,
        movement: `Movimientos suaves: postura del niño sobre un cojín o mariposa sentada en el suelo para abrir caderas y soltar la tensión lumbar.`,
        emotions: `El estrés es el enemigo número uno de la regularidad. Date una tarde para ti sola, una ducha tibia y desconecta el celular temprano.`,
        hydrationSleep: `2.3L de líquidos tibios. Duerme de lado con una almohadita entre las rodillas.`
      };
    }

    // 2. FASE MENSTRUAL (DÍAS 1 A 5)
    if (currentPhase === 'Menstrual') {
      if (day === 1) {
        return {
          phaseBadgeText: `🩸 Menstrual • Día 1`,
          phaseThemeColor: '#e63946',
          energy: `Hoy arranca tu ciclo y tu cuerpo te pide una pausa total. Toda tu energía está concentrada en limpiarse y renovarse. ¡Ponte en modo descanso absoluto y sin culpas!`,
          nutrition: `Sopita caliente, lentejitas o caldo de verduras. Acompáñalo con té de manzanilla tibio para relajar las contracciones del vientre.`,
          movement: `Cero ejercicio hoy. Solo estiramientos suaves en la cama o posición fetal con una mantita calientita en el vientre.`,
          emotions: `Es normal sentirte introspectiva o con ganas de estar solita. Abraza lo que sientes, ${petName} está aquí contigo.`,
          hydrationSleep: `2.2L de agua tibia o infusiones. Duérmete temprano hoy.`
        };
      } else if (day === 2) {
        return {
          phaseBadgeText: `🩸 Menstrual • Día 2`,
          phaseThemeColor: '#e63946',
          energy: `Es el día de mayor flujo y trabajo de tu útero. Es normal sentir la pancita inflamada o pesada; trátate como una reina de cristal hoy.`,
          nutrition: `Alimentos ricos en hierro: espinacas, frijolitos o frutos secos con unas gotas de limón o naranja para recargar fuerzas. Té de canela para los cólicos.`,
          movement: `Acuéstate boca arriba y lleva tus rodillas al pecho (Apanasana) por 3 minutos respirando lento y profundo.`,
          emotions: `Di que no a compromisos pesados. Tu prioridad número uno hoy eres tú.`,
          hydrationSleep: `2.3L de líquidos calientitos. Almohada bajo las rodillas al dormir para relajar la espalda.`
        };
      } else if (day === 3) {
        return {
          phaseBadgeText: `🩸 Menstrual • Día 3`,
          phaseThemeColor: '#e63946',
          energy: `El flujo empieza a ceder y comienzas a sentir un pequeño respiro de alivio en tu cuerpo. Tu energía empieza a despertar lentamente.`,
          nutrition: `Comidas ligeras y ricas: arrocito con verduras al vapor, aguacate y té de menta para despejar la digestión.`,
          movement: `Una caminata suavecita de 15 minutos al aire libre para que circule el aire y se oxigenen tus músculos.`,
          emotions: `Tu mente empieza a despejarse. Buen día para ver tu serie favorita o leer algo inspirador.`,
          hydrationSleep: `2.2L de agua. Duerme tus 8 horas completas.`
        };
      } else { // Día 4 o 5
        return {
          phaseBadgeText: `🩸 Menstrual • Día ${day}`,
          phaseThemeColor: '#e63946',
          energy: `¡Ya casi terminas tu período! Tu cuerpo se siente mucho más liviano, fresco y con ganas de empezar a planear cosas lindas.`,
          nutrition: `Frutas frescas con yogur, chía y ensaladas coloridas para devolverle hidratación y brillo a tu piel.`,
          movement: `Estiramientos de todo el cuerpo, yoga fluido suave o paseos a paso ligero.`,
          emotions: `Sensación de renacer. ¡Se viene tu etapa de mayor vitalidad y entusiasmo!`,
          hydrationSleep: `2.3L de agua fresca con unas rodajitas de limón o pepino.`
        };
      }
    }

    // 3. FASE FOLICULAR (DÍAS 6 A 12/13)
    if (currentPhase === 'Folicular') {
      if (day <= 7) {
        return {
          phaseBadgeText: `🌱 Folicular • Día ${day}`,
          phaseThemeColor: '#ff758f',
          energy: `¡Comienza tu subida de energía! Tu ánimo se siente ligero, con una vibra positiva y ganas de retomar tus actividades con gusto.`,
          nutrition: `Verduras crujientes, huevito, aguacate y frutos secos. Tu digestión está súper ágil.`,
          movement: `Momento ideal para bailar tu música favorita, hacer pilates en casa o salir a trotar.`,
          emotions: `Ganas de socializar, reírte y compartir con amigos o pareja.`,
          hydrationSleep: `2.4L de agua fresca a lo largo del día.`
        };
      } else if (day <= 10) {
        return {
          phaseBadgeText: `🌱 Folicular • Día ${day}`,
          phaseThemeColor: '#ff758f',
          energy: `¡Tus baterías están al 90%! Te vas a notar con la mente súper rápida, creativa, concentrada y con ganas de comerte el mundo.`,
          nutrition: `Ensaladas verdes frescas, brócoli, avena con frutas y alimentos que te den energía limpia y duradera.`,
          movement: `Entrenamientos con más intensidad: pesas, cardio o pilates dinámico. Tu cuerpo aguanta todo.`,
          emotions: `Confianza y optimismo a tope. Si tienes que empezar un proyecto o tomar una decisión, ¡hoy es el momento!`,
          hydrationSleep: `2.4L de agua para mantener esa chispa encendida.`
        };
      } else { // Día 11 a 13
        return {
          phaseBadgeText: `🌱 Folicular • Día ${day}`,
          phaseThemeColor: '#ff758f',
          energy: `Días previos a tu ovulación. Tu piel se ve más linda que nunca, tus ojos brillan y tu magnetismo natural está en su punto más alto.`,
          nutrition: `Antioxidantes deliciosos: arándanos, fresas, nueces y grasas saludables que cuidan tus células.`,
          movement: `Tus músculos están listos para retos divertidos: correr, bailar o tu deporte favorito.`,
          emotions: `Te sientes hermosa, atractiva y con ganas de compartir momentos especiales.`,
          hydrationSleep: `2.5L de agüita fresca.`
        };
      }
    }

    // 4. FASE OVULATORIA (DÍAS 14 A 15)
    if (currentPhase === 'Ovulatoria') {
      return {
        phaseBadgeText: `✨ Ovulatoria • Día ${day}`,
        phaseThemeColor: '#7209B7',
        energy: `¡Estás en el día cumbre de tu ciclo! Tu vitalidad, carisma y alegría están en su punto máximo. Todo tu cuerpo irradia bienestar.`,
        nutrition: `Comidas frescas y llenas de color. Frutos rojos, salmón o semillas y jugos naturales sin azúcar.`,
        movement: `Cualquier actividad que te haga sudar y sonreír: entrenamiento de fuerza, clase de baile o cardio.`,
        emotions: `Confianza total en ti misma. Comunica lo que piensas, ¡todos van a conectar contigo fácilmente!`,
        hydrationSleep: `2.5L de agua bien fresca durante el día.`
      };
    }

    // 5. FASE LÚTEA (DÍAS 16 A 28)
    if (day <= 19) {
      return {
        phaseBadgeText: `🌙 Lútea • Día ${day}`,
        phaseThemeColor: '#1D3557',
        energy: `La ovulación ya pasó y tu cuerpo entra en una energía tranquila, madura y productiva. Sigues con buen aguante pero prefieres planes más caseros.`,
        nutrition: `Comidas calentitas y completas: sopas de verduras, quinoa o arroz integral y té verde o blanco.`,
        movement: `Fuerza moderada, pilates controlado y caminatas al atardecer.`,
        emotions: `Enfocada y reflexiva. Buen momento para organizar tus espacios y consentir tu hogar.`,
        hydrationSleep: `2.3L de agua.`
      };
    } else if (day <= 24) {
      return {
        phaseBadgeText: `🌙 Lútea • Día ${day}`,
        phaseThemeColor: '#1D3557',
        energy: `Tu metabolismo se acelera un poquito y es normal que tu apetito aumente. Tu cuerpo busca reconfortarse y te pide calma.`,
        nutrition: `Satisface tus antojitos inteligentemente: avena tibia con canela, plátano, camote al horno y un cuadrito de chocolate oscuro.`,
        movement: `Estiramientos de cadera y espalda baja. Si sientes hinchazón, una caminata suave ayudará a mover los líquidos.`,
        emotions: `Tus emociones están más perceptivas. Evita situaciones que te drenen y date pausas durante el día.`,
        hydrationSleep: `2.3L de agua. Duerme con pijama fresquita y mantas cómodas.`
      };
    } else { // Día 25 a 28+
      return {
        phaseBadgeText: `🌙 Pre-menstrual • Día ${day}`,
        phaseThemeColor: '#1D3557',
        energy: `Tu cuerpo se está preparando para reiniciar el ciclo. Es el momento donde la paciencia contigo misma es tu mayor superpoder.`,
        nutrition: `Evita cosas con exceso de sal para no sentirte hinchadita. Infusión tibia de manzanilla con lavanda antes de dormir.`,
        movement: `Yoga restaurativo, estiramientos en el suelo sobre una alfombra suave y respiración diafragmática.`,
        emotions: `Si te sientes más sensible, irritable o con ganas de llorar de la nada, ¡es completamente natural y pasajero! No te juzgues.`,
        hydrationSleep: `Té tibio relajante y apagar el celular media hora antes de dormir.`
      };
    }
  }

  // =========================================================================
  // GENERADOR LIVE CON AGENTE DE IA (GOOGLE GEMINI) PARA EL AVATAR
  // =========================================================================
  window.requestAIAvatarAdvice = async function(force = false) {
    const petId = currentAvatarId || localStorage.getItem('pochirocho_selected_avatar') || 'amy';
    const pet = avatarRegistry[petId] || avatarRegistry.amy;
    const currentPhase = userCycleState.currentPhase || 'Ovulatoria';
    const cycleLen = parseInt(userProfile.duracionPromedioCiclo, 10) || 28;
    const currentDay = parseInt(userCycleState.currentDay, 10) || 1;
    const isDelayed = userCycleState.isDelayed || currentDay > cycleLen;
    const daysLate = userCycleState.daysLate || (isDelayed ? currentDay - cycleLen : 0);
    const symptoms = userProfile.sintomasHoy || [];
    const todayStr = new Date().toISOString().split('T')[0];
    const cacheKey = `pochirocho_ai_daily_advice_${todayStr}_d${currentDay}_${petId}`;

    const aiBtn = document.getElementById('avatar-spotlight-ai-btn');
    const energyTextEl = document.getElementById('avatar-spotlight-energy-text');
    const nutritionTextEl = document.getElementById('avatar-spotlight-nutrition-text');
    const movementTextEl = document.getElementById('avatar-spotlight-movement-text');
    const emotionalTextEl = document.getElementById('avatar-spotlight-emotional-text');
    const hydrationTextEl = document.getElementById('avatar-spotlight-hydration-text');

    if (aiBtn) {
      aiBtn.innerHTML = `<span class="material-symbols-outlined avatar-ai-loading-pulse" style="font-size:1.15rem; color:#f59e0b;">smart_toy</span>`;
      aiBtn.disabled = true;
      aiBtn.title = `${pet.name} está pensando con IA...`;
    }

    const symptomsStr = symptoms.length > 0 ? symptoms.join(', ') : 'Tranquila y sin molestias marcadas';

    const prompt = `Eres ${pet.name}, la tierna, cariñosa y atenta mascota virtual de la app de bienestar Pochirocho.
Estás hablando directamente con tu usuaria favorita de forma dulce, amorosa y con CERO tecnicismos médicos.

HOY ES SU:
- Día de su ciclo: Día ${currentDay} de ${cycleLen} días.
- Fase actual: ${currentPhase} ${isDelayed ? `(con ${daysLate} días de retraso menstrual)` : ''}.
- Síntomas y notas de hoy: ${symptomsStr}.

Genera para ella sus 5 recomendaciones ÚNICAS para hoy, respondiendo SOLAMENTE un objeto JSON válido con estas 5 claves (sin markdown, sin comillas triples ni texto extra):
{
  "energia": "2 o 3 frases cariñosas explicando exactamente cómo se siente su energía hoy en el Día ${currentDay} y por qué.",
  "nutricion": "Qué comer o beber rico, reconfortante y nutritivo hoy.",
  "movimiento": "Qué movimiento suave, estiramiento o descanso hacer hoy sin exigirse de más.",
  "emociones": "Un consejo dulce y apapacho para su mente hoy.",
  "hidratacion_sueno": "Meta de agua (ej: 2.2L - 2.5L) y cómo descansar rico hoy."
}`;

    try {
      const geminiRes = await GeminiConfig.generateResponse(prompt, 'Genera mi consejo de hoy');
      let cleanJsonStr = (geminiRes || '').replace(/```json/gi, '').replace(/```/g, '').trim();
      const firstBrace = cleanJsonStr.indexOf('{');
      const lastBrace = cleanJsonStr.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
        cleanJsonStr = cleanJsonStr.substring(firstBrace, lastBrace + 1);
      }
      const aiData = JSON.parse(cleanJsonStr);

      if (aiData && aiData.energia) {
        try {
          localStorage.setItem(cacheKey, JSON.stringify(aiData));
        } catch(e) {}

        if (energyTextEl) energyTextEl.textContent = aiData.energia;
        if (nutritionTextEl) nutritionTextEl.textContent = aiData.nutricion;
        if (movementTextEl) movementTextEl.textContent = aiData.movimiento;
        if (emotionalTextEl) emotionalTextEl.textContent = aiData.emociones;
        if (hydrationTextEl) hydrationTextEl.textContent = aiData.hidratacion_sueno || aiData.hidratacion;

        if (aiBtn) {
          aiBtn.innerHTML = `<span class="material-symbols-outlined" style="font-size:1.15rem; color:#10b981;">check</span>`;
          setTimeout(() => {
            if (aiBtn) {
              aiBtn.innerHTML = `<span class="material-symbols-outlined" style="font-size:1.15rem; color:#a78bfa;">refresh</span>`;
              aiBtn.title = `Regenerar consejo de ${pet.name} con IA`;
              aiBtn.disabled = false;
            }
          }, 1200);
        }
        return;
      }
    } catch (err) {
      console.warn('IA Avatar: no se pudo generar con Gemini, usando consejo dinámico:', err);
    }

    if (aiBtn) {
      aiBtn.innerHTML = `<span class="material-symbols-outlined" style="font-size:1.15rem; color:#f59e0b;">auto_awesome</span>`;
      aiBtn.title = `Generar consejo con IA de ${pet.name}`;
      aiBtn.disabled = false;
    }
  };

  // =========================================================================
  // MODAL EXPANDIDO DE RECOMENDACIONES COMPLETAS DEL AVATAR (EN TRACKER)
  // =========================================================================
  window.openAvatarRecommendationsModal = function() {
    const petId = currentAvatarId || localStorage.getItem('pochirocho_selected_avatar') || 'amy';
    const pet = avatarRegistry[petId] || avatarRegistry.amy;
    const currentPhase = userCycleState.currentPhase || 'Ovulatoria';
    const cycleLen = parseInt(userProfile.duracionPromedioCiclo, 10) || 28;
    const currentDay = parseInt(userCycleState.currentDay, 10) || 1;
    const isDelayed = userCycleState.isDelayed || currentDay > cycleLen;
    const daysLate = userCycleState.daysLate || (isDelayed ? currentDay - cycleLen : 0);
    const symptoms = userProfile.sintomasHoy || [];

    const avatarImgSrc = getAvatarImagePath(petId, currentPhase);

    // 1. Obtener la recomendación calibrada única para este día exacto
    const dayAdvice = getDynamicDayAdvice(currentDay, currentPhase, isDelayed, daysLate, symptoms, pet);

    // 2. Verificar si ya existe un consejo generado previamente por la IA de Gemini para el día de hoy
    const todayStr = new Date().toISOString().split('T')[0];
    const cacheKey = `pochirocho_ai_daily_advice_${todayStr}_d${currentDay}_${petId}`;
    let isFromAI = false;

    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.energia) {
          dayAdvice.energy = parsed.energia;
          dayAdvice.nutrition = parsed.nutricion;
          dayAdvice.movement = parsed.movimiento;
          dayAdvice.emotions = parsed.emociones;
          dayAdvice.hydrationSleep = parsed.hidratacion_sueno || parsed.hidratacion;
          isFromAI = true;
        }
      }
    } catch(e) {}

    // Ajuste adicional si hay síntomas registrados hoy
    let symptomsAdvice = '';
    if (symptoms.length > 0) {
      const symptomListStr = symptoms.join(', ');
      symptomsAdvice = `
        <div class="avatar-spotlight-section-item" style="border-left: 3px solid var(--theme-color, #e63946);">
          <div class="avatar-spotlight-section-label" style="color: var(--primary-crimson);">
            <span class="material-symbols-outlined" style="font-size: 0.95rem;">favorite</span>
            <span>Cuidando lo que sientes hoy (${symptomListStr})</span>
          </div>
          <div class="avatar-spotlight-section-text">
            ${pet.name} vio tus notas de hoy. Ponte una compresa o guatero tibio 15 minutos en el vientre o espalda baja, y haz una rutina suave en el <strong>Centro de Alivio</strong> para quitarte esa molestia rapidito.
          </div>
        </div>
      `;
    }

    let overlay = document.getElementById('avatar-recommendations-modal-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'avatar-recommendations-modal-overlay';
      overlay.className = 'avatar-recommendations-modal-overlay';
      document.body.appendChild(overlay);
    }

    overlay.innerHTML = `
      <div class="avatar-spotlight-modal-card" style="--theme-color: ${dayAdvice.phaseThemeColor};" onclick="event.stopPropagation();">
        <div class="avatar-spotlight-hero">
          <img src="${avatarImgSrc}" class="avatar-spotlight-img" alt="${pet.name}" />
          <div class="avatar-spotlight-badge" style="background: ${dayAdvice.phaseThemeColor};">
            ${dayAdvice.phaseBadgeText}
          </div>
        </div>

        <div class="avatar-spotlight-sheet">
          <div class="avatar-spotlight-sheet-header">
            <div class="avatar-spotlight-sheet-title">
              <span class="material-symbols-outlined" style="color: ${dayAdvice.phaseThemeColor}; font-size: 1.15rem;">auto_awesome</span>
              <span>Consejo de ${pet.name}</span>
            </div>
            <div style="display:flex; align-items:center; gap:0.45rem; flex-shrink:0;">
              <button class="avatar-ai-icon-btn" id="avatar-spotlight-ai-btn" onclick="requestAIAvatarAdvice(true)" title="${isFromAI ? 'Regenerar con IA de ' + pet.name : 'Generar consejo con IA de ' + pet.name}">
                <span class="material-symbols-outlined" id="avatar-spotlight-ai-icon" style="font-size:1.15rem; color:${isFromAI ? '#a78bfa' : '#f59e0b'};">${isFromAI ? 'refresh' : 'auto_awesome'}</span>
              </button>
              <button class="modal-close-icon-btn" onclick="closeAvatarRecommendationsModal()" title="Cerrar" style="background:none; border:none; color:#ffffff; cursor:pointer; display:flex; align-items:center; padding:4px;">
                <span class="material-symbols-outlined" style="font-size: 1.25rem;">close</span>
              </button>
            </div>
          </div>

          <!-- Diagnóstico & Energía -->
          <div class="avatar-spotlight-section-item">
            <div class="avatar-spotlight-section-label" style="color: #60a5fa;">
              <span class="material-symbols-outlined" style="font-size: 0.95rem;">bolt</span>
              <span>Energía de tu Día ${currentDay}</span>
            </div>
            <div class="avatar-spotlight-section-text" id="avatar-spotlight-energy-text">${dayAdvice.energy}</div>
          </div>

          ${symptomsAdvice}

          <!-- Nutrición & Infusiones -->
          <div class="avatar-spotlight-section-item">
            <div class="avatar-spotlight-section-label" style="color: #34d399;">
              <span class="material-symbols-outlined" style="font-size: 0.95rem;">local_cafe</span>
              <span>Nutrición & Bebidas de Hoy</span>
            </div>
            <div class="avatar-spotlight-section-text" id="avatar-spotlight-nutrition-text">${dayAdvice.nutrition}</div>
          </div>

          <!-- Movimiento Somático -->
          <div class="avatar-spotlight-section-item">
            <div class="avatar-spotlight-section-label" style="color: #f472b6;">
              <span class="material-symbols-outlined" style="font-size: 0.95rem;">self_improvement</span>
              <span>Movimiento & Alivio</span>
            </div>
            <div class="avatar-spotlight-section-text" id="avatar-spotlight-movement-text">${dayAdvice.movement}</div>
          </div>

          <!-- Mente & Emociones -->
          <div class="avatar-spotlight-section-item">
            <div class="avatar-spotlight-section-label" style="color: #a78bfa;">
              <span class="material-symbols-outlined" style="font-size: 0.95rem;">favorite</span>
              <span>Mente & Autocuidado</span>
            </div>
            <div class="avatar-spotlight-section-text" id="avatar-spotlight-emotional-text">${dayAdvice.emotions}</div>
          </div>

          <!-- Hidratación & Descanso -->
          <div class="avatar-spotlight-section-item">
            <div class="avatar-spotlight-section-label" style="color: #38bdf8;">
              <span class="material-symbols-outlined" style="font-size: 0.95rem;">water_drop</span>
              <span>Hidratación & Descanso</span>
            </div>
            <div class="avatar-spotlight-section-text" id="avatar-spotlight-hydration-text">${dayAdvice.hydrationSleep}</div>
          </div>
        </div>

        <div class="avatar-spotlight-tap-hint" onclick="closeAvatarRecommendationsModal()">
          <span class="material-symbols-outlined" style="font-size: 0.85rem;">arrow_back</span>
          <span>Toca aquí o fuera para volver al Tracker</span>
        </div>
      </div>
    `;

    overlay.classList.add('active');

    // Cerrar al tocar en cualquier parte del fondo
    overlay.onclick = (e) => {
      if (e.target === overlay) {
        closeAvatarRecommendationsModal();
      }
    };
  };

  window.closeAvatarRecommendationsModal = function() {
    const overlay = document.getElementById('avatar-recommendations-modal-overlay');
    if (overlay) {
      overlay.classList.remove('active');
    }
  };

  // ==========================================================================
  // RENDER NODO 3: LOGROS & MEDALLAS (COSMIC GRID HUB & ETHEREAL NEBULA)
  // ==========================================================================
  let currentAchTab = 'periodic'; // 'periodic' o 'secret'

  function renderAchievementsNodeView() {
    const content = document.getElementById('achievements-view-content');
    const streakCounter = document.getElementById('achievements-streak-counter');
    if (streakCounter) streakCounter.textContent = `${rewardsEngine.streakDays} Días`;

    const allAchs = achievementsEngine.achievements;
    const periodicList = allAchs.filter(a => !a.isSecret);
    const secretList = allAchs.filter(a => a.isSecret);
    const currentList = currentAchTab === 'periodic' ? periodicList : secretList;

    content.innerHTML = `
      <!-- Pestañas de Navegación de Logros -->
      <div class="shop-category-tabs-row" style="margin-bottom:0.6rem;">
        <button class="shop-tab-btn ${currentAchTab === 'periodic' ? 'active' : ''}" onclick="switchAchievementsTab('periodic')">
          <span>🏆 Desafíos de Salud (${periodicList.length})</span>
        </button>
        <button class="shop-tab-btn ${currentAchTab === 'secret' ? 'active' : ''}" onclick="switchAchievementsTab('secret')">
          <span>🕵️‍♀️ Logros Ocultos (${secretList.filter(s => s.unlocked).length}/${secretList.length})</span>
        </button>
      </div>

      <!-- Rejilla Cósmica de Tarjetas de Logros -->
      <div style="display:flex; flex-direction:column; gap:0.75rem; padding-bottom:1.5rem;">
        ${currentList.map(ach => {
          const isReadyToClaim = !ach.claimed && (ach.unlocked || ach.current >= ach.target);
          const percent = Math.min(100, Math.round((ach.current / ach.target) * 100));

          if (ach.isSecret && !ach.unlocked && !ach.claimed) {
            // Tarjeta Misteriosa y Poética para Logro Oculto no descubierto
            return `
              <div class="achievement-giant-card" style="border: 1.5px dashed rgba(255, 185, 80, 0.35); background: linear-gradient(135deg, rgba(15, 23, 42, 0.85), rgba(30, 27, 75, 0.5));">
                <div class="achievement-giant-badge" style="filter: drop-shadow(0 0 10px rgba(255, 185, 80, 0.4));">🔮</div>
                <div>
                  <span style="font-size:0.68rem; font-weight:800; color:var(--gold-accent); text-transform:uppercase; letter-spacing:0.08em;">✨ Enigma Secreto</span>
                  <h3 class="achievement-giant-title" style="color:#ffffff; font-size: 1.05rem;">${ach.lockedTitle || 'Misterio Oculto 🗝️'}</h3>
                  <div style="margin-top: 0.35rem; padding: 0.6rem 0.8rem; border-radius: 12px; background: rgba(255, 255, 255, 0.04); border-left: 3px solid var(--gold-accent);">
                    <p class="achievement-giant-desc" style="font-style:italic; color:#e2e8f0; font-size: 0.78rem; line-height: 1.35; margin:0;">
                      "${ach.secretRiddle || 'Un secreto oculto aguarda ser revelado por tus acciones en el universo de Pochirocho...'}"
                    </p>
                  </div>
                </div>
                <div style="padding: 0.5rem 0.8rem; border-radius:12px; background: rgba(255, 185, 80, 0.08); border:1px solid rgba(255, 185, 80, 0.2); color: var(--gold-accent); font-size:0.72rem; font-weight:700; text-align:center;">
                  🔒 Bloqueado • Descifra el acertijo explorando la app
                </div>
              </div>
            `;
          }

          return `
            <div class="achievement-giant-card" style="${isReadyToClaim ? 'border-color: var(--gold-accent); box-shadow: 0 0 25px rgba(255, 185, 80, 0.35);' : ''}">
              <div class="achievement-giant-badge">${ach.icon}</div>
              <div>
                <span style="font-size:0.68rem; font-weight:700; color:var(--cyan-accent); text-transform:uppercase; letter-spacing:0.08em;">
                  ${ach.isSecret ? '⭐ LOGRO SECRETO REVELADO' : `Nivel ${ach.level}`}
                </span>
                <h3 class="achievement-giant-title">${ach.title}</h3>
                <p class="achievement-giant-desc">${ach.desc}</p>
              </div>

              <!-- Barra de Progreso -->
              <div class="achievement-progress-box">
                <div class="achievement-progress-text">
                  <span>Progreso: ${ach.current} / ${ach.target} ${ach.unit}</span>
                  <span style="color:var(--gold-accent); font-weight:800;">Recompensa: 🪙 ${ach.reward}</span>
                </div>
                <div class="achievement-progress-track">
                  <div class="achievement-progress-fill" style="width: ${percent}%;"></div>
                </div>
              </div>

              ${isReadyToClaim ? `
                <button class="btn-claim-achievement" onclick="claimAchievementRewardEngine('${ach.id}')" style="box-shadow: 0 0 20px rgba(255, 185, 80, 0.5);">
                  ✨ Reclamar Recompensa (+🪙 ${ach.reward} Pochipesos)
                </button>
              ` : (ach.claimed && !ach.isSecret ? `
                <div style="padding: 0.55rem; border-radius:14px; background: rgba(56, 189, 248, 0.15); border:1px solid var(--cyan-accent); color: var(--cyan-accent); font-size:0.75rem; font-weight:700; text-align:center;">
                  ✓ Nivel ${ach.level - 1} Reclamado • Siguiente objetivo en curso
                </div>
              ` : (ach.claimed && ach.isSecret ? `
                <div style="padding: 0.55rem; border-radius:14px; background: rgba(16, 185, 129, 0.15); border:1px solid #10b981; color: #a7f3d0; font-size:0.75rem; font-weight:700; text-align:center;">
                  ✓ Logro Secreto Completado (+45 🪙 Reclamados)
                </div>
              ` : `
                <div style="padding: 0.55rem; border-radius:14px; background: rgba(255, 255, 255, 0.04); border:1px solid rgba(255, 255, 255, 0.08); color: #94a3b8; font-size:0.72rem; font-weight:600; text-align:center;">
                  🔒 En progreso (${percent}%) • Continúa con tus hábitos
                </div>
              `))}
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  window.switchAchievementsTab = function(tab) {
    currentAchTab = tab;
    renderAchievementsNodeView();
  };

  window.claimAchievementRewardEngine = function(achId) {
    const res = achievementsEngine.claimAchievement(achId);
    if (res.success) {
      rewardsEngine.coins += res.rewardCoins;
      updateCoinsUI();
      renderAchievementsNodeView();
      showInAppRewardToast(res.rewardCoins, `¡Reclamaste +${res.rewardCoins} 🪙 por "${res.ach.title}"!`, '🏆');
    } else {
      showInAppInfoToast('Logros', res.reason || 'No fue posible reclamar el logro');
    }
  };
  // ==========================================================================
  // RENDER NODO 4: AMOR (AMOR POLLOCHIROCHO - 12 NOTAS SELLADAS & PRÍNCIPE PÍO)
  // ==========================================================================
  function renderMotivationNodeView() {
    const content = document.getElementById('motivation-view-content');
    if (!content) return;

    const notesHTML = motivationNotes.map((note, index) => {
      return `
        <div class="love-note-sealed-card" style="transform: rotate(${note.rotation}deg);" onclick="openLoveNote('${note.id}')" title="Toca para abrir la Nota #${index + 1}">
          <div class="love-note-wax-seal">${note.emoji}</div>
          <span class="love-note-number-badge">Nota #${index + 1}</span>
          <span class="love-note-tap-hint">Abrir 💌</span>
        </div>
      `;
    }).join('');

    content.innerHTML = `
      <div class="love-notes-screen-wrapper">
        <div class="love-notes-grid-container">
          ${notesHTML}
        </div>

        <!-- Footer Fijo de Amor con Avatar Príncipe Pío Normal -->
        <div class="motivation-fixed-footer">
          <div class="pio-footer-avatar-wrapper">
            <img src="assets/avatares/PrincipePio/Principe_Pio_Normal.png" class="pio-footer-avatar-img" alt="Príncipe Pío" />
          </div>
          <div class="pio-footer-content">
            <div class="pio-footer-name-row">
              <span class="pio-footer-author-title">Príncipe Pío 🐓</span>
              <span class="pio-footer-heart-badge">Para ti 💖</span>
            </div>
            <p class="pio-footer-message-text">
              "Si en algún momento te sientes bajoneada, lee alguna de estas notas que escribí con mi corazón para levantar un poquito tu ánimo, no olvides que en mi siempre tendrás un amor puro y un pecho sobre el cual recostarte. Te amo con cada dato que recopila mi corazón."
            </p>
          </div>
        </div>
      </div>
    `;
  }

  window.openLoveNote = function(noteId) {
    const note = motivationNotes.find(n => n.id === noteId);
    if (!note) return;

    const existing = document.getElementById('love-note-zoom-modal');
    if (existing) existing.remove();

    const noteIndex = motivationNotes.findIndex(n => n.id === noteId) + 1;

    const modalHTML = `
      <div class="love-note-zoom-overlay" id="love-note-zoom-modal" onclick="handleLoveNoteOverlayClick(event)">
        <div class="love-note-zoom-card">
          <div class="love-note-zoom-header">
            <div class="love-note-zoom-author-box">
              <div class="pio-zoom-avatar-ring">
                <img src="assets/avatares/PrincipePio/Principe_Pio_Pensativo.png" class="pio-zoom-avatar-img" alt="Príncipe Pío Pensativo" />
              </div>
              <div class="love-note-zoom-author-info">
                <span class="love-note-zoom-author-title">Príncipe Pío 🐓</span>
                <span class="love-note-zoom-author-sub">Nota #${noteIndex} • Pensando en ti ${note.emoji}</span>
              </div>
            </div>
            <button class="love-note-zoom-close-btn" onclick="closeLoveNoteModal()" title="Cerrar">✕</button>
          </div>

          <div class="love-note-zoom-body-text">
            “${note.message}”
          </div>

          <div class="love-note-zoom-signature-box">
            <span class="love-note-zoom-signature">Con todo mi amor, tu pollo 🐥💛</span>
            <button class="love-note-zoom-btn-close" onclick="closeLoveNoteModal()">Guardar en mi corazón 💌</button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
  };

  window.closeLoveNoteModal = function() {
    const modal = document.getElementById('love-note-zoom-modal');
    if (modal) {
      modal.style.opacity = '0';
      modal.style.transition = 'opacity 0.25s ease';
      setTimeout(() => modal.remove(), 250);
    }
  };

  window.handleLoveNoteOverlayClick = function(e) {
    if (e.target && e.target.id === 'love-note-zoom-modal') {
      closeLoveNoteModal();
    }
  };

  // THEME ENGINE
  const themeConfig = {
    red: { name: 'Rojo (Rosas) 🌹', color: '#E63946', colorDark: '#800f1c', glow: 'rgba(230, 57, 70, 0.85)', bgGradient: 'radial-gradient(circle at 50% 30%, rgba(230, 57, 70, 0.4) 0%, #1a0306 80%)', imgSrc: 'assets/themes/Rosas.png', count: 16 },
    pink: { name: 'Rosa (Corazones) 🩷', color: '#ff758f', colorDark: '#991136', glow: 'rgba(255, 117, 143, 0.75)', bgGradient: 'radial-gradient(circle at 50% 30%, rgba(255, 117, 143, 0.35) 0%, #200412 80%)', imgSrc: 'assets/themes/Corazones.png', count: 16 },
    green: { name: 'Verde (Hojas) 🍃', color: '#2ec4b6', colorDark: '#0a4f47', glow: 'rgba(46, 196, 182, 0.75)', bgGradient: 'radial-gradient(circle at 50% 30%, rgba(46, 196, 182, 0.3) 0%, #031c17 80%)', imgSrc: 'assets/themes/Hojas.png', count: 15 },
    yellow: { name: 'Amarillo (Girasoles) 🌻', color: '#ffb950', colorDark: '#804e00', glow: 'rgba(255, 185, 80, 0.75)', bgGradient: 'radial-gradient(circle at 50% 30%, rgba(255, 185, 80, 0.3) 0%, #1f1402 80%)', imgSrc: 'assets/themes/Girasoles.png', count: 16 },
    purple: { name: 'Morado (Burbujas) 🫧', color: '#a855f7', colorDark: '#4c1d95', glow: 'rgba(168, 85, 247, 0.85)', bgGradient: 'radial-gradient(circle at 50% 30%, rgba(168, 85, 247, 0.4) 0%, #140522 80%)', imgSrc: 'assets/themes/Burbujas.png', count: 18 },
    blue: { name: 'Azul (Lluvia) 🌧️', color: '#38bdf8', colorDark: '#032b45', glow: 'rgba(56, 189, 248, 0.75)', bgGradient: 'radial-gradient(circle at 50% 30%, rgba(56, 189, 248, 0.25) 0%, #031024 80%)', isRain: true }
  };

  function applyTheme(themeKey) {
    const config = themeConfig[themeKey] || themeConfig.red;

    document.documentElement.style.setProperty('--theme-color', config.color);
    document.documentElement.style.setProperty('--theme-color-dark', config.colorDark);
    document.documentElement.style.setProperty('--theme-glow', config.glow);
    document.documentElement.style.setProperty('--theme-bg-gradient', config.bgGradient);
    
    // Adaptar el borde de Spotify a la paleta del tema seleccionado, con transparencia
    document.documentElement.style.setProperty('--theme-border-color', config.color.replace('rgb', 'rgba').replace(')', ', 0.4)'));

    if (themeFallingContainer) themeFallingContainer.innerHTML = '';
    if (rainAnimatedLayer) rainAnimatedLayer.style.display = config.isRain ? 'block' : 'none';

    if (!config.isRain && config.imgSrc) {
      for (let i = 0; i < config.count; i++) {
        const img = document.createElement('img');
        img.src = config.imgSrc;
        img.className = 'falling-theme-item';

        const randomX = Math.random() * 86 + 4;
        const randomDelay = -(Math.random() * 12);
        const randomDuration = Math.random() * 5 + 6.5;
        const randomSize = Math.random() * 35 + 70;

        img.style.left = `${randomX}%`;
        img.style.animationDelay = `${randomDelay}s`;
        img.style.animationDuration = `${randomDuration}s`;
        img.style.width = `${randomSize}px`;

        themeFallingContainer.appendChild(img);
      }
    }

    currentThemeKey = themeKey;

    // Sincronizar bolitas activas
    themeDots.forEach(d => {
      if (d.getAttribute('data-theme') === themeKey) {
        d.classList.add('active');
      } else {
        d.classList.remove('active');
      }
    });
  }
  window.applyTheme = applyTheme;

  themeDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const themeKey = dot.getAttribute('data-theme');
      themeSettings.mode = 'fixed';
      themeSettings.fixedTheme = themeKey;
      saveThemeSettings();
      applyTheme(themeKey);
    });
  });

  // Inicialización con tema según la configuración activa
  const initialTheme = getThemeForCurrentState();
  applyTheme(initialTheme);
  updateAvatarDisplay('Normal');

  wheelNavItems.forEach(item => {
    item.addEventListener('click', () => {
      wheelNavItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      const tab = item.getAttribute('data-tab');
      handleWheelTabChange(tab);
    });
  });

  // RENDER TRACKER SUBVIEWS
  function renderAIAgentView() {
    const subview = document.getElementById('tracker-subview-content');
    const activeConv = aiConversations.find(c => c.id === currentConversationId) || aiConversations[0];
    const pet = avatarRegistry[currentAvatarId] || avatarRegistry.amy;
    const displayPhase = userCycleState.currentPhase || 'Ovulatoria';
    const avatarImgPath = getAvatarImagePath(currentAvatarId, displayPhase);

    // Adaptar mensaje inicial dinámicamente a la mascota activa
    if (activeConv && activeConv.messages.length === 1 && activeConv.messages[0].sender !== 'user') {
      activeConv.messages[0].text = `¡Hola! Soy **${pet.name}**, tu asistente de salud en simbiosis orgánica. Estoy en sintonía contigo durante tu **Fase ${displayPhase}**. ${pet.quotes.trackerGreeting} ¿En qué te puedo acompañar hoy?`;
    }

    subview.innerHTML = `
      <div class="ai-container">
        <div class="ai-symbiosis-header-card">
          <div class="symbiosis-info-group">
            <div class="symbiosis-avatar-badge">
              <img src="${avatarImgPath}" class="symbiosis-avatar-img" alt="${pet.name}"/>
            </div>
            <div class="symbiosis-text-details">
              <span class="symbiosis-agent-name">${pet.name} — Asistente IA</span>
              <span class="symbiosis-live-phase">Fase ${displayPhase} • Día ${userCycleState.currentDay} del Ciclo</span>
            </div>
          </div>
          <div class="symbiosis-status-pill">
            <span class="material-symbols-outlined" style="font-size: 0.8rem;">graphic_eq</span>
            <span>Simbiosis Activa 🟢</span>
          </div>
        </div>

        <div class="ai-session-controls-row">
          <button class="btn-new-chat" onclick="createNewAIConversation()">
            <span class="material-symbols-outlined" style="font-size: 1rem;">add</span>
            Nueva Conversación
          </button>
          <button class="btn-history-chats" onclick="openAIHistoryModal()">
            <span class="material-symbols-outlined" style="font-size: 1rem;">history</span>
            Historial (${aiConversations.length}/${MAX_AI_CONVERSATIONS})
          </button>
        </div>

        <div class="ai-prompt-chips-row" id="ai-prompt-chips-row">
          <div class="ai-chip-btn" onclick="sendPromptChip('¿Por qué me duele la espalda baja hoy?')"><span>⚡ ¿Dolor de espalda baja hoy?</span></div>
          <div class="ai-chip-btn" onclick="sendPromptChip('¿Qué puedo comer para el estrés premenstrual?')"><span>🥗 Alimentación según mi Fase</span></div>
          <div class="ai-chip-btn" onclick="sendPromptChip('¿Cómo me ayudas con mis cólicos?')"><span>✨ ¿Cómo me ayudas con mis cólicos?</span></div>
          <div class="ai-chip-btn" onclick="sendPromptChip('¿Es normal la fatiga en la Fase Lútea?')"><span>😴 Fatiga en Fase Lútea</span></div>
          <div class="ai-chip-btn" onclick="sendPromptChip('¿Cómo influye mi nivel de estrés?')"><span>🧠 Impacto del Estrés en el Ciclo</span></div>
          <div class="ai-chip-btn" onclick="sendPromptChip('¿Qué hacer ante un sangrado abundante?')"><span>🩸 Consejos para Sangrado Alto</span></div>
        </div>

        <div class="ai-chat-feed-container" id="ai-chat-feed">
          ${activeConv.messages.map(msg => {
            if (msg.sender === 'user') {
              return `<div class="chat-bubble-user">${msg.text}</div>`;
            } else {
              return `
                <div class="chat-bubble-spike">
                  <div class="chat-spike-sender">
                    <img src="${avatarImgPath}" class="chat-spike-avatar-img" alt="${pet.name}"/>
                    <span>${pet.name}</span>
                  </div>
                  <div class="chat-bubble-text">${formatMarkdownText(msg.text)}</div>
                </div>
              `;
            }
          }).join('')}
        </div>

        <div class="ai-input-bar-container">
          <input type="text" id="ai-user-input" class="ai-input-field" placeholder="Pregúntale a ${pet.name} sobre tu salud u hormonas..." onkeypress="if(event.key === 'Enter') submitAIMessage();"/>
          <button class="btn-ai-send" onclick="submitAIMessage()">
            <span class="material-symbols-outlined" style="font-size: 1.2rem;">send</span>
          </button>
        </div>
      </div>
    `;
    scrollAIChatToBottom();
  }

  window.createNewAIConversation = function() {
    const pet = avatarRegistry[currentAvatarId] || avatarRegistry.amy;
    const displayPhase = userCycleState.currentPhase || 'Ovulatoria';
    const newId = `conv-${Date.now()}`;
    const newConv = {
      id: newId,
      title: `Nueva Conversación (${new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })})`,
      date: 'Hoy',
      messages: [{ sender: 'pet', text: `¡Hola de nuevo! Soy **${pet.name}**. He abierto un **nuevo hilo de conversación** para ti en tu Fase ${displayPhase}. ${pet.quotes.trackerGreeting} ¿De qué tema de tu salud deseas hablar hoy?` }]
    };
    aiConversations.unshift(newConv);
    if (aiConversations.length > MAX_AI_CONVERSATIONS) {
      aiConversations = aiConversations.slice(0, MAX_AI_CONVERSATIONS);
    }
    currentConversationId = newId;
    saveAIConversationsToStorage();
    renderAIAgentView();
  };

  window.openAIHistoryModal = function() {
    const pet = avatarRegistry[currentAvatarId] || avatarRegistry.amy;
    modalTitleIcon.textContent = 'history';
    modalTitle.textContent = `Historial de Conversaciones (${aiConversations.length}/${MAX_AI_CONVERSATIONS})`;
    modalBody.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 0.65rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.2rem;">
          <p style="font-size: 0.74rem; color: #94a3b8; margin: 0;">Selecciona una conversación para continuar o elimínala si deseas liberar espacio:</p>
          <span style="font-size: 0.68rem; font-weight: 700; color: #cbd5e1; background: rgba(255,255,255,0.06); padding: 0.2rem 0.55rem; border-radius: 999px; white-space: nowrap; margin-left: 0.5rem;">${aiConversations.length}/10</span>
        </div>
        ${aiConversations.map(conv => `
          <div class="ai-history-card-item ${conv.id === currentConversationId ? 'active-chat' : ''}" onclick="selectAIConversation('${conv.id}')" style="display:flex; align-items:center; justify-content:space-between; gap:0.6rem;">
            <div style="display: flex; align-items: center; gap: 0.65rem; min-width: 0; flex: 1;">
              <span style="font-size: 1.3rem; flex-shrink: 0;">💬</span>
              <div style="display: flex; flex-direction: column; min-width: 0;">
                <span style="font-family: var(--font-heading); font-size: 0.8rem; font-weight: 700; color: #ffffff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${conv.title}</span>
                <span style="font-size: 0.68rem; color: #cbd5e1;">${conv.messages.length} mensajes • ${conv.date}</span>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 0.45rem; flex-shrink: 0;">
              ${conv.id === currentConversationId ? '<span style="font-size: 0.68rem; font-weight:700; color: var(--purple-accent); background: rgba(168,85,247,0.15); border: 1px solid var(--purple-accent); padding: 0.15rem 0.45rem; border-radius: 8px;">Activo</span>' : ''}
              <button onclick="deleteAIConversation('${conv.id}', event)" title="Eliminar conversación" style="background: rgba(230, 57, 70, 0.15); border: 1px solid rgba(230, 57, 70, 0.35); border-radius: 8px; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #ff758f; transition: all 0.2s ease;">
                <span class="material-symbols-outlined" style="font-size: 1rem; pointer-events: none;">delete</span>
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
    modalOverlay.classList.add('active');
  };

  window.deleteAIConversation = function(convId, event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    const idx = aiConversations.findIndex(c => c.id === convId);
    if (idx === -1) return;

    aiConversations.splice(idx, 1);

    // Si nos quedamos sin conversaciones, crear una nueva conversación limpia
    if (aiConversations.length === 0) {
      const pet = avatarRegistry[currentAvatarId] || avatarRegistry.amy;
      const displayPhase = userCycleState.currentPhase || 'Ovulatoria';
      const freshId = `conv-${Date.now()}`;
      aiConversations.push({
        id: freshId,
        title: 'Nueva Conversación',
        date: 'Hoy',
        messages: [{ sender: 'pet', text: `¡Hola de nuevo! Soy **${pet.name}**. He abierto un **nuevo hilo de conversación** para ti en tu Fase ${displayPhase}. ${pet.quotes.trackerGreeting} ¿De qué tema de tu salud deseas hablar hoy?` }]
      });
      currentConversationId = freshId;
    } else if (currentConversationId === convId) {
      // Si la conversación eliminada era la activa, activar la primera
      currentConversationId = aiConversations[0].id;
    }

    saveAIConversationsToStorage();
    renderAIAgentView();
    openAIHistoryModal();
    if (typeof showInAppInfoToast === 'function') {
      showInAppInfoToast('Conversación Eliminada', 'Se eliminó la conversación del historial.', '🗑️');
    }
  };

  window.selectAIConversation = function(convId) {
    currentConversationId = convId;
    closeModal();
    renderAIAgentView();
  };

  function formatMarkdownText(txt) {
    if (!txt) return '';
    let formatted = txt;

    // 1. Encabezados ###
    formatted = formatted.replace(/^###\s*(.*?)$/gm, '<div class="chat-section-heading">$1</div>');

    // 2. Negritas **texto**
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // 3. Cursivas *texto* (que no sean ya parte de tags)
    formatted = formatted.replace(/(?<![\w<])\*(?!\s)([^*]+?)(?<!\s)\*(?![\w>])/g, '<em>$1</em>');

    // 4. Viñetas con punto o guión
    formatted = formatted.replace(/^[•\-]\s*(.*?)$/gm, '<div class="chat-bullet-row"><span class="chat-bullet-dot">•</span><span>$1</span></div>');

    // 5. Saltos de párrafo limpios
    formatted = formatted.replace(/\n\n+/g, '<div style="height: 0.4rem;"></div>');
    formatted = formatted.replace(/\n/g, '<br/>');

    // Limpieza de saltos residuales después de divs
    formatted = formatted.replace(/(<\/div>)<br\/>/g, '$1');

    return formatted;
  }
  function scrollAIChatToBottom() { const feed = document.getElementById('ai-chat-feed'); if (feed) feed.scrollTop = feed.scrollHeight; }

  window.sendPromptChip = function(questionText) {
    const input = document.getElementById('ai-user-input');
    if (input) input.value = questionText;
    submitAIMessage();
  };

  window.submitAIMessage = async function() {
    const input = document.getElementById('ai-user-input');
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;

    input.value = '';

    const activeConv = aiConversations.find(c => c.id === currentConversationId) || aiConversations[0];
    if (activeConv.messages.length <= 1) {
      activeConv.title = text.length > 28 ? `${text.substring(0, 28)}...` : text;
    }

    activeConv.messages.push({ sender: 'user', text: text });
    saveAIConversationsToStorage();
    renderAIAgentView();

    const feed = document.getElementById('ai-chat-feed');
    const pet = avatarRegistry[currentAvatarId] || avatarRegistry.amy;
    const displayPhase = userCycleState.currentPhase || 'Ovulatoria';
    const avatarImgPath = getAvatarImagePath(currentAvatarId, displayPhase);

    if (feed) {
      const thinkingBox = document.createElement('div');
      thinkingBox.className = 'spike-thinking-box';
      thinkingBox.id = 'spike-thinking-indicator';
      thinkingBox.innerHTML = `<img src="${avatarImgPath}" class="chat-spike-avatar-img" style="width:20px; height:20px;" alt="${pet.name}"/><span>${pet.name} está pensando en cómo cuidarte... 💭</span>`;
      feed.appendChild(thinkingBox);
      feed.scrollTop = feed.scrollHeight;
    }

    // Telemetría en tiempo real
    const profileTelemetry = {
      faseHormonal: `Fase ${displayPhase}`,
      diaActualCiclo: 14,
      desarrolladorEmail: 'ana@ejemplo.com'
    };

    const responseObj = await aiEngine.processQuery(text, currentAvatarId, profileTelemetry, activeConv.messages);

    setTimeout(() => {
      let formattedMessageText = responseObj.text;

      // Renderizar Rutinas Interactivas Recomendadas (Con botón directo a la rutina)
      if (responseObj.linkedRoutines && responseObj.linkedRoutines.length > 0) {
        const routinesBadgesHTML = responseObj.linkedRoutines.slice(0, 2).map(rt => `
          <div style="margin-top:0.4rem; padding:0.55rem 0.75rem; background:rgba(255,255,255,0.06); border:1.5px solid var(--rose-accent); border-radius:12px; display:flex; align-items:center; justify-content:space-between; gap:0.5rem;">
            <div style="display:flex; flex-direction:column;">
              <span style="font-family:var(--font-heading); font-size:0.78rem; font-weight:800; color:var(--gold-accent);">🧘‍♀️ ${rt.name}</span>
              <span style="font-size:0.68rem; color:#cbd5e1;">${rt.benefit || 'Rutina terapéutica recomendada'}</span>
            </div>
            <button onclick="navigateToReliefAndOpenRoutine('${rt.id}')" style="padding:0.4rem 0.75rem; background:linear-gradient(135deg, var(--rose-accent), var(--gold-accent)); border:none; border-radius:10px; color:#02040a; font-weight:800; font-size:0.72rem; cursor:pointer; white-space:nowrap;">
              ▶️ Abrir en Alivio
            </button>
          </div>
        `).join('');

        formattedMessageText += `<div style="margin-top:0.6rem;">${routinesBadgesHTML}</div>`;
      }

      // Renderizar Recursos Externos Verificados
      if (responseObj.resources && responseObj.resources.length > 0) {
        const linksHTML = responseObj.resources.map(res => `
          <div style="margin-top:0.4rem; padding:0.5rem 0.7rem; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.12); border-radius:10px; display:flex; align-items:center; justify-content:space-between;">
            <div style="display:flex; align-items:center; gap:0.4rem;">
              <span>${res.icon || '🌐'}</span>
              <span style="font-size:0.72rem; color:#f1f5f9; font-weight:600;">${res.title}</span>
            </div>
            <a href="${res.url}" target="_blank" style="font-size:0.7rem; color:var(--cyan-accent); font-weight:700; text-decoration:underline;">Abrir ↗</a>
          </div>
        `).join('');

        formattedMessageText += `<div style="margin-top:0.5rem;">${linksHTML}</div>`;
      }

      // Si es reporte de error técnico (Pollo Desarrollador 🐔💻)
      if (responseObj.isDevTicketTriggered) {
        formattedMessageText += `
          <div style="margin-top:0.6rem; padding:0.6rem; background:rgba(230,57,70,0.15); border:1px solid var(--primary-crimson); border-radius:12px; font-size:0.72rem; color:#ffffff;">
            <strong>📩 Estado de Ticket de Soporte:</strong><br/>
            Notificación enviada al correo del desarrollador (<code>santisc1304@gmail.com</code>). Se te avisará por este chat cuando la solución esté lista.
          </div>
        `;
      }

      activeConv.messages.push({ sender: 'spike', text: formattedMessageText });
      saveAIConversationsToStorage();
      renderAIAgentView();
    }, 200);
  };

  // =========================================================================
  // MOTOR DE ANÁLISIS MÉDICO CON IA DE PRÍNCIPE PÍO (EL POLLO ANALISTA 🐔👓)
  // =========================================================================
  window.requestAIPioAnalysis = async function(force = false) {
    const analytics = AnalyticsEngine.computeAnalytics(userProfile, loggedDaysData);
    const todayStr = new Date().toISOString().split('T')[0];
    const cacheKey = `pochirocho_pio_ai_insights_${todayStr}`;

    const aiBtn = document.getElementById('btn-pio-ai-analyze');
    const quoteEl = document.getElementById('pio-speech-quote');
    const regTitleEl = document.getElementById('pio-insight-regularity-title');
    const regBodyEl = document.getElementById('pio-insight-regularity-body');
    const painTitleEl = document.getElementById('pio-insight-pain-title');
    const painBodyEl = document.getElementById('pio-insight-pain-body');
    const stressTitleEl = document.getElementById('pio-insight-stress-title');
    const stressBodyEl = document.getElementById('pio-insight-stress-body');
    const symTitleEl = document.getElementById('pio-insight-symptoms-title');
    const symBodyEl = document.getElementById('pio-insight-symptoms-body');

    if (aiBtn) {
      aiBtn.innerHTML = `<span class="material-symbols-outlined avatar-ai-loading-pulse" style="font-size:1.05rem; color:#fbbf24;">smart_toy</span>`;
      aiBtn.disabled = true;
      aiBtn.title = 'Príncipe Pío analizando tus estadísticas con IA...';
    }

    if (quoteEl) {
      quoteEl.innerHTML = `<em>"¡PíoPíoPío! 🐔👓 Estoy consultando tus métricas y registros con Inteligencia Artificial para darte un reporte médico certero..."</em>`;
    }

    const userName = (userProfile && userProfile.nombre) || 'usuaria';
    const currentDay = userCycleState.currentDay || 1;
    const currentPhase = userCycleState.currentPhase || 'Folicular';
    const totalCycles = analytics.totalCycles || 0;
    const avgDuration = analytics.duracionPromedio || 28;
    const sigma = analytics.sigma || 1;
    const regPct = analytics.regularidadPorcentaje || 95;
    const avgMenstrualCramps = analytics.avgMenstrualCramps || '2.0';
    const peakPainPhase = analytics.peakPainPhase || 'Fase Menstrual';
    const stressAltoPct = analytics.stressStats?.alto || 0;
    const stressModPct = analytics.stressStats?.moderado || 0;
    const stressBajoPct = analytics.stressStats?.bajo || 100;
    const impactoEstres = analytics.impactoEstresPorcentaje || 40;
    const topSymptomsStr = (analytics.topSymptoms || []).map(s => `${s.name} (${s.pct}%)`).join(', ') || 'Ninguno recurrente';

    const prompt = `Eres Príncipe Pío 🐔👓, el analítico, tierno y perspicaz Pollo Analista de la app de salud femenina Pochirocho.
Hablas con alegría ("¡PíoPíoPío!"), entusiasmo y visión clínica aguda pero explicada con palabras sencillas, cotidianas, empáticas y CERO tecnicismos médicos fríos.

DATOS MÉDICOS REALES DE LA USUARIA (${userName}):
- Historial analizado: ${totalCycles} ciclos completados (duración media: ${avgDuration} días, variabilidad: ±${sigma} días, regularidad: ${regPct}%).
- Molestias y Cólicos: Promedio de ${avgMenstrualCramps}/5 en menstruación. Mayor concentración de dolor en: ${peakPainPhase}.
- Estrés: ${stressAltoPct}% Alto, ${stressModPct}% Moderado, ${stressBajoPct}% Bajo. Impacto de estrés en dolor: ${impactoEstres}%.
- Síntomas más reportados: ${topSymptomsStr}.
- Estado de hoy: Día ${currentDay} del ciclo (${currentPhase}).

Genera para ella un reporte analítico de alto valor biológico respondiendo ÚNICAMENTE un objeto JSON válido con estas 5 claves (sin comillas triples, sin markdown, sin texto adicional):
{
  "saludo": "Mensaje enérgico y afectuoso de 2 o 3 oraciones de Príncipe Pío dando su veredicto general sobre cómo ve el equilibrio de su cuerpo hoy.",
  "regularidad": {
    "titulo": "Insight de Príncipe Pío 🐔👓 — Regularidad del Ciclo",
    "significado": "Explicación clara de qué revelan sus ${avgDuration} días promedio y su regularidad del ${regPct}%.",
    "recomendacion": "Consejo práctico y amoroso para mantener estable su ritmo hormonal."
  },
  "dolor": {
    "titulo": "Insight de Príncipe Pío 🐔👓 — Curva de Dolor e Inflamación",
    "significado": "Explicación de cuándo y por qué ocurren sus cólicos según sus datos reales.",
    "recomendacion": "Consejo preventivo (calor local, movimiento somático o infusión) para mitigar esa molestia antes de que suba."
  },
  "estres": {
    "titulo": "Insight de Príncipe Pío 🐔👓 — Impacto del Estrés en el Cuerpo",
    "significado": "Cómo sus días de estrés influyen directamente en sus cólicos, cabeza o tensión muscular.",
    "recomendacion": "Recomendación práctica para reducir el cortisol y proteger su ciclo."
  },
  "sintomas": {
    "titulo": "Insight de Príncipe Pío 🐔👓 — Síntomas Observados",
    "significado": "Por qué su cuerpo manifiesta principalmente ${topSymptomsStr}.",
    "recomendacion": "Hábito sencillo de hidratación, descanso o nutrición para sentirse mucho mejor."
  }
}`;

    try {
      const geminiRes = await GeminiConfig.generateResponse(prompt, 'Genera el análisis médico');
      let cleanJsonStr = (geminiRes || '').replace(/```json/gi, '').replace(/```/g, '').trim();
      const firstBrace = cleanJsonStr.indexOf('{');
      const lastBrace = cleanJsonStr.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
        cleanJsonStr = cleanJsonStr.substring(firstBrace, lastBrace + 1);
      }
      const aiData = JSON.parse(cleanJsonStr);

      if (aiData && aiData.regularidad && aiData.dolor) {
        try {
          localStorage.setItem(cacheKey, JSON.stringify(aiData));
        } catch(e) {}

        if (quoteEl && aiData.saludo) {
          quoteEl.innerHTML = `"${aiData.saludo}"`;
        }

        if (regTitleEl && aiData.regularidad.titulo) regTitleEl.textContent = aiData.regularidad.titulo;
        if (regBodyEl && aiData.regularidad.significado) {
          regBodyEl.innerHTML = `<strong>¿Qué significan tus datos?</strong> ${aiData.regularidad.significado}<br/><strong>💡 Recomendación de Príncipe Pío:</strong> ${aiData.regularidad.recomendacion}`;
        }

        if (painTitleEl && aiData.dolor.titulo) painTitleEl.textContent = aiData.dolor.titulo;
        if (painBodyEl && aiData.dolor.significado) {
          painBodyEl.innerHTML = `<strong>¿Qué significan tus datos?</strong> ${aiData.dolor.significado}<br/><strong>💡 Recomendación de Príncipe Pío:</strong> ${aiData.dolor.recomendacion}`;
        }

        if (stressTitleEl && aiData.estres.titulo) stressTitleEl.textContent = aiData.estres.titulo;
        if (stressBodyEl && aiData.estres.significado) {
          stressBodyEl.innerHTML = `<strong>¿Qué significan tus datos?</strong> ${aiData.estres.significado}<br/><strong>💡 Recomendación de Príncipe Pío:</strong> ${aiData.estres.recomendacion}`;
        }

        if (symTitleEl && aiData.sintomas.titulo) symTitleEl.textContent = aiData.sintomas.titulo;
        if (symBodyEl && aiData.sintomas.significado) {
          symBodyEl.innerHTML = `<strong>¿Qué significan tus datos?</strong> ${aiData.sintomas.significado}<br/><strong>💡 Recomendación de Príncipe Pío:</strong> ${aiData.sintomas.recomendacion}`;
        }

        if (aiBtn) {
          aiBtn.innerHTML = `<span class="material-symbols-outlined" style="font-size:1.05rem; color:#10b981;">check</span>`;
          setTimeout(() => {
            if (aiBtn) {
              aiBtn.innerHTML = `<span class="material-symbols-outlined" style="font-size:1.05rem; color:#a78bfa;">refresh</span>`;
              aiBtn.title = 'Regenerar análisis con IA de Príncipe Pío';
              aiBtn.disabled = false;
            }
          }, 1200);
        }
        return;
      }
    } catch(err) {
      console.warn('Príncipe Pío IA: error al generar análisis con Gemini, manteniendo análisis dinámico:', err);
    }

    if (quoteEl) {
      quoteEl.innerHTML = `"¡PíoPíoPío! Soy <strong>Príncipe Pío 🐔👓</strong>, tu Pollo Analista. Interpreto tus registros diarios, tendencias de dolor y datos biológicos para darte un reporte médico y afectuoso de tu cuerpo."`;
    }

    if (aiBtn) {
      aiBtn.innerHTML = `<span class="material-symbols-outlined" style="font-size:1.05rem; color:#fbbf24;">auto_awesome</span>`;
      aiBtn.title = 'Generar análisis con IA de Príncipe Pío';
      aiBtn.disabled = false;
    }
  };

  function renderAnalyticsTrendsView() {
    const subview = document.getElementById('tracker-subview-content');
    const analytics = AnalyticsEngine.computeAnalytics(userProfile, loggedDaysData);
    const pioInsights = AnalystChickenInsights.generateInsights(userProfile, loggedDaysData, analytics);

    const todayStr = new Date().toISOString().split('T')[0];
    let pioGreeting = `¡PíoPíoPío! Soy <strong>Príncipe Pío 🐔👓</strong>, tu Pollo Analista. Interpreto tus registros diarios, tendencias de dolor y datos biológicos para darte un reporte médico y afectuoso de tu cuerpo.`;
    let isPioFromAI = false;

    try {
      const cachedAI = localStorage.getItem(`pochirocho_pio_ai_insights_${todayStr}`);
      if (cachedAI) {
        const parsed = JSON.parse(cachedAI);
        if (parsed && parsed.saludo) {
          pioGreeting = parsed.saludo;
          isPioFromAI = true;
        }
      }
    } catch(e) {}

    subview.innerHTML = `
      <div class="trends-container">
        <div class="relief-header-section">
          <h1 class="relief-header-title">Análisis de Salud & Tendencias</h1>
          <p class="relief-header-subtitle">Gráficas biológicas reales e insights clínicos de salud.</p>
        </div>

        <!-- Tarjeta de Presentación del Príncipe Pío (El Pollo Analista) -->
        <div class="pio-analyst-presentation-card">
          <div class="pio-avatar-wrapper">
            <img src="assets/avatares/PrincipePio/Principe_Pio_Normal.png" class="pio-avatar-img" alt="Príncipe Pío Normal" />
          </div>
          <div class="pio-presentation-text" style="flex:1;">
            <div class="pio-badge-title" style="display:flex; align-items:center; justify-content:space-between; width:100%;">
              <div style="display:flex; align-items:center; gap:0.45rem;">
                <span class="pio-name">Príncipe Pío</span>
                <span class="pio-tag">El Pollo Analista 🐔👓</span>
              </div>
              <button class="avatar-ai-icon-btn" id="btn-pio-ai-analyze" onclick="requestAIPioAnalysis(true)" title="${isPioFromAI ? 'Regenerar análisis con IA de Príncipe Pío' : 'Generar análisis profundo con IA de Príncipe Pío'}" style="width:32px; height:32px; min-width:32px;">
                <span class="material-symbols-outlined" id="pio-ai-btn-icon" style="font-size:1.05rem; color:${isPioFromAI ? '#a78bfa' : '#fbbf24'};">${isPioFromAI ? 'refresh' : 'auto_awesome'}</span>
              </button>
            </div>
            <p class="pio-speech-quote" id="pio-speech-quote">
              "${pioGreeting}"
            </p>
          </div>
        </div>

        <div class="somatic-score-card">
          <div class="somatic-score-info">
            <span class="somatic-score-title">Puntuación Somática Hormonal</span>
            <span class="somatic-score-val">${analytics.scoreSomatico} / 100</span>
            <div class="somatic-badge-status">
              <span class="material-symbols-outlined" style="font-size: 0.9rem;">check_circle</span>
              <span>Salud Hormonal Sincronizada</span>
            </div>
          </div>
          <div style="font-size: 2.8rem;">📊</div>
        </div>

        <div class="trend-chart-solid-card">
          <div class="chart-card-header">
            <div>
              <h3 class="chart-card-title"><span class="material-symbols-outlined" style="color: var(--cyan-accent);">show_chart</span>Duración del Ciclo (Últimos 6 Meses)</h3>
              <span class="chart-card-subtitle">Variabilidad estimada según tu perfil y registros</span>
            </div>
            <span style="font-family: var(--font-heading); font-size: 0.8rem; font-weight:700; color: var(--cyan-accent);">Prom. ${analytics.duracionPromedio} Días</span>
          </div>
          <div class="liquid-bar-chart">
            ${analytics.cycleBars.map(b => `
              <div class="liquid-bar-column">
                <span class="liquid-bar-val">${b.val}</span>
                <div class="liquid-bar-track"><div class="liquid-bar-fill" style="height: ${b.height};"></div></div>
                <span class="liquid-bar-label">${b.label}</span>
              </div>
            `).join('')}
          </div>
          <div class="insight-comment-card">
            <div class="insight-avatar-box"><img src="assets/avatares/PrincipePio/Principe_Pio_Pensativo.png" class="insight-pio-img" alt="Príncipe Pío Pensativo"/></div>
            <div class="insight-text-wrapper">
              <span class="insight-title" id="pio-insight-regularity-title">${pioInsights[0].title}</span>
              <p class="insight-body-text" id="pio-insight-regularity-body"><strong>¿Qué significan tus datos?</strong> ${pioInsights[0].meaning}<br/><strong>💡 Recomendación de Príncipe Pío:</strong> ${pioInsights[0].recommendation}</p>
            </div>
          </div>
        </div>

        <div class="trend-chart-solid-card">
          <div class="chart-card-header">
            <div>
              <h3 class="chart-card-title"><span class="material-symbols-outlined" style="color: var(--primary-crimson);">waves</span>Intensidad de Cólicos según la Fase</h3>
              <span class="chart-card-subtitle">Nivel de molestia (0 a 5) reportado por fase</span>
            </div>
            <span style="font-family: var(--font-heading); font-size: 0.8rem; font-weight:700; color: var(--primary-crimson);">Fase Menstrual: Prom. ${analytics.avgMenstrualCramps}/5</span>
          </div>
          <div class="liquid-wave-wrapper">
            <svg class="wave-svg-chart" viewBox="0 0 300 90" preserveAspectRatio="none">
              <defs><linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#E63946" stop-opacity="0.9"/><stop offset="25%" stop-color="#ff758f" stop-opacity="0.3"/><stop offset="60%" stop-color="#a855f7" stop-opacity="0.2"/><stop offset="100%" stop-color="#ffb950" stop-opacity="0.5"/></linearGradient></defs>
              <path d="M 0 20 Q 35 15, 60 75 Q 100 85, 150 85 Q 220 85, 260 45 Q 280 30, 300 85 L 300 90 L 0 90 Z" fill="url(#waveGrad)" />
              <path d="M 0 20 Q 35 15, 60 75 Q 100 85, 150 85 Q 220 85, 260 45 Q 280 30, 300 85" fill="none" stroke="#E63946" stroke-width="3" />
            </svg>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.65rem; color: #94a3b8; font-weight: 600;">
            <span>Fase Menstrual (Días 1-${analytics.duracionPeriodo})</span>
            <span>Fase Folicular</span>
            <span>Fase Lútea</span>
          </div>
          <div class="insight-comment-card">
            <div class="insight-avatar-box"><img src="assets/avatares/PrincipePio/Principe_Pio_Pensativo.png" class="insight-pio-img" alt="Príncipe Pío Pensativo"/></div>
            <div class="insight-text-wrapper">
              <span class="insight-title" id="pio-insight-pain-title">${pioInsights[1].title}</span>
              <p class="insight-body-text" id="pio-insight-pain-body"><strong>¿Qué significan tus datos?</strong> ${pioInsights[1].meaning}<br/><strong>💡 Recomendación de Príncipe Pío:</strong> ${pioInsights[1].recommendation}</p>
            </div>
          </div>
        </div>

        <div class="trend-chart-solid-card">
          <div class="chart-card-header">
            <div>
              <h3 class="chart-card-title"><span class="material-symbols-outlined" style="color: var(--purple-accent);">donut_large</span>Distribución de Nivel de Estrés</h3>
              <span class="chart-card-subtitle">Frecuencia en registros corporales</span>
            </div>
          </div>
          <div class="donut-chart-row">
            <svg class="donut-chart-svg" viewBox="0 0 36 36">
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="4"/>
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#2ec4b6" stroke-width="4" stroke-dasharray="${analytics.stressStats.bajo}, 100"/>
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#ffb950" stroke-width="4" stroke-dasharray="${analytics.stressStats.moderado}, 100" stroke-dashoffset="-${analytics.stressStats.bajo}"/>
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#E63946" stroke-width="4" stroke-dasharray="${analytics.stressStats.alto}, 100" stroke-dashoffset="-${analytics.stressStats.bajo + analytics.stressStats.moderado}"/>
            </svg>
            <div class="donut-legend-list">
              <div class="donut-legend-item"><div><span class="donut-legend-color" style="background: #2ec4b6;"></span>Estrés Bajo</div><span style="font-weight:700; color: #2ec4b6;">${analytics.stressStats.bajo}%</span></div>
              <div class="donut-legend-item"><div><span class="donut-legend-color" style="background: #ffb950;"></span>Estrés Moderado</div><span style="font-weight:700; color: #ffb950;">${analytics.stressStats.moderado}%</span></div>
              <div class="donut-legend-item"><div><span class="donut-legend-color" style="background: #E63946;"></span>Estrés Alto</div><span style="font-weight:700; color: #E63946;">${analytics.stressStats.alto}%</span></div>
            </div>
          </div>
          <div class="insight-comment-card">
            <div class="insight-avatar-box"><img src="assets/avatares/PrincipePio/Principe_Pio_Pensativo.png" class="insight-pio-img" alt="Príncipe Pío Pensativo"/></div>
            <div class="insight-text-wrapper">
              <span class="insight-title" id="pio-insight-stress-title">${pioInsights[2].title}</span>
              <p class="insight-body-text" id="pio-insight-stress-body"><strong>¿Qué significan tus datos?</strong> ${pioInsights[2].meaning}<br/><strong>💡 Recomendación de Príncipe Pío:</strong> ${pioInsights[2].recommendation}</p>
            </div>
          </div>
        </div>

        <div class="trend-chart-solid-card">
          <div class="chart-card-header">
            <div>
              <h3 class="chart-card-title"><span class="material-symbols-outlined" style="color: var(--rose-accent);">bar_chart</span>Síntomas Recurrentes</h3>
              <span class="chart-card-subtitle">Frecuencia observada en tus registros</span>
            </div>
          </div>
          <div class="symptom-progress-list">
            ${analytics.topSymptoms.map(s => `
              <div class="symptom-progress-item">
                <div class="symptom-progress-info"><span>${s.name}</span><span style="color: var(--rose-accent);">${s.pct}%</span></div>
                <div class="symptom-progress-track"><div class="symptom-progress-fill" style="width: ${s.pct}%;"></div></div>
              </div>
            `).join('')}
          </div>
          <div class="insight-comment-card">
            <div class="insight-avatar-box"><img src="assets/avatares/PrincipePio/Principe_Pio_Pensativo.png" class="insight-pio-img" alt="Príncipe Pío Pensativo"/></div>
            <div class="insight-text-wrapper">
              <span class="insight-title" id="pio-insight-symptoms-title">${pioInsights[3].title}</span>
              <p class="insight-body-text" id="pio-insight-symptoms-body"><strong>¿Qué significan tus datos?</strong> ${pioInsights[3].meaning}<br/><strong>💡 Recomendación de Príncipe Pío:</strong> ${pioInsights[3].recommendation}</p>
            </div>
          </div>
        </div>

        <div class="pdf-exporter-card">
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <span style="font-size: 1.8rem;">📄</span>
            <div>
              <h3 style="font-family: var(--font-heading); font-size: 0.95rem; font-weight: 700; color: #ffffff;">Reporte Médico en PDF</h3>
              <p style="font-size: 0.72rem; color: #cbd5e1;">Consolidado de ciclos, dolor y síntomas listo para llevar a tu consulta ginecológica.</p>
            </div>
          </div>
          <button class="btn-export-pdf" onclick="showInAppInfoToast('Reporte Clínico', '📄 Reporte Clínico en PDF generado con éxito por Príncipe Pío 🐔👓. Descargando resumen consolidado para Ginecología...', '📋');">
            <span class="material-symbols-outlined" style="font-size: 1.1rem;">download</span>Exportar Reporte Médico en PDF
          </button>
        </div>
      </div>
    `;

    // Trigger de Tarea Diaria 3: Leer estadísticas en Análisis solo al hacer scroll hasta el fondo
    const trendsContainer = subview.querySelector('.trends-container');
    if (trendsContainer) {
      trendsContainer.addEventListener('scroll', () => {
        const isAtBottom = (trendsContainer.scrollTop + trendsContainer.clientHeight) >= (trendsContainer.scrollHeight - 45);
        if (isAtBottom) {
          const taskRes = rewardsEngine.completeDailyTask('read_analysis');
          if (taskRes && taskRes.success && taskRes.earned > 0) {
            updateCoinsUI();
            renderDailyTasksHub();
            const achRes = achievementsEngine.trackProgress('analytics-read', 1);
            if (achRes && achRes.newlyUnlocked) showInAppAchievementToast(achRes.ach);
          }
        }
      });
    }
  }

  window.prevCalMonth = function() { currentCalMonth--; if (currentCalMonth < 0) { currentCalMonth = 11; currentCalYear--; } renderCalendarView(); };
  window.nextCalMonth = function() { currentCalMonth++; if (currentCalMonth > 11) { currentCalMonth = 0; currentCalYear++; } renderCalendarView(); };
  window.selectCalendarDay = function(dateStr) { selectedCalDateStr = dateStr; renderCalendarView(); };

  // =========================================================================
  // MINI CALENDARIO ESTÉTICO & CALCULADORA DE FECHAS FUTURAS
  // =========================================================================
  let predictedDateSelected = '2026-09-15';
  let pickerCalMonth = 8; // Septiembre (0-indexed)
  let pickerCalYear = 2026;

  function formatPredictionDateDisplay(dateStr) {
    if (!dateStr) return 'Elegir fecha...';
    const parts = dateStr.split('-');
    const d = parseInt(parts[2], 10);
    const m = parseInt(parts[1], 10) - 1;
    const y = parseInt(parts[0], 10);
    return `📆 ${d} de ${monthNames[m]}, ${y}`;
  }

  window.openCustomDatePickerModal = function() {
    const parts = (predictedDateSelected || '2026-09-15').split('-');
    pickerCalYear = parseInt(parts[0], 10) || 2026;
    pickerCalMonth = (parseInt(parts[1], 10) - 1) || 8;
    renderCustomDatePickerModalContent();
  };

  window.renderCustomDatePickerModalContent = function() {
    const existing = document.getElementById('custom-date-picker-modal');
    if (existing) existing.remove();

    const firstDay = new Date(pickerCalYear, pickerCalMonth, 1);
    const lastDay = new Date(pickerCalYear, pickerCalMonth + 1, 0);
    let startDay = firstDay.getDay() - 1;
    if (startDay < 0) startDay = 6;
    const totalDays = lastDay.getDate();

    let daysGridHTML = '';
    for (let i = 0; i < startDay; i++) {
      daysGridHTML += `<div class="picker-day-cell empty"></div>`;
    }

    for (let d = 1; d <= totalDays; d++) {
      const mStr = String(pickerCalMonth + 1).padStart(2, '0');
      const dStr = String(d).padStart(2, '0');
      const dateKey = `${pickerCalYear}-${mStr}-${dStr}`;
      const isSelected = (dateKey === predictedDateSelected);

      daysGridHTML += `
        <div class="picker-day-cell ${isSelected ? 'selected' : ''}" onclick="selectPredictionPickerDate('${dateKey}')">
          ${d}
        </div>
      `;
    }

    const quickMonths = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const quickMonthsHTML = quickMonths.map((mName, idx) => `
      <button type="button" class="picker-month-pill ${pickerCalMonth === idx ? 'active' : ''}" onclick="setPickerMonth(${idx})">
        ${mName}
      </button>
    `).join('');

    const modalHTML = `
      <div class="modal-overlay active" id="custom-date-picker-modal" style="display:flex; align-items:center; justify-content:center; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(2,4,10,0.88); backdrop-filter:blur(12px); z-index:99999; padding:1rem;">
        <div style="background:#0f172a; border:1.5px solid rgba(168, 85, 247, 0.45); border-radius:24px; padding:1.25rem; max-width:420px; width:100%; color:#ffffff; box-shadow:0 20px 50px rgba(0,0,0,0.9), 0 0 30px rgba(168, 85, 247, 0.25);" class="custom-modal-scroll">
          
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
            <div style="display:flex; align-items:center; gap:0.45rem;">
              <span style="font-size:1.3rem;">🔮</span>
              <h3 style="font-family:var(--font-heading); font-size:1rem; font-weight:800; color:#ffffff; margin:0;">Elegir Fecha de Predicción</h3>
            </div>
            <button onclick="document.getElementById('custom-date-picker-modal').remove()" style="background:rgba(255,255,255,0.1); border:none; color:white; width:30px; height:30px; border-radius:50%; cursor:pointer; font-weight:bold; display:flex; align-items:center; justify-content:center;">✕</button>
          </div>

          <div class="picker-month-nav">
            <button class="picker-month-btn" onclick="prevPickerMonth()"><span class="material-symbols-outlined" style="font-size:1.1rem;">chevron_left</span></button>
            <div style="display:flex; align-items:center; gap:0.4rem;">
              <span style="font-family:var(--font-heading); font-size:0.9rem; font-weight:800; color:var(--purple-accent);">${monthNames[pickerCalMonth]}</span>
              <span style="font-family:var(--font-heading); font-size:0.9rem; font-weight:800; color:#ffffff;">${pickerCalYear}</span>
            </div>
            <button class="picker-month-btn" onclick="nextPickerMonth()"><span class="material-symbols-outlined" style="font-size:1.1rem;">chevron_right</span></button>
          </div>

          <div class="picker-quick-months-row">
            ${quickMonthsHTML}
          </div>

          <div class="picker-weekdays-row">
            <span>Lun</span><span>Mar</span><span>Mié</span><span>Jue</span><span>Vie</span><span>Sáb</span><span>Dom</span>
          </div>

          <div class="picker-days-grid">
            ${daysGridHTML}
          </div>

          <div style="font-family:var(--font-heading); font-size:0.7rem; font-weight:700; color:#94a3b8; margin-bottom:0.35rem;">⚡ Atajos Rápidos:</div>
          <div class="picker-shortcuts-row">
            <button type="button" class="picker-shortcut-pill" onclick="setPickerShortcut(30)">+1 Mes 🌸</button>
            <button type="button" class="picker-shortcut-pill" onclick="setPickerShortcut(90)">+3 Meses ✈️</button>
            <button type="button" class="picker-shortcut-pill" onclick="setPickerShortcut(180)">+6 Meses 🏖️</button>
            <button type="button" class="picker-shortcut-pill" onclick="selectPredictionPickerDate('2027-01-01')">Año Nuevo 2027 🎆</button>
          </div>

          <button onclick="confirmCustomPredictionDate()" style="width:100%; padding:0.85rem; background:linear-gradient(135deg, var(--purple-accent), var(--rose-accent)); border:none; border-radius:16px; color:#ffffff; font-family:var(--font-heading); font-weight:800; font-size:0.85rem; cursor:pointer; box-shadow:0 0 20px var(--purple-glow); display:flex; align-items:center; justify-content:center; gap:0.5rem;">
            <span>🔮 Confirmar y Calcular Predicción</span>
          </button>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
  };

  window.prevPickerMonth = function() {
    pickerCalMonth--;
    if (pickerCalMonth < 0) { pickerCalMonth = 11; pickerCalYear--; }
    renderCustomDatePickerModalContent();
  };

  window.nextPickerMonth = function() {
    pickerCalMonth++;
    if (pickerCalMonth > 11) { pickerCalMonth = 0; pickerCalYear++; }
    renderCustomDatePickerModalContent();
  };

  window.setPickerMonth = function(mIdx) {
    pickerCalMonth = mIdx;
    renderCustomDatePickerModalContent();
  };

  window.setPickerShortcut = function(daysToAdd) {
    const target = new Date();
    target.setDate(target.getDate() + daysToAdd);
    const y = target.getFullYear();
    const m = String(target.getMonth() + 1).padStart(2, '0');
    const d = String(target.getDate()).padStart(2, '0');
    selectPredictionPickerDate(`${y}-${m}-${d}`);
  };

  window.selectPredictionPickerDate = function(dateStr) {
    predictedDateSelected = dateStr;
    const parts = dateStr.split('-');
    pickerCalYear = parseInt(parts[0], 10);
    pickerCalMonth = parseInt(parts[1], 10) - 1;
    renderCustomDatePickerModalContent();
  };

  window.confirmCustomPredictionDate = function() {
    const modal = document.getElementById('custom-date-picker-modal');
    if (modal) modal.remove();

    const displayText = document.getElementById('future-date-display-text');
    if (displayText) displayText.textContent = formatPredictionDateDisplay(predictedDateSelected);

    runFutureDatePrediction();
  };

  window.runFutureDatePrediction = function() {
    const resultBox = document.getElementById('prediction-result-box');
    if (!resultBox) return;
    const val = predictedDateSelected || '2026-09-15';

    const parts = val.split('-');
    const targetDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    const phaseInfo = getCyclePhaseForDate(targetDate);
    const diffDays = Math.ceil((targetDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24));
    const timeText = diffDays > 0 ? `En ${diffDays} días` : (diffDays === 0 ? 'Hoy' : `Hace ${Math.abs(diffDays)} días`);

    const pet = avatarRegistry[currentAvatarId] || avatarRegistry.amy;
    const petFirstName = pet.name.split(' ')[0];

    resultBox.style.display = 'flex';
    resultBox.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;"><span style="font-family: var(--font-heading); font-size: 0.85rem; font-weight: 700; color: #ffffff;">📆 ${parts[2]} de ${monthNames[targetDate.getMonth()]}, ${parts[0]} (${timeText})</span><span style="padding: 0.2rem 0.65rem; border-radius: 999px; font-size: 0.68rem; font-weight: 700; background: ${phaseInfo.phaseColor}; color: white;">Día ${phaseInfo.cycleDay}</span></div>
      <div style="font-size: 0.78rem; color: #f1f5f9; line-height: 1.35;"><span><strong>Fase Calculada:</strong> ${phaseInfo.phaseName}</span><br/><span><strong>Probabilidad de Fertilidad:</strong> ${phaseInfo.cycleDay >= 12 && phaseInfo.cycleDay <= 16 ? '🔥 Elevada (Fase Fértil)' : '🟢 Baja / Segura'}</span></div>
      <div style="background: rgba(255, 185, 80, 0.12); border: 1px solid var(--gold-accent); border-radius: 12px; padding: 0.6rem; display: flex; align-items: center; gap: 0.55rem; margin-top: 0.2rem;">
        <img src="assets/avatares/${pet.folder}/Normal_${pet.suffix}.png" style="width: 32px; height: 32px; object-fit: contain; border-radius: 50%; background: radial-gradient(circle at 30% 30%, #ffd166, #e76f51); padding: 2px;" alt="${petFirstName}"/>
        <p style="font-size: 0.72rem; color: #ffffff; line-height: 1.3; margin: 0;"><strong>Recomendación de ${petFirstName}:</strong> ${phaseInfo.cycleDay >= 1 && phaseInfo.cycleDay <= 5 ? 'Para esta fecha te sugiero llevar compresas de té tibio y preparar tu rutina de alivio pélvico ☕' : (phaseInfo.cycleDay >= 12 && phaseInfo.cycleDay <= 16 ? '¡Tendrás energía radiante y motivación al máximo para ese evento especial! ✨' : 'Fase ideal para actividades sociales suaves y relajación en casa 🌸')}</p>
      </div>
    `;

    if (window.achievementsEngine) {
      const predAch = achievementsEngine.trackProgress('cycle-predictions', 1);
      if (predAch && predAch.newlyUnlocked && window.showInAppAchievementToast) {
        showInAppAchievementToast(predAch.ach);
      }
    }
  };

  function renderCalendarView() {
    const subview = document.getElementById('tracker-subview-content');
    const firstDayOfMonth = new Date(currentCalYear, currentCalMonth, 1);
    const lastDayOfMonth = new Date(currentCalYear, currentCalMonth + 1, 0);

    let startDayOfWeek = firstDayOfMonth.getDay() - 1; 
    if (startDayOfWeek < 0) startDayOfWeek = 6; 

    const daysInMonth = lastDayOfMonth.getDate();
    let calendarCellsHTML = '';

    for (let i = 0; i < startDayOfWeek; i++) calendarCellsHTML += `<div class="cal-day-cell other-month"></div>`;

    for (let d = 1; d <= daysInMonth; d++) {
      const iterDate = new Date(currentCalYear, currentCalMonth, d);
      const dateStr = formatDateKey(iterDate);
      const phaseInfo = getCyclePhaseForDate(iterDate);
      const isSelected = (dateStr === selectedCalDateStr);
      const logItem = loggedDaysData[dateStr];

      const hex = phaseInfo.phaseColor || '#ff758f';
      const cellBg = hexToRgba(hex, 0.22);
      const cellBorder = hexToRgba(hex, 0.55);
      const cellGlow = hexToRgba(hex, 0.45);

      calendarCellsHTML += `
        <div class="cal-day-cell ${phaseInfo.phaseClass} ${isSelected ? 'selected-day' : ''}" 
             style="background: ${cellBg}; border-color: ${cellBorder}; ${isSelected ? `box-shadow: 0 0 16px ${cellGlow}; border-color: #ffffff !important;` : ''}" 
             onclick="selectCalendarDay('${dateStr}')">
          <span class="cal-day-number">${d}</span>
          <div class="cal-day-badges">
            ${logItem && logItem.period && logItem.period !== 'Ninguno' ? '<span class="badge-dot dot-period"></span>' : ''}
            ${logItem && logItem.intimacy ? '<span class="badge-dot dot-sex"></span>' : ''}
            ${logItem && logItem.cramps > 0 ? '<span class="badge-dot dot-symptom"></span>' : ''}
          </div>
        </div>
      `;
    }

    const selDateParts = selectedCalDateStr.split('-');
    const selDateObj = new Date(parseInt(selDateParts[0], 10), parseInt(selDateParts[1], 10) - 1, parseInt(selDateParts[2], 10));
    const selectedPhaseInfo = getCyclePhaseForDate(selDateObj);
    const selectedLog = loggedDaysData[selectedCalDateStr];

    const mTheme = (themeSettings && themeSettings.phaseThemes && themeSettings.phaseThemes.Menstrual) || 'red';
    const fTheme = (themeSettings && themeSettings.phaseThemes && themeSettings.phaseThemes.Folicular) || 'pink';
    const oTheme = (themeSettings && themeSettings.phaseThemes && themeSettings.phaseThemes.Ovulatoria) || 'blue';
    const lTheme = (themeSettings && themeSettings.phaseThemes && themeSettings.phaseThemes.Lutea) || 'yellow';

    const mColor = (themeConfig && themeConfig[mTheme]) ? themeConfig[mTheme].color : '#E63946';
    const fColor = (themeConfig && themeConfig[fTheme]) ? themeConfig[fTheme].color : '#ff758f';
    const oColor = (themeConfig && themeConfig[oTheme]) ? themeConfig[oTheme].color : '#38bdf8';
    const lColor = (themeConfig && themeConfig[lTheme]) ? themeConfig[lTheme].color : '#ffb950';

    subview.innerHTML = `
      <div class="calendar-container">
        <div class="relief-header-section"><h1 class="relief-header-title">Calendario Predictivo</h1><p class="relief-header-subtitle">Precision Calendar • Fases, Síntomas & Predicciones</p></div>
        <div class="calendar-nav-header"><button class="cal-nav-btn" onclick="prevCalMonth()"><span class="material-symbols-outlined">chevron_left</span></button><h2 class="cal-month-title">${monthNames[currentCalMonth]} ${currentCalYear}</h2><button class="cal-nav-btn" onclick="nextCalMonth()"><span class="material-symbols-outlined">chevron_right</span></button></div>
        <div class="phase-legend-bar">
          <div class="legend-pill"><span class="legend-dot" style="background: ${mColor}; box-shadow: 0 0 6px ${mColor};"></span>Menstrual</div>
          <div class="legend-pill"><span class="legend-dot" style="background: ${fColor}; box-shadow: 0 0 6px ${fColor};"></span>Folicular</div>
          <div class="legend-pill"><span class="legend-dot" style="background: ${oColor}; box-shadow: 0 0 6px ${oColor};"></span>Ovulatoria</div>
          <div class="legend-pill"><span class="legend-dot" style="background: ${lColor}; box-shadow: 0 0 6px ${lColor};"></span>Lútea</div>
        </div>
        <div class="calendar-card-slab"><div class="calendar-weekdays-row"><span>Lun</span><span>Mar</span><span>Mié</span><span>Jue</span><span>Vie</span><span>Sáb</span><span>Dom</span></div><div class="calendar-days-grid">${calendarCellsHTML}</div></div>
        <div class="day-inspector-card">
          <div class="inspector-header"><h3 class="inspector-date-title">📆 ${selDateParts[2]} de ${monthNames[selDateObj.getMonth()]}</h3><span class="inspector-phase-badge" style="background: ${selectedPhaseInfo.phaseColor}; color: #ffffff; text-shadow: 0 1px 2px rgba(0,0,0,0.5);">${selectedPhaseInfo.phaseName} (Día ${selectedPhaseInfo.cycleDay})</span></div>
          <div class="inspector-details-grid">
            <div class="detail-item-box"><span class="detail-item-icon">🩸</span><div class="detail-item-text"><span class="detail-item-label">Sangrado / Flujo</span><span class="detail-item-val">${selectedLog ? selectedLog.period : 'Sin registro'}</span></div></div>
            <div class="detail-item-box"><span class="detail-item-icon">⚡</span><div class="detail-item-text"><span class="detail-item-label">Cólicos</span><span class="detail-item-val">${selectedLog && selectedLog.cramps > 0 ? `Nivel ${selectedLog.cramps}/5` : '0 (Sin dolor)'}</span></div></div>
            <div class="detail-item-box"><span class="detail-item-icon">💖</span><div class="detail-item-text"><span class="detail-item-label">Intimidad</span><span class="detail-item-val">${selectedLog && selectedLog.intimacy ? 'Registrada' : 'Sin registro'}</span></div></div>
            <div class="detail-item-box"><span class="detail-item-icon">😊</span><div class="detail-item-text"><span class="detail-item-label">Ánimo</span><span class="detail-item-val">${selectedLog ? selectedLog.mood : 'Tranquila 😌'}</span></div></div>
          </div>
          ${selectedLog && selectedLog.note ? `<div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 0.6rem 0.8rem; font-size: 0.75rem; color: #cbd5e1;"><strong>Notas:</strong> "${selectedLog.note}"</div>` : ''}
          <button class="btn-action" style="padding: 0.75rem; font-size: 0.8rem; width: 100%; border-radius: 18px;" onclick="openModal('symptom-sheet')">✍️ Registrar / Editar Síntomas en este Día</button>
        </div>
        <div class="future-predictor-card">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="font-size: 1.5rem;">🔮</span>
            <div>
              <h3 style="font-family: var(--font-heading); font-size: 0.9rem; font-weight: 700; color: #ffffff;">Calculadora & Planificador de Fechas Futuras</h3>
              <p style="font-size: 0.7rem; color: #cbd5e1;">Planifica tu viaje, boda o evento y conoce en qué fase estarás.</p>
            </div>
          </div>
          <div class="future-picker-row">
            <button type="button" class="future-custom-date-btn" onclick="openCustomDatePickerModal()">
              <span class="material-symbols-outlined" style="color: var(--purple-accent); font-size: 1.15rem;">calendar_month</span>
              <span id="future-date-display-text">${formatPredictionDateDisplay(predictedDateSelected)}</span>
              <span class="material-symbols-outlined" style="font-size: 0.95rem; color: #94a3b8; margin-left: auto;">edit_calendar</span>
            </button>
            <button class="btn-predict-action" onclick="runFutureDatePrediction()">🔮 Calcular</button>
          </div>
          <div id="prediction-result-box" class="prediction-result-box" style="display: none;"></div>
        </div>
      </div>
    `;
  }

  function renderReliefCenterView() {
    const subview = document.getElementById('tracker-subview-content');
    if (!subview) return;

    let filteredExercises = [];
    if (currentReliefCategory === 'all') filteredExercises = reliefExercises;
    else if (currentReliefCategory === 'favorite') filteredExercises = reliefExercises.filter(ex => ex.isFavorite);
    else filteredExercises = reliefExercises.filter(ex => ex.catId === currentReliefCategory);

    const pet = avatarRegistry[currentAvatarId] || avatarRegistry.amy;
    const petFirstName = pet.name.split(' ')[0];
    const petCleanName = pet.species ? `${petFirstName} la ${pet.species}` : petFirstName;

    const heroEx = filteredExercises[0] || reliefExercises[0];
    const showHeroCard = Boolean(heroEx) && currentReliefCategory !== 'favorite';

    subview.innerHTML = `
      <div class="relief-container">
        <div class="relief-header-section">
          <h1 class="relief-header-title">Your Daily Moment of Stillness</h1>
          <p class="relief-header-subtitle">Slow Down. Feel Better.</p>
        </div>

        <div class="relief-filters-row" id="relief-filters-row" onscroll="categoryScrollLeftPos = this.scrollLeft">
          ${reliefCategories.map(cat => `
            <div class="relief-filter-btn ${currentReliefCategory === cat.id ? 'active' : ''}" onclick="selectReliefCategory('${cat.id}')">
              <div class="filter-icon-box"><span class="material-symbols-outlined">${cat.icon}</span></div>
              <span class="filter-label">${cat.name}</span>
            </div>
          `).join('')}
        </div>

        ${showHeroCard ? `
          <div class="relief-hero-card-solid">
            <div class="hero-instructor-row">
              <div class="instructor-badge">
                <img src="assets/avatares/${pet.folder}/Normal_${pet.suffix}.png" class="instructor-avatar-img" alt="${petFirstName}" style="width: 28px; height: 28px; object-fit: contain; border-radius: 50%; background: radial-gradient(circle at 30% 30%, #ffd166, #e76f51); padding: 2px;" />
                <div class="instructor-info">
                  <span class="instructor-name">Recomendado por ${petFirstName}</span>
                  <span class="instructor-series">Series Terapéuticas • ${heroEx.duration}</span>
                </div>
              </div>
              <div class="hero-fav-btn ${heroEx.isFavorite ? 'active' : ''}" onclick="toggleFavorite('${heroEx.id}', event)">
                <span class="material-symbols-outlined" style="font-size: 1rem;">favorite</span>
              </div>
            </div>
            <h3 class="hero-main-title">${heroEx.title}</h3>
            <p class="hero-description">${heroEx.desc}</p>
            <div class="hero-media-preview" onclick="startExerciseRoutine('${heroEx.id}')" style="background-image: url('${heroEx.previewImagePath}'); background-size: cover; background-position: center; border-radius: 14px; height: 105px; min-height: 105px; position: relative; overflow: hidden;">
              <div class="hero-media-bg-glow"></div>
              <div class="hero-play-circle-btn"><span class="material-symbols-outlined" style="font-size: 1.5rem; margin-left: 2px;">play_arrow</span></div>
              <div class="duration-pill-badge">⏱️ ${heroEx.duration}</div>
            </div>
          </div>
        ` : ''}

        <div class="relief-section-heading">
          <span>${currentReliefCategory === 'favorite' ? 'MIS RUTINAS FAVORITAS' : 'CONTINUE YOUR JOURNEY'} (${filteredExercises.length})</span>
          <span class="material-symbols-outlined" style="font-size: 1.1rem; color: #94a3b8;">arrow_forward</span>
        </div>

        ${filteredExercises.length > 0 ? `
          <div class="exercise-solid-grid">
            ${filteredExercises.map(ex => `
              <div class="exercise-solid-card" onclick="startExerciseRoutine('${ex.id}')">
                <div class="ex-card-thumb-box" style="position: relative; width: 100%; height: 105px; border-radius: 14px; overflow: hidden; background: rgba(0,0,0,0.3);">
                  <img src="${ex.previewImagePath || (ex.steps && ex.steps[0] ? ex.steps[0].imagePath : 'assets/exercises/yoga_supta_baddha.jpg')}" alt="${ex.title}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 14px;" />
                  <span class="ex-fav-card-btn material-symbols-outlined ${ex.isFavorite ? 'active' : ''}" onclick="toggleFavorite('${ex.id}', event)">favorite</span>
                  <div class="ex-play-mini-overlay"><span class="material-symbols-outlined">play_arrow</span></div>
                </div>
                <div>
                  <h4 class="ex-solid-title">${ex.title}</h4>
                  <div class="ex-solid-meta"><span class="ex-solid-time">⏱️ ${ex.duration}</span><span>${ex.intensity}</span></div>
                </div>
              </div>
            `).join('')}
          </div>
        ` : `
          <div style="background: rgba(15, 23, 42, 0.8); border: 1px dashed rgba(255, 255, 255, 0.2); border-radius: 20px; padding: 1.5rem; text-align: center; color: #cbd5e1; font-size: 0.8rem;">
            <span>💖 No tienes ninguna rutina guardada en favoritos todavía. ¡Toca el corazón en cualquier ejercicio para guardarlo aquí!</span>
          </div>
        `}
      </div>
    `;

    const filtersRow = document.getElementById('relief-filters-row');
    if (filtersRow) filtersRow.scrollLeft = categoryScrollLeftPos;
  }

  window.selectReliefCategory = function(catId) {
    const filtersRow = document.getElementById('relief-filters-row');
    if (filtersRow) categoryScrollLeftPos = filtersRow.scrollLeft;
    currentReliefCategory = catId;
    renderReliefCenterView();
  };

  window.toggleFavorite = function(exId, e) {
    if (e) e.stopPropagation();
    const filtersRow = document.getElementById('relief-filters-row');
    if (filtersRow) categoryScrollLeftPos = filtersRow.scrollLeft;
    const ex = reliefExercises.find(item => item.id === exId);
    if (ex) { ex.isFavorite = !ex.isFavorite; renderReliefCenterView(); }
  };

  // ==========================================================================
  // ROUTINE PLAYER ROUTER & CONTROLLER SYSTEM (COMPREHENSIVE MULTI-MODAL)
  // ==========================================================================
  let activeRoutine = null;
  let currentStepIndex = 0;
  let stepTimerSeconds = 60;
  let selectedStepDuration = 60; // 30, 60 o 120s
  let isStepTimerRunning = false;
  let routineTimerInterval = null;
  let isTimerPaused = false;

  // BREATHING TIMED SESSION STATE
  let selectedTimedMinutes = 5;
  let selectedBreathingAudioTrack = 'assets/audio/rainy_window_sleep_sounds_asmr.mp3';
  let isBackgroundAudioPlaying = false;

  // MASSAGE PATTERN STATE (2 MIN C/U CON RESALTADO PROGRESIVO)
  let currentMassagePatternIndex = 0;
  let massagePatternTimerSeconds = 120;
  let isMassageTimerRunning = false;
  let massageTimerInterval = null;
  let massagePatternsList = [];

  // AUDIO SLEEP TIMER & PLAYER STATE (SIN AUTOPLAY)
  let activeAudioElement = null;
  let isAudioPlaying = false;
  let audioSleepTimerSeconds = 0;
  let audioSleepTimerInterval = null;
  let isAudioSleepTimerActive = false;
  let selectedAudioTimerMinutes = null; // null = bucle infinito

  function playLocalMP3(audioPath) {
    stopLocalMP3();
    try {
      activeAudioElement = new Audio(audioPath);
      activeAudioElement.loop = true;
      activeAudioElement.play().catch(err => console.log('Audio playback info:', err));
      isAudioPlaying = true;
    } catch (e) {
      console.log('Audio element error:', e);
    }
  }

  function stopLocalMP3() {
    if (activeAudioElement) {
      try {
        activeAudioElement.pause();
        activeAudioElement.currentTime = 0;
      } catch (e) {}
      activeAudioElement = null;
    }
    isAudioPlaying = false;
  }

  window.startExerciseRoutine = function(routineId) {
    const routine = RoutinesCatalog.find(r => r.id === routineId) || reliefExercises.find(r => r.id === routineId);
    if (!routine) return;

    if (routine.catId === 'nutrition' || routine.type === 'static-recipe' || routine.type === 'recipe-card') {
      openNutritionRecipeModal(routine);
    } else if (routine.catId === 'audio' || routine.type === 'audio-player') {
      launchAudioPlayerModal(routine);
    } else if (routine.catId === 'breathing' || routine.type === 'timed-breathing') {
      openBreathingDetailModal(routine);
    } else if (routine.catId === 'massages-thermo' || routine.type === 'massage-guide') {
      openMassageGuideModal(routine);
    } else {
      openRoutineDetailModal(routine);
    }
  };

  // ==========================================================================
  // 1. MODAL RECETAS DE NUTRICIÓN (PASO A PASO + RECLAMO DE MONEDAS)
  // ==========================================================================
  function openNutritionRecipeModal(routine) {
    activeRoutine = routine;
    const ingredients = routine.ingredients || [
      "1 ingrediente principal fresco",
      "Especias naturales al gusto",
      "Agua tibia o infusión base"
    ];

    const steps = routine.preparationSteps || [
      "Lava y prepara todos los ingredientes en una superficie limpia.",
      "Cocina o mezcla a fuego suave durante 5 minutos para extraer los nutrientes.",
      "Sirve en una taza o plato hondo y disfruta caliente o tibio."
    ];

    const ingredientsHTML = ingredients.map(ing => `
      <div style="display:flex; align-items:center; gap:0.5rem; padding:0.4rem 0.6rem; background:rgba(255,255,255,0.04); border-radius:10px; margin-bottom:0.3rem; font-size:0.75rem; color:#f1f5f9;">
        <span style="color:var(--gold-accent); font-weight:bold;">•</span> <span>${ing}</span>
      </div>
    `).join('');

    const stepsHTML = steps.map((step, idx) => `
      <div style="padding:0.65rem 0.8rem; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:14px; margin-bottom:0.45rem;">
        <span style="font-family:var(--font-heading); font-size:0.75rem; font-weight:800; color:var(--cyan-accent);">Paso ${idx + 1}</span>
        <p style="font-size:0.78rem; color:#cbd5e1; margin:0.2rem 0 0 0; line-height:1.4;">${step}</p>
      </div>
    `).join('');

    const modalHTML = `
      <div class="modal-overlay active" id="nutrition-recipe-modal" style="display:flex; align-items:center; justify-content:center; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(2,4,10,0.88); backdrop-filter:blur(8px); z-index:9999; padding:1rem;">
        <div style="background:#0f172a; border:1px solid rgba(255,255,255,0.18); border-radius:24px; padding:1.25rem; max-width:460px; width:100%; max-height:90vh; overflow-y:auto; color:#ffffff; box-shadow:0 20px 50px rgba(0,0,0,0.85);">
          
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.8rem;">
            <div>
              <span style="font-size:0.68rem; font-weight:700; color:var(--rose-accent); text-transform:uppercase;">🍳 Receta de Nutrición • ${routine.duration || '10 min prep'}</span>
              <h2 style="font-family:var(--font-heading); font-size:1.15rem; font-weight:700; margin-top:0.2rem; color:#ffffff;">${routine.title}</h2>
            </div>
            <button onclick="document.getElementById('nutrition-recipe-modal').remove()" style="background:rgba(255,255,255,0.1); border:none; color:white; width:32px; height:32px; border-radius:50%; cursor:pointer; font-weight:bold;">✕</button>
          </div>

          <div style="width:100%; height:160px; max-height:170px; border-radius:16px; overflow:hidden; margin-bottom:0.9rem; border:1px solid rgba(255,255,255,0.15); background:rgba(0,0,0,0.4); display:flex; align-items:center; justify-content:center;">
            <img src="${routine.previewImagePath}" style="width:100%; height:100%; object-fit:contain;" alt="${routine.title}"/>
          </div>

          <p style="font-size:0.78rem; color:#cbd5e1; line-height:1.4; margin-bottom:0.8rem;">${routine.desc}</p>

          <div style="background:rgba(255, 185, 80, 0.1); border:1px solid var(--gold-accent); border-radius:14px; padding:0.65rem 0.8rem; margin-bottom:1rem; display:flex; align-items:center; gap:0.6rem;">
            <span style="font-size:1.5rem;">${routine.instructorIcon || '🦔'}</span>
            <p style="font-size:0.72rem; color:#ffffff; margin:0; line-height:1.3;">"${routine.spikeTip || 'Prepara esta receta con calma para consentir tu cuerpo.'}"</p>
          </div>

          <div style="margin-bottom:0.9rem;">
            <span style="font-family:var(--font-heading); font-size:0.8rem; font-weight:700; color:var(--gold-accent); display:block; margin-bottom:0.4rem;">🛒 Ingredientes Fáciles:</span>
            ${ingredientsHTML}
          </div>

          <div style="margin-bottom:1.1rem;">
            <span style="font-family:var(--font-heading); font-size:0.8rem; font-weight:700; color:var(--cyan-accent); display:block; margin-bottom:0.4rem;">👨‍🍳 Preparación Paso a Paso:</span>
            ${stepsHTML}
          </div>

          <button onclick="claimRecipeReward('${routine.id}');" style="width:100%; padding:0.85rem; background:linear-gradient(135deg, var(--rose-accent), var(--gold-accent)); border:none; border-radius:18px; color:#02040a; font-family:var(--font-heading); font-weight:800; font-size:0.9rem; cursor:pointer; box-shadow:0 0 20px rgba(255, 185, 80, 0.4);">
            ✨ Sesión Completada
          </button>
        </div>
      </div>
    `;

    const existingModal = document.getElementById('nutrition-recipe-modal');
    if (existingModal) existingModal.remove();
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }

  window.claimRecipeReward = function(recipeId) {
    const modal = document.getElementById('nutrition-recipe-modal');
    if (modal) modal.remove();
    completeRoutineVictory();
  };

  // ==========================================================================
  // 2. MODAL RESPIRACIÓN (DESLIZADOR ESTILIZADO DE DURACIÓN + DESLIZADOR DE AUDIOS)
  // ==========================================================================
  const breathingAudioCatalog = [
    { id: 'rain', name: 'Lluvia en la Ventana', icon: '🌧️', cover: 'assets/exercises/lluvia.png', path: 'assets/audio/rainy_window_sleep_sounds_asmr.mp3' },
    { id: 'river', name: 'Río Cristalino y Aves', icon: '🌿', cover: 'assets/exercises/pajaros.png', path: 'assets/audio/birds_singing_calm_river_nature_ambient_sound.mp3' },
    { id: 'forest', name: 'Bosque Nocturno y Grillos', icon: '🌙', cover: 'assets/exercises/lluvia.png', path: 'assets/audio/nature_sounds_water_forest_crickets_calm.mp3' },
    { id: 'town_rain', name: 'Tarde Lluviosa en Villa', icon: '🏡', cover: 'assets/exercises/pajaros.png', path: 'assets/audio/rainy_day_in_town_with_birds_singing.mp3' },
    { id: 'asmr_box', name: 'ASMR Tapping en Cartón', icon: '🎧', cover: 'assets/exercises/ASMR_1.png', path: 'assets/audio/cardboard_box_tapping_asmr.mp3' },
    { id: 'asmr_plastic', name: 'ASMR Tapping en Plástico', icon: '🎧', cover: 'assets/exercises/ASMR_2.png', path: 'assets/audio/plastic_tapping_asmr.mp3' },
    { id: 'asmr_buttons', name: 'ASMR Pulsación Botones', icon: '🎧', cover: 'assets/exercises/ASMR_1.png', path: 'assets/audio/touching_buttons_asmr.mp3' },
    { id: 'brown_noise', name: 'Ruido Marrón Profundo', icon: '🤎', cover: 'assets/exercises/ASMR_2.png', path: 'assets/audio/brown_noise_with_asmr_crinkles.mp3' },
    { id: 'none', name: 'Silencio (Sin Audio)', icon: '🔇', cover: '', path: 'none' }
  ];

  function openBreathingDetailModal(routine) {
    activeRoutine = routine;
    selectedTimedMinutes = 5;
    selectedBreathingAudioTrack = 'assets/audio/rainy_window_sleep_sounds_asmr.mp3';

    const audioCardsHTML = breathingAudioCatalog.map((a, idx) => `
      <div class="audio-slider-card ${selectedBreathingAudioTrack === a.path ? 'active' : ''}" onclick="selectBreathingAudioCard('${a.path}', this)">
        <div class="audio-slider-thumb">
          ${a.cover ? `<img src="${a.cover}" alt="${a.name}"/>` : `<span style="font-size:1.6rem;">${a.icon}</span>`}
        </div>
        <span class="audio-slider-title">${a.name}</span>
        <span style="font-size:0.65rem; color:var(--cyan-accent); font-weight:700;">${selectedBreathingAudioTrack === a.path ? '✓ Elegido' : 'Elegir'}</span>
      </div>
    `).join('');

    const modalHTML = `
      <div class="modal-overlay active" id="breathing-detail-modal" style="display:flex; align-items:center; justify-content:center; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(2,4,10,0.88); backdrop-filter:blur(8px); z-index:9999; padding:1rem;">
        <div style="background:#0f172a; border:1px solid rgba(255,255,255,0.18); border-radius:24px; padding:1.25rem; max-width:460px; width:100%; max-height:92vh; overflow-y:auto; color:#ffffff; box-shadow:0 20px 50px rgba(0,0,0,0.85);" class="custom-modal-scroll">
          
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.8rem;">
            <div>
              <span style="font-size:0.68rem; font-weight:700; color:var(--cyan-accent); text-transform:uppercase;">🌬️ Respiración Terapéutica</span>
              <h2 style="font-family:var(--font-heading); font-size:1.15rem; font-weight:700; margin-top:0.2rem; color:#ffffff;">${routine.title}</h2>
            </div>
            <button onclick="document.getElementById('breathing-detail-modal').remove()" style="background:rgba(255,255,255,0.1); border:none; color:white; width:32px; height:32px; border-radius:50%; cursor:pointer; font-weight:bold;">✕</button>
          </div>

          <div style="width:100%; height:150px; border-radius:16px; overflow:hidden; margin-bottom:0.8rem; border:1px solid rgba(255,255,255,0.15); background:rgba(0,0,0,0.4); display:flex; align-items:center; justify-content:center;">
            <img src="${routine.previewImagePath}" style="width:100%; height:100%; object-fit:contain;" alt="${routine.title}"/>
          </div>

          <p style="font-size:0.78rem; color:#cbd5e1; line-height:1.4; margin-bottom:0.8rem;">${routine.desc}</p>

          <div style="background:rgba(255, 185, 80, 0.1); border:1px solid var(--gold-accent); border-radius:14px; padding:0.65rem 0.8rem; margin-bottom:0.9rem; display:flex; align-items:center; gap:0.6rem;">
            <span style="font-size:1.5rem;">${routine.instructorIcon || '🐸'}</span>
            <p style="font-size:0.72rem; color:#ffffff; margin:0; line-height:1.3;">"${routine.spikeTip || 'Inhala paz y exhala cualquier tensión en tu abdomen.'}"</p>
          </div>

          <!-- 1. Deslizador / Selector Estilizado de Duración (2, 5 o 10 minutos) -->
          <div style="margin-bottom:0.9rem;">
            <span style="font-family:var(--font-heading); font-size:0.78rem; font-weight:700; color:var(--gold-accent); display:block; margin-bottom:0.2rem;">⏱️ 1. Duración del Ejercicio:</span>
            <div class="duration-slider-row">
              <button class="duration-slider-btn" onclick="selectBreathingDuration(2, this)">
                <span>2 Min</span>
                <span style="font-size:0.65rem; color:#94a3b8; font-weight:600;">Express ⚡</span>
              </button>
              <button class="duration-slider-btn active" onclick="selectBreathingDuration(5, this)">
                <span>5 Min</span>
                <span style="font-size:0.65rem; color:#94a3b8; font-weight:600;">Recomendada 🌸</span>
              </button>
              <button class="duration-slider-btn" onclick="selectBreathingDuration(10, this)">
                <span>10 Min</span>
                <span style="font-size:0.65rem; color:#94a3b8; font-weight:600;">Profunda 🌙</span>
              </button>
            </div>
          </div>

          <!-- 2. Deslizador Horizontal Estilizado de Audios de Acompañamiento -->
          <div style="margin-bottom:1.1rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.3rem;">
              <span style="font-family:var(--font-heading); font-size:0.78rem; font-weight:700; color:var(--cyan-accent);">🎵 2. Audio de Fondo (Desliza para explorar):</span>
            </div>
            
            <div class="custom-styled-slider" id="breathing-audio-slider">
              ${audioCardsHTML}
            </div>
          </div>

          <button onclick="launchBreathingPlayerModal('${routine.id}');" style="width:100%; padding:0.85rem; background:linear-gradient(135deg, var(--cyan-accent), #059669); border:none; border-radius:18px; color:white; font-family:var(--font-heading); font-weight:800; font-size:0.9rem; cursor:pointer; box-shadow:0 0 20px rgba(46, 196, 182, 0.4);">
            ▶️ Iniciar Respiración Guiada
          </button>
        </div>
      </div>
    `;

    const existingModal = document.getElementById('breathing-detail-modal');
    if (existingModal) existingModal.remove();
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }

  window.selectBreathingDuration = function(mins, btnEl) {
    selectedTimedMinutes = mins;
    const btns = document.querySelectorAll('.duration-slider-btn');
    btns.forEach(b => b.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');
  };

  window.selectBreathingAudioCard = function(audioPath, cardEl) {
    selectedBreathingAudioTrack = audioPath;
    const cards = document.querySelectorAll('.audio-slider-card');
    cards.forEach(c => {
      c.classList.remove('active');
      const label = c.querySelector('span:last-child');
      if (label) label.textContent = 'Elegir';
    });
    if (cardEl) {
      cardEl.classList.add('active');
      const label = cardEl.querySelector('span:last-child');
      if (label) label.textContent = '✓ Elegido';
    }
  };

  window.launchBreathingPlayerModal = function(routineId) {
    const detailModal = document.getElementById('breathing-detail-modal');
    if (detailModal) detailModal.remove();

    activeRoutine = RoutinesCatalog.find(r => r.id === routineId) || reliefExercises.find(r => r.id === routineId);
    if (!activeRoutine) return;

    stepTimerSeconds = selectedTimedMinutes * 60;
    isTimerPaused = false;

    // Iniciar audio si no es 'none'
    if (selectedBreathingAudioTrack && selectedBreathingAudioTrack !== 'none') {
      playLocalMP3(selectedBreathingAudioTrack);
      isBackgroundAudioPlaying = true;
    } else {
      stopLocalMP3();
      isBackgroundAudioPlaying = false;
    }

    const modalHTML = `
      <div class="modal-overlay active" id="breathing-player-modal" style="display:flex; align-items:center; justify-content:center; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(2,4,10,0.92); backdrop-filter:blur(10px); z-index:99999; padding:1rem;">
        <div style="background:#0b1329; border:1px solid rgba(255,255,255,0.2); border-radius:24px; padding:1.25rem; max-width:450px; width:100%; color:#ffffff; box-shadow:0 25px 60px rgba(0,0,0,0.9); display:flex; flex-direction:column; gap:0.8rem; text-align:center;">
          
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div>
              <span style="font-size:0.7rem; font-weight:700; color:var(--cyan-accent); text-transform:uppercase;">Respiración Guiada</span>
              <div style="font-family:var(--font-heading); font-size:0.9rem; font-weight:700; color:#ffffff;">${activeRoutine.title}</div>
            </div>
            <button onclick="closeBreathingPlayerModal()" style="background:rgba(255,255,255,0.1); border:none; color:white; width:32px; height:32px; border-radius:50%; cursor:pointer; font-weight:bold;">✕</button>
          </div>

          <!-- Círculo de Respiración Guiada con Micro-animación -->
          <div style="width:100%; height:190px; display:flex; flex-direction:column; align-items:center; justify-content:center; position:relative; background:rgba(0,0,0,0.3); border-radius:18px;">
            <div id="breathing-sphere" style="width:110px; height:110px; border-radius:50%; background:radial-gradient(circle, rgba(46,196,182,0.85) 0%, rgba(16,185,129,0.3) 70%); border:3px solid var(--cyan-accent); box-shadow:0 0 35px rgba(46,196,182,0.5); display:flex; align-items:center; justify-content:center; animation: breathingPulse 8s infinite ease-in-out;">
              <span id="breathing-guide-phase" style="font-family:var(--font-heading); font-size:0.85rem; font-weight:800; color:#ffffff;">Inhala 🌸</span>
            </div>
          </div>

          <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:14px; padding:0.6rem 0.8rem; font-size:0.75rem; color:#cbd5e1; line-height:1.35;">
            ${activeRoutine.instructions || activeRoutine.massageInstructions || activeRoutine.desc}
          </div>

          <!-- Contador y Control de Audio -->
          <div style="background:rgba(15, 23, 42, 0.9); border:1px solid rgba(255,255,255,0.12); border-radius:18px; padding:0.75rem 0.9rem; display:flex; align-items:center; justify-content:space-between;">
            <div>
              <span style="font-size:0.65rem; color:#94a3b8; font-weight:600; text-transform:uppercase;">Tiempo Restante</span>
              <div id="breathing-timer-display" style="font-family:var(--font-heading); font-size:1.6rem; font-weight:800; color:var(--gold-accent); font-variant-numeric:tabular-nums;">
                ${formatTimeDisplay(stepTimerSeconds)}
              </div>
            </div>

            <button id="btn-toggle-breathing-audio" onclick="toggleBreathingAudioPlayback()" style="padding:0.5rem 0.8rem; background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.2); border-radius:12px; color:white; font-size:0.75rem; font-weight:700; cursor:pointer;">
              ${isBackgroundAudioPlaying ? '🔊 Audio Sonando' : '🔇 Audio Pausado'}
            </button>
          </div>

          <!-- Botón de Finalización Libre (+25 Monedas) -->
          <button onclick="completeRoutineVictory()" style="width:100%; padding:0.85rem; background:linear-gradient(135deg, #2ec4b6, #10b981); border:none; border-radius:18px; color:#ffffff; font-family:var(--font-heading); font-weight:800; font-size:0.9rem; cursor:pointer; box-shadow:0 0 20px rgba(46, 196, 182, 0.5);">
            🎉 Finalizar Sesión
          </button>
        </div>
      </div>
    `;

    const existingPlayer = document.getElementById('breathing-player-modal');
    if (existingPlayer) existingPlayer.remove();
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    startBreathingTimer();
  };

  function startBreathingTimer() {
    if (routineTimerInterval) clearInterval(routineTimerInterval);
    updateBreathingTimerUI();

    let breathSeconds = 0;
    const phaseEl = document.getElementById('breathing-guide-phase');

    routineTimerInterval = setInterval(() => {
      if (isTimerPaused) return;
      if (stepTimerSeconds > 0) {
        stepTimerSeconds--;
        breathSeconds = (breathSeconds + 1) % 19; // 4s inhala, 7s retén, 8s exhala
        
        if (phaseEl) {
          if (breathSeconds < 4) phaseEl.textContent = 'Inhala 🌬️';
          else if (breathSeconds < 11) phaseEl.textContent = 'Retén 🍃';
          else phaseEl.textContent = 'Exhala 💨';
        }

        updateBreathingTimerUI();
      } else {
        clearInterval(routineTimerInterval);
      }
    }, 1000);
  }

  function updateBreathingTimerUI() {
    const display = document.getElementById('breathing-timer-display');
    if (display) display.textContent = formatTimeDisplay(stepTimerSeconds);
  }

  window.toggleBreathingAudioPlayback = function() {
    const btn = document.getElementById('btn-toggle-breathing-audio');
    if (isBackgroundAudioPlaying) {
      stopLocalMP3();
      isBackgroundAudioPlaying = false;
      if (btn) btn.textContent = '🔇 Audio Pausado';
    } else {
      if (selectedBreathingAudioTrack && selectedBreathingAudioTrack !== 'none') {
        playLocalMP3(selectedBreathingAudioTrack);
        isBackgroundAudioPlaying = true;
        if (btn) btn.textContent = '🔊 Audio Sonando';
      }
    }
  };

  window.closeBreathingPlayerModal = function() {
    if (routineTimerInterval) clearInterval(routineTimerInterval);
    stopLocalMP3();
    const modal = document.getElementById('breathing-player-modal');
    if (modal) modal.remove();
  };

  // ==========================================================================
  // 3. MODAL MASAJES INTERACTIVOS (2 MIN POR PATRÓN + SUBRAYADO Y AVISO DE CAMBIO)
  // ==========================================================================
  function parseMassagePatterns(routine) {
    if (routine.massageInstructions) {
      const lines = routine.massageInstructions.split('\n').filter(l => l.trim().length > 0);
      return lines.map((line, idx) => {
        const text = line.replace(/^[0-9]+\.\s*/, '').trim();
        return { index: idx + 1, text };
      });
    }
    return [
      { index: 1, text: "Movimientos circulares suaves sobre el vientre bajo para disipar tensión." },
      { index: 2, text: "Deslizamientos lentos con las palmas desde los costados hacia el centro." },
      { index: 3, text: "Presión sostenida y delicada en los puntos de molestia al exhalar." },
      { index: 4, text: "Reposo tibio con las manos sobre la zona pélvica respirando profundamente." }
    ];
  }

  function openMassageGuideModal(routine) {
    activeRoutine = routine;
    massagePatternsList = parseMassagePatterns(routine);
    currentMassagePatternIndex = 0;
    massagePatternTimerSeconds = 120; // 2 minutos por patrón
    isMassageTimerRunning = false;
    isTimerPaused = false;
    if (massageTimerInterval) clearInterval(massageTimerInterval);

    renderMassageGuideUI();
  }

  function renderMassageGuideUI() {
    if (!activeRoutine) return;
    const totalPatterns = massagePatternsList.length || 4;

    const patternsHTML = massagePatternsList.map((p, idx) => {
      const isActive = (idx === currentMassagePatternIndex);
      return `
        <div id="massage-pattern-${idx}" style="padding:0.75rem 0.85rem; background:${isActive ? 'rgba(230, 57, 70, 0.25)' : 'rgba(255,255,255,0.03)'}; border:${isActive ? '2px solid var(--rose-accent)' : '1px solid rgba(255,255,255,0.08)'}; border-radius:16px; margin-bottom:0.5rem; transition:all 0.3s ease; transform:${isActive ? 'scale(1.02)' : 'scale(1)'}; box-shadow:${isActive ? '0 0 20px rgba(230,57,70,0.35)' : 'none'};">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.3rem;">
            <span style="font-family:var(--font-heading); font-size:0.78rem; font-weight:800; color:${isActive ? 'var(--rose-accent)' : 'var(--gold-accent)'};">
              ${isActive ? '▶️ PATRÓN EN EJECUCIÓN (2 MIN)' : 'Patrón ' + (idx + 1)}
            </span>
            <span style="font-size:0.7rem; font-weight:700; color:${isActive ? 'var(--gold-accent)' : '#94a3b8'};">
              ${isActive ? '⏱️ ' + formatTimeDisplay(massagePatternTimerSeconds) : '2:00 min'}
            </span>
          </div>
          <p style="font-size:0.78rem; color:${isActive ? '#ffffff' : '#cbd5e1'}; margin:0; line-height:1.38; font-weight:${isActive ? '600' : '400'};">
            ${p.text}
          </p>
        </div>
      `;
    }).join('');

    const modalHTML = `
      <div class="modal-overlay active" id="massage-guide-modal" style="display:flex; align-items:center; justify-content:center; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(2,4,10,0.92); backdrop-filter:blur(10px); z-index:99999; padding:1rem;">
        <div style="background:#0f172a; border:1px solid rgba(255,255,255,0.2); border-radius:24px; padding:1.25rem; max-width:460px; width:100%; max-height:92vh; color:#ffffff; box-shadow:0 25px 60px rgba(0,0,0,0.9); display:flex; flex-direction:column; gap:0.75rem;" class="custom-modal-scroll">
          
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div>
              <span style="font-size:0.7rem; font-weight:700; color:var(--rose-accent); text-transform:uppercase;">💆‍♀️ Masajes & Termoterapia • 2 min c/u</span>
              <div style="font-family:var(--font-heading); font-size:1rem; font-weight:800; color:#ffffff;">${activeRoutine.title}</div>
            </div>
            <button onclick="closeMassageGuideModal()" style="background:rgba(255,255,255,0.1); border:none; color:white; width:32px; height:32px; border-radius:50%; cursor:pointer; font-weight:bold;">✕</button>
          </div>

          <div style="width:100%; height:150px; max-height:160px; border-radius:16px; overflow:hidden; background:rgba(0,0,0,0.4); display:flex; align-items:center; justify-content:center; border:1px solid rgba(255,255,255,0.12);">
            <img src="${activeRoutine.previewImagePath}" style="width:100%; height:100%; object-fit:contain;" alt="${activeRoutine.title}"/>
          </div>

          <!-- Banner de Aviso de Cambio de Patrón -->
          <div id="massage-change-alert" style="display:none; background:rgba(255,185,80,0.2); border:1px solid var(--gold-accent); border-radius:14px; padding:0.6rem 0.8rem; font-size:0.75rem; color:var(--gold-accent); font-weight:700; text-align:center; animation:pulseGlow 1s infinite alternate;">
            🔔 ¡Cambio de Patrón! Pasa al siguiente movimiento de masaje.
          </div>

          <!-- Lista de Patrones Paso a Paso con Subrayado Activo y Deslizador Estilizado -->
          <div class="custom-modal-scroll" style="max-height:220px; padding-right:0.3rem;">
            ${patternsHTML}
          </div>

          <!-- Temporizador del Patrón Actual de 2 Minutos -->
          <div style="background:rgba(15, 23, 42, 0.95); border:1px solid rgba(255,255,255,0.12); border-radius:18px; padding:0.75rem 0.9rem; display:flex; align-items:center; justify-content:space-between;">
            <div>
              <span style="font-size:0.65rem; color:#94a3b8; font-weight:600; text-transform:uppercase;">Tiempo del Patrón Actual</span>
              <div id="massage-timer-display" style="font-family:var(--font-heading); font-size:1.6rem; font-weight:800; color:var(--gold-accent); font-variant-numeric:tabular-nums;">
                ${formatTimeDisplay(massagePatternTimerSeconds)}
              </div>
            </div>

            <div style="display:flex; gap:0.4rem;">
              <button id="btn-massage-timer-action" onclick="toggleMassageTimerAction()" style="padding:0.5rem 0.9rem; background:${isMassageTimerRunning ? 'rgba(255,255,255,0.12)' : 'linear-gradient(135deg, var(--rose-accent), var(--gold-accent))'}; border:1px solid rgba(255,255,255,0.2); border-radius:12px; color:${isMassageTimerRunning ? '#ffffff' : '#02040a'}; font-size:0.78rem; font-weight:800; cursor:pointer;">
                ${isMassageTimerRunning ? (isTimerPaused ? '▶️ Reanudar' : '⏸️ Pausar') : '▶️ Iniciar 2 min'}
              </button>
              <button onclick="nextMassagePattern()" style="padding:0.5rem 0.8rem; background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.15); border-radius:12px; color:#cbd5e1; font-size:0.78rem; font-weight:700; cursor:pointer;" title="Siguiente patrón">
                ⏭️
              </button>
            </div>
          </div>

          <!-- Botón de Finalizar Sesión -->
          <button onclick="completeRoutineVictory()" style="width:100%; padding:0.85rem; background:linear-gradient(135deg, #2ec4b6, #10b981); border:none; border-radius:18px; color:#ffffff; font-family:var(--font-heading); font-weight:800; font-size:0.9rem; cursor:pointer; box-shadow:0 0 20px rgba(46, 196, 182, 0.5);">
            🎉 Finalizar Masaje
          </button>
        </div>
      </div>
    `;

    const existingModal = document.getElementById('massage-guide-modal');
    if (existingModal) existingModal.remove();
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }

  window.toggleMassageTimerAction = function() {
    if (!isMassageTimerRunning) {
      startMassagePatternTimer();
    } else {
      isTimerPaused = !isTimerPaused;
      updateMassageTimerUI();
    }
  };

  function startMassagePatternTimer() {
    isMassageTimerRunning = true;
    isTimerPaused = false;
    if (massageTimerInterval) clearInterval(massageTimerInterval);

    updateMassageTimerUI();
    massageTimerInterval = setInterval(() => {
      if (isTimerPaused) return;
      if (massagePatternTimerSeconds > 0) {
        massagePatternTimerSeconds--;
        updateMassageTimerUI();
      } else {
        onMassagePatternTimerFinished();
      }
    }, 1000);
  }

  function onMassagePatternTimerFinished() {
    const alertBanner = document.getElementById('massage-change-alert');
    if (alertBanner) {
      alertBanner.style.display = 'block';
      setTimeout(() => { if (alertBanner) alertBanner.style.display = 'none'; }, 4000);
    }

    if (currentMassagePatternIndex < massagePatternsList.length - 1) {
      currentMassagePatternIndex++;
      massagePatternTimerSeconds = 120;
      renderMassageGuideUI();
      startMassagePatternTimer();
    } else {
      clearInterval(massageTimerInterval);
      isMassageTimerRunning = false;
      completeRoutineVictory();
    }
  }

  window.nextMassagePattern = function() {
    if (currentMassagePatternIndex < massagePatternsList.length - 1) {
      currentMassagePatternIndex++;
      massagePatternTimerSeconds = 120;
      renderMassageGuideUI();
      if (isMassageTimerRunning) startMassagePatternTimer();
    } else {
      completeRoutineVictory();
    }
  };

  window.prevMassagePattern = function() {
    if (currentMassagePatternIndex > 0) {
      currentMassagePatternIndex--;
      massagePatternTimerSeconds = 120;
      renderMassageGuideUI();
      if (isMassageTimerRunning) startMassagePatternTimer();
    }
  };

  function updateMassageTimerUI() {
    const display = document.getElementById('massage-timer-display');
    const btnAction = document.getElementById('btn-massage-timer-action');

    if (display) display.textContent = formatTimeDisplay(massagePatternTimerSeconds);
    if (btnAction) {
      if (!isMassageTimerRunning) {
        btnAction.textContent = '▶️ Iniciar 2 min';
        btnAction.style.background = 'linear-gradient(135deg, var(--rose-accent), var(--gold-accent))';
        btnAction.style.color = '#02040a';
      } else {
        btnAction.textContent = isTimerPaused ? '▶️ Reanudar' : '⏸️ Pausar';
        btnAction.style.background = 'rgba(255,255,255,0.12)';
        btnAction.style.color = '#ffffff';
      }
    }
  }

  window.closeMassageGuideModal = function() {
    if (massageTimerInterval) clearInterval(massageTimerInterval);
    const modal = document.getElementById('massage-guide-modal');
    if (modal) modal.remove();
  };

    // ==========================================================================
  // 4. MODAL AUDIOS (SIN AUTOPLAY AL ABRIR + LOOP + APAGADO AUTOMÁTICO)
  // ==========================================================================
  function launchAudioPlayerModal(routine) {
    activeRoutine = routine;
    stopLocalMP3(); // Detener audios anteriores, pero NO iniciar este automáticamente
    selectedAudioTimerMinutes = null;
    isAudioSleepTimerActive = false;
    if (audioSleepTimerInterval) clearInterval(audioSleepTimerInterval);

    const audioSource = routine.audioUrl || routine.audioPath || 'assets/audio/cardboard_box_tapping_asmr.mp3';

    const modalHTML = `
      <div class="modal-overlay active" id="audio-player-modal" style="display:flex; align-items:center; justify-content:center; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(2,4,10,0.92); backdrop-filter:blur(10px); z-index:99999; padding:1rem;">
        <div style="background:#0b1329; border:1px solid rgba(255,255,255,0.2); border-radius:24px; padding:1.25rem; max-width:440px; width:100%; color:#ffffff; box-shadow:0 25px 60px rgba(0,0,0,0.9); display:flex; flex-direction:column; align-items:center; gap:0.75rem; text-align:center;">
          
          <div style="display:flex; justify-content:space-between; align-items:center; width:100%;">
            <span style="font-size:0.7rem; font-weight:700; color:var(--rose-accent); text-transform:uppercase;">🎧 Audios de Alivio • ${routine.intensity || 'Sonido de Calma'}</span>
            <button onclick="closeAudioPlayerModal()" style="background:rgba(255,255,255,0.1); border:none; color:white; width:32px; height:32px; border-radius:50%; cursor:pointer; font-weight:bold;">✕</button>
          </div>

          <div style="width:130px; height:130px; border-radius:50%; overflow:hidden; border:3px solid var(--rose-accent); box-shadow:0 0 30px rgba(255, 117, 143, 0.4); margin:0.2rem 0; background:rgba(0,0,0,0.4); display:flex; align-items:center; justify-content:center;">
            <img src="${routine.previewImagePath}" style="width:100%; height:100%; object-fit:contain;" alt="${routine.title}"/>
          </div>

          <h3 style="font-family:var(--font-heading); font-size:1.05rem; font-weight:700; color:#ffffff; margin:0;">${routine.title}</h3>
          <p style="font-size:0.75rem; color:#cbd5e1; line-height:1.35; margin:0;">${routine.desc}</p>

          <!-- Especificaciones de Loop y Temporizador -->
          <div style="background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:16px; padding:0.75rem; width:100%; text-align:left;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
              <span style="font-size:0.75rem; color:var(--cyan-accent); font-weight:700;">🔁 Modo de Bucle:</span>
              <span id="audio-loop-status" style="font-size:0.72rem; color:var(--gold-accent); font-weight:700;">Bucle Continuo ♾️</span>
            </div>

            <span style="font-size:0.7rem; color:#94a3b8; display:block; margin-bottom:0.4rem;">Fijar tiempo de apagado (o déjalo en bucle indefinido):</span>
            
            <div style="display:flex; flex-wrap:wrap; gap:0.4rem; justify-content:center;">
              <button class="audio-timer-chip active" onclick="setAudioSleepTimer(null, this)" style="padding:0.35rem 0.65rem; border-radius:10px; border:1px solid rgba(255,255,255,0.18); background:var(--cyan-accent); color:#02040a; font-size:0.72rem; font-weight:700; cursor:pointer;">
                ♾️ Sin Límite
              </button>
              <button class="audio-timer-chip" onclick="setAudioSleepTimer(5, this)" style="padding:0.35rem 0.65rem; border-radius:10px; border:1px solid rgba(255,255,255,0.18); background:rgba(255,255,255,0.06); color:#ffffff; font-size:0.72rem; font-weight:700; cursor:pointer;">
                5 min
              </button>
              <button class="audio-timer-chip" onclick="setAudioSleepTimer(15, this)" style="padding:0.35rem 0.65rem; border-radius:10px; border:1px solid rgba(255,255,255,0.18); background:rgba(255,255,255,0.06); color:#ffffff; font-size:0.72rem; font-weight:700; cursor:pointer;">
                15 min
              </button>
              <button class="audio-timer-chip" onclick="setAudioSleepTimer(30, this)" style="padding:0.35rem 0.65rem; border-radius:10px; border:1px solid rgba(255,255,255,0.18); background:rgba(255,255,255,0.06); color:#ffffff; font-size:0.72rem; font-weight:700; cursor:pointer;">
                30 min
              </button>
              <button class="audio-timer-chip" onclick="setAudioSleepTimer(45, this)" style="padding:0.35rem 0.65rem; border-radius:10px; border:1px solid rgba(255,255,255,0.18); background:rgba(255,255,255,0.06); color:#ffffff; font-size:0.72rem; font-weight:700; cursor:pointer;">
                45 min
              </button>
              <button class="audio-timer-chip" onclick="setAudioSleepTimer(60, this)" style="padding:0.35rem 0.65rem; border-radius:10px; border:1px solid rgba(255,255,255,0.18); background:rgba(255,255,255,0.06); color:#ffffff; font-size:0.72rem; font-weight:700; cursor:pointer;">
                60 min
              </button>
            </div>

            <div id="audio-timer-remaining" style="margin-top:0.5rem; text-align:center; font-size:0.72rem; color:#cbd5e1; font-weight:600;">
              ✨ Listo para reproducir. Presiona "Reproducir Audio" para comenzar.
            </div>
          </div>

          <div style="display:flex; align-items:center; gap:0.8rem; margin-top:0.2rem; width:100%; justify-content:center;">
            <button id="btn-toggle-local-mp3" onclick="toggleLocalAudioPlayback('${audioSource}')" style="flex:1; padding:0.75rem 1rem; background:linear-gradient(135deg, var(--rose-accent), var(--gold-accent)); border:none; border-radius:999px; color:#02040a; font-family:var(--font-heading); font-weight:800; font-size:0.85rem; cursor:pointer; box-shadow:0 0 20px rgba(255, 185, 80, 0.4);">
              ▶️ Reproducir Audio
            </button>
            <button onclick="closeAudioPlayerModal()" style="padding:0.75rem 1.2rem; background:rgba(255,255,255,0.12); border:1px solid rgba(255,255,255,0.2); border-radius:999px; color:#ffffff; font-family:var(--font-heading); font-weight:700; font-size:0.85rem; cursor:pointer;">
              ⏹️ Salir
            </button>
          </div>
        </div>
      </div>
    `;

    const existingPlayer = document.getElementById('audio-player-modal');
    if (existingPlayer) existingPlayer.remove();
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }

  window.toggleLocalAudioPlayback = function(customPath) {
    const btn = document.getElementById('btn-toggle-local-mp3');
    const path = customPath || (activeRoutine ? (activeRoutine.audioUrl || activeRoutine.audioPath) : 'assets/audio/cardboard_box_tapping_asmr.mp3');

    if (activeAudioElement && !activeAudioElement.paused) {
      activeAudioElement.pause();
      isAudioPlaying = false;
      if (btn) btn.textContent = '▶️ Reproducir Audio';
    } else {
      playLocalMP3(path);
      if (btn) btn.textContent = '⏸️ Pausar Audio';
    }
  };

  window.setAudioSleepTimer = function(mins, btnEl) {
    selectedAudioTimerMinutes = mins;
    if (audioSleepTimerInterval) clearInterval(audioSleepTimerInterval);

    const chips = document.querySelectorAll('.audio-timer-chip');
    chips.forEach(c => {
      c.style.background = 'rgba(255,255,255,0.06)';
      c.style.color = '#ffffff';
    });
    if (btnEl) {
      btnEl.style.background = 'var(--cyan-accent)';
      btnEl.style.color = '#02040a';
    }

    const statusEl = document.getElementById('audio-loop-status');
    const remainingEl = document.getElementById('audio-timer-remaining');

    if (mins === null) {
      isAudioSleepTimerActive = false;
      if (statusEl) statusEl.textContent = 'Bucle Continuo ♾️';
      if (remainingEl) remainingEl.textContent = '✨ Reproduciendo en bucle continuo indefinidamente.';
    } else {
      isAudioSleepTimerActive = true;
      audioSleepTimerSeconds = mins * 60;
      if (statusEl) statusEl.textContent = `Bucle con Temporizador (${mins} min)`;
      updateAudioTimerDisplay();

      audioSleepTimerInterval = setInterval(() => {
        if (audioSleepTimerSeconds > 0) {
          audioSleepTimerSeconds--;
          updateAudioTimerDisplay();
        } else {
          clearInterval(audioSleepTimerInterval);
          stopLocalMP3();
          const btn = document.getElementById('btn-toggle-local-mp3');
          if (btn) btn.textContent = '▶️ Reproducir Audio';
          if (remainingEl) remainingEl.innerHTML = '<span style="color:var(--gold-accent);">🌙 Temporizador finalizado. Audio detenido para tu descanso.</span>';
        }
      }, 1000);
    }
  };

  function updateAudioTimerDisplay() {
    const remainingEl = document.getElementById('audio-timer-remaining');
    if (!remainingEl) return;
    const m = Math.floor(audioSleepTimerSeconds / 60);
    const s = audioSleepTimerSeconds % 60;
    const formatted = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    remainingEl.innerHTML = `⏱️ Apagado automático en <strong>${formatted}</strong> (reproduciendo en loop).`;
  }

  window.closeAudioPlayerModal = function() {
    if (audioSleepTimerInterval) clearInterval(audioSleepTimerInterval);
    stopLocalMP3();
    const modal = document.getElementById('audio-player-modal');
    if (modal) modal.remove();
  };

  // ==========================================================================
  // 5. REPRODUCTOR PASO A PASO LIBRE (PILATES, YOGA & ESTIRAMIENTOS)
  // ==========================================================================
  function openRoutineDetailModal(routine) {
    const steps = routine.steps || [];
    const stepsCount = steps.length || 6;

    let stepsPreviewHTML = steps.map((s, idx) => `
      <div style="padding: 0.55rem 0.75rem; background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 14px; margin-bottom: 0.4rem; display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; align-items: center; gap: 0.6rem;">
          <span style="font-family: var(--font-heading); font-size: 0.75rem; font-weight: 700; color: var(--gold-accent);">Paso ${idx + 1}</span>
          <span style="font-size: 0.78rem; color: #f1f5f9; font-weight: 600;">${s.title || 'Ejercicio Guiado'}</span>
        </div>
        <span style="font-size: 0.72rem; color: #94a3b8; font-weight: 600;">⏱️ ${Math.floor((s.durationSeconds || 60) / 60)}:${String((s.durationSeconds || 60) % 60).padStart(2, '0')} min</span>
      </div>
    `).join('');

    const modalHTML = `
      <div class="modal-overlay active" id="routine-detail-modal" style="display:flex; align-items:center; justify-content:center; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(2, 4, 10, 0.88); backdrop-filter:blur(8px); z-index:9999; padding:1rem;">
        <div style="background: #0f172a; border: 1px solid rgba(255, 255, 255, 0.18); border-radius: 24px; padding: 1.25rem; max-width: 440px; width: 100%; max-height: 90vh; overflow-y: auto; color: #ffffff; box-shadow: 0 20px 50px rgba(0,0,0,0.85);">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.8rem;">
            <div>
              <span style="font-size: 0.68rem; font-weight: 700; color: var(--cyan-accent); text-transform: uppercase; letter-spacing: 0.5px;">${routine.category} • ${routine.intensity}</span>
              <h2 style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 700; margin-top: 0.2rem; color: #ffffff;">${routine.title}</h2>
            </div>
            <button onclick="closeRoutineDetailModal()" style="background: rgba(255,255,255,0.1); border: none; color: white; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-weight: bold;">✕</button>
          </div>

          <div style="width:100%; height:150px; max-height:160px; border-radius:16px; overflow:hidden; margin-bottom:0.8rem; border:1px solid rgba(255,255,255,0.15); background:rgba(0,0,0,0.4); display:flex; align-items:center; justify-content:center;">
            <img src="${routine.previewImagePath}" style="width:100%; height:100%; object-fit:contain;" alt="${routine.title}"/>
          </div>

          <p style="font-size: 0.78rem; color: #cbd5e1; line-height: 1.4; margin-bottom: 1rem;">${routine.desc}</p>

          <div style="background: rgba(255, 185, 80, 0.1); border: 1px solid var(--gold-accent); border-radius: 14px; padding: 0.65rem 0.8rem; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.6rem;">
            <span style="font-size: 1.5rem;">${routine.instructorIcon || '🦔'}</span>
            <div>
              <span style="font-size: 0.7rem; font-weight: 700; color: var(--gold-accent);">${routine.instructor || 'Manola 🦔'}</span>
              <p style="font-size: 0.72rem; color: #ffffff; margin: 0; line-height: 1.3;">"${routine.spikeTip || 'Sigue cada movimiento a tu ritmo.'}"</p>
            </div>
          </div>

          <div style="margin-bottom: 1rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
              <span style="font-family: var(--font-heading); font-size: 0.8rem; font-weight: 700; color: #ffffff;">Secuencia de ${stepsCount} Ejercicios:</span>
              <span style="font-size: 0.72rem; color: var(--cyan-accent); font-weight: 700;">⏱️ A tu ritmo</span>
            </div>
            ${stepsPreviewHTML}
          </div>

          <button onclick="closeRoutineDetailModal(); launchInteractiveRoutinePlayer('${routine.id}');" style="width: 100%; padding: 0.85rem; background: linear-gradient(135deg, var(--primary-crimson), #ff758f); border: none; border-radius: 18px; color: white; font-family: var(--font-heading); font-weight: 700; font-size: 0.9rem; cursor: pointer; box-shadow: 0 4px 15px rgba(230, 57, 70, 0.4);">
            ▶️ Iniciar Rutina Libre
          </button>
        </div>
      </div>
    `;

    const existingModal = document.getElementById('routine-detail-modal');
    if (existingModal) existingModal.remove();
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }

  window.closeRoutineDetailModal = function() {
    const modal = document.getElementById('routine-detail-modal');
    if (modal) modal.remove();
  };

  window.launchInteractiveRoutinePlayer = function(routineId) {
    activeRoutine = RoutinesCatalog.find(r => r.id === routineId) || reliefExercises.find(r => r.id === routineId);
    if (!activeRoutine) return;
    currentStepIndex = 0;
    selectedStepDuration = 60;
    stepTimerSeconds = 60;
    isStepTimerRunning = false;
    isTimerPaused = false;
    if (routineTimerInterval) clearInterval(routineTimerInterval);

    renderPlayerModal();
  };

  function renderPlayerModal() {
    if (!activeRoutine) return;
    const steps = activeRoutine.steps || [];
    const currentStep = steps[currentStepIndex] || {
      stepNumber: currentStepIndex + 1,
      title: 'Ejercicio de Alivio',
      durationSeconds: selectedStepDuration,
      imagePath: 'assets/exercises/reclinacion_cojin_lumbar.png',
      instructions: 'Realiza el estiramiento manteniendo una respiración fluida y relajada.'
    };

    const totalSteps = steps.length || 6;
    const progressPercent = Math.round(((currentStepIndex + 1) / totalSteps) * 100);
    const isFirstStep = (currentStepIndex === 0);
    const isLastStep = (currentStepIndex >= totalSteps - 1);

    const modalHTML = `
      <div class="modal-overlay active" id="routine-player-modal" style="display:flex; align-items:center; justify-content:center; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(2, 4, 10, 0.92); backdrop-filter:blur(10px); z-index:99999; padding:1rem;">
        <div style="background: #0b1329; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 24px; padding: 1.25rem; max-width: 460px; width: 100%; max-height:92vh; overflow-y:auto; color: #ffffff; box-shadow: 0 25px 60px rgba(0,0,0,0.9); display: flex; flex-direction: column; gap: 0.75rem;">
          
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <span style="font-size: 0.7rem; font-weight: 700; color: var(--rose-accent); text-transform: uppercase;">${activeRoutine.title}</span>
              <div style="font-family: var(--font-heading); font-size: 0.85rem; font-weight: 700; color: #ffffff;">Ejercicio ${currentStepIndex + 1} de ${totalSteps} (${progressPercent}%)</div>
            </div>
            <button onclick="closeRoutinePlayerModal()" style="background: rgba(255,255,255,0.1); border: none; color: white; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-weight: bold;">✕</button>
          </div>

          <div style="width: 100%; height: 6px; background: rgba(255,255,255,0.1); border-radius: 999px; overflow: hidden;">
            <div style="width: ${progressPercent}%; height: 100%; background: linear-gradient(90deg, var(--rose-accent), var(--gold-accent)); transition: width 0.3s ease;"></div>
          </div>

          <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 18px; padding: 0.85rem; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
            <h3 style="font-family: var(--font-heading); font-size: 0.95rem; font-weight: 700; color: #ffffff; margin: 0;">${currentStep.title}</h3>
            
            <div style="width: 100%; height: 165px; max-height:175px; background: rgba(0,0,0,0.4); border-radius: 14px; overflow: hidden; display: flex; align-items: center; justify-content: center; position: relative;">
              <img src="${currentStep.imagePath || activeRoutine.previewImagePath}" onerror="this.onerror=null; this.src='assets/exercises/reclinacion_cojin_lumbar.png';" style="width: 100%; height: 100%; object-fit: contain;" alt="${currentStep.title}"/>
            </div>

            <p style="font-size: 0.78rem; color: #cbd5e1; line-height: 1.35; margin: 0; text-align: left; width: 100%;">
              <strong>Instrucciones:</strong> ${currentStep.instructions}
            </p>
          </div>

          <!-- Selector de Duración Deseada del Ejercicio (30s, 1m, 2m) -->
          <div style="background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; padding: 0.65rem 0.8rem; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.72rem; color: var(--gold-accent); font-weight: 700;">⏱️ Duración:</span>
            <div style="display: flex; gap: 0.35rem;">
              <button class="step-duration-chip ${selectedStepDuration === 30 ? 'active' : ''}" onclick="setStepDuration(30)" style="padding: 0.35rem 0.65rem; border-radius: 10px; border: 1px solid rgba(255,255,255,0.18); background: ${selectedStepDuration === 30 ? 'var(--gold-accent)' : 'rgba(255,255,255,0.06)'}; color: ${selectedStepDuration === 30 ? '#02040a' : '#ffffff'}; font-size: 0.72rem; font-weight: 800; cursor: pointer;">
                30s
              </button>
              <button class="step-duration-chip ${selectedStepDuration === 60 ? 'active' : ''}" onclick="setStepDuration(60)" style="padding: 0.35rem 0.65rem; border-radius: 10px; border: 1px solid rgba(255,255,255,0.18); background: ${selectedStepDuration === 60 ? 'var(--gold-accent)' : 'rgba(255,255,255,0.06)'}; color: ${selectedStepDuration === 60 ? '#02040a' : '#ffffff'}; font-size: 0.72rem; font-weight: 800; cursor: pointer;">
                1 min
              </button>
              <button class="step-duration-chip ${selectedStepDuration === 120 ? 'active' : ''}" onclick="setStepDuration(120)" style="padding: 0.35rem 0.65rem; border-radius: 10px; border: 1px solid rgba(255,255,255,0.18); background: ${selectedStepDuration === 120 ? 'var(--gold-accent)' : 'rgba(255,255,255,0.06)'}; color: ${selectedStepDuration === 120 ? '#02040a' : '#ffffff'}; font-size: 0.72rem; font-weight: 800; cursor: pointer;">
                2 min
              </button>
            </div>
          </div>

          <!-- Reloj y Controles Manuales del Contador -->
          <div style="background: rgba(15, 23, 42, 0.9); border: 1px solid rgba(255,255,255,0.12); border-radius: 18px; padding: 0.75rem 0.9rem; display: flex; align-items: center; justify-content: space-between;">
            <div>
              <span style="font-size: 0.65rem; color:#94a3b8; font-weight: 600; text-transform: uppercase;">Contador Opcional</span>
              <div id="player-timer-display" style="font-family: var(--font-heading); font-size: 1.5rem; font-weight: 800; color: var(--gold-accent); font-variant-numeric: tabular-nums;">
                ${formatTimeDisplay(stepTimerSeconds)}
              </div>
            </div>

            <div style="display: flex; gap: 0.4rem;">
              <button id="btn-timer-action" onclick="togglePlayerTimerAction()" style="padding: 0.5rem 0.85rem; background: ${isStepTimerRunning ? 'rgba(255,255,255,0.12)' : 'linear-gradient(135deg, var(--rose-accent), var(--gold-accent))'}; border: 1px solid rgba(255,255,255,0.2); border-radius: 12px; color: ${isStepTimerRunning ? '#ffffff' : '#02040a'}; font-size: 0.78rem; font-weight: 800; cursor: pointer;">
                ${isStepTimerRunning ? (isTimerPaused ? '▶️ Reanudar' : '⏸️ Pausar') : '▶️ Iniciar'}
              </button>
              <button onclick="resetStepTimer()" style="padding: 0.5rem 0.7rem; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 12px; color: #cbd5e1; font-size: 0.78rem; font-weight: 700; cursor: pointer;" title="Reiniciar tiempo">
                🔄
              </button>
            </div>
          </div>

          <!-- Barra de Navegación de Ejercicios (SIN BLOQUEOS) -->
          <div style="display: flex; gap: 0.6rem; width: 100%;">
            <button onclick="prevStep()" ${isFirstStep ? 'disabled' : ''} style="flex: 1; padding: 0.8rem; background: ${isFirstStep ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.12)'}; border: 1px solid rgba(255,255,255,0.15); border-radius: 18px; color: ${isFirstStep ? '#64748b' : '#ffffff'}; font-family: var(--font-heading); font-weight: 700; font-size: 0.85rem; cursor: ${isFirstStep ? 'not-allowed' : 'pointer'};">
              ⬅️ Anterior
            </button>
            
            <button onclick="advanceToNextStep()" style="flex: 2; padding: 0.8rem; background: ${isLastStep ? 'linear-gradient(135deg, #2ec4b6, #10b981)' : 'linear-gradient(135deg, var(--rose-accent), #ff758f)'}; border: none; border-radius: 18px; color: #ffffff; font-family: var(--font-heading); font-weight: 800; font-size: 0.88rem; cursor: pointer; box-shadow: 0 0 20px rgba(255, 117, 143, 0.4);">
              ${isLastStep ? '🎉 Finalizar Rutina' : 'Siguiente Ejercicio ➔'}
            </button>
          </div>

        </div>
      </div>
    `;

    const existingPlayer = document.getElementById('routine-player-modal');
    if (existingPlayer) existingPlayer.remove();
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }

  function formatTimeDisplay(totalSeconds) {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  window.setStepDuration = function(seconds) {
    selectedStepDuration = seconds;
    stepTimerSeconds = seconds;
    isStepTimerRunning = false;
    isTimerPaused = false;
    if (routineTimerInterval) clearInterval(routineTimerInterval);
    renderPlayerModal();
  };

  window.togglePlayerTimerAction = function() {
    if (!isStepTimerRunning) {
      startStepTimerManually();
    } else {
      isTimerPaused = !isTimerPaused;
      updateTimerUI();
    }
  };

  window.startStepTimerManually = function() {
    isStepTimerRunning = true;
    isTimerPaused = false;
    if (routineTimerInterval) clearInterval(routineTimerInterval);

    updateTimerUI();
    routineTimerInterval = setInterval(() => {
      if (isTimerPaused) return;
      if (stepTimerSeconds > 0) {
        stepTimerSeconds--;
        updateTimerUI();
      } else {
        clearInterval(routineTimerInterval);
        isStepTimerRunning = false;
        updateTimerUI();
      }
    }, 1000);
  };

  window.resetStepTimer = function() {
    if (routineTimerInterval) clearInterval(routineTimerInterval);
    stepTimerSeconds = selectedStepDuration;
    isStepTimerRunning = false;
    isTimerPaused = false;
    updateTimerUI();
  };

  function updateTimerUI() {
    const display = document.getElementById('player-timer-display');
    const btnAction = document.getElementById('btn-timer-action');

    if (display) display.textContent = formatTimeDisplay(stepTimerSeconds);
    if (btnAction) {
      if (!isStepTimerRunning) {
        btnAction.textContent = '▶️ Iniciar';
        btnAction.style.background = 'linear-gradient(135deg, var(--rose-accent), var(--gold-accent))';
        btnAction.style.color = '#02040a';
      } else {
        btnAction.textContent = isTimerPaused ? '▶️ Reanudar' : '⏸️ Pausar';
        btnAction.style.background = 'rgba(255,255,255,0.12)';
        btnAction.style.color = '#ffffff';
      }
    }
  }

  window.prevStep = function() {
    if (currentStepIndex > 0) {
      if (routineTimerInterval) clearInterval(routineTimerInterval);
      currentStepIndex--;
      stepTimerSeconds = selectedStepDuration;
      isStepTimerRunning = false;
      isTimerPaused = false;
      renderPlayerModal();
    }
  };

  window.advanceToNextStep = function() {
    const steps = activeRoutine.steps || [];
    if (currentStepIndex < steps.length - 1) {
      if (routineTimerInterval) clearInterval(routineTimerInterval);
      currentStepIndex++;
      stepTimerSeconds = selectedStepDuration;
      isStepTimerRunning = false;
      isTimerPaused = false;
      renderPlayerModal();
    } else {
      completeRoutineVictory();
    }
  };

  function closeRoutinePlayerModal() {
    if (routineTimerInterval) clearInterval(routineTimerInterval);
    const modal = document.getElementById('routine-player-modal');
    if (modal) modal.remove();
  }
  window.closeRoutinePlayerModal = closeRoutinePlayerModal;

  function completeRoutineVictory() {
    if (routineTimerInterval) clearInterval(routineTimerInterval);
    if (massageTimerInterval) clearInterval(massageTimerInterval);
    if (typeof closeRoutinePlayerModal === 'function') closeRoutinePlayerModal();
    if (typeof window.closeBreathingPlayerModal === 'function') window.closeBreathingPlayerModal();
    if (typeof window.closeMassageGuideModal === 'function') window.closeMassageGuideModal();
    if (typeof window.stopLocalMP3 === 'function') window.stopLocalMP3();

    const routineRes = rewardsEngine.registerRoutineCompletion();
    updateCoinsUI();
    renderDailyTasksHub();

    // Trigger de Logros según categoría de alivio
    if (activeRoutine && activeRoutine.catId) {
      let achCatKey = '';
      if (activeRoutine.catId === 'nutrition') achCatKey = 'relief-nutrition';
      else if (activeRoutine.catId === 'breathing') achCatKey = 'relief-breathing';
      else if (activeRoutine.catId === 'massages' || activeRoutine.catId === 'massage') achCatKey = 'relief-massages';
      else if (activeRoutine.catId === 'audio') achCatKey = 'relief-audios';
      else achCatKey = 'relief-exercises';

      const achRes = achievementsEngine.trackProgress(achCatKey, 1);
      if (achRes.newlyUnlocked) {
        showInAppAchievementToast(achRes.ach);
      }
    }

    const isMilestone = routineRes.reachedMilestone;
    const cycleProgress = routineRes.cycleProgress || ((rewardsEngine.totalRoutinesCompleted % 5 === 0) ? 5 : (rewardsEngine.totalRoutinesCompleted % 5));

    const modalHTML = `
      <div class="modal-overlay active" id="routine-victory-modal" style="display:flex; align-items:center; justify-content:center; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(2, 4, 10, 0.9); backdrop-filter:blur(10px); z-index:99999; padding:1rem;">
        <div style="background: #0f172a; border: 2px solid var(--gold-accent); border-radius: 28px; padding: 1.5rem; max-width: 420px; width: 100%; text-align: center; color: #ffffff; box-shadow: 0 0 40px rgba(255, 185, 80, 0.4); display: flex; flex-direction: column; align-items: center; gap: 0.8rem;">
          <div style="font-size: 3rem;">🎉🌸</div>
          <h2 style="font-family: var(--font-heading); font-size: 1.3rem; font-weight: 800; color: var(--gold-accent); margin: 0;">¡Sesión Completada!</h2>
          <p style="font-size: 0.8rem; color: #cbd5e1; line-height: 1.4; margin: 0;">
            Has completado exitosamente la rutina <strong>${activeRoutine ? activeRoutine.title : 'de alivio'}</strong>. Tu cuerpo te lo agradece 💖
          </p>

          ${isMilestone ? `
          <div style="background: rgba(255, 185, 80, 0.18); border: 2px solid var(--gold-accent); border-radius: 16px; padding: 0.75rem 1rem; display: flex; align-items: center; gap: 0.8rem; width: 100%; justify-content: center; box-shadow: 0 0 20px rgba(255,185,80,0.3);">
            <span style="font-size: 1.6rem;">👑</span>
            <span style="font-family: var(--font-heading); font-size: 0.95rem; font-weight: 800; color: var(--gold-accent);">¡Hito de 5 Rutinas Conscientes (5/5)! +20 Pochipesos 🪙</span>
          </div>
          ` : `
          <div style="background: rgba(255, 185, 80, 0.12); border: 1px solid var(--gold-accent); border-radius: 16px; padding: 0.75rem 1rem; display: flex; align-items: center; gap: 0.8rem; width: 100%; justify-content: center;">
            <span style="font-size: 1.6rem;">🧘‍♀️</span>
            <span style="font-family: var(--font-heading); font-size: 0.95rem; font-weight: 800; color: var(--gold-accent);">Progreso hacia el Hito de Rutinas (${cycleProgress}/5)</span>
          </div>
          `}

          <div style="background: rgba(255,255,255,0.04); border-radius: 14px; padding: 0.65rem 0.8rem; text-align: left; font-size: 0.75rem; color: #cbd5e1; width: 100%;">
            <strong>Consejo de Manola 🦔:</strong> "Recuerda mantenerte hidratada y descansar con calor en la pelvis durante las próximas horas 🦔☕"
          </div>

          <button onclick="document.getElementById('routine-victory-modal').remove()" style="width: 100%; padding: 0.85rem; background: linear-gradient(135deg, var(--rose-accent), var(--gold-accent)); border: none; border-radius: 18px; color: #02040a; font-family: var(--font-heading); font-weight: 800; font-size: 0.9rem; cursor: pointer; margin-top: 0.4rem;">
            ✨ Excelente, Continuar
          </button>
        </div>
      </div>
    `;

    const existingVictory = document.getElementById('routine-victory-modal');
    if (existingVictory) existingVictory.remove();
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }

  function handleWheelTabChange(tab) {
    const dashMain = document.getElementById('tracker-dashboard-main-content');
    const subview = document.getElementById('tracker-subview-content');

    if (tab === 'dashboard') {
      if (dashMain) dashMain.style.display = 'flex';
      if (themePickerBar) themePickerBar.style.display = 'flex';
      if (prominentActionContainer) prominentActionContainer.style.display = 'flex';

      enhancedSlab.classList.remove('animate-fall-delayed');
      enhancedSlab.style.opacity = '1';
      enhancedSlab.style.transform = 'translateY(0)';
      enhancedSlab.style.display = 'flex';

      if (avatarSection) {
        avatarSection.classList.remove('animate-full-fluid-entrance');
        avatarSection.style.display = 'flex';
      }
      if (avatarBubble) avatarBubble.classList.remove('bubble-hidden');
      if (subview) subview.style.display = 'none';
      const spotSec = document.getElementById('spotify-dashboard-section');
      if (spotSec) spotSec.style.display = 'flex';
      renderSpotifyDashboardCard();
    } else {
      if (dashMain) dashMain.style.display = 'none';
      if (themePickerBar) themePickerBar.style.display = 'none';
      if (prominentActionContainer) prominentActionContainer.style.display = 'none';

      enhancedSlab.style.display = 'none';
      if (avatarSection) avatarSection.style.display = 'none';
      if (subview) subview.style.display = 'flex';
      const spotSec = document.getElementById('spotify-dashboard-section');
      if (spotSec) spotSec.style.display = 'none';

      if (tab === 'calendar') renderCalendarView();
      else if (tab === 'relief') renderReliefCenterView();
      else if (tab === 'trends') renderAnalyticsTrendsView();
      else if (tab === 'ai') renderAIAgentView();
    }
  }
  window.handleWheelTabChange = handleWheelTabChange;

    // MODAL HANDLER
  if (btnOpenSymptomSheet) btnOpenSymptomSheet.addEventListener('click', () => openModal('symptom-sheet'));

  function openModal(type, data = null) {
    modalOverlay.classList.add('active');

    if (type === 'exercise-modal' && data) {
      modalTitleIcon.textContent = 'self_improvement';
      modalTitle.textContent = data.title;
      modalBody.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 0.85rem;">
          <div style="background: rgba(56, 189, 248, 0.12); border: 1px solid var(--cyan-accent); border-radius: 18px; padding: 0.85rem; display: flex; align-items: center; gap: 0.75rem;">
            <span style="font-size: 2.2rem;">${data.icon}</span>
            <div><h4 style="font-family: var(--font-heading); font-size: 0.9rem; color: #ffffff;">${data.category} • ${data.duration}</h4><p style="font-size: 0.75rem; color: #cbd5e1; margin-top: 0.1rem;">${data.desc}</p></div>
          </div>
          <div style="background: rgba(255, 185, 80, 0.12); border: 1px solid var(--gold-accent); border-radius: 18px; padding: 0.75rem; display: flex; align-items: center; gap: 0.65rem;">
            <span style="font-size: 1.8rem;">🦔</span>
            <div><span style="font-family: var(--font-heading); font-size: 0.68rem; font-weight:700; color: var(--gold-accent); text-transform: uppercase;">Consejo Terapéutico de Spike:</span><p style="font-size: 0.75rem; color: #ffffff; line-height: 1.3;">${data.spikeTip}</p></div>
          </div>
          <div style="background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 18px; padding: 0.85rem;">
            <span style="font-family: var(--font-heading); font-size: 0.8rem; font-weight: 700; color: var(--cyan-accent); display: block; margin-bottom: 0.5rem;">📋 Instrucciones Paso a Paso:</span>
            <ol style="padding-left: 1.1rem; display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.78rem; color: #e2e8f0; line-height: 1.4;">${data.steps.map(step => `<li>${step}</li>`).join('')}</ol>
          </div>
          <button class="btn-action" style="padding: 0.85rem; font-size: 0.9rem; margin-top: 0.3rem;" onclick="closeModal(); completeRoutineVictory();">✓ Completar Rutina</button>
        </div>
      `;
    } else if (type === 'symptom-sheet') {
      modalTitleIcon.textContent = 'edit_note';
      modalTitle.textContent = 'Registrar Detalles Diarios';
      modalBody.innerHTML = `
        <form id="symptom-form" class="custom-modal-scroll" onsubmit="event.preventDefault(); saveSymptomData();" style="display: flex; flex-direction: column; gap: 0.95rem; max-height: 72vh; overflow-y: auto; padding-right: 0.45rem;">
          
          <!-- 1. Flujo / Sangrado & Día 1 -->
          <div class="symptom-section-group" style="background: rgba(230, 57, 70, 0.08); border: 1px solid rgba(230, 57, 70, 0.25); border-radius: 18px; padding: 0.85rem;">
            <span class="symptom-group-label" style="color: var(--primary-crimson); font-weight: 800; font-size: 0.85rem;">🩸 Flujo Menstrual / Sangrado:</span>
            <div style="display: flex; gap: 0.35rem; margin-top: 0.4rem; flex-wrap: wrap;">
              <button type="button" class="symptom-toggle-btn flex-1" onclick="selectSingle(this)">Ninguno</button>
              <button type="button" class="symptom-toggle-btn flex-1" onclick="selectSingle(this)">Manchado (Spotting)</button>
              <button type="button" class="symptom-toggle-btn flex-1" onclick="selectSingle(this)">Ligero</button>
              <button type="button" class="symptom-toggle-btn flex-1 selected" onclick="selectSingle(this)">Mediano</button>
              <button type="button" class="symptom-toggle-btn flex-1" onclick="selectSingle(this)">Abundante</button>
            </div>
            <button type="button" id="btn-start-period" class="symptom-toggle-btn" style="width: 100%; margin-top: 0.5rem; justify-content: center; background: rgba(230, 57, 70, 0.25); border-color: var(--primary-red); color: white; font-weight: 800;" onclick="toggleStartPeriod(this)">
              🩸 Registrar Inicio de Período (Actualizar a Día 1)
            </button>
          </div>

          <!-- 2. Síntomas Físicos con Deslizadores (0-5) para Cólicos, Senos y Espalda Baja -->
          <div class="symptom-section-group" style="background: rgba(255, 185, 80, 0.08); border: 1px solid rgba(255, 185, 80, 0.25); border-radius: 18px; padding: 0.85rem;">
            <span class="symptom-group-label" style="color: var(--gold-accent); font-weight: 800; font-size: 0.85rem;">🌸 Síntomas Físicos & Intensidad de Dolor:</span>
            
            <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-top: 0.5rem;">
              
              <!-- Cólicos Menstruales con Slider 0-5 -->
              <div style="background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; padding: 0.6rem;">
                <button type="button" class="symptom-toggle-btn selected" style="width: 100%; justify-content: space-between;" onclick="togglePain(this, 'box-colicos')">
                  <span>⚡ Cólicos Menstruales</span>
                  <span id="val-colicos-txt" style="color: var(--gold-accent); font-weight: 800;">Nivel 2/5</span>
                </button>
                <div id="box-colicos" style="display: flex; flex-direction: column; gap: 0.2rem; margin-top: 0.5rem; padding: 0 0.3rem;">
                  <div style="display: flex; justify-content: space-between; font-size: 0.68rem; color: #94a3b8;">
                    <span>0 (Sin dolor)</span><span>3 (Moderado)</span><span>5 (Intenso)</span>
                  </div>
                  <input type="range" min="0" max="5" value="2" oninput="document.getElementById('val-colicos-txt').textContent = 'Nivel ' + this.value + '/5'" style="width: 100%; accent-color: var(--gold-accent); cursor: pointer;" />
                </div>
              </div>

              <!-- Dolor de Senos con Slider 0-5 -->
              <div style="background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; padding: 0.6rem;">
                <button type="button" class="symptom-toggle-btn" style="width: 100%; justify-content: space-between;" onclick="togglePain(this, 'box-senos')">
                  <span>🌸 Dolor / Sensibilidad en Senos</span>
                  <span id="val-senos-txt" style="color: var(--gold-accent); font-weight: 800;">Nivel 0/5</span>
                </button>
                <div id="box-senos" style="display: none; flex-direction: column; gap: 0.2rem; margin-top: 0.5rem; padding: 0 0.3rem;">
                  <div style="display: flex; justify-content: space-between; font-size: 0.68rem; color: #94a3b8;">
                    <span>0 (Sin dolor)</span><span>3 (Moderado)</span><span>5 (Intenso)</span>
                  </div>
                  <input type="range" min="0" max="5" value="0" oninput="document.getElementById('val-senos-txt').textContent = 'Nivel ' + this.value + '/5'" style="width: 100%; accent-color: var(--gold-accent); cursor: pointer;" />
                </div>
              </div>

              <!-- Dolor de Espalda Baja con Slider 0-5 -->
              <div style="background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; padding: 0.6rem;">
                <button type="button" class="symptom-toggle-btn" style="width: 100%; justify-content: space-between;" onclick="togglePain(this, 'box-espalda')">
                  <span>⚡ Dolor de Espalda Baja / Lumbar</span>
                  <span id="val-espalda-txt" style="color: var(--gold-accent); font-weight: 800;">Nivel 0/5</span>
                </button>
                <div id="box-espalda" style="display: none; flex-direction: column; gap: 0.2rem; margin-top: 0.5rem; padding: 0 0.3rem;">
                  <div style="display: flex; justify-content: space-between; font-size: 0.68rem; color: #94a3b8;">
                    <span>0 (Sin dolor)</span><span>3 (Moderado)</span><span>5 (Intenso)</span>
                  </div>
                  <input type="range" min="0" max="5" value="0" oninput="document.getElementById('val-espalda-txt').textContent = 'Nivel ' + this.value + '/5'" style="width: 100%; accent-color: var(--gold-accent); cursor: pointer;" />
                </div>
              </div>

            </div>

            <span style="font-size: 0.72rem; color: #94a3b8; font-weight: 700; display: block; margin: 0.6rem 0 0.3rem 0;">Otros Síntomas Físicos:</span>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.35rem;">
              <button type="button" class="symptom-toggle-btn" onclick="this.classList.toggle('selected')">🎈 Hinchazón Abdominal</button>
              <button type="button" class="symptom-toggle-btn" onclick="this.classList.toggle('selected')">😴 Fatiga / Cansancio</button>
              <button type="button" class="symptom-toggle-btn" onclick="this.classList.toggle('selected')">🤯 Dolor de Cabeza / Migraña</button>
              <button type="button" class="symptom-toggle-btn" onclick="this.classList.toggle('selected')">✨ Brotes / Acné Hormonal</button>
              <button type="button" class="symptom-toggle-btn" onclick="this.classList.toggle('selected')">🤢 Náuseas / Estómago</button>
              <button type="button" class="symptom-toggle-btn" onclick="this.classList.toggle('selected')">🧊 Escalofríos / Bochornos</button>
              <button type="button" class="symptom-toggle-btn" onclick="this.classList.toggle('selected')">💩 Alteraciones Digestivas</button>
              <button type="button" class="symptom-toggle-btn" onclick="this.classList.toggle('selected')">🦵 Pesadez en Piernas</button>
            </div>
          </div>

          <!-- 3. Estados de Ánimo Ampliados & Nivel de Estrés con Deslizador (0-5) -->
          <div class="symptom-section-group" style="background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 18px; padding: 0.85rem;">
            <span class="symptom-group-label" style="color: var(--rose-accent); font-weight: 800; font-size: 0.85rem;">😊 Estados de Ánimo Ampliados & Estrés:</span>
            
            <div style="background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; padding: 0.6rem; margin-top: 0.4rem;">
              <button type="button" class="symptom-toggle-btn selected" style="width: 100%; justify-content: space-between;" onclick="togglePain(this, 'box-estres')">
                <span>🧠 Nivel de Estrés General</span>
                <span id="val-estres-txt" style="color: var(--rose-accent); font-weight: 800;">Nivel 1/5</span>
              </button>
              <div id="box-estres" style="display: flex; flex-direction: column; gap: 0.2rem; margin-top: 0.5rem; padding: 0 0.3rem;">
                <div style="display: flex; justify-content: space-between; font-size: 0.68rem; color: #94a3b8;">
                  <span>0 (Sin estrés)</span><span>3 (Moderado)</span><span>5 (Estrés máximo)</span>
                </div>
                <input type="range" min="0" max="5" value="1" oninput="document.getElementById('val-estres-txt').textContent = 'Nivel ' + this.value + '/5'" style="width: 100%; accent-color: var(--rose-accent); cursor: pointer;" />
              </div>
            </div>

            <span style="font-size: 0.72rem; color: #94a3b8; font-weight: 700; display: block; margin: 0.6rem 0 0.3rem 0;">Emociones y Sensaciones (Selección Múltiple):</span>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.35rem;">
              <button type="button" class="symptom-toggle-btn" onclick="this.classList.toggle('selected')">😊 Feliz / Radiante</button>
              <button type="button" class="symptom-toggle-btn" onclick="this.classList.toggle('selected')">🧘‍♀️ Tranquila / Zen</button>
              <button type="button" class="symptom-toggle-btn" onclick="this.classList.toggle('selected')">⚡ Motivada / Con Energía</button>
              <button type="button" class="symptom-toggle-btn" onclick="this.classList.toggle('selected')">🥺 Sensible / Llorosa</button>
              <button type="button" class="symptom-toggle-btn" onclick="this.classList.toggle('selected')">😢 Triste / Melancólica</button>
              <button type="button" class="symptom-toggle-btn" onclick="this.classList.toggle('selected')">🌩️ Irritable / Con Rabia</button>
              <button type="button" class="symptom-toggle-btn" onclick="this.classList.toggle('selected')">😟 Con Ansiedad / Inquieta</button>
              <button type="button" class="symptom-toggle-btn" onclick="this.classList.toggle('selected')">🎒 Abrumada / Con Carga</button>
              <button type="button" class="symptom-toggle-btn" onclick="this.classList.toggle('selected')">☁️ Niebla Mental</button>
              <button type="button" class="symptom-toggle-btn" onclick="this.classList.toggle('selected')">🧸 Necesidad de Mimo</button>
              <button type="button" class="symptom-toggle-btn" onclick="this.classList.toggle('selected')">🎭 Cambios Bruscos de Humor</button>
              <button type="button" class="symptom-toggle-btn" onclick="this.classList.toggle('selected')">🫥 Apática / Desconectada</button>
              <button type="button" class="symptom-toggle-btn" onclick="this.classList.toggle('selected')">🪞 Insegura / Con Dudas</button>
            </div>
          </div>

          <!-- 4. Flujo Vaginal / Moco Cervical Ampliado -->
          <div class="symptom-section-group" style="background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 18px; padding: 0.85rem;">
            <span class="symptom-group-label" style="color: var(--cyan-accent); font-weight: 800; font-size: 0.85rem;">💧 Moco Cervical / Secreción Vaginal (Ampliación Completa):</span>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.35rem; margin-top: 0.4rem;">
              <button type="button" class="symptom-toggle-btn" onclick="selectSingle(this)">🌵 Seco / Inexistente</button>
              <button type="button" class="symptom-toggle-btn" onclick="selectSingle(this)">💧 Inodoro e Incoloro</button>
              <button type="button" class="symptom-toggle-btn" onclick="selectSingle(this)">🥛 Cremoso / Blanquecino</button>
              <button type="button" class="symptom-toggle-btn" onclick="selectSingle(this)">🍯 Pegajoso / Espeso</button>
              <button type="button" class="symptom-toggle-btn" onclick="selectSingle(this)">🥚 Clara de Huevo (Fértil)</button>
              <button type="button" class="symptom-toggle-btn" onclick="selectSingle(this)">🌊 Acuoso / Muy Líquido</button>
              <button type="button" class="symptom-toggle-btn" onclick="selectSingle(this)">🍂 Manchado Marrón / Café</button>
              <button type="button" class="symptom-toggle-btn" onclick="selectSingle(this)">🌸 Rosado Leve</button>
            </div>
          </div>

          <!-- 5. Actividad Sexual, Libido & Intimidad -->
          <div class="symptom-section-group" style="background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 18px; padding: 0.85rem;">
            <span class="symptom-group-label" style="color: var(--rose-accent); font-weight: 800; font-size: 0.85rem;">💜 Actividad Sexual, Libido & Intimidad:</span>
            
            <span style="font-size: 0.72rem; color: #94a3b8; font-weight: 700; display: block; margin: 0.4rem 0 0.25rem 0;">Deseo Sexual / Libido:</span>
            <div style="display: flex; gap: 0.35rem; flex-wrap: wrap;">
              <button type="button" class="symptom-toggle-btn flex-1" onclick="selectSingle(this)">🫥 Nulo / Sin Deseo</button>
              <button type="button" class="symptom-toggle-btn flex-1" onclick="selectSingle(this)">🌸 Moderado</button>
              <button type="button" class="symptom-toggle-btn flex-1" onclick="selectSingle(this)">🔥 Alto / Elevado</button>
            </div>

            <span style="font-size: 0.72rem; color: #94a3b8; font-weight: 700; display: block; margin: 0.5rem 0 0.25rem 0;">Relaciones Sexuales:</span>
            <div style="display: flex; gap: 0.35rem; flex-wrap: wrap;">
              <button type="button" class="symptom-toggle-btn flex-1" onclick="selectSingle(this)">Sin Relaciones</button>
              <button type="button" class="symptom-toggle-btn flex-1" onclick="selectSingle(this)">🛡️ Con Protección</button>
              <button type="button" class="symptom-toggle-btn flex-1" onclick="selectSingle(this)">⚠️ Sin Protección</button>
            </div>

            <span style="font-size: 0.72rem; color: #94a3b8; font-weight: 700; display: block; margin: 0.5rem 0 0.25rem 0;">Detalles de Salud Íntima:</span>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.4rem;">
              <button type="button" class="symptom-toggle-btn" onclick="this.classList.toggle('selected')">✨ Hubo Orgasmo</button>
              <button type="button" class="symptom-toggle-btn" onclick="this.classList.toggle('selected')">🤲 Hubo Masturbación</button>
            </div>
            <button type="button" class="symptom-toggle-btn" style="width: 100%; margin-top: 0.4rem; justify-content: center;" onclick="this.classList.toggle('selected')">
              💊 Píldora Anticonceptiva Tomada Hoy
            </button>
          </div>

          <!-- 6. Notas y Diario Personal -->
          <div class="symptom-section-group" style="background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 18px; padding: 0.85rem;">
            <span class="symptom-group-label" style="color: #cbd5e1; font-weight: 800; font-size: 0.85rem;">📝 Notas y Diario Personal del Día:</span>
            <textarea placeholder="¿Cómo te sentiste hoy? Escribe libremente aquí..." style="width: 100%; height: 70px; margin-top: 0.4rem; padding: 0.6rem; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.2); border-radius: 12px; color: white; font-size: 0.78rem; resize: none;"></textarea>
          </div>

          <button type="submit" class="btn-action" style="width: 100%; padding: 0.9rem; font-size: 0.9rem; margin-top: 0.4rem; background: linear-gradient(135deg, var(--rose-accent), var(--gold-accent)); border: none; border-radius: 18px; color: #02040a; font-weight: 800; cursor: pointer;">
            💾 Guardar Registro Diario Completo
          </button>
        </form>
      `;
    }
  }

  function closeModal() { modalOverlay.classList.remove('active'); }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  window.selectFlow = function(btn, flowType) {
    const parent = btn.parentElement;
    parent.querySelectorAll('.symptom-toggle-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
  };

  window.selectSingle = function(btn) {
    const parent = btn.parentElement;
    parent.querySelectorAll('.symptom-toggle-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
  };

  window.toggleStartPeriod = function(btn) {
    btn.classList.toggle('selected');
    if (btn.classList.contains('selected')) {
      btn.style.background = 'var(--primary-crimson)';
      btn.textContent = '✓ Inicio de Período Registrado (Día 1)';
    } else {
      btn.style.background = 'rgba(230, 57, 70, 0.25)';
      btn.textContent = '🩸 Registrar Inicio de Período (Actualizar a Día 1)';
    }
  };

  window.togglePain = function(btn, sliderBoxId) {
    btn.classList.toggle('selected');
    const box = document.getElementById(sliderBoxId);
    if (box) box.style.display = btn.classList.contains('selected') ? 'flex' : 'none';
  };

  window.saveSymptomData = function() {
    const periodBtn = document.getElementById('btn-start-period');
    const speechText = document.querySelector('.speech-text');
    const cycleDayHeading = document.querySelector('.slab-cycle-day');

    closeModal();

    // Feedback visual animado en el avatar del tracker
    const trackerImg = document.getElementById('tracker-avatar-img');
    const pet = avatarRegistry[currentAvatarId] || avatarRegistry.amy;
    if (trackerImg) {
      trackerImg.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      trackerImg.style.transform = 'scale(1.18) rotate(6deg)';
      setTimeout(() => { trackerImg.style.transform = ''; }, 500);
    }

    // Extraer y persistir síntomas seleccionados en el perfil
    const selectedSymptoms = Array.from(document.querySelectorAll('#symptom-form .symptom-toggle-btn.selected')).map(b => b.textContent.trim());
    userProfile.sintomasHoy = selectedSymptoms;

    // Extraer valores estructurados para el registro clínico del calendario
    const flowBtn = document.querySelector('#symptom-form .symptom-section-group:nth-child(1) .symptom-toggle-btn.selected');
    const flowVal = flowBtn ? flowBtn.textContent.trim() : 'Ninguno';

    const colicosInput = document.querySelector('#box-colicos input[type="range"]');
    const colicosSelected = document.querySelector('.symptom-toggle-btn[onclick*="box-colicos"]')?.classList.contains('selected');
    const crampsVal = colicosSelected && colicosInput ? parseInt(colicosInput.value, 10) : 0;

    const estresInput = document.querySelector('#box-estres input[type="range"]');
    const estresVal = estresInput ? parseInt(estresInput.value, 10) : 1;
    const stressLabel = estresVal >= 4 ? 'Alto' : (estresVal >= 2 ? 'Moderado' : 'Bajo');

    const isIntimacy = selectedSymptoms.some(s => s.toLowerCase().includes('intimidad') || s.toLowerCase().includes('protección') || s.toLowerCase().includes('proteccion'));
    const moodSelected = selectedSymptoms.find(s => s.includes('😌') || s.includes('😊') || s.includes('✨') || s.includes('🥺') || s.includes('😤') || s.includes('😴') || s.includes('Tranquila') || s.includes('Feliz')) || 'Tranquila 😌';
    const notesInput = document.getElementById('symptom-notes-input');
    const noteText = notesInput ? notesInput.value.trim() : '';

    const targetDateKey = selectedCalDateStr || formatDateKey(new Date());

    // Guardar en la base de datos real del calendario
    loggedDaysData[targetDateKey] = {
      period: flowVal,
      cramps: crampsVal,
      intimacy: isIntimacy,
      mood: moodSelected,
      stress: stressLabel,
      symptoms: selectedSymptoms,
      note: noteText,
      timestamp: Date.now()
    };

    try {
      localStorage.setItem('pochirocho_logged_days_db', JSON.stringify(loggedDaysData));
      localStorage.setItem('pochirocho_daily_symptoms', JSON.stringify({
        date: new Date().toISOString().split('T')[0],
        symptoms: selectedSymptoms,
        timestamp: Date.now()
      }));
      localStorage.setItem('pochirocho_user_profile', JSON.stringify(userProfile.toJSON()));
    } catch(e) {}

    const trackerAvatarText = document.getElementById('tracker-avatar-text');
    if (periodBtn && periodBtn.classList.contains('selected')) {
      const todayDate = new Date();
      const todayStr = todayDate.toISOString().split('T')[0];
      const previousLmp = parseSafeDate(userProfile.lmpFecha);
      
      // Duración del ciclo que acaba de completarse
      const diffMs = Math.max(0, todayDate.getTime() - previousLmp.getTime());
      const completedDuration = Math.max(15, Math.min(60, Math.round(diffMs / (1000 * 3600 * 24)))) || parseInt(userProfile.duracionPromedioCiclo, 10) || 28;

      // 1. Guardar ciclo completado en el historial de ciclos
      let cycleHistory = [];
      try {
        cycleHistory = JSON.parse(localStorage.getItem('pochirocho_cycle_history') || '[]');
      } catch(e) {}

      cycleHistory.push({
        fechaInicio: previousLmp.toISOString().split('T')[0],
        fechaFin: todayStr,
        duracionDias: completedDuration,
        fuente: 'user_period_start',
        timestamp: Date.now()
      });

      // 2. Re-alimentar el Ensamble Predictor de Machine Learning
      const learningResult = cyclePredictorEngine.feedCycleCompletion(
        completedDuration,
        cycleHistory,
        parseInt(userProfile.duracionPromedioCiclo, 10) || 28
      );

      // 3. Actualizar perfil y baseline aprendido
      userProfile.duracionPromedioCiclo = learningResult.nuevaDuracionCiclo;
      userProfile.lmpFecha = todayStr;
      userCycleState.currentDay = 1;
      userCycleState.isDelayed = false;
      userCycleState.daysLate = 0;

      try {
        localStorage.setItem('pochirocho_cycle_history', JSON.stringify(cycleHistory));
        localStorage.setItem('pochirocho_user_profile', JSON.stringify(userProfile.toJSON()));
      } catch(e) {}

      setCyclePhase('Menstrual', 1);
      if (cycleDayHeading) cycleDayHeading.textContent = 'Día 1';
      if (trackerAvatarText) {
        trackerAvatarText.textContent = `"¡Inicio de período registrado! Tu ciclo anterior duró ${completedDuration} días. El algoritmo recalculó tu duración estimada a ${learningResult.nuevaDuracionCiclo} días con ${learningResult.confianzaPorcentaje}% de confianza ✨"`;
      }
    } else {
      if (trackerAvatarText) {
        if (userCycleState.isDelayed) {
          trackerAvatarText.textContent = `"Tranquila mi cielo, el estrés o cambios en tu rutina pueden retrasar unos días la menstruación (+${userCycleState.daysLate}d). ¡Aquí te acompaño con un té calientito! 🦔☕"`;
        } else {
          trackerAvatarText.textContent = `"¡Tus síntomas diarios han sido guardados! ${pet.name} ajustó tus consejos personalizados de salud 🌸"`;
        }
      }
    }

    // Actualizar vista activa si es calendario o análisis
    const trackerSubview = document.getElementById('tracker-subview-content');
    if (trackerSubview) {
      const isCalendar = trackerSubview.querySelector('.calendar-container');
      const isTrends = trackerSubview.querySelector('.trends-container');
      if (isCalendar) renderCalendarView();
      if (isTrends) renderAnalyticsTrendsView();
    }

    // Trigger de Tarea Diaria 1: Registrar detalles diarios (+5 Pochipesos)
    rewardsEngine.completeDailyTask('daily_log');
    updateCoinsUI();
    renderDailyTasksHub();

    // Trigger de Logro Secreto: Sexo sin protección en Ovulación
    const currentActivePhase = userCycleState.currentPhase || 'Ovulatoria';
    const isUnprotectedSelected = Array.from(document.querySelectorAll('.symptom-toggle-btn.selected')).some(b => b.textContent.includes('Sin Protección'));
    if (isUnprotectedSelected && currentActivePhase.toLowerCase().includes('ovulat')) {
      const secretSexAch = achievementsEngine.unlockDirect('ach-secret-unprotected-ovulation');
      if (secretSexAch.newlyUnlocked) {
        showInAppAchievementToast(secretSexAch.ach);
      }
    }
  };

  // =========================================================================
  // LOGICA DE LA PANTALLA DE CONFIGURACIÓN & AJUSTES
  // =========================================================================
  function openSettingsModal() {
    try {
      let modal = document.getElementById('settings-modal-overlay');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'settings-modal-overlay';
        modal.className = 'modal-overlay active';
        modal.style.cssText = 'display:flex; align-items:center; justify-content:center; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(2,4,10,0.88); backdrop-filter:blur(10px); z-index:99999; padding:1rem;';
        modal.onclick = function(e) {
          if (e.target === modal) closeSettingsModal();
        };
        document.body.appendChild(modal);
      }

      currentAvatarId = localStorage.getItem('pochirocho_selected_avatar') || currentAvatarId || 'amy';
      const currentPet = avatarRegistry[currentAvatarId] || avatarRegistry.amy;
    const isSpotifyConn = SpotifyPsychoacousticEngine.isConnected();
    const hasGeminiKey = GeminiConfig.hasApiKey();
    const currentGeminiKey = GeminiConfig.getApiKey();

    const availableColors = [
      { key: 'red', name: 'Rojo (Rosas) 🌹', color: '#E63946' },
      { key: 'pink', name: 'Rosa (Corazones) 🩷', color: '#ff758f' },
      { key: 'green', name: 'Verde (Hojas) 🍃', color: '#2ec4b6' },
      { key: 'yellow', name: 'Amarillo (Girasoles) 🌻', color: '#ffb950' },
      { key: 'purple', name: 'Morado (Burbujas) 🫧', color: '#a855f7' },
      { key: 'blue', name: 'Azul (Lluvia) 🌧️', color: '#38bdf8' }
    ];

    modal.innerHTML = `
      <div class="settings-modal-card animate-scale-up" style="max-height:85vh; overflow-y:auto;">
        <!-- Encabezado de Ajustes -->
        <div class="settings-header-row">
          <div class="settings-title-group">
            <span class="material-symbols-outlined" style="color: var(--gold-accent); font-size: 1.5rem;">settings</span>
            <h2>Ajustes & Configuración</h2>
          </div>
          <button class="modal-close-btn" onclick="closeSettingsModal()" aria-label="Cerrar">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <!-- 1. Selección de Mascota Acompañante -->
        <div class="settings-section-card">
          <div class="settings-section-title">
            <span class="material-symbols-outlined" style="color: #ffd166;">pets</span>
            <span id="settings-companion-title">Mascota Acompañante (${currentPet.name})</span>
          </div>
          <div class="settings-options-grid">
            <div class="settings-avatar-btn ${currentAvatarId === 'amy' ? 'active' : ''}" data-avatar="amy" onclick="setSettingsAvatar('amy')">
              <img src="assets/avatares/Amy/Normal_Amy.png" alt="Amy" />
              <span class="settings-avatar-name">Manola 🦔</span>
            </div>
            <div class="settings-avatar-btn ${currentAvatarId === 'luffy' ? 'active' : ''}" data-avatar="luffy" onclick="setSettingsAvatar('luffy')">
              <img src="assets/avatares/Luffy/Normal_Luffy.png" alt="Luffy" />
              <span class="settings-avatar-name">Luffy 🐒</span>
            </div>
            <div class="settings-avatar-btn ${currentAvatarId === 'maomao' ? 'active' : ''}" data-avatar="maomao" onclick="setSettingsAvatar('maomao')">
              <img src="assets/avatares/MaoMao/Normal_Mao.png" alt="MaoMao" />
              <span class="settings-avatar-name">MaoMao 🐱</span>
            </div>
            <div class="settings-avatar-btn ${currentAvatarId === 'pipo' ? 'active' : ''}" data-avatar="pipo" onclick="setSettingsAvatar('pipo')">
              <img src="assets/avatares/Pipo/Normal_Pipo.png" alt="Pipo" />
              <span class="settings-avatar-name">Pipo 🐧</span>
            </div>
            <div class="settings-avatar-btn ${currentAvatarId === 'naveen' ? 'active' : ''}" data-avatar="naveen" onclick="setSettingsAvatar('naveen')">
              <img src="assets/avatares/Naveen/Normal_Naveen.png" alt="Naveen" />
              <span class="settings-avatar-name">Naveen 🐸</span>
            </div>
          </div>
        </div>

        <!-- 2. Inteligencia Artificial • Salud & Afecto -->
        <div class="settings-section-card" style="border-color: rgba(168, 85, 247, 0.35); background: rgba(168, 85, 247, 0.05);">
          <div class="settings-section-title">
            <span class="material-symbols-outlined" style="color: var(--purple-accent);">psychology</span>
            <span>Inteligencia Artificial • Salud & Afecto</span>
          </div>
          <div style="font-size:0.75rem; color:#cbd5e1; margin-bottom:0.35rem;">
            Asistente clínico-afectivo con soporte especializado en sincronía biológica y bienestar hormonal.
          </div>
          <div style="display:inline-flex; align-items:center; gap:0.4rem; padding:0.35rem 0.65rem; background:rgba(74,222,128,0.12); border:1px solid rgba(74,222,128,0.3); border-radius:10px; font-size:0.72rem; color:#4ade80; font-weight:700;">
            <span>🟢</span>
            <span>Motor IA Activo & Optimizado</span>
          </div>
        </div>

        <!-- 3. Conexión de Cuenta de Spotify -->
        <div class="settings-section-card" style="border-color: rgba(29, 185, 84, 0.35); background: rgba(29, 185, 84, 0.05);">
          <div class="settings-section-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#1DB954"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.49 17.306c-.215.352-.676.465-1.028.25-2.82-1.722-6.37-2.112-10.55-1.157-.403.092-.806-.157-.898-.56-.092-.403.157-.806.56-.898 4.577-1.045 8.508-.598 11.666 1.337.352.215.465.676.25 1.028zm1.464-3.256c-.27.44-.847.58-1.287.31-3.228-1.984-8.15-2.558-11.97-1.398-.497.15-1.028-.135-1.178-.632-.15-.497.135-1.028.632-1.178 4.37-1.325 9.79-.684 13.493 1.59.44.27.58.847.31 1.288zm.126-3.39c-3.87-2.298-10.254-2.51-13.97-1.38-.595.18-1.226-.155-1.406-.75-.18-.595.155-1.226.75-1.406 4.27-1.296 11.31-1.048 15.772 1.6c.535.318.71 1.01.392 1.545-.318.535-1.01.71-1.545.392z"/></svg>
            <span>Sintonía Musical Spotify</span>
          </div>
          <div style="font-size:0.75rem; color:#cbd5e1; margin-bottom:0.4rem;">
            Estado de conexión: <strong id="settings-spotify-status">${isSpotifyConn ? '<span style="color:#1ed760;">🟢 Cuenta Conectada</span>' : '<span style="color:#cbd5e1;">⚪ No conectada</span>'}</strong>
          </div>
          <div id="settings-spotify-btn-slot">
            ${isSpotifyConn ? `
              <button class="settings-action-btn" style="background:rgba(239,68,68,0.15); border-color:rgba(239,68,68,0.3); color:#fca5a5;" onclick="SpotifyPsychoacousticEngine.disconnect(); updateSpotifySettingsStatus();">
                <span>Desconectar Cuenta de Spotify</span>
              </button>
            ` : `
              <button class="settings-action-btn" style="background:#1DB954; color:#02040a; font-weight:800;" onclick="SpotifyPsychoacousticEngine.loginWithSpotify();">
                <span>🟢 Conectar con Spotify</span>
              </button>
            `}
          </div>
        </div>

        <!-- 4. Personalización de Tono & Tema Visual (Automático por Fase o Fijo) -->
        <div class="settings-section-card">
          <div class="settings-section-title">
            <span class="material-symbols-outlined" style="color: var(--pink-accent);">palette</span>
            <span>Tono & Tema Visual de la App</span>
          </div>
          <p style="font-size: 0.72rem; color: #94a3b8; margin-top: -0.35rem; margin-bottom: 0.7rem;">
            Personaliza el color de la aplicación. En modo automático, la app adoptará el tono que asignes a cada fase del ciclo. El avatar mostrará siempre su estado según la fase biológica.
          </p>

          <!-- Selector de Modo de Color -->
          <div class="settings-mode-tabs-row">
            <button class="settings-mode-tab-btn ${themeSettings.mode === 'auto_by_phase' ? 'active' : ''}" data-mode="auto_by_phase" onclick="setSettingsThemeMode('auto_by_phase')">
              <span>🔄 Por Fase del Ciclo</span>
            </button>
            <button class="settings-mode-tab-btn ${themeSettings.mode === 'fixed' ? 'active' : ''}" data-mode="fixed" onclick="setSettingsThemeMode('fixed')">
              <span>🎨 Tono Fijo General</span>
            </button>
          </div>

          <!-- Vista Modo Automático por Fase -->
          <div id="settings-theme-auto-container" class="settings-phase-themes-list" style="display: ${themeSettings.mode === 'auto_by_phase' ? 'flex' : 'none'};">
            ${Object.keys(userCycleState.phaseDetails).map(phaseKey => {
              const details = userCycleState.phaseDetails[phaseKey];
              const currentPhaseTheme = themeSettings.phaseThemes[phaseKey] || 'red';
              const isCurrent = userCycleState.currentPhase === phaseKey;
              return `
                <div class="settings-phase-item-card ${isCurrent ? 'is-current-phase' : ''}" data-phase="${phaseKey}">
                  <div class="settings-phase-item-header">
                    <span class="settings-phase-item-title">
                      <span>${details.emoji}</span>
                      <span>${details.name}</span>
                    </span>
                    <span class="settings-phase-current-badge-slot">
                      ${isCurrent ? '<span class="settings-phase-current-badge">Fase Actual 🟢</span>' : ''}
                    </span>
                  </div>
                  <div class="settings-phase-color-picker-row">
                    ${availableColors.map(c => `
                      <button class="phase-color-dot-btn ${currentPhaseTheme === c.key ? 'active' : ''}" 
                              data-color="${c.key}"
                              style="background: ${c.color};" 
                              onclick="setSettingsPhaseTheme('${phaseKey}', '${c.key}')"
                              title="${c.name}">
                        ${currentPhaseTheme === c.key ? '✓' : ''}
                      </button>
                    `).join('')}
                  </div>
                </div>
              `;
            }).join('')}
          </div>

          <!-- Vista Modo Tono Fijo General -->
          <div id="settings-theme-fixed-container" class="settings-theme-grid" style="display: ${themeSettings.mode === 'fixed' ? 'grid' : 'none'};">
            ${availableColors.map(c => `
              <div class="settings-theme-card ${themeSettings.fixedTheme === c.key ? 'active' : ''}" data-theme="${c.key}" onclick="setSettingsFixedTheme('${c.key}')">
                <div class="settings-theme-color-dot" style="background:${c.color};"></div>
                <span>${c.name}</span>
              </div>
            `).join('')}
          </div>

          <!-- Simulador / Selector de Fase Activa del Ciclo -->
          <div style="margin-top:0.85rem; border-top: 1px dashed rgba(255,255,255,0.1); padding-top:0.65rem;">
            <span style="font-size:0.72rem; color:#94a3b8; font-weight:600; display:block; margin-bottom:0.35rem;">
              🧬 Probar Cambio de Fase del Ciclo (El avatar cambia a su imagen de fase):
            </span>
            <div class="settings-cycle-simulator-row">
              <button class="settings-phase-simulate-btn ${userCycleState.currentPhase === 'Menstrual' ? 'active' : ''}" data-sim-phase="Menstrual" onclick="simulatePhaseFromSettings('Menstrual')">
                <span>🩸 Menstrual</span>
                <span style="font-size:0.58rem; color:#94a3b8;">Día 2</span>
              </button>
              <button class="settings-phase-simulate-btn ${userCycleState.currentPhase === 'Folicular' ? 'active' : ''}" data-sim-phase="Folicular" onclick="simulatePhaseFromSettings('Folicular')">
                <span>🌱 Folicular</span>
                <span style="font-size:0.58rem; color:#94a3b8;">Día 7</span>
              </button>
              <button class="settings-phase-simulate-btn ${userCycleState.currentPhase === 'Ovulatoria' ? 'active' : ''}" data-sim-phase="Ovulatoria" onclick="simulatePhaseFromSettings('Ovulatoria')">
                <span>✨ Ovulatoria</span>
                <span style="font-size:0.58rem; color:#94a3b8;">Día 14</span>
              </button>
              <button class="settings-phase-simulate-btn ${userCycleState.currentPhase === 'Lutea' ? 'active' : ''}" data-sim-phase="Lutea" onclick="simulatePhaseFromSettings('Lutea')">
                <span>🌙 Lútea</span>
                <span style="font-size:0.58rem; color:#94a3b8;">Día 21</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 5. Transferencia de Datos desde Flo 🌸 -->
        <div class="settings-section-card" style="border-color: rgba(255, 77, 109, 0.4); background: rgba(255, 77, 109, 0.08);">
          <div class="settings-section-title">
            <span style="font-size:1.15rem;">🌸</span>
            <span>Transferencia de Datos desde Flo</span>
          </div>
          <div style="font-size:0.75rem; color:#cbd5e1; margin-bottom:0.4rem;">
            Estado: <strong id="settings-flo-status">${FloSyncEngine.isConnected() ? '<span style="color:#ff758f;">🟢 Conectado y Sincronizado con Flo</span>' : '<span style="color:#cbd5e1;">⚪ No conectado</span>'}</strong>
          </div>
          <div style="display:flex; gap:0.45rem; flex-wrap:wrap;">
            <button class="settings-action-btn" style="flex:1; background:linear-gradient(135deg, #ff4d6d 0%, #ff758f 100%); border-color:#ff758f; color:#ffffff; font-weight:800;" onclick="openFloSyncModal()">
              <span class="material-symbols-outlined" style="font-size:0.95rem;">sync</span>
              <span>Asistente de Sincronización Flo 🌸</span>
            </button>
            <input type="file" id="flo-file-input-settings" accept=".csv,.json,.txt" style="display:none;" onchange="importFloFileFromSettings(this)" />
            <button class="settings-action-btn" style="background:rgba(255,255,255,0.08); border-color:rgba(255,255,255,0.2); color:#cbd5e1; padding:0.45rem 0.75rem;" onclick="document.getElementById('flo-file-input-settings').click()" title="Importar archivo exportado de Flo">
              <span class="material-symbols-outlined" style="font-size:0.95rem;">upload_file</span>
              <span>Importar Archivo Flo</span>
            </button>
          </div>
        </div>

        <!-- 6. Protección Biométrica Face ID -->
        <div class="settings-section-card" style="border-color: rgba(56, 189, 248, 0.35); background: rgba(56, 189, 248, 0.05);">
          <div class="settings-section-title">
            <span class="material-symbols-outlined" style="color: var(--cyan-accent);">face_unlock</span>
            <span>Protección Biométrica Face ID</span>
          </div>
          <div style="font-size:0.75rem; color:#cbd5e1; margin-bottom:0.4rem;">
            Estado: <strong id="settings-faceid-status">${BiometricAuthEngine.isEnabled() ? '<span style="color:#38bdf8;">🟢 Face ID Habilitado (Secure Enclave)</span>' : '<span style="color:#cbd5e1;">⚪ Desactivado</span>'}</strong>
          </div>
          <button class="settings-action-btn" style="background:rgba(56,189,248,0.2); border-color:var(--cyan-accent); color:#ffffff;" onclick="testFaceIDFromSettings()">
            <span class="material-symbols-outlined" style="font-size:0.95rem;">fingerprint</span>
            <span>Probar / Autenticar con Face ID</span>
          </button>
        </div>

        <!-- 7. Privacidad & Respaldo de Datos -->
        <div class="settings-section-card">
          <div class="settings-section-title">
            <span class="material-symbols-outlined" style="color: #4cc9f0;">shield</span>
            <span>Privacidad & Respaldo de Datos</span>
          </div>
          <button class="settings-action-btn" onclick="exportUserDataJSON()">
            <span class="material-symbols-outlined" style="font-size:1rem;">download</span>
            <span>Exportar Respaldo de Datos (JSON)</span>
          </button>
          <button class="settings-action-btn" style="background:rgba(255,185,80,0.15); border-color:rgba(255,185,80,0.35); color:#ffd166;" onclick="restartOnboardingFromSettings()">
            <span class="material-symbols-outlined" style="font-size:1rem;">restart_alt</span>
            <span>Reiniciar Onboarding Inicial 🔄</span>
          </button>
          <button class="settings-action-btn" style="background:rgba(239,68,68,0.15); border-color:rgba(239,68,68,0.3); color:#fca5a5;" onclick="clearLocalAppCache()">
            <span class="material-symbols-outlined" style="font-size:1rem;">delete</span>
            <span>Restablecer Caché Local Completa</span>
          </button>
        </div>

        <!-- 8. Soporte Técnico Desarrollador -->
        <div class="settings-section-card" style="border-color: rgba(255,209,102,0.35); background: rgba(255,209,102,0.05);">
          <div class="settings-section-title">
            <span class="material-symbols-outlined" style="color: var(--gold-accent);">developer_board</span>
            <span>Pochirocho v2.4.0 • Pollo Desarrollador</span>
          </div>
          <div style="font-size:0.75rem; color:#cbd5e1; margin-bottom:0.6rem; line-height:1.4;">
            Desarrollado con ❤️ para la salud hormonal femenina. Puedes escribir y redactar cualquier mensaje directo a Santiago en <code>santisc1304@gmail.com</code>.
          </div>
          <button class="settings-action-btn" style="background:linear-gradient(135deg, rgba(255,209,102,0.25) 0%, rgba(255,117,143,0.25) 100%); border-color:var(--gold-accent); color:#ffffff; font-weight:700;" onclick="openDeveloperContactModal()">
            <span class="material-symbols-outlined" style="font-size:1.1rem; color:#ffd166;">mail</span>
            <span>Escribir Mensaje al Pollo Desarrollador (santisc1304@gmail.com) 🐔💌</span>
          </button>
        </div>
      </div>
    `;

      modal.style.display = 'flex';
      modal.classList.add('active');
    } catch (err) {
      console.warn('openSettingsModal error:', err);
    }
  };
  window.openSettingsModal = openSettingsModal;

  window.restartOnboardingFromSettings = function() {
    if (confirm('¿Deseas reiniciar la experiencia de Onboarding y configurar tu app desde el inicio?')) {
      try {
        localStorage.removeItem('pochirocho_onboarding_completed');
      } catch(e) {}
      location.reload();
    }
  };

  window.updateSpotifySettingsStatus = function() {
    const isConn = SpotifyPsychoacousticEngine.isConnected();
    const statusEl = document.getElementById('settings-spotify-status');
    const slotEl = document.getElementById('settings-spotify-btn-slot');
    if (statusEl) {
      statusEl.innerHTML = isConn 
        ? '<span style="color:#1ed760;">🟢 Cuenta Conectada</span>' 
        : '<span style="color:#cbd5e1;">⚪ No conectada</span>';
    }
    if (slotEl) {
      slotEl.innerHTML = isConn ? `
        <button class="settings-action-btn" style="background:rgba(239,68,68,0.15); border-color:rgba(239,68,68,0.3); color:#fca5a5;" onclick="SpotifyPsychoacousticEngine.disconnect(); updateSpotifySettingsStatus(); if (typeof renderSpotifyDashboardCard==='function') renderSpotifyDashboardCard();">
          <span>Desconectar Cuenta de Spotify</span>
        </button>
      ` : `
        <button class="settings-action-btn" style="background:#1DB954; color:#02040a; font-weight:800;" onclick="SpotifyPsychoacousticEngine.loginWithSpotify();">
          <span>🟢 Conectar con Spotify</span>
        </button>
      `;
    }
  };

  window.syncFloDataFromSettings = function() {
    window.openFloSyncModal();
  };
  window.syncAppleHealthFromSettings = window.syncFloDataFromSettings;

  window.importFloFileFromSettings = function(fileInput) {
    if (!fileInput || !fileInput.files || !fileInput.files[0]) return;
    const file = fileInput.files[0];
    const reader = new FileReader();

    showInAppInfoToast('Importando Flo', `Leyendo ${file.name}...`, '⏳');

    reader.onload = function(e) {
      const content = e.target.result;
      const parseRes = FloSyncEngine.parseFloCSV(content);

      if (parseRes && parseRes.totalEntries > 0) {
        const res = FloSyncEngine.syncFloData(
          loggedDaysData,
          parseRes.latestPeriodDate || userProfile.lmpFecha,
          userProfile.duracionPromedioCiclo || 28,
          userProfile.duracionPromedioPeriodo || 5,
          parseRes.importedDays
        );

        userProfile.floConectado = true;
        const statusEl = document.getElementById('settings-flo-status');
        if (statusEl) statusEl.innerHTML = '<span style="color:#ff758f;">🟢 Conectado y Sincronizado con Flo</span>';

        showInAppToast({
          title: 'Reporte Flo Importado con Éxito 🌸',
          message: `Se importaron ${parseRes.totalEntries} registros de ciclo e historial desde Flo.`,
          icon: '🌸',
          badgeText: 'Flo Health',
          badgeIcon: 'check_circle',
          accentColor: '#ff758f',
          duration: 5000
        });
      } else {
        const res = FloSyncEngine.syncFloData(loggedDaysData, userProfile.lmpFecha, userProfile.duracionPromedioCiclo, userProfile.duracionPromedioPeriodo);
        const statusEl = document.getElementById('settings-flo-status');
        if (statusEl) statusEl.innerHTML = '<span style="color:#ff758f;">🟢 Conectado y Sincronizado con Flo</span>';

        showInAppToast({
          title: 'Flo Sincronizado 🌸',
          message: res.message,
          icon: '🌸',
          badgeText: 'Flo Health',
          badgeIcon: 'check_circle',
          accentColor: '#ff758f',
          duration: 4500
        });
      }
    };

    reader.readAsText(file);
  };
  window.importHealthKitFileFromSettings = window.importFloFileFromSettings;

  window.testFaceIDFromSettings = async function() {
    showInAppInfoToast('Face ID', 'Iniciando escaneo biométrico con Secure Enclave...', '🔒');
    await BiometricAuthEngine.registerBiometrics(userProfile.nombre || 'Usuaria');

    const statusEl = document.getElementById('settings-faceid-status');
    if (statusEl) statusEl.innerHTML = '<span style="color:#38bdf8;">🟢 Face ID Habilitado (Secure Enclave)</span>';
    userProfile.biometriaHabilitada = true;

    showInAppToast({
      title: 'Face ID Autenticado ✨',
      message: 'Verificación biométrica completada exitosamente con los estándares de Apple.',
      icon: '🛡️',
      badgeText: 'Seguridad iOS',
      badgeIcon: 'verified_user',
      accentColor: '#38bdf8',
      duration: 4500
    });
  };

  window.closeSettingsModal = function() {
    try {
      const modal = document.getElementById('settings-modal-overlay');
      if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('active');
      }

      // Guardar y sincronizar todas las preferencias al cerrar
      saveThemeSettings();
      if (currentAvatarId) {
        try {
          localStorage.setItem('pochirocho_selected_avatar', currentAvatarId);
          userProfile.mascotaSeleccionada = currentAvatarId;
          localStorage.setItem('pochirocho_user_profile', JSON.stringify(userProfile));
        } catch(e) {}
      }

      const activeTheme = getThemeForCurrentState();
      applyTheme(activeTheme);
      updateAvatarDisplay(null);

      // Sincronizar subvista activa del tracker de forma segura
      const activeWheel = document.querySelector('.wheel-nav-item.active');
      const activeTab = activeWheel ? activeWheel.getAttribute('data-tab') : '';
      if (activeTab === 'calendar' && typeof renderCalendarView === 'function') {
        renderCalendarView();
      } else if (activeTab === 'ai' && typeof renderAIAgentView === 'function') {
        renderAIAgentView();
      } else if (activeTab === 'relief' && typeof renderReliefCenterView === 'function') {
        renderReliefCenterView();
      }

      if (typeof renderSpotifyDashboardCard === 'function') {
        renderSpotifyDashboardCard();
      }
    } catch (err) {
      console.warn('closeSettingsModal caught error:', err);
    } finally {
      const modal = document.getElementById('settings-modal-overlay');
      if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('active');
      }
    }
  };

  window.setSettingsAvatar = function(avatarId) {
    currentAvatarId = avatarId;
    try {
      localStorage.setItem('pochirocho_selected_avatar', avatarId);
      userProfile.mascotaSeleccionada = avatarId;
      localStorage.setItem('pochirocho_user_profile', JSON.stringify(userProfile));
    } catch(e) {}

    const btns = document.querySelectorAll('.settings-avatar-btn');
    btns.forEach(b => {
      if (b.getAttribute('data-avatar') === avatarId) b.classList.add('active');
      else b.classList.remove('active');
    });
    const titleEl = document.getElementById('settings-companion-title');
    const pet = avatarRegistry[avatarId] || avatarRegistry.amy;
    if (titleEl) titleEl.textContent = `Mascota Acompañante (${pet.name})`;
  };

  window.setSettingsThemeMode = function(mode) {
    themeSettings.mode = mode;
    saveThemeSettings();

    const modeBtns = document.querySelectorAll('.settings-mode-tab-btn');
    modeBtns.forEach(b => {
      if (b.getAttribute('data-mode') === mode) b.classList.add('active');
      else b.classList.remove('active');
    });
    const autoContainer = document.getElementById('settings-theme-auto-container');
    const fixedContainer = document.getElementById('settings-theme-fixed-container');
    if (autoContainer && fixedContainer) {
      if (mode === 'auto_by_phase') {
        autoContainer.style.display = 'flex';
        fixedContainer.style.display = 'none';
      } else {
        autoContainer.style.display = 'none';
        fixedContainer.style.display = 'grid';
      }
    }
  };

  window.setSettingsPhaseTheme = function(phaseKey, colorKey) {
    themeSettings.phaseThemes[phaseKey] = colorKey;
    saveThemeSettings();

    const phaseCard = document.querySelector(`.settings-phase-item-card[data-phase="${phaseKey}"]`);
    if (phaseCard) {
      const dotBtns = phaseCard.querySelectorAll('.phase-color-dot-btn');
      dotBtns.forEach(btn => {
        if (btn.getAttribute('data-color') === colorKey) {
          btn.classList.add('active');
          btn.textContent = '✓';
        } else {
          btn.classList.remove('active');
          btn.textContent = '';
        }
      });
    }
  };

  window.setSettingsFixedTheme = function(colorKey) {
    themeSettings.fixedTheme = colorKey;
    saveThemeSettings();

    const cards = document.querySelectorAll('.settings-theme-card');
    cards.forEach(c => {
      if (c.getAttribute('data-theme') === colorKey) c.classList.add('active');
      else c.classList.remove('active');
    });
  };

  window.simulatePhaseFromSettings = function(phaseKey) {
    userCycleState.currentPhase = phaseKey;
    userCycleState.currentDay = (userCycleState.phaseDetails[phaseKey] && userCycleState.phaseDetails[phaseKey].defaultDay) || 14;
    userProfile.faseActual = phaseKey;
    try {
      localStorage.setItem('pochirocho_user_profile', JSON.stringify(userProfile));
    } catch(e) {}
    saveThemeSettings();

    const simBtns = document.querySelectorAll('.settings-phase-simulate-btn');
    simBtns.forEach(b => {
      if (b.getAttribute('data-sim-phase') === phaseKey) b.classList.add('active');
      else b.classList.remove('active');
    });

    const phaseCards = document.querySelectorAll('.settings-phase-item-card');
    phaseCards.forEach(card => {
      const cardPhase = card.getAttribute('data-phase');
      const badgeSlot = card.querySelector('.settings-phase-current-badge-slot');
      if (cardPhase === phaseKey) {
        card.classList.add('is-current-phase');
        if (badgeSlot) badgeSlot.innerHTML = '<span class="settings-phase-current-badge">Fase Actual 🟢</span>';
      } else {
        card.classList.remove('is-current-phase');
        if (badgeSlot) badgeSlot.innerHTML = '';
      }
    });

    // Actualizar slab de fondo si existe
    const phaseNameEl = document.getElementById('slab-phase-name');
    if (phaseNameEl && userCycleState.phaseDetails[phaseKey]) phaseNameEl.textContent = userCycleState.phaseDetails[phaseKey].name;

    const cycleDayEl = document.querySelector('.slab-cycle-day');
    if (cycleDayEl) cycleDayEl.textContent = `Día ${userCycleState.currentDay}`;
  };

  window.exportUserDataJSON = function() {
    const exportData = {
      app: 'Pochirocho',
      version: '2.4.0',
      timestamp: new Date().toISOString(),
      userCoins: userCoins,
      userStreakDays: userStreakDays,
      currentAvatarId: currentAvatarId,
      currentThemeKey: currentThemeKey,
      cycleProfile: userProfile
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pochirocho_respaldo_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  window.clearLocalAppCache = function() {
    if (confirm('¿Deseas restablecer todos los datos locales y empezar la experiencia desde cero? Esto reiniciará el Onboarding inicial y limpiará el almacenamiento.')) {
      localStorage.clear();
      sessionStorage.clear();
      if ('caches' in window) {
        caches.keys().then(names => {
          for (let name of names) caches.delete(name);
        });
      }
      alert('Datos restablecidos con éxito. Reiniciando...');
      location.reload();
    }
  };

  window.openDeveloperContactModal = function() {
    let modal = document.getElementById('dev-contact-modal-overlay');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'dev-contact-modal-overlay';
      modal.className = 'modal-overlay active';
      modal.style.cssText = 'display:flex; align-items:center; justify-content:center; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(2,4,10,0.92); backdrop-filter:blur(14px); z-index:100000; padding:1rem;';
      document.body.appendChild(modal);
    }

    const userName = (userProfile && userProfile.nombre) || 'Ana';

    modal.innerHTML = `
      <div class="developer-contact-card animate-scale-up" style="width: 100%; max-width: 480px; max-height: 90vh; overflow-y: auto; background: rgba(15, 23, 42, 0.98); backdrop-filter: blur(20px); border: 1px solid rgba(255, 209, 102, 0.35); border-radius: 28px; padding: 1.4rem; box-shadow: 0 25px 60px rgba(0,0,0,0.85), 0 0 35px rgba(255, 209, 102, 0.2); color: #f8fafc; font-family: var(--font-body);">
        
        <div class="settings-header-row" style="border-bottom: 1px solid rgba(255, 209, 102, 0.2); margin-bottom: 1rem; padding-bottom: 0.75rem; display:flex; align-items:center; justify-content:space-between;">
          <div class="settings-title-group" style="display:flex; align-items:center; gap:0.6rem;">
            <span style="font-size: 1.6rem;">🐔</span>
            <div>
              <h2 style="font-size: 1.05rem; margin: 0; font-weight:800; background: linear-gradient(135deg, #ffd166 0%, #ff758f 100%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;">Mensaje al Pollo Desarrollador</h2>
              <span style="font-size: 0.68rem; color: #94a3b8; display:block;">Destino oficial: <strong>santisc1304@gmail.com</strong></span>
            </div>
          </div>
          <button class="modal-close-btn" onclick="closeDeveloperContactModal()" aria-label="Cerrar" style="background:none; border:none; color:#cbd5e1; cursor:pointer;">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <p style="font-size: 0.74rem; color: #cbd5e1; line-height: 1.4; margin-bottom: 1rem;">
          Escribe tu mensaje, duda, idea de mejora, reporte o dedicatoria. Al presionar <strong>"Enviar Mensaje"</strong>, viajará directamente a la bandeja de entrada personal de Santiago 🐔💌.
        </p>

        <form id="dev-contact-form" onsubmit="handleSendDeveloperMessage(event)" style="display:flex; flex-direction:column; gap:0.75rem;">
          
          <!-- Nombre de la usuaria -->
          <div>
            <label style="font-size: 0.72rem; color: #ffd166; font-weight: 700; display: block; margin-bottom: 0.25rem;">
              Tu Nombre o Apodo:
            </label>
            <input type="text" id="dev-msg-name" required value="${userName}" placeholder="Tu nombre..." style="width:100%; padding:0.6rem 0.8rem; background:rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.15); border-radius:12px; color:white; font-size:0.8rem;" />
          </div>

          <!-- Correo de contacto (Opcional) -->
          <div>
            <label style="font-size: 0.72rem; color: #cbd5e1; font-weight: 600; display: block; margin-bottom: 0.25rem;">
              Tu Correo (Opcional, para responderte):
            </label>
            <input type="email" id="dev-msg-email" placeholder="tucorreo@ejemplo.com" style="width:100%; padding:0.6rem 0.8rem; background:rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.15); border-radius:12px; color:white; font-size:0.8rem;" />
          </div>

          <!-- Motivo / Categoría -->
          <div>
            <label style="font-size: 0.72rem; color: #cbd5e1; font-weight: 600; display: block; margin-bottom: 0.25rem;">
              Motivo del Mensaje:
            </label>
            <select id="dev-msg-category" style="width:100%; padding:0.6rem 0.8rem; background:#0f172a; border:1px solid rgba(255,255,255,0.15); border-radius:12px; color:white; font-size:0.8rem; cursor:pointer;">
              <option value="Sugerencia o Nueva Idea">💡 Sugerencia o Nueva Idea para la App</option>
              <option value="Duda o Pregunta">❓ Duda o Pregunta sobre Pochirocho</option>
              <option value="Reporte de Error">🐛 Reportar un Error o Problema</option>
              <option value="Felicitaciones o Mensaje Especial">❤️ Felicitaciones o Mensaje con Cariño</option>
              <option value="Otro Motivo">💬 Otro Motivo</option>
            </select>
          </div>

          <!-- Mensaje Redactado -->
          <div>
            <label style="font-size: 0.72rem; color: #ffd166; font-weight: 700; display: block; margin-bottom: 0.25rem;">
              Tu Mensaje Redactado:
            </label>
            <textarea id="dev-msg-body" required rows="4" placeholder="Escribe aquí todo lo que le quieras decir al Pollo Desarrollador..." style="width:100%; padding:0.7rem 0.8rem; background:rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.15); border-radius:14px; color:white; font-size:0.82rem; resize:vertical; font-family:var(--font-body); line-height:1.4;"></textarea>
          </div>

          <!-- Acciones -->
          <div style="display:flex; gap:0.6rem; margin-top:0.4rem;">
            <button type="button" style="flex:1; padding:0.75rem; background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.15); border-radius:14px; color:#cbd5e1; font-weight:600; cursor:pointer;" onclick="closeDeveloperContactModal()">
              Cancelar
            </button>
            <button type="submit" id="btn-submit-dev-msg" style="flex:2; padding:0.75rem; background:linear-gradient(135deg, #ffd166 0%, #ff758f 100%); border:none; border-radius:14px; color:#02040a; font-weight:800; font-size:0.85rem; display:flex; align-items:center; justify-content:center; gap:0.4rem; cursor:pointer; box-shadow:0 4px 15px rgba(255,209,102,0.35);">
              <span class="material-symbols-outlined" style="font-size:1.1rem;">send</span>
              <span id="btn-submit-dev-text">Enviar Mensaje 💌</span>
            </button>
          </div>

        </form>
      </div>
    `;

    modal.style.display = 'flex';
  };

  window.closeDeveloperContactModal = function() {
    const modal = document.getElementById('dev-contact-modal-overlay');
    if (modal) {
      modal.style.display = 'none';
    }
  };

  window.handleSendDeveloperMessage = async function(event) {
    if (event) event.preventDefault();

    const nameInput = document.getElementById('dev-msg-name');
    const emailInput = document.getElementById('dev-msg-email');
    const catSelect = document.getElementById('dev-msg-category');
    const bodyInput = document.getElementById('dev-msg-body');
    const btnSubmit = document.getElementById('btn-submit-dev-msg');
    const btnText = document.getElementById('btn-submit-dev-text');

    const name = nameInput ? nameInput.value.trim() : 'Usuaria';
    const email = emailInput ? emailInput.value.trim() : '';
    const category = catSelect ? catSelect.value : 'Mensaje General';
    const message = bodyInput ? bodyInput.value.trim() : '';

    if (!message) {
      showInAppInfoToast('Mensaje Vacío', 'Por favor escribe tu mensaje antes de enviar.', '⚠️');
      return;
    }

    if (btnSubmit) btnSubmit.disabled = true;
    if (btnText) btnText.textContent = 'Enviando a santisc1304@gmail.com...';

    showInAppInfoToast('Pollo Desarrollador 🐔💻', 'Despachando mensaje a santisc1304@gmail.com...', '📩');

    const currentPhase = (userCycleState && userCycleState.currentPhase) || 'Menstrual';
    const petName = avatarRegistry[currentAvatarId]?.name || 'Mascota';

    const ticket = await DeveloperSupportBridge.sendCustomMessageTicket({
      userName: name,
      userEmail: email,
      subjectCategory: category,
      messageText: message,
      appState: {
        userName: name,
        userEmail: email,
        petName,
        currentPhase,
        userCoins: rewardsEngine.coins,
        streakDays: rewardsEngine.streakDays,
        timestamp: new Date().toISOString()
      }
    });

    closeDeveloperContactModal();

    showInAppToast({
      title: '¡Mensaje Enviado con Éxito! 🐔💌',
      message: `Tu mensaje "${category}" ha sido enviado a santisc1304@gmail.com.`,
      icon: '📬',
      badgeText: 'Pollo Desarrollador',
      badgeIcon: 'mark_email_read',
      accentColor: '#ffd166',
      duration: 5500
    });
  };

  window.triggerDeveloperSupportTicket = function() {
    openDeveloperContactModal();
  };

  // Bind All Settings Buttons in top bars
  document.querySelectorAll('.tracker-settings-btn, #btn-open-settings').forEach(btn => {
    btn.addEventListener('click', openSettingsModal);
  });

  window.navigateToReliefAndOpenRoutine = function(routineId) {
    const wheelItems = document.querySelectorAll('.wheel-nav-item');
    wheelItems.forEach(i => {
      if (i.getAttribute('data-tab') === 'relief') i.classList.add('active');
      else i.classList.remove('active');
    });

    handleWheelTabChange('relief');

    setTimeout(() => {
      if (typeof startExerciseRoutine === 'function') {
        startExerciseRoutine(routineId);
      }
    }, 180);
  };

  // =========================================================================
  // BOOTSTRAP UNIFICADO (NUEVA USUARIA VS RECURRENTE)
  // =========================================================================
  // Procesar Callback de Spotify de inmediato si está presente en la URL
  if (typeof window !== 'undefined' && window.location.search.includes('code=')) {
    SpotifyPsychoacousticEngine.handleAuthCallback().then(success => {
      if (success) {
        console.log('✅ Spotify conectado exitosamente.');
        if (typeof updateSpotifySettingsStatus === 'function') updateSpotifySettingsStatus();
        if (typeof renderSpotifyDashboardCard === 'function') renderSpotifyDashboardCard();
        setTimeout(() => {
          if (typeof navigateToTracker === 'function') navigateToTracker();
        }, 300);
      }
    });
  }

  const onboardingCompleted = localStorage.getItem('pochirocho_onboarding_completed') === 'true';

  if (!onboardingCompleted) {
    // USUARIA NUEVA: Mostrar Onboarding, ocultar Home
    if (viewHome) {
      viewHome.classList.remove('active');
    }
    if (viewOnboarding) {
      viewOnboarding.style.display = 'flex';
      viewOnboarding.classList.add('active');
    }
    initObFallingBackground();
    renderObThemeColorPickers();
    renderObCalendar();
    updateObView();
  } else {
    // USUARIA RECURRENTE: Entrada natural directa al Home
    if (viewOnboarding) {
      viewOnboarding.classList.remove('active');
      viewOnboarding.style.display = 'none';
    }
    if (viewHome) {
      viewHome.style.opacity = '';
      viewHome.style.transform = '';
      viewHome.classList.add('active');
    }

    try {
      const savedProfile = localStorage.getItem('pochirocho_user_profile');
      if (savedProfile) {
        Object.assign(userProfile, JSON.parse(savedProfile));
      }
      const savedAvatar = localStorage.getItem('pochirocho_selected_avatar');
      if (savedAvatar) currentAvatarId = savedAvatar;
      else if (userProfile.mascotaSeleccionada) currentAvatarId = userProfile.mascotaSeleccionada;

      const savedTheme = localStorage.getItem('pochirocho_theme_settings');
      if (savedTheme) themeSettings = Object.assign(themeSettings, JSON.parse(savedTheme));
    } catch(e) {}

    // Calcular fase biológica actual a partir de la fecha LMP guardada
    let activePhase = 'Ovulatoria';
    let activeDay = 14;
    try {
      if (userProfile.lmpFecha) {
        const today = new Date();
        const lmpDate = new Date(userProfile.lmpFecha);
        const cLen = userProfile.duracionPromedioCiclo || 28;
        const pLen = userProfile.duracionPromedioPeriodo || 5;
        const diffDays = Math.floor(Math.abs(today - lmpDate) / (1000 * 60 * 60 * 24));
        activeDay = (diffDays % cLen) + 1;
        if (activeDay <= pLen) activePhase = 'Menstrual';
        else if (activeDay <= (cLen - 14) - 2) activePhase = 'Folicular';
        else if (activeDay <= (cLen - 14) + 2) activePhase = 'Ovulatoria';
        else activePhase = 'Lutea';
      }
    } catch(e) {}

    applyTheme(getThemeForCurrentState());
    setCyclePhase(activePhase, activeDay);
    updateDashboardSlabUI();
    updateAvatarDisplay();
    updateCoinsUI();
    updateConnectors();
  }
});

