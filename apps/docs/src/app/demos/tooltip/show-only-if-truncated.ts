import { Component, ChangeDetectionStrategy } from '@angular/core';
import { PositioningSizeConstraints } from '@ngneers/controls/api/ng';
import { NgnTooltip } from '@ngneers/controls/tooltip';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnTooltip],
  selector: 'ngn-demo-tooltip-show-only-if-truncated',
  template: `
    <h1>Truncated</h1>
    <p
      class="truncated"
      [ngnTooltip]="content"
      ngnTooltipShowOnlyIfTruncated
      [ngnTooltipSize]="size"
    >
      {{ content }}
    </p>
    <h1>Clamped</h1>
    <p class="clamped" [ngnTooltip]="content" ngnTooltipShowOnlyIfTruncated [ngnTooltipSize]="size">
      {{ content }}
    </p>
    <h1>Not truncated</h1>
    <p [ngnTooltip]="content" ngnTooltipShowOnlyIfTruncated [ngnTooltipSize]="size">
      {{ content }}
    </p>
  `,
  styles: `
    .truncated {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }

    .clamped {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `,
})
export class Demo_Tooltip_ShowOnlyIfTruncated {
  protected readonly size: PositioningSizeConstraints = { maxWidth: '40vw' };
  protected readonly content =
    'Elit qui ipsum commodo cillum cupidatat sunt. Dolore veniam enim deserunt officia mollit nulla veniam. Ea aliqua elit magna ea ex officia aute. Sint laborum dolore Lorem quis nostrud aute sunt exercitation id in consectetur id nostrud. Elit cillum laborum amet commodo aliqua commodo voluptate eiusmod duis ea cillum elit. Nisi tempor et in proident nostrud irure enim exercitation aute cupidatat reprehenderit culpa deserunt officia.';
}
