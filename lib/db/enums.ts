export const ProjectStatus = {
  DRAFT: "draft",
  ACTIVE: "active",
  SOLD: "sold",
  DELETED: "deleted",
} as const;

export type ProjectStatus = typeof ProjectStatus[keyof typeof ProjectStatus];

export const ProjectCategory = {
  ART: "Art",
  PFP: "PFP",
  GAME: "Game",
  MUSIC: "Music",
  UTILITY: "Utility",
} as const;

export type ProjectCategory = typeof ProjectCategory[keyof typeof ProjectCategory];