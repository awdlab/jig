import { NgComponentOutlet } from '@angular/common';
import { Component, input, signal } from '@angular/core';
import tablerCode from '@iconify/icons-tabler/code';
import tablerCopy from '@iconify/icons-tabler/copy';
import { JigButton } from '@awdlab/jig/button';
import { JigIcon } from '@awdlab/jig/icon';
import { throwExp } from '@awdlab/jig/utils';

import { style } from '../code/prism';

import type { Type } from '@angular/core';

@Component({
  selector: 'jig-docs-demo',
  templateUrl: 'demo.html',
  styleUrl: 'demo.scss',
  imports: [NgComponentOutlet, JigButton, JigIcon],
})
export class JigDocsDemo {
  protected readonly iconCode = tablerCode;
  protected readonly iconCopy = tablerCopy;
  public readonly component = input.required<Type<unknown>>();

  protected readonly codeVisible = signal(false);
  protected readonly code = signal('');
  protected readonly formattedCode = signal('');

  protected toggleCodeVisibility() {
    this.codeVisible.update(v => !v);
    if (!this.code()) {
      void this.loadCode();
    }
  }

  private async loadCode() {
    const componentName = this.component().name.replace(/^_/, ''); // Example: Demo_ListBox_Base
    const componentNameParts = componentName.split('_');
    // Pascal case to kebab case
    function toKebabCase(input: string) {
      return input.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    }

    const componentShortName = toKebabCase(
      componentNameParts[1] || throwExp('docs:demo', 'Invalid component name format')
    );
    const demoShortName = toKebabCase(
      componentNameParts[2] || throwExp('docs:demo', 'Invalid component name format')
    );

    const path = `/demos/${componentShortName}/${demoShortName}.ts`;
    const res = await fetch(path);
    const text = await res.text();
    this.code.set(text);
    this.formattedCode.set(await style(text));
  }

  protected copyCode() {
    if (this.code()) {
      void navigator.clipboard.writeText(this.code());
    }
  }
}
