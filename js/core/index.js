/**
 * @fileoverview PatiLingo Clean Architecture & ES6 Module Bootstrap
 * Tüm katmanları (Core, Domain, Infrastructure, Application, Services, Components) DI Container içinde birleştirir.
 */
import { config } from './config.js';
import { EventBus, eventBus } from './events.js';
import { ServiceContainer, container } from './container.js';
import { ErrorHandler, errorHandler } from './error-handler.js';
import { compose, loggingMiddleware, validationMiddleware, authMiddleware, analyticsMiddleware } from './middleware.js';
import { PluginSystem, pluginSystem } from './plugin-system.js';
import { AppStore, store } from './store.js';
import { Router, router } from './router.js';

import { Lesson } from '../domain/entities/lesson.js';
import { User } from '../domain/entities/user.js';
import { Word } from '../domain/entities/word.js';
import { XPScore } from '../domain/value-objects/xp-score.js';

import { StorageRepository } from '../infrastructure/repositories/storage-repository.js';
import { UserRepository } from '../infrastructure/repositories/user-repository.js';
import { LessonRepository } from '../infrastructure/repositories/lesson-repository.js';
import { ProgressRepository } from '../infrastructure/repositories/progress-repository.js';
import { GeminiClient } from '../infrastructure/api/gemini-client.js';

import { StartLessonUseCase } from '../application/use-cases/start-lesson.js';
import { CompleteLessonUseCase } from '../application/use-cases/complete-lesson.js';

import { AIService } from '../services/ai.js';
import { AuthService } from '../services/auth.js';
import { StorageService } from '../services/storage.js';
import { AnalyticsService, analyticsService, analyticsPlugin } from '../services/analytics.js';

import { BaseComponent } from '../components/base-component.js';
import { NavComponent, renderNav } from '../components/nav/index.js';
import { renderHome, createHero, createDashboard } from '../components/home/index.js';
import { renderLesson, createQuestionView, createFeedbackBanner } from '../components/lesson/index.js';
import { renderAI } from '../components/ai/index.js';
import { renderProgress } from '../components/progress/index.js';
import { renderSettings } from '../components/settings/index.js';

// Dependency Injection Kayıtları
container.register('config', () => config);
container.register('eventBus', () => eventBus);
container.register('errorHandler', () => errorHandler);
container.register('pluginSystem', () => pluginSystem);
container.register('storageRepository', () => new StorageRepository(config.app.storeKey));
container.register('store', (c) => new AppStore({
  storageRepo: c.get('storageRepository'),
  eventBus: c.get('eventBus')
}));
container.register('userRepository', (c) => new UserRepository(c.get('storageRepository')));
container.register('lessonRepository', () => new LessonRepository());
container.register('progressRepository', (c) => new ProgressRepository(c.get('storageRepository')));
container.register('geminiClient', (c) => new GeminiClient({
  getApiKey: () => c.get('store').state.settings?.apiKey || ''
}));
container.register('aiService', (c) => new AIService(c.get('store'), c.get('geminiClient')));
container.register('authService', (c) => new AuthService(c.get('store'), c.get('eventBus')));
container.register('storageService', (c) => new StorageService(c.get('storageRepository')));
container.register('analyticsService', () => analyticsService);
container.register('startLessonUseCase', (c) => new StartLessonUseCase(
  c.get('lessonRepository'),
  c.get('progressRepository')
));
container.register('completeLessonUseCase', (c) => new CompleteLessonUseCase({
  store: c.get('store'),
  progressRepo: c.get('progressRepository'),
  eventBus: c.get('eventBus'),
  pluginSystem: c.get('pluginSystem')
}));

// Varsayılan Analitik Eklentisini Kaydet
pluginSystem.register(analyticsPlugin);

// Router Middleware Zinciri
router.use(loggingMiddleware);
router.use(validationMiddleware);
router.use(analyticsMiddleware);

// Tarayıcı ortamında global mimari köprüsünü dışa aç
if (typeof window !== 'undefined') {
  window.PatiLingoArch = {
    config,
    eventBus,
    container,
    errorHandler,
    pluginSystem,
    router
  };
}

export {
  config,
  EventBus,
  eventBus,
  ServiceContainer,
  container,
  ErrorHandler,
  errorHandler,
  compose,
  loggingMiddleware,
  validationMiddleware,
  authMiddleware,
  analyticsMiddleware,
  PluginSystem,
  pluginSystem,
  AppStore,
  store,
  Router,
  router,
  Lesson,
  User,
  Word,
  XPScore,
  StorageRepository,
  UserRepository,
  LessonRepository,
  ProgressRepository,
  GeminiClient,
  StartLessonUseCase,
  CompleteLessonUseCase,
  AIService,
  AuthService,
  StorageService,
  AnalyticsService,
  analyticsService,
  analyticsPlugin,
  BaseComponent,
  NavComponent,
  renderNav,
  renderHome,
  createHero,
  createDashboard,
  renderLesson,
  createQuestionView,
  createFeedbackBanner,
  renderAI,
  renderProgress,
  renderSettings
};
