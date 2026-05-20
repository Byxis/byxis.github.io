import { Injectable } from '@angular/core';
import { marked } from 'marked';
import { IMarkdownService } from '../tokens/markdown.token';

@Injectable({
  providedIn: 'root'
})
export class MarkdownParserService implements IMarkdownService {
  constructor() {
    marked.use({
      gfm: true,
      breaks: true
    });
  }

  parse(markdown: string): string {
    if (!markdown) return '';
    try {
      const parsed = marked.parse(markdown);
      if (typeof parsed === 'string') {
        return parsed;
      }
      return markdown;
    } catch (e) {
      console.error('MarkdownParserService failed to parse markdown:', e);
      return markdown
        .replace(/#+\s+(.*)/g, '<h3>$1</h3>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/\n/g, '<br>');
    }
  }
}
