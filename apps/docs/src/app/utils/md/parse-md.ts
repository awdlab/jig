import { throwExp } from '@awdlab/jig/utils';

// Base block types
export type MarkdownBlock = {
  kind: 'markdown';
  content: string;
};

export type DemoBlock = {
  kind: 'demo';
  component: string;
};
export type ComponentBlock = {
  kind: 'component';
  content: string; // component name
  inputs?: Record<string, any>;
};
export type IncludeBlock = {
  kind: 'include';
  path: string;
};
export type ApiBlock = {
  kind: 'api';
  module: string; // module name
  component: string; // component name
};

// Union of all block types we currently support
export type Block = MarkdownBlock | ComponentBlock | IncludeBlock | ApiBlock | DemoBlock;

// A handler takes the placeholder name and value and returns a Block
type PlaceholderHandler = (value: string) => Block;

const defaultHandlers: Record<string, PlaceholderHandler> = {
  component: value => {
    const parts = value.split(' ');
    if (parts.length === 0) {
      throw new Error(`Invalid component placeholder value: ${value}`);
    }
    const componentName =
      parts[0] ??
      throwExp('parseMarkdown', 'Component name is required in component placeholder', parts);

    const inputs: Record<string, any> = {};
    parts.forEach(part => {
      const [key, val] = part.split('=');
      if (key && val !== undefined) {
        // Try to parse boolean and number values
        if (val === 'true') {
          inputs[key] = true;
        } else if (val === 'false') {
          inputs[key] = false;
        } else if (!isNaN(Number(val))) {
          inputs[key] = Number(val);
        } else {
          inputs[key] = val;
        }
      }
    });

    return {
      kind: 'component',
      content: componentName,
      inputs,
    };
  },
  demo: value => ({
    kind: 'demo',
    component: value.trim(),
  }),
  include: value => ({
    kind: 'include',
    path: value.trim(),
  }),
  api: value => {
    const parts = value.trim().split(' ');
    if (parts.length !== 2) {
      throw new Error(`Invalid api placeholder value: ${value}`);
    }
    return {
      kind: 'api',
      module:
        parts[0] ?? throwExp('parseMarkdown', 'Module name is required in api placeholder', parts),
      component:
        parts[1] ??
        throwExp('parseMarkdown', 'Component name is required in api placeholder', parts),
    };
  },
  // Extendable for other placeholder types
};

export function parseMarkdown(
  input: string,
  extraHandlers: Record<string, PlaceholderHandler> = {}
): Block[] {
  const handlers = { ...defaultHandlers, ...extraHandlers };

  const result: Block[] = [];

  // {{ placeholderName: value }}
  const regex = /{{\s*([a-zA-Z0-9_-]+)\s*:\s*([^}]+)\s*}}/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(input)) !== null) {
    const matchStart = match.index;
    const matchEnd = regex.lastIndex;

    // markdown before the placeholder
    const before = input.slice(lastIndex, matchStart);
    if (before.length > 0) {
      result.push({
        kind: 'markdown',
        content: before,
      });
    }

    const placeholderName =
      match[1] ?? throwExp('parseMarkdown', 'Placeholder name is required', match);
    const placeholderValue =
      match[2] ?? throwExp('parseMarkdown', 'Placeholder value is required', match); // e.g. "TestComponent"

    const handler = handlers[placeholderName];

    if (handler) {
      // known placeholder
      result.push(handler(placeholderValue));
    } else {
      // unknown placeholder, treat as markdownm log warning
      result.push({
        kind: 'markdown',
        content: match[0],
      });
      console.warn(`Unknown placeholder: ${placeholderName}`);
    }

    lastIndex = matchEnd;
  }

  // trailing markdown
  const tail = input.slice(lastIndex);
  if (tail.length > 0) {
    result.push({
      kind: 'markdown',
      content: tail,
    });
  }

  return result;
}
