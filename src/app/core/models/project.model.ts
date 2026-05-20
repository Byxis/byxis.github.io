export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  imageUrl?: string;
  tags: string[];
  category: 'professional' | 'personal' | 'academic';
  githubUrl?: string;
  stores?: {
    itch?: string | string[];
    steam?: string | string[];
    metaQuest?: string | string[];
    googlePlay?: string | string[];
    appStore?: string | string[];
  };
  liveUrl?: string;
  technologies: string[];
  featured: boolean;
  order?: number;
}

export interface ProjectFilter {
  searchQuery: string;
  selectedTags: string[];
}
