import { NgComponentOutlet } from '@angular/common';
import { Component, inject, type Type } from '@angular/core';

import { Seo } from '../utils/seo';
import { JigDocsAccessibilitySection } from './sections/accessibility-section';
import { JigDocsComponentGallerySection } from './sections/component-gallery-section';
import { JigDocsCustomizationSection } from './sections/customization-section';
import { JigDocsDemoSection } from './sections/demo-section';
import { JigDocsDeveloperExperienceSection } from './sections/developer-experience-section';
import { JigDocsFinalCtaSection } from './sections/final-cta-section';
import { JigDocsHeroSection } from './sections/hero-section';
import { JigDocsQuickStartSection } from './sections/quick-start-section';
import { JigDocsSiteFooter } from './sections/site-footer';
import { JigDocsThemingSection } from './sections/theming-section';
import { JigDocsUnderTheHoodSection } from './sections/under-the-hood-section';

interface FeatureSection {
  readonly id: string;
  readonly component: Type<unknown>;
}

@Component({
  selector: 'jig-docs-start',
  templateUrl: 'start.html',
  styleUrl: 'start.scss',
  imports: [NgComponentOutlet, JigDocsHeroSection, JigDocsSiteFooter],
  host: { class: 'flex min-h-full flex-col' },
})
export class Start {
  // Every section below the hero, in order.
  // Narrative arc: proof (demo) → easy start → make it yours (theming,
  // customization) → typed DX → accessibility → platform internals → browse
  // everything → closing call to action.
  protected readonly featureSections: readonly FeatureSection[] = [
    { id: 'demo', component: JigDocsDemoSection },
    { id: 'quick-start', component: JigDocsQuickStartSection },
    { id: 'theming', component: JigDocsThemingSection },
    { id: 'customization', component: JigDocsCustomizationSection },
    { id: 'developer-experience', component: JigDocsDeveloperExperienceSection },
    { id: 'accessibility', component: JigDocsAccessibilitySection },
    { id: 'under-the-hood', component: JigDocsUnderTheHoodSection },
    { id: 'component-gallery', component: JigDocsComponentGallerySection },
    { id: 'final-cta', component: JigDocsFinalCtaSection },
  ];

  constructor() {
    // The landing page keeps the bare site name as its title — the suffix the
    // docs pages carry would read as "jig - jig".
    inject(Seo).set({ title: '' });
  }
}
