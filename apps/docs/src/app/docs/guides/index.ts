import { CreatingAControlPage } from './advanced/creating-a-control/page';
import { ThemeInternalsPage } from './advanced/theme-internals/page';
import { McpServerPage } from './ai/mcp/page';
import { AgentSkillsPage } from './ai/skills/page';
import { IconsPage } from './concepts/icons/page';
import { PassthroughPage } from './concepts/passthrough/page';
import { StateConceptPage } from './concepts/state/page';
import { InstallationPage } from './getting-started/installation/page';
import { IntroductionPage } from './getting-started/introduction/page';
import { UsagePage } from './getting-started/usage/page';
import { AuthoringAThemePage } from './theming/authoring-a-theme/page';
import { ColorsPage } from './theming/colors/page';
import { DarkModePage } from './theming/dark-mode/page';
import { KindsColorsPage } from './theming/kinds-colors/page';
import { ThemingOverviewPage } from './theming/overview/page';

import type { NgnDocsGroup } from '../../utils/page/types';

/**
 * The Guides tab, sliced into visual sidebar groups. Group titles are headers
 * only — every page routes at `/guides/{page}`.
 */
export const GUIDE_GROUPS: NgnDocsGroup[] = [
  {
    title: 'Getting Started',
    pages: [IntroductionPage, InstallationPage, UsagePage],
  },
  {
    title: 'Theming',
    pages: [ThemingOverviewPage, ColorsPage, KindsColorsPage, DarkModePage, AuthoringAThemePage],
  },
  {
    title: 'Concepts',
    pages: [PassthroughPage, StateConceptPage, IconsPage],
  },
  {
    title: 'Advanced',
    pages: [CreatingAControlPage, ThemeInternalsPage],
  },
  {
    title: 'AI Tooling',
    pages: [McpServerPage, AgentSkillsPage],
  },
];
