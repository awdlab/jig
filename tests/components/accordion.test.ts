import test, { expect, Page } from '@playwright/test';
import { expectOutput, loadComponent } from '../helper/load-component';
import { exampleData } from '../helper/data';
import { InputsType } from 'apps/test-wrapper/src/app/window';
import { NgnAccordionHarness } from 'packages/playwright/src/components/accordion';
import { expectScreenshot } from '../helper/screenshot';
import { deepCopy } from '@ngneers/controls/utils';

const PANELS = [
  {
    id: 'panel1',
    header: 'Panel 1',
    content: exampleData.loremIpsum.full.split(' ').slice(0, 100).join(' '),
  },
  {
    id: 'panel2',
    header: 'Panel 2',
    content: exampleData.loremIpsum.full.split(' ').slice(100, 200).join(' '),
  },
  {
    id: 'panel3',
    header: 'Panel 3',
    content: exampleData.loremIpsum.full.split(' ').slice(200, 400).join(' '),
  },
];

async function prepareTest(page: Page, inputs: InputsType = {}) {
  const handle = await loadComponent(
    page,
    {
      template: `
      <ngn-accordion [expandedPanels]="inputs().expandedPanels" [multiple]="inputs().multiple" (expandedPanelsChange)="output('expanded', $event)"
        [lazy]="inputs().lazy" [cache]="inputs().cache"
      >
        @for(panel of inputs().panels; track panel) {
          <ngn-accordion-panel [panelId]="panel.id" [header]="panel.header" [lazy]="panel.lazy" [cache]="panel.cache">
            <ng-template #content> 
              <dummy [dummyId]="panel.id" (calledConstructor)="output('constructorCalled', $event)">
                {{ panel.content }}
              </dummy>
            </ng-template>
          </ngn-accordion-panel>
        }
      </ngn-accordion>
      `,
      imports: ['accordion', 'accordionPanel', 'dummy_component'],
    },
    {
      inputs: {
        panels: PANELS,
        expandedPanels: [],
        ...inputs,
      },
    }
  );
  return handle;
}

test('expand & collapse', async ({ page }, testInfo) => {
  const handle = await prepareTest(page);

  const accordion = new NgnAccordionHarness(page.locator('ngn-accordion'));
  await accordion.expectPanelCount(3);

  const panel1 = accordion.getPanelByIndex(0);
  const panel2 = accordion.getPanelByIndex(1);
  const panel3 = accordion.getPanelByIndex(2);

  await panel1.expectHeaderText('Panel 1');
  await panel2.expectHeaderText('Panel 2');
  await panel3.expectHeaderText('Panel 3');

  await panel1.expectExpanded(false);
  await panel2.expectExpanded(false);
  await panel3.expectExpanded(false);

  await panel1.toggle();
  await panel1.expectExpanded(true);
  await panel2.expectExpanded(false);
  await panel3.expectExpanded(false);

  await panel2.toggle();
  await panel1.expectExpanded(false);
  await panel2.expectExpanded(true);
  await panel3.expectExpanded(false);

  await panel3.toggle();
  await panel1.expectExpanded(false);
  await panel2.expectExpanded(false);
  await panel3.expectExpanded(true);

  await expectScreenshot(page, testInfo, 'panel3-expanded');

  await panel3.toggle();
  await panel1.expectExpanded(false);
  await panel2.expectExpanded(false);
  await panel3.expectExpanded(false);

  await expectScreenshot(page, testInfo, 'all-collapsed');

  await handle.setInputs({
    expandedPanels: ['panel2'],
  });

  await panel1.expectExpanded(false);
  await panel2.expectExpanded(true);
  await panel3.expectExpanded(false);
});

test('lazy', async ({ page }, testInfo) => {
  const panels = deepCopy(PANELS) as any[];
  panels[0].lazy = false;
  panels[1].lazy = true;
  panels[2].lazy = true;
  panels[2].cache = true;

  const handle = await prepareTest(page, {
    panels,
  });

  const accordion = new NgnAccordionHarness(page.locator('ngn-accordion'));
  await accordion.expectPanelCount(3);

  await expectOutput(handle, 'constructorCalled', ['panel1']); // panel1 is loaded eagerly

  const panel1 = accordion.getPanelByIndex(0);
  const panel2 = accordion.getPanelByIndex(1);
  const panel3 = accordion.getPanelByIndex(2);

  await panel1.toggle();
  await panel1.expectExpanded(true);
  await panel2.expectExpanded(false);
  await panel3.expectExpanded(false);
  await expectOutput(handle, 'constructorCalled', ['panel1']); // panel1 is still only loaded once

  await panel2.toggle();
  await panel1.expectExpanded(false);
  await panel2.expectExpanded(true);
  await panel3.expectExpanded(false);
  await expectOutput(handle, 'constructorCalled', ['panel1', 'panel2']); // panel2 is loaded lazily

  await panel3.toggle();
  await panel1.expectExpanded(false);
  await panel2.expectExpanded(false);
  await panel3.expectExpanded(true);
  await expectOutput(handle, 'constructorCalled', ['panel1', 'panel2', 'panel3']); // panel3 is loaded lazily

  await panel2.toggle();
  await panel1.expectExpanded(false);
  await panel2.expectExpanded(true);
  await panel3.expectExpanded(false);
  await expectOutput(handle, 'constructorCalled', ['panel1', 'panel2', 'panel3', 'panel2']); // panel2 is not cached

  await panel3.toggle();
  await panel1.expectExpanded(false);
  await panel2.expectExpanded(false);
  await panel3.expectExpanded(true);
  await expectOutput(handle, 'constructorCalled', ['panel1', 'panel2', 'panel3', 'panel2']); // panel3 is cached
});
