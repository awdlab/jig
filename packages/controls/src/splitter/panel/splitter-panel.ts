import { AfterViewInit, Component, HostBinding, input, model } from '@angular/core';
import { BaseDirective } from '@ngneers/controls/base';

@Component({
  selector: 'ngn-splitter-panel',
  templateUrl: './splitter-panel.html',
  host: {
    class: 'ngn-splitter-panel',
  },
})
export class SplitterPanel extends BaseDirective implements AfterViewInit {
  public readonly sizeMode = input<'absolute' | 'relative'>('relative');
  public readonly size = model<number | null>(null);

  @HostBinding('style.width')
  private get width(): string | null {
    const size = this.size();
    if (size === null) {
      return null;
    }
    return this.sizeMode() === 'absolute' ? `${size}px` : null;
  }

  @HostBinding('style.flexBasis')
  private get flexBasis(): string | null {
    const size = this.size();
    if (size === null) {
      return null;
    }
    return this.sizeMode() === 'relative' ? `${size}%` : null;
  }

  public ngAfterViewInit(): void {
    if (!this.size()) {
      const sizeMode = this.sizeMode();
      if (sizeMode === 'absolute') {
        this.size.set(this.element.nativeElement.offsetWidth);
      } else {
        this.size.set(100);
      }
    }
  }
}
