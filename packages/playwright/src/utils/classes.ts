import { avatarControlTemplate } from '@awdlab/jig-themes/templates/avatar';
import { themeClasses } from './theme';
import { buttonControlTemplate } from '@awdlab/jig-themes/templates/button';
import { calendarControlTemplate } from '@awdlab/jig-themes/templates/calendar';
import { checkboxControlTemplate } from '@awdlab/jig-themes/templates/checkbox';
import { inputControlTemplate } from '@awdlab/jig-themes/templates/input';
import { maskInputControlTemplate } from '@awdlab/jig-themes/templates/mask-input';
import { otpControlTemplate } from '@awdlab/jig-themes/templates/otp';
import { inputFieldControlTemplate } from '@awdlab/jig-themes/templates/input-field';
import { listBoxControlTemplate } from '@awdlab/jig-themes/templates/list-box';
import { popoverControlTemplate } from '@awdlab/jig-themes/templates/popover';
import { scrollerControlTemplate } from '@awdlab/jig-themes/templates/scroller';
import { selectControlTemplate } from '@awdlab/jig-themes/templates/select';
import { splitterControlTemplate } from '@awdlab/jig-themes/templates/splitter';
import { tabsControlTemplate } from '@awdlab/jig-themes/templates/tabs';
import { tooltipControlTemplate } from '@awdlab/jig-themes/templates/tooltip';

export const JIG_CLASSES = {
  avatar: themeClasses(avatarControlTemplate),
  button: themeClasses(buttonControlTemplate),
  calendar: themeClasses(calendarControlTemplate),
  checkbox: themeClasses(checkboxControlTemplate),
  input: themeClasses(inputControlTemplate),
  inputField: themeClasses(inputFieldControlTemplate),
  maskInput: themeClasses(maskInputControlTemplate),
  otp: themeClasses(otpControlTemplate),
  listBox: themeClasses(listBoxControlTemplate),
  popover: themeClasses(popoverControlTemplate),
  scroller: themeClasses(scrollerControlTemplate),
  select: themeClasses(selectControlTemplate),
  splitter: themeClasses(splitterControlTemplate),
  tabs: themeClasses(tabsControlTemplate),
  tooltip: themeClasses(tooltipControlTemplate),
};
