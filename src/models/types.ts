export interface Project {
  project_id: number;
  title: string;
  description: string | null;
  github: string | null;
  github_backend: string | null;
  demo: string | null;
  featured: boolean;
  created_at: Date;
}

export interface ProjectTag {
  tag_id: number;
  project_id: number;
  tag: string;
}

export interface ProjectImage {
  image_id: number;
  project_id: number;
  url: string;
  alt: string;
}

export interface ProjectWithDetails extends Project {
  tags: ProjectTag[];
  images: ProjectImage[];
}

export interface InsertResult {
  insertId: number;
}

export interface DeleteResult {
  affectedRows: number;
}

export interface UpdateResult {
  affectedRows: number;
}

export interface DevProfile {
  profile_id: number;
  password: string;
  image_url: string | null;
  presentation: string | null;
  github_link: string | null;
  linkedin: string | null;
  gmail: string | null;
  instagram: string | null;
  x: string | null;
  fiverr: string | null;
  phone: string | null;
  cv: string | null;
  tags: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface SkillCategory {
  id: number;
  name: string;
  label: string;
  display_order: number;
  created_at: Date;
  updated_at: Date;
  skills?: Skill[];
}

export interface Skill {
  id: number;
  category_id: number;
  name: string;
  description: string | null;
  display_order: number;
  created_at: Date;
  updated_at: Date;
}
export interface SkillWithCategory extends Skill {
  category_label: string;
}
