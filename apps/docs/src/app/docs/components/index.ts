import { AccordionPage } from './accordion/page';
import { AutofocusPage } from './autofocus/page';
import { AvatarPage } from './avatar/page';
import { BadgePage } from './badge/page';
import { BreadcrumbPage } from './breadcrumb/page';
import { ButtonPage } from './button/page';
import { ButtonGroupPage } from './button-group/page';
import { CalendarPage } from './calendar/page';
import { CheckboxPage } from './checkbox/page';
import { ChipPage } from './chip/page';
import { ColorPickerPage } from './color-picker/page';
import { CommandPage } from './command/page';
import { DeferPage } from './defer/page';
import { DialogPage } from './dialog/page';
import { DragPage } from './drag/page';
import { DrawerPage } from './drawer/page';
import { EditInplacePage } from './edit-inplace/page';
import { ErrorsPage } from './errors/page';
import { FilterPage } from './filter/page';
import { HintPage } from './hint/page';
import { IconPage } from './icon/page';
import { InplacePage } from './inplace/page';
import { InputPage } from './input/page';
import { InputFieldPage } from './input-field/page';
import { ItemViewPage } from './item-view/page';
import { KbdPage } from './kbd/page';
import { ListBoxPage } from './list-box/page';
import { MaskInputPage } from './mask-input/page';
import { MenuPage } from './menu/page';
import { MessagePage } from './message/page';
import { MovablePage } from './movable/page';
import { NumberInputPage } from './number-input/page';
import { OtpPage } from './otp/page';
import { PaginatorPage } from './paginator/page';
import { PopoverPage } from './popover/page';
import { ProgressPage } from './progress/page';
import { RadioPage } from './radio/page';
import { RatingPage } from './rating/page';
import { ResizablePage } from './resizable/page';
import { RovingFocusPage } from './roving-focus/page';
import { ScrollAmountPage } from './scroll-amount/page';
import { ScrollShadowPage } from './scroll-shadow/page';
import { ScrollerPage } from './scroller/page';
import { SelectPage } from './select/page';
import { SelectButtonPage } from './select-button/page';
import { SliderPage } from './slider/page';
import { SnackbarPage } from './snackbar/page';
import { SpinnerPage } from './spinner/page';
import { SplitterPage } from './splitter/page';
import { StatePage } from './state/page';
import { StepperPage } from './stepper/page';
import { SwitchPage } from './switch/page';
import { TablePage } from './table/page';
import { TabsPage } from './tabs/page';
import { TagPage } from './tag/page';
import { ToastPage } from './toast/page';
import { ToggleButtonPage } from './toggle-button/page';
import { TooltipPage } from './tooltip/page';
import { TreePage } from './tree/page';
import { UploadPage } from './upload/page';

import type { NgnDocsGroup } from '../../utils/page/types';

/**
 * The Components tab, sliced into visual sidebar groups. Group titles are
 * headers only — every page still routes at `/components/{page}`.
 */
export const COMPONENT_GROUPS: NgnDocsGroup[] = [
  {
    title: 'Inputs',
    pages: [
      CalendarPage,
      CheckboxPage,
      ColorPickerPage,
      EditInplacePage,
      FilterPage,
      InputPage,
      InputFieldPage,
      ListBoxPage,
      MaskInputPage,
      NumberInputPage,
      OtpPage,
      RadioPage,
      RatingPage,
      SelectPage,
      SliderPage,
      SwitchPage,
      UploadPage,
    ],
  },
  {
    title: 'Actions',
    pages: [ButtonPage, ButtonGroupPage, CommandPage, SelectButtonPage, ToggleButtonPage],
  },
  {
    title: 'Data Display',
    pages: [
      AvatarPage,
      BadgePage,
      ChipPage,
      IconPage,
      InplacePage,
      ItemViewPage,
      KbdPage,
      PaginatorPage,
      ProgressPage,
      SpinnerPage,
      TablePage,
      TagPage,
      TreePage,
    ],
  },
  {
    title: 'Containers & Overlays',
    pages: [
      AccordionPage,
      DeferPage,
      DialogPage,
      DrawerPage,
      MenuPage,
      PopoverPage,
      ScrollShadowPage,
      ScrollerPage,
      SplitterPage,
      StepperPage,
      TabsPage,
      TooltipPage,
    ],
  },
  {
    title: 'Feedback & Navigation',
    pages: [BreadcrumbPage, ErrorsPage, HintPage, MessagePage, SnackbarPage, StatePage, ToastPage],
  },
  {
    title: 'Directives',
    pages: [AutofocusPage, DragPage, MovablePage, ResizablePage, RovingFocusPage, ScrollAmountPage],
  },
];

export const ALL_COMPONENT_PAGES = COMPONENT_GROUPS.flatMap(g => g.pages);
