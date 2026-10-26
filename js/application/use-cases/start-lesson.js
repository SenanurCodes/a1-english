/**
 * @fileoverview Application Use Case: StartLessonUseCase
 */
export class StartLessonUseCase {
  /**
   * @param {import('../../infrastructure/repositories/lesson-repository.js').LessonRepository} lessonRepository
   * @param {import('../../infrastructure/repositories/progress-repository.js').ProgressRepository} progressRepository
   */
  constructor(lessonRepository, progressRepository) {
    this.lessonRepo = lessonRepository;
    this.progressRepo = progressRepository;
  }

  async execute(lessonId, userId) {
    const lesson = this.lessonRepo.findById(lessonId);
    if (!lesson) {
      throw new Error(`Lesson not found: ${lessonId}`);
    }
    const progress = this.progressRepo.findByUser(userId);
    if (!lesson.canUnlock(progress)) {
      const err = new Error('Lesson locked');
      err.code = 'LESSON_LOCKED';
      throw err;
    }
    return lesson;
  }
}

export default StartLessonUseCase;
