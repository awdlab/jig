import { NgComponentOutlet } from '@angular/common';
import { Component, type Type } from '@angular/core';

import { NgnDocsAccessibilitySection } from './sections/accessibility-section';
import { NgnDocsComponentGallerySection } from './sections/component-gallery-section';
import { NgnDocsCustomizationSection } from './sections/customization-section';
import { NgnDocsDemoSection } from './sections/demo-section';
import { NgnDocsDeveloperExperienceSection } from './sections/developer-experience-section';
import { NgnDocsFinalCtaSection } from './sections/final-cta-section';
import { NgnDocsHeroSection } from './sections/hero-section';
import { NgnDocsQuickStartSection } from './sections/quick-start-section';
import { NgnDocsSiteFooter } from './sections/site-footer';
import { NgnDocsThemingSection } from './sections/theming-section';
import { NgnDocsUnderTheHoodSection } from './sections/under-the-hood-section';

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
  // Every section below the hero, in order.
  // Narrative arc: proof (demo) → easy start → make it yours (theming,
  // customization) → typed DX → accessibility → platform internals → browse
  // everything → closing call to action.
  protected readonly featureSections: readonly FeatureSection[] = [
    { id: 'demo', component: NgnDocsDemoSection },
    { id: 'quick-start', component: NgnDocsQuickStartSection },
    { id: 'theming', component: NgnDocsThemingSection },
    { id: 'customization', component: NgnDocsCustomizationSection },
    { id: 'developer-experience', component: NgnDocsDeveloperExperienceSection },
    { id: 'accessibility', component: NgnDocsAccessibilitySection },
    { id: 'under-the-hood', component: NgnDocsUnderTheHoodSection },
    { id: 'component-gallery', component: NgnDocsComponentGallerySection },
    { id: 'final-cta', component: NgnDocsFinalCtaSection },
  ];
}
