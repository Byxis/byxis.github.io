import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Project } from '../models/project.model';

export interface IProjectService {
  getProjects(): Observable<Project[]>;
  getProjectById(id: string): Observable<Project | undefined>;
}

export const PROJECT_SERVICE_TOKEN = new InjectionToken<IProjectService>('PROJECT_SERVICE_TOKEN');
