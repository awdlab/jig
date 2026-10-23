import { createThemePart } from '@awdlab/jig-themes/api';
import { baseStyles } from '@awdlab/jig-themes/base';
import { dropdownListControlTemplate } from '@awdlab/jig-themes/templates/dropdown-list';

// Spacing for the projected header belongs to the content that fills it — the
// select's filter field brings its own margin — so material adds nothing here.
export const dropdownListStyles = createThemePart({
  controlTemplate: dropdownListControlTemplate,
  base: baseStyles.dropdownList,
  dependencies: [],
});
