/**
 * @fileoverview Domain Entity: Lesson (Ders Varlığı ve İş Kuralları)
 */
import { config } from '../../core/config.js';

export class Lesson {
  /**
   * @param {{ id: string, title?: string, type?: string, index?: number, words?: Array<any>, grammar?: any, requiredXP?: number, totalQuestions?: number, completedQuestions?: number }} props
   */
  constructor(props = {}) {
    if (!props.id || typeof props.id !== 'string') {
      throw new Error('Lesson id zorunludur.');
    }
    this.id = props.id;
    this.title = props.title || props.en || props.id;
    this.type = props.type || 'vocab';
    this.index = Number.isFinite(Number(props.index)) ? Number(props.index) : 0;
    this.words = Array.isArray(props.words) ? props.words : [];
    this.grammar = props.grammar || null;
    this.requiredXP = Number.isFinite(Number(props.requiredXP)) ? Math.max(0, Number(props.requiredXP)) : 0;
    this.totalQuestions = Math.max(1, Number(props.totalQuestions) || 10);
    this.completedQuestions = Math.max(0, Math.min(this.totalQuestions, Number(props.completedQuestions) || 0));
  }

  get completionPercentage() {
    return Math.round((this.completedQuestions / this.totalQuestions) * 100);
  }

  /**
   * Kullanıcının bu dersi açıp açamayacağını kontrol eder.
   * @param {{ xp?: number, unlockedUpTo?: number }} userProgress
   */
  canUnlock(userProgress = {}) {
    const userXP = Number(userProgress.xp) || 0;
    const unlockedUpTo = Number.isFinite(Number(userProgress.unlockedUpTo)) ? Number(userProgress.unlockedUpTo) : 0;
    if (this.requiredXP > 0 && userXP < this.requiredXP) {
      return false;
    }
    return this.index <= unlockedUpTo;
  }

  /**
   * Ders skorunun geçme barajını (70%) aşıp aşmadığını hesaplar.
   * @param {number} scorePercent
   */
  isPassed(scorePercent) {
    return Number(scorePercent) >= config.progression.passThreshold;
  }
}

export default Lesson;
