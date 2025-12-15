import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ngn-docs-theme-colors',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="main-wrapper">
      @for (color of colors; track color) {
        <div class="color-wrapper">
          <span class="col-span-2 justify-self-center">{{ color }}</span>
          @for (shade of shades; track shade; let i = $index) {
            <span
              class="color-block"
              style="background: var(--ngn-color-{{ color }}-{{ shade }})"
              [class.dark]="i > colors.length / 2"
            >
              {{ shade }}
            </span>
          }
        </div>
      }
    </div>
  `,
  styles: `
    .main-wrapper {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 1rem;
      align-items: center;
      justify-items: center;
    }
    .color-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .color-block {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 50px;
      height: 50px;
      &.dark {
        color: white;
      }
    }
  `,
})
export class NgnThemeColorsDemo {
  constructor() {}

  protected readonly colors = [
    'primary',
    'secondary',
    'accent',
    'error',
    'warning',
    'info',
    'success',
    'surface',
  ];
  protected readonly shades = [
    '50',
    '100',
    '200',
    '300',
    '400',
    '500',
    '600',
    '700',
    '800',
    '900',
    '950',
  ];
}
