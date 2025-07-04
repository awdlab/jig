import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { injectThemeTemplate } from '@ngneers/controls/api';
import { buttonControlTemplate } from '@ngneers/controls-themes/templates/button';

@Component({
  selector: 'ngn-button',
  imports: [NgClass],
  templateUrl: './button.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Button {
  protected readonly theme = injectThemeTemplate(buttonControlTemplate);

  public readonly disabled = input(false);
  public readonly autofocus = input<boolean | null>();
  public readonly type = input<'button' | 'submit' | 'reset'>('button');
  public readonly tabIndex = input<number | null>();
  public readonly kind = input<string | null>();

  public readonly ariaPressed = input<boolean | 'mixed' | null>();
  public readonly ariaExpanded = input<boolean | null>();
  public readonly ariaControls = input<string | null>();
  public readonly ariaLabel = input<string | null>();
  public readonly ariaLabelledBy = input<string | null>();
  public readonly ariaDescribedBy = input<string | null>();
  public readonly ariaDisabled = input<boolean | null>();
  public readonly ariaHidden = input<boolean | null>();

  public readonly clicked = output<Event>();
  public readonly focused = output<Event>();
  public readonly blurred = output<Event>();
  public readonly keyPressedDown = output<KeyboardEvent>();
  public readonly keyReleased = output<KeyboardEvent>();
  public readonly mouseEntered = output<MouseEvent>();
}
