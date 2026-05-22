import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
  name: 'safeResourceUrl',
  standalone: true
})
export class SafeResourceUrlPipe implements PipeTransform {
  private readonly sanitizer = inject(DomSanitizer);

  transform(value: string): SafeResourceUrl {
    if (!value) return '';
    const formattedUrl = this.formatEmbedUrl(value);
    return this.sanitizer.bypassSecurityTrustResourceUrl(formattedUrl);
  }

  private formatEmbedUrl(url: string): string {
    // Detect YouTube patterns and extract video ID
    const youtubeRegExp = /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(youtubeRegExp);

    if (match && match[1] && match[1].length === 11) {
      const videoId = match[1];
      // Use youtube-nocookie.com to bypass cookie consent redirects which cause X-Frame-Options sameorigin blocks
      return `https://www.youtube-nocookie.com/embed/${videoId}`;
    }

    return url;
  }
}

