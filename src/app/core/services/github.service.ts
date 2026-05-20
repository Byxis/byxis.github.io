import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { IGithubService } from '../tokens/github.token';

@Injectable({
  providedIn: 'root'
})
export class GithubApiService implements IGithubService {
  private readonly http = inject(HttpClient);

  getReadme(owner: string, repo: string): Observable<string> {
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/readme`;

    return this.http.get<{ content: string; encoding: string }>(apiUrl).pipe(
      map(response => {
        if (response.encoding === 'base64') {
          const cleanedContent = response.content.replace(/\s/g, '');
          return decodeURIComponent(
            atob(cleanedContent)
              .split('')
              .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join('')
          );
        }
        return '';
      }),
      catchError(error => {
        console.warn(`GitHub API failed, attempting raw fallback for ${owner}/${repo}:`, error);
        return this.getReadmeFallback(owner, repo);
      })
    );
  }

  getReadmeByUrl(githubUrl: string): Observable<string> {
    const parts = this.parseGithubUrl(githubUrl);
    if (!parts) {
      return of(`**Erreur**: L'URL GitHub '${githubUrl}' est invalide.`);
    }
    return this.getReadme(parts.owner, parts.repo);
  }

  private getReadmeFallback(owner: string, repo: string): Observable<string> {
    const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/README.md`;
    return this.http.get(rawUrl, { responseType: 'text' }).pipe(
      catchError(() => {
        const rawUrlMaster = `https://raw.githubusercontent.com/${owner}/${repo}/master/README.md`;
        return this.http.get(rawUrlMaster, { responseType: 'text' }).pipe(
          catchError(() => {
            return of(
              `# ${repo}\n\n` +
              `> ⚠️ **Informations indisponibles** : Impossible de charger le README depuis GitHub.\n\n` +
              `Ce projet est hébergé sur GitHub. Vous pouvez y accéder directement via le lien suivant :\n` +
              `👉 [Visiter le dépôt GitHub](https://github.com/${owner}/${repo})\n\n` +
              `## Aperçu rapide\n` +
              `Ce projet met en évidence les compétences en architecture logicielle, le développement d'interfaces fluides et l'application des principes SOLID.`
            );
          })
        );
      })
    );
  }

  private parseGithubUrl(url: string): { owner: string; repo: string } | null {
    try {
      const cleanedUrl = url.replace(/\/$/, '');
      const urlObj = new URL(cleanedUrl);
      if (urlObj.hostname.includes('github.com')) {
        const pathParts = urlObj.pathname.split('/').filter(Boolean);
        if (pathParts.length >= 2) {
          return { owner: pathParts[0], repo: pathParts[1] };
        }
      }
    } catch (e) {
      console.error('Failed to parse github url', e);
    }
    return null;
  }
}
