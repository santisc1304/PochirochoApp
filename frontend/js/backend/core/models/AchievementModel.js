/**
 * AchievementModel.js
 * Modelo de Logros y Desafíos
 */

export class AchievementModel {
  constructor(data = {}) {
    this.id = data.id || '';
    this.title = data.title || '';
    this.level = data.level || 1;
    this.maxLevelDays = data.maxLevelDays || 7;
    this.currentDays = data.currentDays || 0;
    this.icon = data.icon || '🏆';
    this.reward = data.reward || 100;
    this.claimed = data.claimed || false;
    this.desc = data.desc || '';
    this.nextLevelText = data.nextLevelText || '';
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      level: this.level,
      maxLevelDays: this.maxLevelDays,
      currentDays: this.currentDays,
      icon: this.icon,
      reward: this.reward,
      claimed: this.claimed,
      desc: this.desc,
      nextLevelText: this.nextLevelText
    };
  }
}
