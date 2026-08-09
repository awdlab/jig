import { NgComponentOutlet } from '@angular/common';
import { Component, inject, type Type } from '@angular/core';

import { Seo } from '../utils/seo';
import { AwdDocsAccessibilitySection } from './sections/accessibility-section';
import { AwdDocsComponentGallerySection } from './sections/component-gallery-section';
import { AwdDocsCustomizationSection } from './sections/customization-section';
import { AwdDocsDemoSection } from './sections/demo-section';
import { AwdDocsDeveloperExperienceSection } from './sections/developer-experience-section';
import { AwdDocsFinalCtaSection } from './sections/final-cta-section';
import { AwdDocsHeroSection } from './sections/hero-section';
import { AwdDocsQuickStartSection } from './sections/quick-start-section';
import { AwdDocsSiteFooter } from './sections/site-footer';
import { AwdDocsThemingSection } from './sections/theming-section';
import { AwdDocsUnderTheHoodSection } from './sections/under-the-hood-section';

interface FeatureSection {
  readonly id: string;
  readonly component: Type<unknown>;
}

@Component({
  selector: 'jig-docs-start',
  templateUrl: 'start.html',
  styleUrl: 'start.scss',
  imports: [NgComponentOutlet, AwdDocsHeroSection, AwdDocsSiteFooter],
  host: { class: 'flex min-h-full flex-col' },
})
export class Start {
  // Every section below the hero, in order.
  // Narrative arc: proof (demo) → easy start → make it yours (theming,
  // customization) → typed DX → accessibility → platform internals → browse
  // everything → closing call to action.
  protected readonly featureSections: readonly FeatureSection[] = [
    { id: 'demo', component: AwdDocsDemoSection },
    { id: 'quick-start', component: AwdDocsQuickStartSection },
    { id: 'theming', component: AwdDocsThemingSection },
    { id: 'customization', component: AwdDocsCustomizationSection },
    { id: 'developer-experience', component: AwdDocsDeveloperExperienceSection },
    { id: 'accessibility', component: AwdDocsAccessibilitySection },
    { id: 'under-the-hood', component: AwdDocsUnderTheHoodSection },
    { id: 'component-gallery', component: AwdDocsComponentGallerySection },
    { id: 'final-cta', component: AwdDocsFinalCtaSection },
  ];

  constructor() {
    // The landing page keeps the bare site name as its title — the suffix the
    // docs pages carry would read as "jig-controls - jig-controls".
    inject(Seo).set({ title: '' });
  }
}
