import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs';
import { Project } from '../models/project.model';
import { IProjectService } from '../tokens/project.token';

@Injectable({
  providedIn: 'root'
})
export class MockProjectService implements IProjectService {
  private readonly http = inject(HttpClient);
  private readonly githubApiUrl = 'https://api.github.com/users/Byxis/repos';

  private readonly richMetadataFailsafe: Project[] = [
    {
      id: 'ruzzle',
      title: 'Ruzzle Engine & Game (Rust)',
      description: `Un jeu et un moteur graphique 3D complet écrit en Rust et OpenGL, avec une physique personnalisée et des shaders.`,
      longDescription: `Ruzzle est un projet de 4ème année d'école d'ingénieurs. Il comprend le développement complet d'un moteur de jeu en Rust avec OpenGL, gérant des contrôles fluides et une machine d'états d'animation. Le moteur intègre un système de Transform, des Colliders en deux phases (AABB puis détaillé), une gestion de la gravité et des shaders personnalisés. Les assets (crabe 3D, rig, animations) ont été modélisés dans Blender.`,
      imageUrl: undefined,
      tags: ['Rust', 'OpenGL', 'Blender', 'Physique', '3D', 'Moteur', 'Perso'],
      category: 'personal',
      githubUrl: 'https://github.com/Byxis/Ruzzle',
      liveUrl: undefined,
      technologies: ['Rust', 'OpenGL', 'Blender 3D', 'GLSL', 'State Machine', 'AABB Colliders'],
      featured: true
    },
    {
      id: 'webwarfare',
      title: 'WebWarfare - Multiplayer FPS Netcode',
      description: `Un FPS multijoueur sur navigateur gérant le netcode en temps réel avec compensation de latence et anti-triche.`,
      longDescription: `WebWarfare est un projet web de 3ème année d'école d'ingénieurs. Il se focalise sur l'architecture réseau en temps réel, implémentant une compensation de latence avancée (par moyenne de ping et tolérance de gigue/jitter) et une reconnexion automatique. Il intègre également un système anti-triche robuste simulant et vérifiant chaque action des joueurs en parallèle côté serveur.`,
      imageUrl: undefined,
      tags: ['Angular', 'Netcode', 'Real-time', 'Web', 'Anti-cheat', 'Projet'],
      category: 'academic',
      githubUrl: 'https://github.com/Byxis/IG3-WebProjectFPS',
      liveUrl: undefined,
      technologies: ['TypeScript', 'Node.js', 'WebSockets', 'Netcode', 'Lag Compensation', 'Server Simulation'],
      featured: true
    },
    {
      id: 'fireland',
      title: 'Fireland Minecraft Server Core',
      description: `Conception et architecture d'un serveur Minecraft Java de haute performance avec BDD multithreadée.`,
      longDescription: `Fireland is a Minecraft server core software and plugin system that leverages multithreaded and asynchronous tasks in Java to process database calls (MySQL) and gameplay logic, eliminating server-side tick lag and hosting a community of over 200 unique players.`,
      imageUrl: undefined,
      tags: ['Java', 'MySQL', 'Spark Profiler', 'Asynchrone', 'Perso'],
      category: 'personal',
      githubUrl: 'https://github.com/Byxis/Fireland',
      liveUrl: undefined,
      technologies: ['Java', 'MySQL', 'Spark', 'Spigot API', 'Multithreading', 'Async Tasks'],
      featured: true
    },
    {
      id: 'bomberman-ue5',
      title: 'Bomberman Mobile C++ (UE5)',
      description: `Une réécriture complète de Bomberman en C++ sur Unreal Engine 5 optimisée pour mobile.`,
      longDescription: `Développé pendant mon stage chez Eussam Développements, ce projet recrée le gameplay complet de Bomberman en C++ dans Unreal Engine 5. Il intègre des déplacements d'ennemis par raycast directionnel avec prise de décision probabiliste. Le jeu a été optimisé continuellement pour mobile en désactivant Nanite et en configurant des joysticks virtuels. Les assets ont été modélisés et riggés dans Blender puis importés dans UE5.`,
      imageUrl: undefined,
      tags: ['C++', 'UE5', 'Blender', 'Mobile', 'IA', 'Stage'],
      category: 'professional',
      githubUrl: 'https://github.com/Byxis/Bomberman',
      liveUrl: undefined,
      technologies: ['C++', 'Unreal Engine 5', 'Blender', 'Mobile Optimization', 'Pathfinding Raycast', 'Joystick Virtual'],
      featured: false
    },
    {
      id: 'vr-educational-game',
      title: 'VR Educational Game (Unity)',
      description: `Développement d'un jeu éducatif en Réalité Virtuelle avec pipeline d'IA générative et Unity 6.3.`,
      longDescription: `Projet de recherche développé à l'Ulster University (Derry, Irlande du Nord). Il s'agit d'un jeu vidéo éducatif complet en VR, développé sous Unity 6.3 LTS. L'architecture intègre un pipeline d'IA générative et fait l'objet d'une optimisation continue pour une publication multi-store (Meta Quest / HTC Vive).`,
      imageUrl: undefined,
      tags: ['C#', 'Unity', 'VR', 'AI', 'XR', 'Stage'],
      category: 'professional',
      githubUrl: undefined,
      liveUrl: undefined,
      technologies: ['C#', 'Unity 6.3 LTS', 'Virtual Reality', 'Generative AI Pipelines', 'XR Interaction Toolkit', 'Benchmark'],
      featured: true
    }
  ];

