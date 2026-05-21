import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PROJECT_SERVICE_TOKEN } from '../../core/tokens/project.token';
import { Project } from '../../core/models/project.model';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { ProjectDetailComponent } from './project-detail.component';

@Component({
  selector: 'app-explorer',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, ProjectDetailComponent],
  templateUrl: './explorer.component.html',
  styleUrl: './explorer.component.scss',
})
export class ExplorerComponent implements OnInit {
  private readonly projectService = inject(PROJECT_SERVICE_TOKEN);

  private static readonly ALL_CATEGORIES = ['professional', 'personal', 'academic', 'hackathon'] as const;

  readonly allProjects = signal<Project[]>([]);
  readonly searchQuery = signal<string>('');
  readonly selectedCategories = signal<string[]>([...ExplorerComponent.ALL_CATEGORIES]);
  readonly selectedTags = signal<string[]>([]);
  readonly selectedProject = signal<Project | null>(null);

  readonly allTags = computed(() => {
    const tags = new Set<string>();
    this.allProjects().forEach((p) => p.tags.forEach((t) => tags.add(t)));
    return Array.from(tags).sort();
  });

  readonly filteredProjects = computed(() => {
    return this.allProjects()
      .filter((project) => {
        if (!this.selectedCategories().includes(project.category)) {
          return false;
        }

        if (this.searchQuery().trim()) {
          const query = this.searchQuery().toLowerCase().trim();
          const matchesTitle = project.title.toLowerCase().includes(query);
          const matchesDesc = project.description.toLowerCase().includes(query);
          const matchesTech = project.technologies.some((t) => t.toLowerCase().includes(query));
          const matchesTag = project.tags.some((t) => t.toLowerCase().includes(query));

          if (!matchesTitle && !matchesDesc && !matchesTech && !matchesTag) {
            return false;
          }
        }

        if (this.selectedTags().length > 0) {
          const hasAllTags = this.selectedTags().every((t) => project.tags.includes(t));
          if (!hasAllTags) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        const orderA = a.order ?? Number.MAX_VALUE;
        const orderB = b.order ?? Number.MAX_VALUE;
        return orderA - orderB;
      });
  });

  ngOnInit() {
    this.projectService.getProjects().subscribe((projects) => {
      this.allProjects.set(projects);
    });
  }

  isCategorySelected(category: string): boolean {
    return this.selectedCategories().includes(category);
  }

  isAllCategoriesSelected(): boolean {
    return ExplorerComponent.ALL_CATEGORIES.every((c) => this.selectedCategories().includes(c));
  }

  toggleCategory(category: string) {
    this.selectedCategories.update((cats) => {
      if (cats.includes(category)) {
        if (cats.length === 1) return cats;
        return cats.filter((c) => c !== category);
      } else {
        return [...cats, category];
      }
    });
  }

  isTagSelected(tag: string): boolean {
    return this.selectedTags().includes(tag);
  }

  toggleTag(tag: string) {
    this.selectedTags.update((tags) => {
      if (tags.includes(tag)) {
        return tags.filter((t) => t !== tag);
      } else {
        return [...tags, tag];
      }
    });
  }

  resetAllFilters() {
    this.searchQuery.set('');
    this.selectedCategories.set([...ExplorerComponent.ALL_CATEGORIES]);
    this.selectedTags.set([]);
  }
}
