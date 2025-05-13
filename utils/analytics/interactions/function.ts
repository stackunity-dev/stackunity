import { ExtendedUserInteraction } from "../types";

function getMetricCardColor(type: string): string {
  switch (type) {
    case 'click':
      return 'rgb(var(--v-theme-primary))';
    case 'scroll':
      return 'rgb(var(--v-theme-success))';
    case 'form_submit':
      return 'rgb(var(--v-theme-warning))';
    case 'input_change':
      return '#FF5722';
    default:
      return 'rgb(var(--v-theme-surface-variant))';
  }
}

function formatFieldPurpose(purpose: string): string {
  const purposeMap = {
    'email': 'Email',
    'phone': 'Téléphone',
    'name': 'Nom',
    'first_name': 'Prénom',
    'last_name': 'Nom de famille',
    'address': 'Adresse',
    'city': 'Ville',
    'country': 'Pays',
    'postal_code': 'Code postal',
    'payment': 'Paiement',
    'message': 'Message',
    'subject': 'Sujet',
    'company': 'Entreprise',
    'website': 'Site web',
    'search': 'Recherche',
    'password': 'Mot de passe',
    'username': 'Nom d\'utilisateur',
    'date': 'Date',
    'time': 'Heure',
    'number': 'Nombre',
    'quantity': 'Quantité',
    'file': 'Fichier',
    'comment': 'Commentaire',
    'description': 'Description',
    'url': 'URL',
    'title': 'Titre',
    'category': 'Catégorie',
    'tags': 'Tags',
    'checkbox': 'Case à cocher',
    'radio': 'Bouton radio',
    'select': 'Sélection'
  };

  return purposeMap[purpose] || purpose;
}

