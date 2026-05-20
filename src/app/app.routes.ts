import { Component, OnInit } from '@angular/core';
import { Routes } from '@angular/router';

@Component({
  template: '',
  standalone: true,
})
class ExternalRedirectComponent implements OnInit {
  ngOnInit() {
    window.location.href = 'https://youtube.com';
  }
}

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'explorer',
    loadComponent: () =>
      import('./features/explorer/explorer.component').then((m) => m.ExplorerComponent),
  },
  {
    path: 'linkedin',
    loadComponent: () =>
      import('./features/linkedin/linkedin.component').then((m) => m.LinkedinComponent),
  },
  {
    path: 'cv',
    loadComponent: () => import('./features/cv/cv.component').then((m) => m.CvComponent),
  },
  {
    path: 'project-videos',
    component: ExternalRedirectComponent,
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
