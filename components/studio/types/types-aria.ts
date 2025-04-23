import { ref } from 'vue';
import { CardElement } from './types-card';

interface AriaRoleType {
  role: string;
  description: string;
  category: string;
}

interface AriaProps {
  label: string;
  labelledby: string;
  describedby: string;

  expanded: boolean;
  hidden: boolean;
  disabled: boolean;
  required: boolean;
  selected: boolean;
  checked: boolean;
  pressed?: boolean;

  controls: string;
  owns: string;
  flowto: string;

  valuemin: string;
  valuemax: string;
  valuenow: string;

  level: string;
  orientation?: string;
  modal?: boolean;

  rowcount?: string;
  colcount?: string;
  rowindex?: string;
  colindex?: string;
}

const createAriaProps = (): AriaProps => ({
  label: '',
  labelledby: '',
  describedby: '',
  expanded: false,
  hidden: false,
  disabled: false,
  required: false,
  selected: false,
  checked: false,
  pressed: false,
  controls: '',
  owns: '',
  flowto: '',
  valuemin: '',
  valuemax: '',
  valuenow: '',
  level: '',
  orientation: '',
  modal: false,
  rowcount: '',
  colcount: '',
  rowindex: '',
  colindex: ''
});

const roleAttributeMapping: Record<string, (keyof AriaProps)[]> = {
  'button': ['label', 'expanded', 'disabled', 'pressed', 'controls'],
  'link': ['label', 'disabled', 'expanded', 'controls'],
  'progressbar': ['label', 'valuemin', 'valuemax', 'valuenow'],
  'img': ['label', 'describedby'],
  'heading': ['label', 'level'],
  'checkbox': ['label', 'checked', 'required'],
  'radio': ['label', 'checked', 'required'],
  'menuitem': ['label', 'selected', 'disabled'],
  'tab': ['label', 'selected', 'controls'],
  'textbox': ['label', 'required', 'disabled'],
  'slider': ['label', 'valuemin', 'valuemax', 'valuenow'],
  'switch': ['label', 'checked'],
  'list': ['label'],
  'listitem': ['label'],
  'region': ['label', 'labelledby'],
  'dialog': ['label', 'labelledby', 'modal'],
  'alert': ['label'],
  'status': ['label'],
  'timer': ['label'],
  'feed': ['label'],
  'figure': ['label', 'describedby'],
  'group': ['label', 'labelledby'],
  'separator': ['orientation'],
  'toolbar': ['label'],
  'tooltip': ['label'],
  'tree': ['label', 'expanded'],
  'treeitem': ['label', 'expanded', 'selected', 'level'],
  'grid': ['label', 'rowcount', 'colcount'],
  'gridcell': ['label', 'rowindex', 'colindex'],
  'none': [],
  'presentation': []
};

const isRecommendedAttribute = (attribute: keyof AriaProps, selectedElement: CardElement): boolean => {
  if (!selectedElement || !selectedElement.ariaRole) return false;

  const roleValue = selectedElement.ariaRole.role;
  return roleAttributeMapping[roleValue]?.includes(attribute) || false;
};

