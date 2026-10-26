import { createQuestionView } from './question.js';
import { createFeedbackBanner } from './feedback.js';

export { createQuestionView, createFeedbackBanner };

export function renderLesson(unitId) {
  if (typeof globalThis.screenLesson === 'function') {
    return globalThis.screenLesson(unitId);
  }
}
