/**
 * @fileoverview Repository Pattern - LessonRepository (Müfredat Ünite Erişimi)
 */
import { Lesson } from '../../domain/entities/lesson.js';

export class LessonRepository {
  /**
   * @param {Array<any>} [unitsSource]
   */
  constructor(unitsSource = null) {
    this._units = unitsSource || (typeof globalThis !== 'undefined' && Array.isArray(globalThis.UNITS) ? globalThis.UNITS : []);
  }

  findAll() {
    return this._units.map((u, idx) => new Lesson({ ...u, index: u.index ?? idx }));
  }

  findById(lessonId) {
    const raw = this._units.find(u => u.id === lessonId);
    if (!raw) return null;
    return new Lesson(raw);
  }
}

export default LessonRepository;
