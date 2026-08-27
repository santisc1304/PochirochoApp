/**
 * RewardItemModel.js
 * Modelo de Ítems de la Tienda de Recompensas (Pochirocho Store)
 */

export class RewardItemModel {
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
