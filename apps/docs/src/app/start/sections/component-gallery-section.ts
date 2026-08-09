import { Component, DestroyRef, inject, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgnAvatar } from '@awdlab/jig/avatar';
import { NgnButton } from '@awdlab/jig/button';
import { NgnCheckbox } from '@awdlab/jig/checkbox';
import { NgnChip } from '@awdlab/jig/chip';
import { NgnInput } from '@awdlab/jig/input';
import { NgnInputField } from '@awdlab/jig/input-field';
import { NgnProgress } from '@awdlab/jig/progress';
import { NgnSelect } from '@awdlab/jig/select';
import { NgnSlider } from '@awdlab/jig/slider';
import { NgnSwitch } from '@awdlab/jig/switch';
import { NgnTab, NgnTabs } from '@awdlab/jig/tabs';
import { NgnTag } from '@awdlab/jig/tag';
import { NgnTooltip } from '@awdlab/jig/tooltip';

import { CONTROL_COUNT } from './controls-count';
import { GALLERY } from './gallery-data';
import { NgnDocsGlow } from './glow';
import { NgnDocsSectionShell } from './section-shell';

import type { NgnPassthrough } from '@awdlab/jig/base';
import type { CustomColor } from '@awdlab/jig-custom-types';
import { NgnState } from '@awdlab/jig/state';

@Component({
  selector: 'awd-docs-component-gallery-section',
  imports: [
    NgnDocsSectionShell,
    RouterLink,
    NgnButton,
    NgnSwitch,
    NgnSlider,
    NgnSelect,
    NgnInputField,
    NgnInput,
    NgnChip,
    NgnTag,
    NgnAvatar,
    NgnProgress,
    NgnTooltip,
    NgnCheckbox,
    NgnTabs,
    NgnTab,
    NgnDocsGlow,
    NgnState,
  ],
  styles: `
    /* The slider has no built-in transition; glide the fill/thumb between rest and hover. */
    .gallery-slider ::ng-deep * {
      transition:
        width 0.45s ease,
        height 0.45s ease,
        inset-inline-start 0.45s ease,
        inset-block-end 0.45s ease;
    }
  `,
  template: `
    <awd-docs-section-shell
      layout="full"
      eyebrow="Components"
      [heading]="'A taste of ' + controlCount + '+ controls'"
      subtitle="Twelve interactive samples below. Every control ships with a full documentation page — hover for a preview, click through for the docs."
    >
      <div class="grid grid-cols-2 gap-(--awd-size-padding-lg) sm:grid-cols-3 lg:grid-cols-4">
        @for (entry of gallery; track entry.name) {
          <!-- Link is an overlay sibling so the demo controls aren't <a> descendants. -->
          <div
            (mouseenter)="onEnter(entry.name)"
            (mouseleave)="onLeave(entry.name)"
            ngnDocsGlow
            class="card relative flex flex-col items-center justify-center gap-(--awd-size-padding-md) p-(--awd-size-padding-xl)"
          >
            <a
              [routerLink]="entry.route"
              [attr.aria-label]="entry.name"
              class="absolute inset-0 z-10 rounded-(--awd-size-rounded-lg) no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-(--awd-color-primary-500)"
            ></a>
            <div inert class="pointer-events-none flex min-h-12 w-full items-center justify-center">
              @switch (entry.name) {
                @case ('Button') {
                  <button ngnButton kind="primary">
                    Save
                    <awd-state
                      [visible]="!!buttonState()"
                      [kind]="buttonState()"
                      [replaceContent]="true"
                    />
                  </button>
                }
                @case ('Switch') {
                  <awd-switch [(value)]="switchValue" />
                }
                @case ('Slider') {
                  <awd-slider
                    [min]="0"
                    [max]="100"
                    [(value)]="sliderValue"
                    class="gallery-slider w-full"
                  />
                }
                @case ('Select') {
                  <awd-input-field>
                    <awd-select
                      #sel
                      [pt]="selectPt"
                      [options]="selectOptions"
                      [(value)]="selectValue"
                    />
                  </awd-input-field>
                }
                @case ('Chip') {
                  <awd-chip [color]="chipColor()">Chip</awd-chip>
                }
                @case ('Tag') {
                  <awd-tag [color]="tagColor()">Tag</awd-tag>
                }
                @case ('Avatar') {
                  <awd-avatar [initials]="avatarInitials()" [bgColor]="avatarColor()" />
                }
                @case ('Progress') {
                  <awd-progress [value]="progressValue()" class="w-full" />
                }
                @case ('Tooltip') {
                  <button
                    ngnButton
                    kind="secondary"
                    #tip="ngnTooltip"
                    [ngnTooltip]="'A tooltip'"
                    [ngnTooltipShowOnHover]="false"
                    [ngnTooltipShowDelay]="0"
                    [ngnTooltipHideDelay]="0"
                  >
                    Hover
                  </button>
                }
                @case ('Checkbox') {
                  <awd-checkbox [(value)]="checkboxValue" />
                }
                @case ('Tabs') {
                  <awd-tabs [(activeTab)]="activeTab">
                    <awd-tab tabId="a">
                      <ng-template #header>One</ng-template>
                    </awd-tab>
                    <awd-tab tabId="b">
                      <ng-template #header>Two</ng-template>
                    </awd-tab>
                  </awd-tabs>
                }
                @case ('Input') {
                  <awd-input-field>
                    <input ngnInput [value]="inputValue()" />
                  </awd-input-field>
                }
              }
            </div>
            <span
              class="text-(length:--awd-font-size-sm) font-(--awd-font-weight-semibold) text-(--awd-color-text)"
            >
              {{ entry.name }}
            </span>
          </div>
        }
      </div>
      <div class="mt-(--awd-size-padding-xl) flex justify-center">
        <a ngnButton kind="secondary" routerLink="/components">
          See all {{ controlCount }}+ controls
        </a>
      </div>
    </awd-docs-section-shell>
  `,
})
export class NgnDocsComponentGallerySection {
  protected readonly gallery = GALLERY;
  protected readonly controlCount = CONTROL_COUNT;

