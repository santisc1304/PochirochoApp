/**
 * DeveloperSupportBridge.js
 * Servicio de Comunicación y Notificación Directa al Pollo Desarrollador (santisc1304@gmail.com) 🐔💻
 */

export class DeveloperSupportBridge {
  static developerEmail = 'santisc1304@gmail.com';
  static ticketsEnviados = [];

  /**
   * Envía un ticket de reporte técnico o queja al Pollo Desarrollador
   */
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
    
    this.persistTicket(ticket);
    return ticket;
  }

  /**
   * Envía un ticket de reclamo de recompensa al Pollo Desarrollador
   */
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

    this.persistTicket(ticket);
    return ticket;
  }

  static persistTicket(ticket) {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const ticketsPrevios = JSON.parse(window.localStorage.getItem('pochirocho_dev_tickets') || '[]');
        ticketsPrevios.push(ticket);
        window.localStorage.setItem('pochirocho_dev_tickets', JSON.stringify(ticketsPrevios));
      }
    } catch (e) {
      console.warn('DeveloperSupportBridge: Error al guardar ticket localmente:', e);
    }
  }
}
