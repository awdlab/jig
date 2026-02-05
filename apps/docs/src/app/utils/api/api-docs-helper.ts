import { notNullish } from '@ngneers/controls/utils';

import type { ControlName } from '@ngneers/controls-themes';
import type { DeclarationReflection, ProjectReflection } from 'typedoc/browser';

export function getProjectControl(
  project: ProjectReflection,
  componentName: string
): DeclarationReflection | null {
  if (!project || !componentName) {
    return null;
  }
  const projectControls = project.children?.filter(x =>
    x.categories?.some(cat => cat.title === 'control')
  );
  const projectControl =
    projectControls
      ?.map(x => x.children?.find(c => c.name === componentName))
      .filter(notNullish)[0] ?? null;
  return projectControl;
}

export function getInternalControlName(
  project: ProjectReflection,
  componentName: string,
  projectControl?: DeclarationReflection
): ControlName | null {
  const projectCtrl = projectControl ?? getProjectControl(project, componentName);
  if (!projectCtrl) {
    return null;
  }
  const parentName = projectCtrl.parent?.name;
  if (!parentName) {
    console.error('Could not determine parent name of component', projectCtrl);
    return null;
  }
  const controlName = parentName.split('/').pop();
  if (!controlName) {
    console.error('Could not determine control name from parent name', parentName, projectCtrl);
    return null;
  }
  return controlName as ControlName;
}