function formatTimestamp(timestamp: string): string {
  if (!timestamp) return '';

  const date = new Date(timestamp);
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

function formatUrl(url: string): string {
  if (!url) return 'N/A';

  const withoutProtocol = url.replace(/^https?:\/\//, '');

  if (withoutProtocol.length > 40) {
    return withoutProtocol.substring(0, 37) + '...';
  }

  return withoutProtocol;
}

function getPageUrl(interaction: ExtendedUserInteraction): string {
  return interaction.pageUrl || '';
}

function formatSelectedValue(value: any): string {
  try {
    if (typeof value !== 'object' || value === null) {
      return String(value);
    }

    if (value.depth !== undefined && value.pixelY !== undefined) {
      return JSON.stringify({
        depth: value.depth,
        pixelY: Math.round(Number(value.pixelY))
      }, null, 2);
    }

    if (Object.keys(value).length === 0) {
      return '{}';
    }

    return JSON.stringify(value, null, 2);
  } catch (e) {
    console.error('Erreur lors du formatage des données JSON:', e);
    return '{"error": "Impossible de formater ces données"}';
  }
}

function getInteractionTypeIcon(type) {
  switch (type.toLowerCase()) {
    case 'click': return 'mdi-cursor-default-click-outline';
    case 'scroll':
    case 'scroll_depth': return 'mdi-gesture-swipe';
    case 'form_submit': return 'mdi-form-select';
    case 'input_change': return 'mdi-form-textbox';
    default: return 'mdi-gesture-tap';
  }
}

function determineElementType(interaction) {
  const selector = interaction.elementSelector?.toLowerCase() || '';
  const text = interaction.elementText?.toLowerCase() || '';

  if (selector.includes('button') || selector.includes('btn') || selector.includes('v-btn') ||
    selector.match(/\[\s*role\s*=\s*["']button["']\s*\]/)) {
    return 'button';
  } else if (
    selector.includes('icon') ||
    selector.includes('mdi-') ||
    (selector.includes('v-icon')) ||
    selector.includes('fa-') ||
    selector.match(/\.(fas|far|fal|fab|fad)\s/)
  ) {
    return 'icon';
  } else if (
    selector.includes('a ') ||
    selector.startsWith('a[') ||
    selector.startsWith('a.') ||
    selector.includes('link') ||
    selector.includes('nuxt-link') ||
    selector.includes('router-link')
  ) {
    return 'link';
  } else if (
    selector.includes('input[type="email"]') ||
    selector.match(/\[\s*type\s*=\s*["']email["']\s*\]/)
  ) {
    return 'input-email';
  } else if (
    selector.includes('input[type="password"]') ||
    selector.match(/\[\s*type\s*=\s*["']password["']\s*\]/)
  ) {
    return 'input-password';
  } else if (
    selector.includes('input[type="search"]') ||
    selector.match(/\[\s*type\s*=\s*["']search["']\s*\]/)
  ) {
    return 'input-search';
  } else if (
    selector.includes('input[type="checkbox"]') ||
    selector.match(/\[\s*type\s*=\s*["']checkbox["']\s*\]/)
  ) {
    return 'input-checkbox';
  } else if (
    selector.includes('input[type="radio"]') ||
    selector.match(/\[\s*type\s*=\s*["']radio["']\s*\]/)
  ) {
    return 'input-radio';
  } else if (
    selector.includes('textarea') ||
    selector.includes('v-textarea')
  ) {
    return 'input-textarea';
  } else if (
    selector.includes('input') ||
    selector.includes('v-text-field') ||
    selector.includes('v-select') ||
    selector.includes('v-combobox') ||
    selector.includes('v-autocomplete') ||
    selector.includes('v-file-input') ||
    selector.match(/\[\s*role\s*=\s*["'](textbox|combobox)["']\s*\]/)
  ) {
    return 'input';
  } else if (
    selector.includes('img') ||
    selector.includes('image') ||
    selector.includes('avatar') ||
    selector.includes('picture') ||
    selector.includes('v-img') ||
    selector.includes('figure')
  ) {
    return 'image';
  } else if (
    selector.includes('nav') ||
    selector.includes('menu') ||
    selector.includes('navbar') ||
    selector.includes('sidebar') ||
    selector.includes('drawer') ||
    selector.includes('v-navigation-drawer') ||
    selector.includes('v-app-bar') ||
    selector.match(/\[\s*role\s*=\s*["'](navigation|menubar)["']\s*\]/)
  ) {
    return 'navigation';
  } else if (
    selector.includes('list-item') ||
    selector.includes('v-list') ||
    selector.includes('li ') ||
    selector.includes('ul ') ||
    selector.includes('ol ') ||
    selector.includes('v-list-item') ||
    selector.match(/\[\s*role\s*=\s*["'](listitem|list)["']\s*\]/)
  ) {
    return 'list';
  } else if (
    selector.includes('card') ||
    selector.includes('v-card') ||
    selector.includes('mat-card') ||
    selector.includes('panel') ||
    selector.includes('tile')
  ) {
    return 'card';
  } else if (
    selector.includes('tab') ||
    selector.includes('v-tab') ||
    selector.includes('mat-tab') ||
    selector.match(/\[\s*role\s*=\s*["'](tab|tabpanel)["']\s*\]/)
  ) {
    return 'tab';
  } else if (
    selector.includes('checkbox') ||
    selector.includes('radio') ||
    selector.includes('switch') ||
    selector.includes('toggle') ||
    selector.includes('v-checkbox') ||
    selector.includes('v-radio') ||
    selector.includes('v-switch') ||
    selector.match(/\[\s*role\s*=\s*["'](checkbox|radio|switch)["']\s*\]/)
  ) {
    return 'control';
  } else if (
    selector.includes('chip') ||
    selector.includes('badge') ||
    selector.includes('tag') ||
    selector.includes('v-chip') ||
    selector.includes('pill')
  ) {
    return 'chip';
  } else if (
    selector.includes('dialog') ||
    selector.includes('modal') ||
    selector.includes('drawer') ||
    selector.includes('popup') ||
    selector.includes('v-dialog') ||
    selector.includes('v-bottom-sheet') ||
    selector.match(/\[\s*role\s*=\s*["'](dialog|alertdialog)["']\s*\]/)
  ) {
    return 'dialog';
  } else if (
    selector.includes('header') ||
    selector.includes('heading') ||
    selector.includes('h1') ||
    selector.includes('h2') ||
    selector.includes('h3') ||
    selector.includes('h4') ||
    selector.includes('h5') ||
    selector.includes('h6') ||
    selector.includes('title')
  ) {
    return 'heading';
  } else if (
    selector.includes('form') ||
    selector.includes('v-form') ||
    selector.match(/\[\s*role\s*=\s*["']form["']\s*\]/)
  ) {
    return 'form';
  } else if (
    selector.includes('table') ||
    selector.includes('v-data-table') ||
    selector.includes('grid') ||
    selector.includes('v-data-grid') ||
    selector.match(/\[\s*role\s*=\s*["'](grid|table)["']\s*\]/)
  ) {
    return 'table';
  } else if (
    selector.includes('pagination') ||
    selector.includes('v-pagination') ||
    selector.includes('paginator')
  ) {
    return 'pagination';
  }

  if (
    text.includes('login') ||
    text.includes('sign in') ||
    text.includes('submit') ||
    text.includes('save') ||
    text.includes('cancel') ||
    text.includes('close') ||
    text.includes('connexion') ||
    text.includes('confirmer') ||
    text.includes('envoyer') ||
    text.includes('soumettre') ||
    text.includes('enregistrer') ||
    text.includes('créer') ||
    text.includes('fermer') ||
    text.includes('valider')
  ) {
    return 'button';
  }

  return 'other';
}

export { getMetricCardColor, formatFieldPurpose, formatTimestamp, formatUrl, getPageUrl, formatSelectedValue, getInteractionTypeIcon, determineElementType };
