import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { PROJECT_SERVICE_TOKEN } from './core/tokens/project.token';
import { MockProjectService } from './core/services/project.service';
import { GITHUB_SERVICE_TOKEN } from './core/tokens/github.token';
import { GithubApiService } from './core/services/github.service';
import { MARKDOWN_SERVICE_TOKEN } from './core/tokens/markdown.token';
import { MarkdownParserService } from './core/services/markdown.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    { provide: PROJECT_SERVICE_TOKEN, useClass: MockProjectService },
    { provide: GITHUB_SERVICE_TOKEN, useClass: GithubApiService },
    { provide: MARKDOWN_SERVICE_TOKEN, useClass: MarkdownParserService }
  ]
};
