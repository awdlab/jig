import { Component, inject, OnInit, TemplateRef, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgnTemplate, templateTypeFn } from '@ngneers/controls/api/ng';
import { GlobalIconTemplate, IconTemplateContext } from '@ngneers/controls/icon';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgnTemplate],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private readonly _icon = inject(GlobalIconTemplate);
  protected readonly iconTemplateType = templateTypeFn<IconTemplateContext['$implicit']>();

  private readonly _iconTemplate =
    viewChild.required<TemplateRef<IconTemplateContext>>('customIconTemplate');

  public ngOnInit() {
    this._icon.setGlobalIconTemplate(this._iconTemplate());
  }
}
