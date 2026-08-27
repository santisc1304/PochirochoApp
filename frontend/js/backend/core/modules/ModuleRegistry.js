/**
 * ModuleRegistry.js
 * Registro dinámico de módulos y contrato AppModuleProtocol
 */

export class ModuleRegistry {
  constructor() {
    this.modulosRegistrados = new Map();
  }

  registrarModulo(modulo) {
    if (!modulo.id) {
      throw new Error('ModuleRegistry: Todo módulo debe contar con una propiedad id única.');
    }
    this.modulosRegistrados.set(modulo.id, modulo);
    console.log(`ModuleRegistry: Módulo '${modulo.nombreDisplay}' (${modulo.id}) registrado exitosamente.`);
  }

  obtenerModulo(id) {
    return this.modulosRegistrados.get(id);
  }

  listarModulosHabilitados() {
    return Array.from(this.modulosRegistrados.values()).filter(m => m.esHabilitado);
  }
}
