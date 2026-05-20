import { InjectionToken } from '@angular/core';

export interface IMarkdownService {
  parse(markdown: string): string;
}

export const MARKDOWN_SERVICE_TOKEN = new InjectionToken<IMarkdownService>('MARKDOWN_SERVICE_TOKEN');
