import { NgTemplateOutlet } from '@angular/common';
import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  effect,
  ElementRef,
  input,
  TemplateRef,
  untracked,
  viewChild,
} from '@angular/core';
import { generateElementId } from '../utils/generate-id';
import { TemplateContext } from '../utils/template-context';

function a<T>(): T {
  return undefined as T;
}

@Component({
  selector: 'ngn-dialog',
  imports: [NgTemplateOutlet],
  templateUrl: './dialog.html',
  styleUrl: './dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TemplateContext],
})
export class Dialog {
  protected readonly headerId = generateElementId();

  private readonly _defaultHeaderTemplate =
    viewChild.required<TemplateRef<unknown>>('defaultHeaderTemplate');
  private _userHeaderTemplate = contentChild<TemplateRef<unknown>>('header');
  public readonly templateHeader = input<TemplateRef<unknown> | null>(null);
  protected readonly headerTemplate = computed(
    () => this._userHeaderTemplate() ?? this.templateHeader() ?? this._defaultHeaderTemplate()
  );

  private readonly _defaultFooterTemplate =
    viewChild.required<TemplateRef<unknown>>('defaultFooterTemplate');
  private readonly _userFooterTemplate = contentChild<TemplateRef<unknown>>('footer');
  public readonly templateFooter = input<TemplateRef<unknown> | null>(null);
  protected readonly footerTemplate = computed(
    () => this._userFooterTemplate() ?? this.templateFooter() ?? this._defaultFooterTemplate()
  );

  private readonly _dialogElement = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  public readonly open = input(true);
  public readonly modal = input(false);
  public readonly autofocus = input(false);
  public readonly title = input<string | null>(null);

  public readonly typeTokens = a<{
    header: {
      headerId: string;
      title: string | null;
    };
  }>();

  constructor() {
    afterRenderEffect(() => {
      if (this.open()) {
        if (untracked(this.modal)) {
          this._dialogElement().nativeElement.showModal();
        } else {
          this._dialogElement().nativeElement.show();
        }
      } else {
        this._dialogElement().nativeElement.close();
      }
    });
  }
}
