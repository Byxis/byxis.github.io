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
      id: 'network-architecture',
      title: 'Network Architecture & Infrastructure',
      description: 'Interactive map and status dashboard of my Home Lab: Server, Client, and planned Proxmox layouts.',
      longDescription: 'Detailed overview of my home laboratory and server environments. This interactive viewer displays my active Server and Client infrastructures, along with my planned virtualization layout using Proxmox VE for advanced service orchestration, virtualization, and network zoning.',
      category: 'personal',
      iframeUrl: 'https://dev.notes.axithem.fr/s/4w4d7e8051ec1xyza71vqpht9w',
      tags: ['Sysadmin', 'Network', 'Proxmox', 'Home Lab'],
      technologies: ['Proxmox VE', 'HedgeDoc', 'Docker', 'OPNsense', 'VLANs'],
      featured: true,
      imageUrl: 'server.png',
      order: 5
    },
    {
      id: 'ruzzle',
      title: 'Ruzzle Engine & Game (Rust)',
      description: `A complete 3D game and graphics engine written in Rust and OpenGL, featuring custom physics and shaders.`,
      longDescription: `Ruzzle is a 4th-year engineering school project. It features the complete development of a game engine in Rust with OpenGL, handling fluid controls and an animation state machine. The engine integrates a Transform system, two-phase Colliders (AABB then detailed), gravity management, and custom shaders. The assets (3D crab, rig, animations) were modeled in Blender.`,
      imageUrl: undefined,
      videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
      tags: ['Rust', 'OpenGL', 'Blender', 'Physics', '3D', 'Engine', 'Personal'],
      category: 'personal',
      githubUrl: 'https://github.com/Byxis/Ruzzle',
      liveUrl: undefined,
      technologies: ['Rust', 'OpenGL', 'Blender 3D', 'GLSL', 'State Machine', 'AABB Colliders'],
      featured: true
    },
    {
      id: 'webwarfare',
      title: 'WebWarfare - Multiplayer FPS Netcode',
      description: `A browser-based multiplayer FPS managing real-time netcode with lag compensation and anti-cheat.`,
      longDescription: `WebWarfare is a 3rd-year engineering school web project. It focuses on real-time network architecture, implementing advanced lag compensation (via ping averaging and jitter tolerance) and automatic reconnection. It also integrates a robust anti-cheat system that simulates and validates every player action in parallel on the server side.`,
      imageUrl: undefined,
      tags: ['Angular', 'Netcode', 'Real-time', 'Web', 'Anti-cheat', 'Project'],
      category: 'academic',
      githubUrl: 'https://github.com/Byxis/IG3-WebProjectFPS',
      liveUrl: undefined,
      technologies: ['TypeScript', 'Node.js', 'WebSockets', 'Netcode', 'Lag Compensation', 'Server Simulation'],
      featured: true
    },
    {
      id: 'fireland',
      title: 'Fireland Minecraft Server Core',
      description: `Design and architecture of a high-performance Java Minecraft server with a multithreaded database.`,
      longDescription: `Fireland is a Minecraft server core software and plugin system that leverages multithreaded and asynchronous tasks in Java to process database calls (MySQL) and gameplay logic, eliminating server-side tick lag and hosting a community of over 200 unique players.`,
      imageUrl: undefined,
      tags: ['Java', 'MySQL', 'Spark Profiler', 'Asynchronous', 'Personal'],
      category: 'personal',
      githubUrl: 'https://github.com/Byxis/Fireland',
      liveUrl: undefined,
      technologies: ['Java', 'MySQL', 'Spark', 'Spigot API', 'Multithreading', 'Async Tasks'],
      featured: true
    },
    {
      id: 'bomberman-ue5',
      title: 'Bomberman Mobile C++ (UE5)',
      description: `A complete remake of Bomberman in C++ on Unreal Engine 5 optimized for mobile.`,
      longDescription: `Developed during my internship at Eussam Développements, this project recreates the full gameplay of Bomberman in C++ within Unreal Engine 5. It features enemy movement using directional raycasting with probabilistic decision-making. The game was continuously optimized for mobile by disabling Nanite and configuring virtual joysticks. The assets were modeled and rigged in Blender, then imported into UE5.`,
      imageUrl: undefined,
      tags: ['C++', 'UE5', 'Blender', 'Mobile', 'AI', 'Internship'],
      category: 'professional',
      githubUrl: 'https://github.com/Byxis/Bomberman',
      liveUrl: undefined,
      technologies: ['C++', 'Unreal Engine 5', 'Blender', 'Mobile Optimization', 'Pathfinding Raycast', 'Joystick Virtual'],
      featured: false
    },
    {
      id: 'vr-educational-game',
      title: 'VR Educational Game (Unity)',
      description: `Development of a Virtual Reality educational game with a generative AI pipeline and Unity 6.3.`,
      longDescription: `Research project developed at Ulster University (Derry, Northern Ireland). It is a complete VR educational video game developed under Unity 6.3 LTS. The architecture integrates a generative AI pipeline and is continuously optimized for multi-store publishing (Meta Quest / HTC Vive).`,
      imageUrl: undefined,
      tags: ['C#', 'Unity', 'VR', 'AI', 'XR', 'Internship'],
      category: 'professional',
      githubUrl: undefined,
      liveUrl: undefined,
      technologies: ['C#', 'Unity 6.3 LTS', 'Virtual Reality', 'Generative AI Pipelines', 'XR Interaction Toolkit', 'Benchmark'],
      featured: true
    },
    {
      id: 'polyagent',
      title: 'Polyagent - Multi-Agent AI Communication Tool',
      description: `An autonomous multi-agent AI system based on Microsoft AutoGen that automates GitHub updates publication to social media.`,
      longDescription: `Polyagent is a multi-agent AI system designed to solve the 'technical invisibility' problem of developers. Developed in collaboration with Alexis Serrano and Max Chateau for our Agentic AI course under professor Tiberiu Stratulat, it leverages Microsoft AutoGen to orchestrate multiple specialized agents. The system automatically monitors production branches on GitHub, fetches recent commits, conducts a joint technical review, simplifies and synthesizes technical changes, and formats the output to auto-publish updates directly to channels like Discord without human intervention.`,
      imageUrl: undefined,
      tags: ['AutoGen', 'AI Agents', 'Python', 'Automation', 'GitHub API'],
      category: 'academic',
      githubUrl: 'https://github.com/MaxbanCh/polyagent',
      liveUrl: undefined,
      technologies: ['Python', 'AutoGen', 'GPT-4', 'GitHub API', 'Discord Webhooks', 'Multi-Agent Orchestration'],
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
