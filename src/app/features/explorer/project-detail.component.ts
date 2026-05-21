import {
  Component,
  Input,
  Output,
  EventEmitter,
  inject,
  signal,
  OnChanges,
  SimpleChanges,
  HostListener,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Project } from '../../core/models/project.model';
import { GITHUB_SERVICE_TOKEN } from '../../core/tokens/github.token';
import { MARKDOWN_SERVICE_TOKEN } from '../../core/tokens/markdown.token';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { SafeHtmlPipe } from '../../shared/pipes/safe-html.pipe';
import { SafeResourceUrlPipe } from '../../shared/pipes/safe-resource-url.pipe';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, IconComponent, SafeHtmlPipe, SafeResourceUrlPipe],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss',
})
export class ProjectDetailComponent implements OnChanges, OnDestroy {
  private readonly githubService = inject(GITHUB_SERVICE_TOKEN);
  private readonly markdownService = inject(MARKDOWN_SERVICE_TOKEN);

  @Input() project: Project | null = null;
  @Output() close = new EventEmitter<void>();

  readonly isOpen = signal(false);
  readonly isLoadingReadme = signal(false);
  readonly readmeHtml = signal<string>('');

  private readmeSub?: Subscription;
  private readmeTimeout?: any;

  isArray = Array.isArray;

  @HostListener('document:keydown.escape')
  onEscapeKey() {
    if (this.isOpen()) {
      this.handleClose();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['project']) {
      const proj = changes['project'].currentValue as Project | null;
      
      this.cleanup();

      if (proj) {
        // Clear previous state and show loader immediately
        this.isLoadingReadme.set(true);
        this.readmeHtml.set('');

        // Trigger visual modal opening
        setTimeout(() => this.isOpen.set(true), 50);

        // Wait 500ms (until entry animation is fully complete) before doing heavy fetch & markdown parsing
        this.readmeTimeout = setTimeout(() => {
          this.fetchReadmeContent(proj);
        }, 500);
      } else {
        this.isOpen.set(false);
        this.readmeHtml.set('');
        this.isLoadingReadme.set(false);
      }
    }
  }

  ngOnDestroy() {
    this.cleanup();
  }

  private cleanup() {
    if (this.readmeTimeout) {
      clearTimeout(this.readmeTimeout);
      this.readmeTimeout = undefined;
    }
    if (this.readmeSub) {
      this.readmeSub.unsubscribe();
      this.readmeSub = undefined;
    }
  }

  handleClose() {
    this.isOpen.set(false);
    this.cleanup();
    setTimeout(() => {
      this.close.emit();
    }, 450);
  }

  private fetchReadmeContent(proj: Project) {
    if (!proj.githubUrl) {
      this.readmeHtml.set('');
      this.isLoadingReadme.set(false);
      return;
    }

    this.isLoadingReadme.set(true);
    this.readmeSub = this.githubService.getReadmeByUrl(proj.githubUrl).subscribe({
      next: (res) => {
        let html = this.markdownService.parse(res.content);
        if (res.owner && res.repo) {
          html = this.resolveRelativeUrls(html, res.owner, res.repo, res.branch);
        }
        this.readmeHtml.set(html);
        this.isLoadingReadme.set(false);
      },
      error: (err) => {
        console.error('Failed to load readme', err);
        this.readmeHtml.set(`
          <p style="color: #ff007a;">⚠️ Impossible de charger la documentation du dépôt.</p>
          <p>Le dépôt est peut-être privé ou l'API GitHub est temporairement inaccessible. Vous pouvez visiter le code directement sur <a href="${proj.githubUrl}" target="_blank">GitHub</a>.</p>
        `);
        this.isLoadingReadme.set(false);
      },
    });
  }

  private resolveRelativeUrls(html: string, owner: string, repo: string, branch: string): string {
    if (typeof document === 'undefined') {
      return html;
    }

    try {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;

      // 1. Resolve relative images
      const images = tempDiv.querySelectorAll('img');
      images.forEach((img) => {
        const src = img.getAttribute('src');
        if (
          src &&
          !src.startsWith('http://') &&
          !src.startsWith('https://') &&
          !src.startsWith('data:') &&
          !src.startsWith('/')
        ) {
          const cleanSrc = src.replace(/^\.\//, '');
          img.setAttribute(
            'src',
            `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${cleanSrc}`
          );
        }
      });

      // 2. Resolve relative links (buttons / anchors)
      const links = tempDiv.querySelectorAll('a');
      links.forEach((link) => {
        const href = link.getAttribute('href');
        if (
          href &&
          !href.startsWith('http://') &&
          !href.startsWith('https://') &&
          !href.startsWith('mailto:') &&
          !href.startsWith('tel:') &&
          !href.startsWith('#') &&
          !href.startsWith('/')
        ) {
          const cleanHref = href.replace(/^\.\//, '');
          link.setAttribute(
            'href',
            `https://github.com/${owner}/${repo}/blob/${branch}/${cleanHref}`
          );
          link.setAttribute('target', '_blank');
          link.setAttribute('rel', 'noopener noreferrer');
        }
      });

      return tempDiv.innerHTML;
    } catch (e) {
      console.error('Error resolving relative URLs', e);
      return html;
    }
  }
}