  // Programmatic refs for controls without a pure-value rest/hover model.
  private readonly select = viewChild<NgnSelect<string>>('sel');
  private readonly tooltip = viewChild<NgnTooltip>('tip');

  // Per-control state — each signal animates from its rest value to a hover value.
  protected readonly switchValue = signal(false);
  protected readonly checkboxValue = signal(false);
  protected readonly sliderValue = signal(40);
  protected readonly progressValue = signal(20);
  protected readonly selectValue = signal('a');
  protected readonly selectOptions = [
    { value: 'a', label: 'Option A' },
    { value: 'b', label: 'Option B' },
  ];
  // Keep the hover-opened dropdown inert so it can't be interacted with mid-demo.
  protected readonly selectPt: NgnPassthrough<'select'> = {
    'popover-content': { $attributes: { inert: '' } },
  };
  protected readonly buttonState = signal<undefined | 'loading' | 'success'>(undefined);
  protected readonly chipColor = signal<CustomColor | undefined>(undefined);
  protected readonly tagColor = signal<CustomColor | undefined>(undefined);
  protected readonly avatarInitials = signal('NG');
  protected readonly avatarColor = signal<string | undefined>(undefined);
  protected readonly activeTab = signal('a');
  protected readonly inputValue = signal('');

  private readonly typeTarget = 'Hello';
  private buttonStateTimeout: ReturnType<typeof setInterval> | null = null;
  private typeTimer: ReturnType<typeof setInterval> | null = null;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.stopTyping());
  }

  protected onEnter(name: string): void {
    switch (name) {
      case 'Switch':
        this.switchValue.set(true);
        break;
      case 'Checkbox':
        this.checkboxValue.set(true);
        break;
      case 'Slider':
        this.sliderValue.set(70);
        break;
      case 'Progress':
        this.progressValue.set(70);
        break;
      case 'Select':
        this.select()?.show();
        break;
      case 'Tooltip':
        this.tooltip()?.show();
        break;
      case 'Button':
        this.buttonState.set('loading');
        if (this.buttonStateTimeout) {
          clearTimeout(this.buttonStateTimeout);
        }
        this.buttonStateTimeout = setTimeout(() => {
          this.buttonStateTimeout = null;
          this.buttonState.set('success');
        }, 600);
        break;
      case 'Chip':
        this.chipColor.set('primary');
        break;
      case 'Tag':
        this.tagColor.set('success');
        break;
      case 'Avatar':
        this.avatarInitials.set('AWD');
        this.avatarColor.set('var(--awd-color-primary)');
        break;
      case 'Tabs':
        this.activeTab.set('b');
        break;
      case 'Input':
        this.startTyping();
        break;
    }
  }

  protected onLeave(name: string): void {
    switch (name) {
      case 'Switch':
        this.switchValue.set(false);
        break;
      case 'Checkbox':
        this.checkboxValue.set(false);
        break;
      case 'Slider':
        this.sliderValue.set(40);
        break;
      case 'Progress':
        this.progressValue.set(20);
        break;
      case 'Select':
        this.select()?.hide();
        break;
      case 'Tooltip':
        this.tooltip()?.hide();
        break;
      case 'Button':
        this.buttonState.set(undefined);
        if (this.buttonStateTimeout) {
          clearTimeout(this.buttonStateTimeout);
          this.buttonStateTimeout = null;
        }
        break;
      case 'Chip':
        this.chipColor.set(undefined);
        break;
      case 'Tag':
        this.tagColor.set(undefined);
        break;
      case 'Avatar':
        this.avatarInitials.set('NG');
        this.avatarColor.set(undefined);
        break;
      case 'Tabs':
        this.activeTab.set('a');
        break;
      case 'Input':
        this.stopTyping();
        this.inputValue.set('');
        break;
    }
  }

  /** Types `typeTarget` char-by-char. Cancels any in-flight run first (no overlap on rapid hover). */
  private startTyping(): void {
    this.stopTyping();
    this.inputValue.set('');
    let i = 0;
    this.typeTimer = setInterval(() => {
      i += 1;
      this.inputValue.set(this.typeTarget.slice(0, i));
      if (i >= this.typeTarget.length) {
        this.stopTyping();
      }
    }, 90);
  }

  private stopTyping(): void {
    if (this.typeTimer !== null) {
      clearInterval(this.typeTimer);
      this.typeTimer = null;
    }
  }
}
