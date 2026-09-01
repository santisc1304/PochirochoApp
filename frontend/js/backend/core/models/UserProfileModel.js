/**
 * UserProfileModel.js
 * Modelo de Usuario y Preferencias en Pochirocho
 */

export class UserProfileModel {
  constructor(data = {}) {
    this.id = data.id || 'default_user_profile';
    this.nombre = data.nombre || 'Ana';
    this.fechaNacimiento = data.fechaNacimiento || null;
    this.mascotaSeleccionada = data.mascotaSeleccionada || 'Erizo'; // Gatito, Monito, Pinguino, Ranita, Erizo
    this.esquemaColoresModo = data.esquemaColoresModo || 'auto_by_phase'; // auto_by_phase, fixed
    this.coloresFasesCustom = data.coloresFasesCustom || {
      Menstrual: 'red',
      Folicular: 'pink',
      Ovulatoria: 'blue',
      Lutea: 'yellow'
    };
    this.lmpFecha = data.lmpFecha || new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(); // 14 días atrás por defecto
    this.duracionPromedioCiclo = data.duracionPromedioCiclo || 28;
    this.duracionPromedioPeriodo = data.duracionPromedioPeriodo || 5;
    this.regularidad = data.regularidad || 'Regular';
    this.variacionCicloDias = data.variacionCicloDias || '1-2'; // 1-2, 3-5, 6+
    this.metodoAnticonceptivo = data.metodoAnticonceptivo || 'Ninguno';
    this.sintomaPrincipal = data.sintomaPrincipal || 'Cólicos';
    this.objetivoSalud = data.objetivoSalud || 'Bienestar General';
    this.healthKitConectado = data.healthKitConectado || false;
    this.biometriaHabilitada = data.biometriaHabilitada || false;
    this.desarrolladorEmail = data.desarrolladorEmail || 'santisc1304@gmail.com';
  }

  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      fechaNacimiento: this.fechaNacimiento,
      mascotaSeleccionada: this.mascotaSeleccionada,
      esquemaColoresModo: this.esquemaColoresModo,
      coloresFasesCustom: this.coloresFasesCustom,
      lmpFecha: this.lmpFecha,
      duracionPromedioCiclo: this.duracionPromedioCiclo,
      duracionPromedioPeriodo: this.duracionPromedioPeriodo,
      regularidad: this.regularidad,
      variacionCicloDias: this.variacionCicloDias,
      metodoAnticonceptivo: this.metodoAnticonceptivo,
      sintomaPrincipal: this.sintomaPrincipal,
      objetivoSalud: this.objetivoSalud,
      healthKitConectado: this.healthKitConectado,
      biometriaHabilitada: this.biometriaHabilitada,
      desarrolladorEmail: this.desarrolladorEmail
    };
  }
}
