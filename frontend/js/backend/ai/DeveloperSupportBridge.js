/**
 * DeveloperSupportBridge.js
 * Servicio de Comunicación y Notificación Directa al Pollo Desarrollador (santisc1304@gmail.com) 🐔💻
 */

export class DeveloperSupportBridge {
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

    // Despachar email real a santisc1304@gmail.com
    await this.dispatchEmailToDeveloper({
      subject: `🎁 [Pochirocho] ¡Recompensa Canjeada! ${rewardName} (#${ticket.id.slice(-6)})`,
      message: `¡Una usuaria ha canjeado una recompensa!\nProducto: ${rewardName}\nPrecio: ${rewardPrice} Pochipesos\nCódigo de Cupón: ${couponCode}\nCategoría: ${category}`,
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

    this.persistTicket(ticket);

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

  /**
   * Envía un ítem de la Lista de Deseos (con imagen y notas) a santisc1304@gmail.com
   */
  static async sendWishlistTicket({ title = '', category = 'General', priceEstimate = '', notes = '', imageDataUrl = null, timestamp = new Date().toISOString() }) {
    const ticket = {
      id: `wish_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      type: 'WISHLIST_ITEM',
      title,
      category,
      priceEstimate,
      notes,
      hasImage: !!imageDataUrl,
      timestamp,
      status: 'REGISTRADO_WISHLIST',
      developerEmail: this.developerEmail
    };

    this.ticketsEnviados.push(ticket);
    console.log(`🛍️ [POLLO DESARROLLADOR 🐔💻 -> ${this.developerEmail}] Nuevo deseo recibido:`, ticket);

    this.persistTicket(ticket);

    // Despachar email real a santisc1304@gmail.com
    await this.dispatchEmailToDeveloper({
      subject: `🛍️ [Pochirocho] Nuevo Deseo de tu Chica: ${title} (${category})`,
      message: `¡Tu chica ha agregado un nuevo deseo a su lista de recompensas!\n\nArtículo/Lugar: ${title}\nCategoría: ${category}\nPrecio/Presupuesto estimado: ${priceEstimate || 'No especificado'}\nNotas/Detalles: ${notes || 'Sin notas adicionales'}\nFecha: ${new Date(timestamp).toLocaleString('es-CO')}\n\nPuedes ver la imagen y detalles guardados en la app.`,
      data: {
        ticketId: ticket.id,
        tipo: 'LISTA_DE_DESEOS',
        articulo: title,
        categoria: category,
        precioEstimado: priceEstimate || 'N/A',
        notas: notes || 'N/A',
        adjuntoImagen: imageDataUrl ? 'Imagen adjunta registrada en dispositivo (DataURL)' : 'Sin imagen',
        fecha: timestamp
      }
    });

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

