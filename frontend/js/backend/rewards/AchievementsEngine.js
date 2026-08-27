/**
 * AchievementsEngine.js
 * Motor Avanzado de 15 Logros (10 Periódicos Acumulativos + 5 Logros Ocultos/Secretos con Acertijos Cortos)
 * Otorga +45 Pochipesos (🪙) por cada meta alcanzada.
 */

export class AchievementsEngine {
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
