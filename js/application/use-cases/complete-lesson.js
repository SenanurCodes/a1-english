/**
 * @fileoverview Application Use Case: CompleteLessonUseCase
 */
import { config } from '../../core/config.js';

export class CompleteLessonUseCase {
  /**
   * @param {{ store: any, progressRepo: any, eventBus?: any, pluginSystem?: any }} deps
   */
  constructor({ store, progressRepo, eventBus = null, pluginSystem = null }) {
    this.store = store;
    this.progressRepo = progressRepo;
    this.eventBus = eventBus;
    this.pluginSystem = pluginSystem;
  }

  async execute({ lessonId, correct, total }) {
    const safeTotal = Math.max(1, Number(total) || 1);
    const safeCorrect = Math.max(0, Math.min(safeTotal, Number(correct) || 0));
    const score = Math.round((safeCorrect / safeTotal) * 100);
    const passed = score >= config.progression.passThreshold;
    const earnedXP = safeCorrect * config.xp.perCorrectAnswer;

    const unitRecord = this.progressRepo.saveUnitResult(lessonId, {
      score,
      correct: safeCorrect,
      total: safeTotal,
      passed
    });

    const totalXP = this.store.gainXP(earnedXP);
    const payload = { lessonId, score, passed, earnedXP, totalXP, unitRecord };

    if (this.eventBus) {
      this.eventBus.emit('lesson:completed', payload);
    }
    if (this.pluginSystem) {
      this.pluginSystem.executeHook('lesson:completed', payload);
    }
    return payload;
  }
}

export default CompleteLessonUseCase;
