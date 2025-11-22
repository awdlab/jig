import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgnMessage } from '@ngneers/controls/message';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgnMessage],
  selector: 'ngn-demo-message-with-icon',
  template: `
    <div class="flex gap-2 flex-col">
      <ngn-message icon="img/icons/code.svg" color="success">
        Success message with icon
      </ngn-message>
      <ngn-message icon="img/icons/user.svg" color="info"> Info message with icon </ngn-message>
      <ngn-message icon="img/icons/copy.svg" color="warning">
        Warning message with icon
      </ngn-message>
      <ngn-message icon="img/icons/github.svg" color="error"> Error message with icon </ngn-message>
    </div>
  `,
})
export class Demo_Message_WithIcon {}