  getProjects(): Observable<Project[]> {
    return this.http.get<{ projects: Project[] }>('projects-config.json').pipe(
      map(res => res.projects),
      catchError(err => {
        console.warn('Could not load projects-config.json, using offline failsafe list:', err);
        return of(this.richMetadataFailsafe);
      }),
      switchMap((curatedList: Project[]) => {
        return this.http.get<any[]>(this.githubApiUrl).pipe(
          map(repos => {
            const mergedProjects: Project[] = [];
            const matchedRichIds = new Set<string>();

            repos.forEach(repo => {
              const matchedRich = curatedList.find(rich => {
                if (!rich.githubUrl) return false;
                return this.normalizeUrl(rich.githubUrl) === this.normalizeUrl(repo.html_url);
              });

              if (matchedRich) {
                matchedRichIds.add(matchedRich.id);
                const tags = this.mergeUnique(
                  matchedRich.tags || [],
                  [repo.language, ...(repo.topics || [])].map(t => this.formatTag(t))
                );
                const technologies = this.mergeUnique(
                  matchedRich.technologies || [],
                  [repo.language, ...(repo.topics || [])].map(t => this.formatTag(t))
                );

                mergedProjects.push({
                  ...matchedRich,
                  description: repo.description || matchedRich.description,
                  liveUrl: repo.homepage || matchedRich.liveUrl,
                  githubUrl: repo.html_url,
                  tags,
                  technologies
                });
              }
            });

            curatedList.forEach(rich => {
              if (!matchedRichIds.has(rich.id)) {
                mergedProjects.push(rich);
              }
            });

            return mergedProjects;
          }),
          catchError(githubErr => {
            console.warn('Failed to fetch projects from GitHub API, returning curated config directly:', githubErr);
            return of(curatedList);
          })
        );
      })
    );
  }

  getProjectById(id: string): Observable<Project | undefined> {
    return this.getProjects().pipe(
      map(projects => projects.find(p => p.id === id))
    );
  }

  private normalizeUrl(url: string): string {
    return url.toLowerCase().replace(/\/$/, '');
  }

  private mergeUnique(arr1: string[], arr2: string[]): string[] {
    const set = new Set([...arr1, ...arr2]);
    return Array.from(set).filter(Boolean);
  }

  private formatTag(tag: string): string {
    if (!tag) return '';
    const lower = tag.toLowerCase();
    if (lower === 'cpp' || lower === 'cplusplus') return 'C++';
    if (lower === 'csharp' || lower === 'c-sharp') return 'C#';
    if (lower === 'ue5' || lower === 'unrealengine5' || lower === 'unreal-engine-5') return 'UE5';
    if (lower === 'opengl') return 'OpenGL';
    if (lower === 'threejs' || lower === 'three-js') return 'THREE.js';
    if (lower === 'postgis') return 'PostGIS';
    if (lower === 'mysql') return 'MySQL';
    if (lower === 'mariadb') return 'MariaDB';
    if (lower === 'react') return 'React';
    if (lower === 'angular') return 'Angular';
    if (lower === 'typescript') return 'TypeScript';
    if (lower === 'javascript') return 'JavaScript';

    return tag
      .split(/[-_]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
