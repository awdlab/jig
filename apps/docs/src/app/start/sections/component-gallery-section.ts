import { Component, DestroyRef, inject, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AwdAvatar } from '@awdlab/jig/avatar';
import { AwdButton } from '@awdlab/jig/button';
import { AwdCheckbox } from '@awdlab/jig/checkbox';
import { AwdChip } from '@awdlab/jig/chip';
import { AwdInput } from '@awdlab/jig/input';
import { AwdInputField } from '@awdlab/jig/input-field';
import { AwdProgress } from '@awdlab/jig/progress';
import { AwdSelect } from '@awdlab/jig/select';
import { AwdSlider } from '@awdlab/jig/slider';
import { AwdSwitch } from '@awdlab/jig/switch';
import { AwdTab, AwdTabs } from '@awdlab/jig/tabs';
import { AwdTag } from '@awdlab/jig/tag';
import { AwdTooltip } from '@awdlab/jig/tooltip';

import { CONTROL_COUNT } from './controls-count';
import { GALLERY } from './gallery-data';
import { AwdDocsGlow } from './glow';
import { AwdDocsSectionShell } from './section-shell';

import type { AwdPassthrough } from '@awdlab/jig/base';
import type { CustomColor } from '@awdlab/jig-custom-types';
import { AwdState } from '@awdlab/jig/state';

@Component({
  selector: 'jig-docs-component-gallery-section',
  imports: [
    AwdDocsSectionShell,
    RouterLink,
    AwdButton,
    AwdSwitch,
    AwdSlider,
    AwdSelect,
    AwdInputField,
    AwdInput,
    AwdChip,
    AwdTag,
    AwdAvatar,
    AwdProgress,
    AwdTooltip,
    AwdCheckbox,
    AwdTabs,
    AwdTab,
    AwdDocsGlow,
    AwdState,
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
    <jig-docs-section-shell
      layout="full"
      eyebrow="Components"
      [heading]="'A taste of ' + controlCount + '+ controls'"
      subtitle="Twelve interactive samples below. Every control ships with a full documentation page — hover for a preview, click through for the docs."
    >
      <div class="grid grid-cols-2 gap-(--jig-size-padding-lg) sm:grid-cols-3 lg:grid-cols-4">
        @for (entry of gallery; track entry.name) {
          <!-- Link is an overlay sibling so the demo controls aren't <a> descendants. -->
          <div
            (mouseenter)="onEnter(entry.name)"
            (mouseleave)="onLeave(entry.name)"
            ngnDocsGlow
            class="card relative flex flex-col items-center justify-center gap-(--jig-size-padding-md) p-(--jig-size-padding-xl)"
          >
            <a
              [routerLink]="entry.route"
              [attr.aria-label]="entry.name"
              class="absolute inset-0 z-10 rounded-(--jig-size-rounded-lg) no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-(--jig-color-primary-500)"
            ></a>
            <div inert class="pointer-events-none flex min-h-12 w-full items-center justify-center">
              @switch (entry.name) {
                @case ('Button') {
                  <button ngnButton kind="primary">
                    Save
                    <jig-state
                      [visible]="!!buttonState()"
                      [kind]="buttonState()"
                      [replaceContent]="true"
                    />
                  </button>
                }
                @case ('Switch') {
                  <jig-switch [(value)]="switchValue" />
                }
                @case ('Slider') {
                  <jig-slider
                    [min]="0"
                    [max]="100"
                    [(value)]="sliderValue"
                    class="gallery-slider w-full"
                  />
                }
                @case ('Select') {
                  <jig-input-field>
                    <jig-select
                      #sel
                      [pt]="selectPt"
                      [options]="selectOptions"
                      [(value)]="selectValue"
                    />
                  </jig-input-field>
                }
                @case ('Chip') {
                  <jig-chip [color]="chipColor()">Chip</jig-chip>
                }
                @case ('Tag') {
                  <jig-tag [color]="tagColor()">Tag</jig-tag>
                }
                @case ('Avatar') {
                  <jig-avatar [initials]="avatarInitials()" [bgColor]="avatarColor()" />
                }
                @case ('Progress') {
                  <jig-progress [value]="progressValue()" class="w-full" />
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
                  <jig-checkbox [(value)]="checkboxValue" />
                }
                @case ('Tabs') {
                  <jig-tabs [(activeTab)]="activeTab">
                    <jig-tab tabId="a">
                      <ng-template #header>One</ng-template>
                    </jig-tab>
                    <jig-tab tabId="b">
                      <ng-template #header>Two</ng-template>
                    </jig-tab>
                  </jig-tabs>
                }
                @case ('Input') {
                  <jig-input-field>
                    <input ngnInput [value]="inputValue()" />
                  </jig-input-field>
                }
              }
            </div>
            <span
              class="text-(length:--jig-font-size-sm) font-(--jig-font-weight-semibold) text-(--jig-color-text)"
            >
              {{ entry.name }}
            </span>
          </div>
        }
      </div>
      <div class="mt-(--jig-size-padding-xl) flex justify-center">
        <a ngnButton kind="secondary" routerLink="/components">
          See all {{ controlCount }}+ controls
        </a>
      </div>
    </jig-docs-section-shell>
  `,
})
export class AwdDocsComponentGallerySection {
  protected readonly gallery = GALLERY;
  protected readonly controlCount = CONTROL_COUNT;

  // Programmatic refs for controls without a pure-value rest/hover model.
  private readonly select = viewChild<AwdSelect<string>>('sel');
  private readonly tooltip = viewChild<AwdTooltip>('tip');

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
  protected readonly selectPt: AwdPassthrough<'select'> = {
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
        this.avatarInitials.set('JIG');
        this.avatarColor.set('var(--jig-color-primary)');
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
