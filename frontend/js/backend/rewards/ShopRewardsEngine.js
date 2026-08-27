/**
 * ShopRewardsEngine.js
 * Motor de Economía de Pochipesos (🪙), Tareas Diarias, Hitos de Rutinas y Recompensas
 */

export class ShopRewardsEngine {
  constructor(coins = 350, streakDays = 5, totalRoutines = 0) {
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