const allAriaRoles = ref<AriaRoleType[]>([
  { role: 'banner', description: 'Main content area at the top of the page (often the header)', category: 'Landmark' },
  { role: 'complementary', description: 'Complementary content to the main content', category: 'Landmark' },
  { role: 'contentinfo', description: 'Information about the parent document (often the footer)', category: 'Landmark' },
  { role: 'form', description: 'Section containing form elements', category: 'Landmark' },
  { role: 'main', description: 'Main content of the document', category: 'Landmark' },
  { role: 'navigation', description: 'Collection of navigation links', category: 'Landmark' },
  { role: 'region', description: 'Important section of the document that deserves to be exposed', category: 'Landmark' },
  { role: 'search', description: 'Section dedicated to search', category: 'Landmark' },

  { role: 'application', description: 'Declared as a web application rather than a document', category: 'Document' },
  { role: 'article', description: 'Content section that forms an independent composition', category: 'Document' },
  { role: 'cell', description: 'Cell in a table or grid', category: 'Document' },
  { role: 'columnheader', description: 'Cell containing header information for a column', category: 'Document' },
  { role: 'definition', description: 'Definition of a term or concept', category: 'Document' },
  { role: 'directory', description: 'List of references, like a table of contents', category: 'Document' },
  { role: 'document', description: 'Region containing document content', category: 'Document' },
  { role: 'feed', description: 'Dynamic region containing articles that are added', category: 'Document' },
  { role: 'figure', description: 'Perceptible content referenced in the main document', category: 'Document' },
  { role: 'group', description: 'Group of related but not listed elements', category: 'Document' },
  { role: 'heading', description: 'Header for a page section', category: 'Document' },
  { role: 'img', description: 'Container for content presented as an image', category: 'Document' },
  { role: 'list', description: 'List of items', category: 'Document' },
  { role: 'listitem', description: 'Item in a list', category: 'Document' },
  { role: 'math', description: 'Content representing a mathematical expression', category: 'Document' },
  { role: 'none', description: 'Element to remove from the accessibility tree', category: 'Document' },
  { role: 'note', description: 'Section containing additional information', category: 'Document' },
  { role: 'presentation', description: 'Element presented visually only', category: 'Document' },
  { role: 'row', description: 'Line of cells in a table or grid', category: 'Document' },
  { role: 'rowgroup', description: 'Group of rows in a table', category: 'Document' },
  { role: 'rowheader', description: 'Cell containing header information for a row', category: 'Document' },
  { role: 'separator', description: 'Divider that separates and distinguishes content sections', category: 'Document' },
  { role: 'table', description: 'Table data structure', category: 'Document' },
  { role: 'term', description: 'Word or phrase with a corresponding definition', category: 'Document' },
  { role: 'toolbar', description: 'Collection of frequently used UI elements', category: 'Document' },
  { role: 'tooltip', description: 'Contextual information bubble', category: 'Document' },

  { role: 'combobox', description: 'Dropdown combined with an input field', category: 'Composite Widget' },
  { role: 'grid', description: 'Interactive grid similar to a table', category: 'Composite Widget' },
  { role: 'listbox', description: 'List of options where the user can select one or more items', category: 'Composite Widget' },
  { role: 'menu', description: 'List of options for the user', category: 'Composite Widget' },
  { role: 'menubar', description: 'Menu bar presenting options', category: 'Composite Widget' },
  { role: 'radiogroup', description: 'Group of radio buttons', category: 'Composite Widget' },
  { role: 'tablist', description: 'List of tab elements that can be activated', category: 'Composite Widget' },
  { role: 'tree', description: 'Hierarchical structure that can be expanded or collapsed', category: 'Composite Widget' },
  { role: 'treegrid', description: 'Grid with rows that can be expanded and collapsed', category: 'Composite Widget' },

  { role: 'alert', description: 'Important message, generally to inform about a change', category: 'Widget' },
  { role: 'alertdialog', description: 'Alert or confirmation dialog box', category: 'Widget' },
  { role: 'button', description: 'Clickable element that triggers an action', category: 'Widget' },
  { role: 'checkbox', description: 'Checkbox that can be checked, unchecked or in an indeterminate state', category: 'Widget' },
  { role: 'dialog', description: 'Dialog or modal window', category: 'Widget' },
  { role: 'gridcell', description: 'Cell in an interactive grid', category: 'Widget' },
  { role: 'link', description: 'Interactive reference to a resource', category: 'Widget' },
  { role: 'log', description: 'Dynamic content area that displays new information', category: 'Widget' },
  { role: 'marquee', description: 'Non-essential content that moves, scrolls or updates', category: 'Widget' },
  { role: 'menuitem', description: 'Option dans un menu', category: 'Widget' },
  { role: 'menuitemcheckbox', description: 'Checkbox in a menu', category: 'Widget' },
  { role: 'menuitemradio', description: 'Radio button in a menu', category: 'Widget' },
  { role: 'option', description: 'Selectable option in a selection widget', category: 'Widget' },
  { role: 'progressbar', description: 'Element that indicates the progress of an operation', category: 'Widget' },
  { role: 'radio', description: 'Radio button (option in a group of mutually exclusive options)', category: 'Widget' },
  { role: 'scrollbar', description: 'Scrollbar', category: 'Widget' },
  { role: 'searchbox', description: 'Text input specific to search', category: 'Widget' },
  { role: 'slider', description: 'Control allowing selection of a value within a range', category: 'Widget' },
  { role: 'spinbutton', description: 'Input with buttons for selecting a value within a range', category: 'Widget' },
  { role: 'status', description: 'Container whose content is updated in response to an action', category: 'Widget' },
  { role: 'switch', description: 'Two-state button (on/off)', category: 'Widget' },
  { role: 'tab', description: 'Tab in a tab list', category: 'Widget' },
  { role: 'tabpanel', description: 'Container associated with a tab element', category: 'Widget' },
  { role: 'textbox', description: 'Text input', category: 'Widget' },
  { role: 'timer', description: 'Content area containing a counter or clock', category: 'Widget' },
  { role: 'treeitem', description: 'Option in a tree structure', category: 'Widget' },

  { role: 'dialog', description: 'Dialog or modal window', category: 'Window' },
  { role: 'alertdialog', description: 'High-importance dialog requiring a response', category: 'Window' }
])

export { AriaProps, AriaRoleType, createAriaProps, isRecommendedAttribute, allAriaRoles };
