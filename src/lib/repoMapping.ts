import repoAliases from "/config/repos.json";

// Create reverse map once at module load
const repoRidToName: Record<string, string> = Object.entries(
  repoAliases,
).reduce(
  (acc, [name, rid]) => {
    acc[rid] = name;
    return acc;
  },
  {} as Record<string, string>,
);

// Get RID from repo name
export function getRidByName(name: string): string | undefined {
  return repoAliases[name];
}

// Get repo name from RID
export function getNameByRid(rid: string): string | undefined {
  return repoRidToName[rid];
}

// Check if name exists
export function hasRepoAlias(name: string): boolean {
  return name in repoAliases;
}

// Get all repo names
export function getAllRepoNames(): string[] {
  return Object.keys(repoAliases);
}
