# GitHub Copilot Instructions for awdlab Controls

## Project Overview

This is **awdlab Controls**, an Angular component library that provides a comprehensive set of UI controls and components. The project is organized as a pnpm monorepo workspace containing:

- `packages/controls` - Core Angular component library
- `packages/themes` - Theme templates and styling
- `packages/custom-types` - Custom TypeScript types
- `packages/playwright` - Playwright testing utilities
- `apps/docs` - Documentation application
- `apps/test-wrapper` - Testing wrapper application

## Technology Stack

- **Framework**: Angular 22+ (with standalone components and signals)
- **Language**: TypeScript 5.9+
- **Package Manager**: pnpm (v10.26.1+)
- **Build Tool**: Angular CLI with ng-packagr
- **Testing**:
  - Playwright for E2E tests
  - Vitest for unit tests
- **Linting**: oxlint with type-aware rules (tsgolint); config in root `.oxlintrc.json`
- **Formatting**: oxfmt for `.ts`/`.json`/`.md`; Prettier + @ngneers/prettier-config for `.html`
- **UI Libraries**: @floating-ui/dom for positioning, @ngneers/signal-translate for i18n

## Coding Guidelines

### TypeScript

- Use **strict mode** with all strict compiler options enabled
- Use **single quotes** for strings (enforced by EditorConfig)
- Use **2 spaces** for indentation
- Use **explicit types** for function parameters and return values
- Use **Angular signals** for reactive state when possible
- Use **standalone components** (no NgModules)
- Follow **Angular style guide** conventions

### Angular Components

- **Component prefix**: `awd` (e.g., `ngnButton`, `ngnInput`)
- **Selector style**:
  - Element selectors: `kebab-case` (e.g., `awd-button`)
  - Attribute selectors: `camelCase` (e.g., `ngnButton`)
- **Change detection**: Zoneless (Angular 22 default); `OnPush` no longer tool-enforced
- **Component class suffix**: Not required
- **Base class**: Extend `NgnBase<T>` for component base functionality
- **Theme templates**: Use `injectThemeTemplate()` to inject theme templates
- Use `input()` for component inputs (signal-based)
- Use `output()` for component outputs (signal-based)
- Use `booleanAttribute` transform for boolean inputs

### File Organization

- Each component lives in its own directory under `packages/controls/src/`
- Each component directory contains:
  - `index.ts` - Public API exports
  - Component implementation files (e.g., `button.ts`)
  - Component-specific utilities
- Linting is configured centrally in root `.oxlintrc.json` (no per-directory config)
- Tests are organized in:
  - `tests/` - Playwright E2E tests
  - `*.spec.ts` - Vitest unit tests (co-located with source)

### Naming Conventions

- **Components**: PascalCase with `Awd` prefix (e.g., `NgnButton`, `NgnInput`)
- **Directives**: PascalCase with `Awd` prefix
- **Types/Interfaces**: PascalCase
- **Functions**: camelCase
- **Constants**: UPPER_SNAKE_CASE or camelCase depending on context
- **Files**: kebab-case for component files (e.g., `button.ts`, `input-field.ts`)

### Documentation

- Use **JSDoc** comments for public APIs
- Include `@category` tag for API documentation generation (e.g., `@category control`)
- Document all public methods, properties, and inputs
- Provide examples in documentation when helpful

### Error Handling

- Use Angular's dependency injection for error handling
- Validate inputs and provide meaningful error messages
- Use `console.error` for runtime errors that should be visible to developers
- Handle edge cases gracefully

## Build and Test Commands

### Building

```bash
# Build all packages
pnpm build

# Build specific packages
pnpm controls:build    # Build controls library
pnpm themes:build      # Build themes package
pnpm types:build       # Build custom types
pnpm docs:build        # Build documentation
```

### Testing

```bash
# Run all tests
pnpm test              # Run Playwright E2E tests
pnpm unit-test         # Run all unit tests in packages

# Run tests for specific package
pnpm --filter @awdlab/jig test

# Test with UI
pnpm test:ui          # Run Playwright with UI mode

# Build test TypeScript
pnpm test:build       # Check test TypeScript compilation
```

### Development

```bash
# Start documentation development server
pnpm docs:serve

# Start test wrapper development server
pnpm test-wrapper:serve
```

### Linting and Formatting

```bash
# Lint all packages
pnpm lint

# Format all files
pnpm format

# Check formatting without changes
pnpm format:check
```

### Code Generation

```bash
# Generate API documentation
pnpm api-docs:generate
```

## Dependencies

- **Workspace dependencies**: Use `workspace:*` for internal package dependencies
- **Angular packages**: Use `catalog:` for Angular dependencies (managed centrally)
- **Peer dependencies**: Angular core packages, RxJS, and @ngneers/signal-translate are peer dependencies
- Adding new dependencies requires careful consideration to avoid bloating the library

## Testing Requirements

### E2E Tests (Playwright)

- Located in `tests/` directory
- Use the `loadComponent` helper from `tests/helper/load-component.ts`
- Test across multiple browsers (Chromium, Firefox, WebKit)
- Use page object pattern when appropriate
- Tests should be fast and reliable
- Use snapshots (`tests/snapshots/`) for visual regression testing

Example Playwright test structure:

```typescript
import test, { expect } from '@playwright/test';
import { loadComponent } from './helper/load-component';

test('Component behavior', async ({ page }) => {
  const handle = await loadComponent(page, {
    template: `<component-selector [input]="value" />`,
    imports: ['component-name'],
  });
  // Test assertions...
});
```

### Unit Tests (Vitest)

- Located co-located with source files as `*.spec.ts`
- Use Vitest framework
- Test pure functions and utilities
- Use `assertType<T>()` for type testing

Example unit test structure:

```typescript
describe('ComponentOrFunction', () => {
  it('should do something', () => {
    // Test implementation...
  });
});
```

## Code Review Guidelines

- Ensure all new components follow the established patterns
- Check that TypeScript strict mode passes
- Verify linting (`pnpm lint`) and formatting (`pnpm format:check`) pass
- Ensure tests are included for new functionality
- Check that documentation is updated
- Verify build succeeds: `pnpm build`
- Verify tests pass: `pnpm test` and `pnpm unit-test`

## Important Notes

- This library uses **Angular signals** and modern Angular APIs (v20+)
- **No NgModules** - all components are standalone
- Use **RxJS** sparingly, prefer signals for state management
- The library is **side-effect free** (`"sideEffects": false` in package.json)
- Theme system is based on class-based templates from `@awdlab/jig-themes`
- Use `toggleClass` utility instead of renderer for better performance
- i18n is handled via `@ngneers/signal-translate`
- Components should be tree-shakeable

## Common Patterns

### Component Structure

```typescript
import { Directive, input } from '@angular/core';
import { NgnBase, provideSelf } from '@awdlab/jig/base';

@Directive({
  selector: '[ngnExample]',
  providers: [provideSelf(NgnExample)],
  host: {
    '[class]': 'theme.classes({ /* ... */ })',
  },
})
export class NgnExample extends NgnBase<'example'> {
  protected readonly theme = this.injectThemeTemplate(exampleTemplate);

  public readonly someInput = input<string>();

  constructor() {
    super();
    // Initialization logic
  }
}
```

### Public API Exports

Each component directory should have an `index.ts` that exports public APIs:

```typescript
export * from './component-name';
export * from './types';
```

## Preferences

- Prefer **composition over inheritance** when possible
- Prefer **signals over observables** for state management
- Prefer **functional patterns** where appropriate
- Keep components **focused and single-purpose**
- Avoid **unnecessary abstractions**
- Write **self-documenting code** with clear naming
