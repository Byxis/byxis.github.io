import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../shared/components/icon/icon.component';

interface Experience {
  role: string;
  company: string;
  location?: string;
  period: string;
  description: string;
  achievements: string[];
  skills: string[];
  isOpen: boolean;
  link?: string;
}

interface Education {
  degree: string;
  school: string;
  period: string;
  description: string;
}

interface Hackathon {
  title: string;
  period: string;
  details: string;
}

interface Reward {
  title: string;
  period: string;
  details: string;
}

@Component({
  selector: 'app-cv',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cv.component.html',
  styleUrl: './cv.component.scss',
})
export class CvComponent {
  readonly activeTab = signal<'interactive' | 'pdf'>('interactive');

  readonly experiences = signal<Experience[]>([
    {
      role: 'Développeur Stagiaire C# / Unity (VR & IA)',
      company: 'Ulster University',
      location: 'Derry, Northern Ireland',
      period: 'Avril 2026 - Août 2026',
      description: 'Stage de recherche et développement en réalité virtuelle sous Unity 6.3 LTS.',
      achievements: [
        `Développement complet d'un jeu vidéo éducatif immersif en VR, tirant parti de pipelines d'IA générative.`,
        `Migration et refactoring de projets legacy vers Unity 6.3 LTS, gestion fine des cycles de mise en production.`,
        `Veille technologique approfondie sur les patrons de conception (Design Patterns) en C# et réalisation de benchmarks de performances pour IA.`,
        `Optimisation continue (Profiling de frames et de mémoire) visant une publication multi-store.`,
      ],
      skills: [
        'C#',
        'Unity 6.3 LTS',
        'Réalité Virtuelle (VR)',
        'XR Toolkit',
        'Generative AI Pipelines',
        'Profiling',
        'Design Patterns',
      ],
      isOpen: true,
    },
    {
      role: 'Développeur Stagiaire C++ / UE5',
      company: 'Eussam Développements',
      location: 'Marseille, France',
      period: 'Juillet 2023 - Août 2023',
      description:
        'Stage de développement Gameplay & Outils pour un jeu mobile inspiré de Bomberman.',
      link: 'https://github.com/Byxis/Bomberman',
      achievements: [
        `Conception et programmation des mécaniques de jeu fondamentales de Bomberman en C++ pour Unreal Engine 5.`,
        `Développement de l'IA des ennemis basée sur des raycasts directionnels et une prise de décision probabiliste.`,
        `Optimisation continue pour supports mobiles, avec désactivation sélective des modules lourds (Nanite/Lumen).`,
        `Conception de contrôles ergonomiques tactiles via joystick virtuel.`,
        `Modélisation, rigging et animation d'assets 3D dans Blender, et intégration avec send2unreal.`,
      ],
      skills: [
        'C++',
        'Unreal Engine 5',
        'Blender',
        'Mobile Optimization',
        'Raycasting AI',
        'send2unreal',
      ],
      isOpen: true,
    },
    {
      role: 'Fondateur & Lead Développeur Java',
      company: 'Serveur Minecraft Fireland (Projet Perso)',
      location: 'En ligne',
      period: '2019 - En cours',
      description: `Création, architecture et gestion complète d'un serveur de jeu Minecraft de type multijoueur.`,
      link: 'https://github.com/Byxis/Fireland',
      achievements: [
        `Conception et architecture d'un plugin Java original implémentant des tâches asynchrones pour préserver le tickrate.`,
        `Profiling de performance système (Spigot API, JVM) via Spark pour localiser les goulots d'étranglement.`,
        `Refactoring des accès en base de données (MySQL) vers un modèle multithreadé asynchrone, éliminant totalement les pics de latence.`,
        `Gestion de communauté (pic à 30 joueurs simultanés, +200 uniques) et itérations continues des features basées sur les retours joueurs.`,
      ],
      skills: [
        'Java',
        'MySQL',
        'Spark Profiler',
        'Multithreading',
        'Asynchrone',
        'Spigot API',
        'Community Management',
      ],
      isOpen: false,
    },
    {
      role: `Stagiaire d'observation`,
      company: 'Ubisoft Montpellier',
      location: 'Montpellier, France',
      period: '2017 & 2018 (2 semaines au total)',
      description: `Observation globale des métiers du jeu vidéo au sein d'un studio AAA.`,
      achievements: [
        `Immersion au sein des équipes de production de jeux et sensibilisation au cycle de vie complet d'un projet AAA.`,
        `Interactions directes et enrichissantes avec l'équipe de Développement Gameplay.`,
      ],
      skills: ['Cycle de production', 'Gameplay Dev', 'AAA Industry Overview'],
      isOpen: false,
    },
  ]);

  readonly educations: Education[] = [
    {
      degree: `Diplôme d'ingénieur en Informatique`,
      school: 'Polytech Montpellier — Montpellier, France',
      period: '2024 - 2027',
      description: `Spécialisation en Data Science, Management et Architecture Logicielle. Formation avancée sur le clean code, les architectures logicielles propres, la compilation, les patrons de conception et la gestion de projet.`,
    },
    {
      degree: 'Cycle Préparatoire Intégré (PeiP A)',
      school: 'Polytech Montpellier — Montpellier, France',
      period: '2022 - 2024',
      description: `Parcours renforcé en Mathématiques, Physique et bases en Informatique Algorithmique.`,
    },
  ];

  readonly hackathons: Hackathon[] = [
    {
      title: '7ème à 10ème Éditions de la Code Game Jam & GDL Jam',
      period: '2022 - 2026',
      details: `Création rapide de jeux en 48h sous Unity, en équipe. Focus sur la physique rapide, le level design et le code de gameplay.`,
    },
    {
      title: `La Nuit de l'Info`,
      period: '2025 & 2026',
      details: `Développement d'applications web complexes en une seule nuit (React en 2025, Angular 20 en 2026) en répondant à divers défis algorithmiques et de design.`,
    },
  ];

  readonly rewards: Reward[] = [
    {
      title: 'Gagnant de la Code Game Jam (7e Éd.)',
      period: 'Janvier 2023',
      details: `Développement gagnant d'un jeu en 48h sous Unity, salué pour ses mécaniques de gameplay intuitives et son polish.`,
    },
    {
      title: 'Diplôme DDRS',
      period: '2016',
      details: `Récompense pour le développement complet d'un jeu vidéo éducatif centré sur le recyclage et le développement durable.`,
    },
  ];

  toggleExperience(index: number) {
    this.experiences.update((exps) => {
      return exps.map((e, idx) => {
        if (idx === index) {
          return { ...e, isOpen: !e.isOpen };
        }
        return e;
      });
    });
  }
}
