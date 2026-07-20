import { avatarControlTemplate } from '@ngneers/controls-themes/templates/avatar';
import { themeClasses } from './theme';
import { buttonControlTemplate } from '@ngneers/controls-themes/templates/button';
import { calendarControlTemplate } from '@ngneers/controls-themes/templates/calendar';
import { checkboxControlTemplate } from '@ngneers/controls-themes/templates/checkbox';
import { inputControlTemplate } from '@ngneers/controls-themes/templates/input';
import { maskInputControlTemplate } from '@ngneers/controls-themes/templates/mask-input';
import { otpControlTemplate } from '@ngneers/controls-themes/templates/otp';
import { inputFieldControlTemplate } from '@ngneers/controls-themes/templates/input-field';
import { listBoxControlTemplate } from '@ngneers/controls-themes/templates/list-box';
import { popoverControlTemplate } from '@ngneers/controls-themes/templates/popover';
import { scrollerControlTemplate } from '@ngneers/controls-themes/templates/scroller';
import { selectControlTemplate } from '@ngneers/controls-themes/templates/select';
import { splitterControlTemplate } from '@ngneers/controls-themes/templates/splitter';
import { tabsControlTemplate } from '@ngneers/controls-themes/templates/tabs';
import { tooltipControlTemplate } from '@ngneers/controls-themes/templates/tooltip';

export const NGN_CLASSES = {
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
