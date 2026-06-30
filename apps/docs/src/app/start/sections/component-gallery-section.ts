import { Component, DestroyRef, inject, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgnAvatar } from '@ngneers/controls/avatar';
import { NgnButton } from '@ngneers/controls/button';
import { NgnCheckbox } from '@ngneers/controls/checkbox';
import { NgnChip } from '@ngneers/controls/chip';
import { NgnInput } from '@ngneers/controls/input';
import { NgnInputField } from '@ngneers/controls/input-field';
import { NgnProgress } from '@ngneers/controls/progress';
import { NgnSelect } from '@ngneers/controls/select';
import { NgnSlider } from '@ngneers/controls/slider';
import { NgnSwitch } from '@ngneers/controls/switch';
import { NgnTab, NgnTabs } from '@ngneers/controls/tabs';
import { NgnTag } from '@ngneers/controls/tag';
import { NgnTooltip } from '@ngneers/controls/tooltip';

import { CONTROL_COUNT } from './controls-count';
import { GALLERY } from './gallery-data';
import { NgnDocsSectionShell } from './section-shell';

import type { NgnPassthrough } from '@ngneers/controls/base';
import type { CustomColor } from '@ngneers/controls-custom-types';

@Component({
  selector: 'ngn-docs-component-gallery-section',
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
    <ngn-docs-section-shell
      layout="centered"
      eyebrow="Components"
      [heading]="controlCount + '+ controls and counting'"
      subtitle="A growing library of accessible, themeable building blocks. Click any control to read its docs."
    >
      <div class="grid grid-cols-2 gap-(--ngn-size-padding-lg) sm:grid-cols-3 lg:grid-cols-4">
        @for (entry of gallery; track entry.name) {
          <!-- Link is an overlay sibling so the demo controls aren't <a> descendants. -->
          <div
            (mouseenter)="onEnter(entry.name)"
            (mouseleave)="onLeave(entry.name)"
            class="card relative flex flex-col items-center justify-center gap-(--ngn-size-padding-md) p-(--ngn-size-padding-xl) transition-shadow hover:shadow-(--ngn-shadow-md)"
          >
            <a
              [routerLink]="entry.route"
              [attr.aria-label]="entry.name"
              class="absolute inset-0 z-10 rounded-(--ngn-size-rounded-lg) no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-(--ngn-color-primary-500)"
            ></a>
            <div inert class="pointer-events-none flex min-h-12 w-full items-center justify-center">
              @switch (entry.name) {
                @case ('Button') {
                  <button ngnButton kind="primary">
                    {{ buttonLabel() }}
                  </button>
                }
                @case ('Switch') {
                  <ngn-switch [(value)]="switchValue" />
                }
                @case ('Slider') {
                  <ngn-slider
                    [min]="0"
                    [max]="100"
                    [(value)]="sliderValue"
                    class="gallery-slider w-full"
                  />
                }
                @case ('Select') {
                  <ngn-input-field>
                    <ngn-select
                      #sel
                      [pt]="selectPt"
                      [options]="selectOptions"
                      [(value)]="selectValue"
                    />
                  </ngn-input-field>
                }
                @case ('Chip') {
                  <ngn-chip [color]="chipColor()">Chip</ngn-chip>
                }
                @case ('Tag') {
                  <ngn-tag [color]="tagColor()">Tag</ngn-tag>
                }
                @case ('Avatar') {
                  <ngn-avatar [initials]="avatarInitials()" [bgColor]="avatarColor()" />
                }
                @case ('Progress') {
                  <ngn-progress [value]="progressValue()" class="w-full" />
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
                  <ngn-checkbox [(value)]="checkboxValue" />
                }
                @case ('Tabs') {
                  <ngn-tabs [(activeTab)]="activeTab">
                    <ngn-tab tabId="a">
                      <ng-template #header>One</ng-template>
                    </ngn-tab>
                    <ngn-tab tabId="b">
                      <ng-template #header>Two</ng-template>
                    </ngn-tab>
                  </ngn-tabs>
                }
                @case ('Input') {
                  <ngn-input-field>
                    <input ngnInput [value]="inputValue()" />
                  </ngn-input-field>
                }
              }
            </div>
            <span
              class="text-(length:--ngn-font-size-sm) font-(--ngn-font-weight-semibold) text-(--ngn-color-text)"
            >
              {{ entry.name }}
            </span>
          </div>
        }
      </div>
    </ngn-docs-section-shell>
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
  protected readonly buttonLabel = signal('Button');
  protected readonly chipColor = signal<CustomColor | undefined>(undefined);
  protected readonly tagColor = signal<CustomColor | undefined>(undefined);
  protected readonly avatarInitials = signal('NG');
  protected readonly avatarColor = signal<string | undefined>(undefined);
  protected readonly activeTab = signal('a');
  protected readonly inputValue = signal('');

  private readonly typeTarget = 'Hello';
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
        this.buttonLabel.set('Clicked!');
        break;
      case 'Chip':
        this.chipColor.set('primary');
        break;
      case 'Tag':
        this.tagColor.set('success');
        break;
      case 'Avatar':
        this.avatarInitials.set('NGN');
        this.avatarColor.set('var(--ngn-color-primary)');
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
        this.buttonLabel.set('Button');
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
