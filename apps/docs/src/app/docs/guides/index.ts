import { CreatingAControlPage } from './advanced/creating-a-control/page';
import { PerformancePage } from './advanced/performance/page';
import { SsrPage } from './advanced/ssr/page';
import { TestingPage } from './advanced/testing/page';
import { ThemeInternalsPage } from './advanced/theme-internals/page';
import { McpServerPage } from './ai/mcp/page';
import { AgentSkillsPage } from './ai/skills/page';
import { AccessibilityPage } from './concepts/accessibility/page';
import { AnimationsPage } from './concepts/animations/page';
import { FilteringPage } from './concepts/filtering/page';
import { FormsPage } from './concepts/forms/page';
import { I18nPage } from './concepts/i18n/page';
import { IconsPage } from './concepts/icons/page';
import { ItemsPage } from './concepts/items/page';
import { OverlaysPage } from './concepts/overlays/page';
import { PassthroughPage } from './concepts/passthrough/page';
import { StateConceptPage } from './concepts/state/page';
import { StatePersistencePage } from './concepts/state-persistence/page';
import { BrowserSupportPage } from './getting-started/browser-support/page';
import { ChangelogPage } from './getting-started/changelog/page';
import { ConfigurationPage } from './getting-started/configuration/page';
import { InstallationPage } from './getting-started/installation/page';
import { IntroductionPage } from './getting-started/introduction/page';
import { MigrationPage } from './getting-started/migration/page';
import { UsagePage } from './getting-started/usage/page';
import { AuthoringAThemePage } from './theming/authoring-a-theme/page';
import { ColorsPage } from './theming/colors/page';
import { DarkModePage } from './theming/dark-mode/page';
import { KindsColorsPage } from './theming/kinds-colors/page';
import { ThemingOverviewPage } from './theming/overview/page';
import { StylingPage } from './theming/styling/page';

import type { AwdDocsGroup } from '../../utils/page/types';

/**
 * The Guides tab, sliced into visual sidebar groups. Group titles are headers
 * only — every page routes at `/guides/{page}`.
 */
export const GUIDE_GROUPS: AwdDocsGroup[] = [
  {
    title: 'Getting Started',
    pages: [
      IntroductionPage,
      InstallationPage,
      UsagePage,
      ConfigurationPage,
      BrowserSupportPage,
      MigrationPage,
      ChangelogPage,
    ],
  },
  {
    title: 'Theming',
    pages: [
      ThemingOverviewPage,
      ColorsPage,
      KindsColorsPage,
      DarkModePage,
      StylingPage,
      AuthoringAThemePage,
    ],
  },
  {
    title: 'Concepts',
    pages: [
      PassthroughPage,
      StateConceptPage,
      FormsPage,
      ItemsPage,
      FilteringPage,
      OverlaysPage,
      IconsPage,
      AnimationsPage,
      StatePersistencePage,
      I18nPage,
      AccessibilityPage,
    ],
  },
  {
    title: 'Advanced',
    pages: [CreatingAControlPage, ThemeInternalsPage, SsrPage, TestingPage, PerformancePage],
  },
  {
    title: 'AI Tooling',
    pages: [McpServerPage, AgentSkillsPage],
  },
];
