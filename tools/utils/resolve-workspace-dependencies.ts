import fs from 'fs';
import path from 'path';
import { parse } from 'yaml';

/**
 * Resolves `workspace:` and `catalog:` protocol references in a package.json object.
 * Mutates the provided packageJson in place.
 *
 * @param packageJson - The parsed package.json object to resolve
 * @param repoRoot - Absolute path to the repository root
 */
export function resolveWorkspaceDependencies(
  packageJson: Record<string, unknown>,
  repoRoot: string
): void {
  const catalog = loadCatalog(repoRoot);

  for (const depType of ['dependencies', 'peerDependencies', 'optionalDependencies'] as const) {
    const deps = packageJson[depType] as Record<string, string> | undefined;
    if (!deps) continue;

    for (const [name, version] of Object.entries(deps)) {
      if (typeof version === 'string' && version.startsWith('workspace:')) {
        const resolved = resolveWorkspaceProtocol(name, version, repoRoot);
        if (resolved) {
          deps[name] = resolved;
          console.log(`Resolved ${name}: ${version} -> ${resolved}`);
        } else {
          console.warn(`Could not find workspace package for ${name}`);
        }
      } else if (typeof version === 'string' && version.startsWith('catalog:')) {
        const resolved = resolveCatalogProtocol(name, catalog);
        if (resolved) {
          deps[name] = resolved;
          console.log(`Resolved ${name}: ${version} -> ${resolved}`);
        } else {
          console.warn(`Could not find catalog entry for ${name}`);
        }
      }
    }
  }
}

function resolveWorkspaceProtocol(
  packageName: string,
  version: string,
  repoRoot: string
): string | undefined {
  const depPkgPath = findWorkspacePackage(repoRoot, packageName);
  if (!depPkgPath) return undefined;

  const depPkg = JSON.parse(fs.readFileSync(depPkgPath, 'utf-8'));
  if (version === 'workspace:*' || version === 'workspace:') {
    return `^${depPkg.version}`;
  }
  return version.replace('workspace:', '');
}

function resolveCatalogProtocol(
  packageName: string,
  catalog: Record<string, string>
): string | undefined {
  return catalog[packageName];
}

function loadCatalog(repoRoot: string): Record<string, string> {
  const workspacePath = path.join(repoRoot, 'pnpm-workspace.yaml');
  if (!fs.existsSync(workspacePath)) return {};

  const content = fs.readFileSync(workspacePath, 'utf-8');
  const workspace = parse(content);
  return workspace?.catalog ?? {};
}

function findWorkspacePackage(rootDir: string, packageName: string): string | undefined {
  const dirs = ['packages', 'apps'];
  for (const dir of dirs) {
    const searchDir = path.join(rootDir, dir);
    if (!fs.existsSync(searchDir)) continue;

    const entries = fs.readdirSync(searchDir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const pkgFile = path.join(searchDir, entry.name, 'package.json');
      if (!fs.existsSync(pkgFile)) continue;

      try {
        const pkg = JSON.parse(fs.readFileSync(pkgFile, 'utf-8'));
        if (pkg.name === packageName) return pkgFile;
      } catch {
        // skip invalid json
      }
    }
  }
  return undefined;
}
