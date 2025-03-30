export const navTemplates = {
  dashboard: {
    addAppBar: true,
    appBarColor: 1, // primary
    appBar: [
      { title: 'Dashboard', icon: 'mdi-view-dashboard' }
    ],
    location: 'left',
    width: 256,
    color: 'indigo',
    elevation: 4,
    rounded: false,
    floating: false,
    rail: false,
    clipped: false,
    mobile: false,
    temporary: false,
    image: '',
    navItems: [
      { id: '1', type: 'subheader', title: 'Main' },
      { id: '2', type: 'item', icon: 'mdi-home', title: 'Home' },
      { id: '3', type: 'item', icon: 'mdi-chart-bar', title: 'Analytics' },
      { id: '4', type: 'item', icon: 'mdi-account-group', title: 'Users' },
      { id: '5', type: 'subheader', title: 'Management' },
      { id: '6', type: 'item', icon: 'mdi-cog', title: 'Settings' },
      { id: '7', type: 'item', icon: 'mdi-help-circle', title: 'Help' }
    ],
    showLinkItem: true,
    linkIcon: 'mdi-github',
    linkTitle: 'GitHub Repository',
    linkUrl: 'https://github.com',
    linkExternal: true
  },

  ecommerce: {
    addAppBar: true,
    appBarColor: 5, // warning
    appBar: [
      { title: 'E-commerce', icon: 'mdi-shopping' }
    ],
    location: 'left',
    width: 280,
    color: 'amber-darken-2',
    elevation: 2,
    rounded: true,
    floating: false,
    rail: false,
    clipped: true,
    mobile: false,
    temporary: false,
    image: '',
    navItems: [
      { id: '1', type: 'subheader', title: 'Shop' },
      { id: '2', type: 'item', icon: 'mdi-store', title: 'Products' },
      { id: '3', type: 'item', icon: 'mdi-tag', title: 'Categories' },
      { id: '4', type: 'item', icon: 'mdi-cart', title: 'Orders' },
      { id: '5', type: 'subheader', title: 'Account' },
      { id: '6', type: 'item', icon: 'mdi-account', title: 'Profile' },
      { id: '7', type: 'item', icon: 'mdi-heart', title: 'Wishlist' }
    ],
    showLinkItem: false
  },

  social: {
    addAppBar: true,
    appBarColor: 4, // info
    appBar: [
      { title: 'Social Network', icon: 'mdi-account-group' }
    ],
    location: 'left',
    width: 256,
    color: 'blue-lighten-1',
    elevation: 0,
    rounded: false,
    floating: true,
    rail: true,
    expandOnHover: true,
    clipped: false,
    mobile: false,
    temporary: false,
    image: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e',
    navItems: [
      { id: '1', type: 'item', icon: 'mdi-home', title: 'Feed' },
      { id: '2', type: 'item', icon: 'mdi-bell', title: 'Notifications' },
      { id: '3', type: 'item', icon: 'mdi-message', title: 'Messages' },
      { id: '4', type: 'subheader', title: 'Connections' },
      { id: '5', type: 'item', icon: 'mdi-account-multiple', title: 'Friends' },
      { id: '6', type: 'item', icon: 'mdi-account-group', title: 'Groups' },
      { id: '7', type: 'item', icon: 'mdi-calendar', title: 'Events' }
    ],
    showLinkItem: false
  },

  admin: {
    addAppBar: true,
    appBarColor: 3, // success
    appBar: [
      { title: 'Admin Panel', icon: 'mdi-shield-account' }
    ],
    location: 'left',
    width: 300,
    color: 'teal-darken-1',
    elevation: 4,
    rounded: false,
    floating: false,
    rail: false,
    clipped: true,
    mobile: true,
    temporary: true,
    image: '',
    navItems: [
      { id: '1', type: 'subheader', title: 'Administration' },
      { id: '2', type: 'item', icon: 'mdi-view-dashboard', title: 'Dashboard' },
      { id: '3', type: 'item', icon: 'mdi-account-multiple', title: 'Users' },
      { id: '4', type: 'item', icon: 'mdi-file-document', title: 'Reports' },
      { id: '5', type: 'subheader', title: 'System' },
      { id: '6', type: 'item', icon: 'mdi-cog', title: 'Settings' },
      { id: '7', type: 'item', icon: 'mdi-lock', title: 'Permissions' },
      { id: '8', type: 'item', icon: 'mdi-backup-restore', title: 'Backup' }
    ],
    showLinkItem: true,
    linkIcon: 'mdi-help-circle',
    linkTitle: 'Documentation',
    linkUrl: '/docs',
    linkExternal: false
  }
};

export const getNavTemplate = (templateName: string) => {
  return JSON.parse(JSON.stringify(navTemplates[templateName as keyof typeof navTemplates] || {}));
}; 