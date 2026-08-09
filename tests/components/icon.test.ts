import test, { expect } from '@playwright/test';
import { loadComponent } from '../helper/load-component';
import { expectNoA11yViolations } from '../helper/axe';

// Minimal Iconify data object — enough for the component to inline an <svg>.
const ICONIFY = { body: '<path d="M0 0h24v24H0z" />', width: 24, height: 24 };

test('renders an inlined, aria-hidden svg for an Iconify icon', async ({ page }) => {
  await loadComponent(
    page,
    { template: `<awd-icon [icon]="inputs().icon" />`, imports: ['icon'] },
    { inputs: { icon: ICONIFY } }
  );

  const host = page.locator('awd-icon');
  await expect(host).toHaveClass(/awd-icon-root/);

  const svg = host.locator('svg');
  await expect(svg).toHaveCount(1);
  // Icons are decorative and must be hidden from assistive technology.
  await expect(svg).toHaveAttribute('aria-hidden', 'true');
  await expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
});

test('applies scale by insetting the viewBox', async ({ page }) => {
  await loadComponent(
    page,
    { template: `<awd-icon [icon]="inputs().icon" />`, imports: ['icon'] },
    { inputs: { icon: { icon: ICONIFY, scale: 2 } } }
  );

  // scale 2 on a 24x24 icon insets each side by 6, leaving a 12x12 viewBox.
  await expect(page.locator('awd-icon svg')).toHaveAttribute('viewBox', '6 6 12 12');
});

test('resolves a registered default icon', async ({ page }) => {
  await loadComponent(
    page,
    { template: `<awd-icon [defaultIcon]="'checkbox-checked'" />`, imports: ['icon'] },
    { inputs: {} }
  );

  const svg = page.locator('awd-icon svg');
  await expect(svg).toHaveCount(1);
  await expect(svg).toHaveAttribute('aria-hidden', 'true');
});

test('icon takes precedence over defaultIcon', async ({ page }) => {
  await loadComponent(
    page,
    {
      template: `<awd-icon [icon]="inputs().icon" [defaultIcon]="'checkbox-checked'" />`,
      imports: ['icon'],
    },
    { inputs: { icon: ICONIFY } }
  );

  // The explicit [icon] wins, so we get its 24x24 viewBox rather than the
  // scaled default-icon viewBox.
  await expect(page.locator('awd-icon svg')).toHaveAttribute('viewBox', '0 0 24 24');
});

test('accessibility (axe)', async ({ page }) => {
  await loadComponent(
    page,
    { template: `<awd-icon [icon]="inputs().icon" />`, imports: ['icon'] },
    { inputs: { icon: ICONIFY } }
  );
  await expectNoA11yViolations(page);
});
