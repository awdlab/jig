import { NgComponentOutlet } from '@angular/common';
import { Component, type Type } from '@angular/core';

import { NgnDocsAccessibilitySection } from './sections/accessibility-section';
import { NgnDocsComponentGallerySection } from './sections/component-gallery-section';
import { NgnDocsCustomizationSection } from './sections/customization-section';
import { NgnDocsDemoSection } from './sections/demo-section';
import { NgnDocsDeveloperExperienceSection } from './sections/developer-experience-section';
import { NgnDocsHeroSection } from './sections/hero-section';
import { NgnDocsNativePlatformSection } from './sections/native-platform-section';
import { NgnDocsQuickStartSection } from './sections/quick-start-section';
import { NgnDocsResponsivenessSection } from './sections/responsiveness-section';
import { NgnDocsSiteFooter } from './sections/site-footer';
import { NgnDocsThemingSection } from './sections/theming-section';

interface FeatureSection {
  readonly id: string;
  readonly component: Type<unknown>;
}

@Component({
  selector: 'ngn-docs-start',
  templateUrl: 'start.html',
  styleUrl: 'start.scss',
  imports: [NgComponentOutlet, NgnDocsHeroSection, NgnDocsSiteFooter],
  host: { class: 'flex min-h-full flex-col' },
})
export class Start {
  // Every band below the hero. Even indices are tinted; the footer matches the
  // last band's tone via `lastTinted`, so reordering stays in sync.
  // Narrative arc: proof (demo) → easy start → make it yours (theming,
  // customization) → built for devs → capability trio → browse everything.
  protected readonly featureSections: readonly FeatureSection[] = [
    { id: 'demo', component: NgnDocsDemoSection },
    { id: 'quick-start', component: NgnDocsQuickStartSection },
    { id: 'theming', component: NgnDocsThemingSection },
    { id: 'customization', component: NgnDocsCustomizationSection },
    { id: 'developer-experience', component: NgnDocsDeveloperExperienceSection },
    { id: 'accessibility', component: NgnDocsAccessibilitySection },
    { id: 'native-platform', component: NgnDocsNativePlatformSection },
    { id: 'responsiveness', component: NgnDocsResponsivenessSection },
    { id: 'component-gallery', component: NgnDocsComponentGallerySection },
  ];

  // The footer is tinted exactly when the last band is tinted (even index).
  protected readonly lastTinted = (this.featureSections.length - 1) % 2 === 0;
}
