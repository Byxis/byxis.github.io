import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export interface ReadmeResult {
  content: string;
  owner: string;
  repo: string;
  branch: string;
}

export interface IGithubService {
  getReadme(owner: string, repo: string): Observable<ReadmeResult>;
  getReadmeByUrl(githubUrl: string): Observable<ReadmeResult>;
}

export const GITHUB_SERVICE_TOKEN = new InjectionToken<IGithubService>('GITHUB_SERVICE_TOKEN');
