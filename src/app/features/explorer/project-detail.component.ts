import {
  Component,
  Input,
  Output,
  EventEmitter,
  inject,
  signal,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../core/models/project.model';
import { GITHUB_SERVICE_TOKEN } from '../../core/tokens/github.token';
import { MARKDOWN_SERVICE_TOKEN } from '../../core/tokens/markdown.token';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { SafeHtmlPipe } from '../../shared/pipes/safe-html.pipe';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, IconComponent, SafeHtmlPipe],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss',
})
export class ProjectDetailComponent implements OnChanges {
  private readonly githubService = inject(GITHUB_SERVICE_TOKEN);
  private readonly markdownService = inject(MARKDOWN_SERVICE_TOKEN);

  @Input() project: Project | null = null;
  @Output() close = new EventEmitter<void>();

  readonly isOpen = signal(false);
  readonly isLoadingReadme = signal(false);
  readonly readmeHtml = signal<string>('');

  isArray = Array.isArray;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['project']) {
      const proj = changes['project'].currentValue as Project | null;
      if (proj) {
        setTimeout(() => this.isOpen.set(true), 50);
        this.fetchReadmeContent(proj);
      } else {
        this.isOpen.set(false);
        this.readmeHtml.set('');
      }
    }
  }

  handleClose() {
    this.isOpen.set(false);
    setTimeout(() => {
      this.close.emit();
    }, 450);
  }

  private fetchReadmeContent(proj: Project) {
    if (!proj.githubUrl) {
      this.readmeHtml.set('');
      return;
    }

    this.isLoadingReadme.set(true);
    this.githubService.getReadmeByUrl(proj.githubUrl).subscribe({
      next: (markdown) => {
        const html = this.markdownService.parse(markdown);
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
}
