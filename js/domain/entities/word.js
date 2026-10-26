/**
 * @fileoverview Domain Entity: Word (Kelime & Leitner SRS Aralıklı Tekrar Kuralları)
 */
import { config } from '../../core/config.js';

export class Word {
  /**
   * @param {{ en: string, tr: string, unitId?: string, box?: number, right?: number, wrong?: number, due?: string|null }} props
   */
  constructor(props = {}) {
    if (!props.en || !props.tr) {
      throw new Error('Kelime için "en" ve "tr" alanları zorunludur.');
    }
    this.en = String(props.en).trim();
    this.tr = String(props.tr).trim();
    this.unitId = props.unitId || 'u1';
    this.box = Math.max(0, Math.min(config.srs.boxes - 1, Math.floor(Number(props.box) || 0)));
    this.right = Math.max(0, Math.floor(Number(props.right) || 0));
    this.wrong = Math.max(0, Math.floor(Number(props.wrong) || 0));
    this.due = props.due || null;
  }

  /**
   * Cevaba göre Leitner kutusunu ve sonraki tekrar gününü günceller.
   * @param {boolean} isCorrect
   * @param {Date} [referenceDate]
   */
  recordAttempt(isCorrect, referenceDate = new Date()) {
    if (isCorrect) {
      this.right += 1;
      this.box = Math.min(config.srs.intervals.length - 1, this.box + 1);
    } else {
      this.wrong += 1;
      this.box = 1;
    }
    const waitDays = config.srs.intervals[this.box] ?? 1;
    const dueDate = new Date(referenceDate.getTime() + waitDays * 86400000);
    this.due = dueDate.toISOString().slice(0, 10);
    return { box: this.box, due: this.due, right: this.right, wrong: this.wrong };
  }
}

export default Word;
