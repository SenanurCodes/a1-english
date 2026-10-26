/**
 * @fileoverview Domain Entity: User (Öğrenci Varlığı ve İlerleme Kuralları)
 */
export class User {
  /**
   * @param {{ id: string, name?: string, xp?: number, streakCount?: number, mascot?: string, theme?: string, isPro?: boolean, unlockedUpTo?: number }} props
   */
  constructor(props = {}) {
    this.id = props.id || 'u_guest';
    this.name = (typeof props.name === 'string' && props.name.trim()) ? props.name.trim() : 'Öğrenci';
    this.xp = Math.max(0, Math.floor(Number(props.xp) || 0));
    this.streakCount = Math.max(0, Math.floor(Number(props.streakCount) || 0));
    this.mascot = props.mascot || 'squirrel';
    this.theme = props.theme || 'nordic';
    this.isPro = Boolean(props.isPro);
    this.unlockedUpTo = Math.max(0, Math.floor(Number(props.unlockedUpTo) || 0));
  }

  addXP(amount) {
    const delta = Number(amount);
    if (!Number.isFinite(delta) || delta <= 0) {
      throw new Error('Eklenecek XP pozitif bir sayı olmalıdır.');
    }
    this.xp += Math.floor(delta);
    return this.xp;
  }

  upgradeToPro() {
    this.isPro = true;
    return this;
  }
}

export default User;
