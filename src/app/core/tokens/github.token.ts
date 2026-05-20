import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export interface IGithubService {
  getReadme(owner: string, repo: string): Observable<string>;
  getReadmeByUrl(githubUrl: string): Observable<string>;
}

export const GITHUB_SERVICE_TOKEN = new InjectionToken<IGithubService>('GITHUB_SERVICE_TOKEN');
