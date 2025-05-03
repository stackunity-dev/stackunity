export default {
  navigation: {
    website: 'Website',
    appearance: 'Appearance',
    security: 'Security',
    cookies: 'Cookies',
    dataPrivacy: 'Data & Privacy'
  },
  website: {
    title: 'Website',
    info: 'Manage your website settings.',
    name: {
      label: 'Website name',
      required: 'The website name is required'
    },
    url: {
      label: 'Website URL',
      invalid: 'The URL must start with https://'
    },
    analysis: {
      title: 'Website analysis',
      description: 'Analyze your site to discover all indexable URLs.',
      button: 'Analyze the website',
      analyzing: 'Analyzing...',
      urlsDetected: 'URLs detected',
      noUrls: 'No URLs detected',
      copy: 'Copy',
      clear: 'Clear',
      open: 'Open {url} in a new tab'
    },
    summary: {
      title: 'Analysis Summary',
      totalPages: 'Total Pages',
      averageLoadTime: 'Average Load Time',
      warnings: 'Warnings'
    },
    sitemap: {
      title: 'Generated Sitemap',
      copy: 'Copy sitemap',
      download: 'Download'
    },
    save: 'Save'
  },
  appearance: {
    title: 'Appearance',
    theme: {
      title: 'Theme',
      greenAmbiance: 'Green Ambiance',
      dark: 'Dark',
      system: 'System'
    },
    save: 'Save'
  },
  security: {
    title: 'Security',
    info: 'Manage your account security settings. We recommend using a strong password and changing it regularly.',
    changePassword: {
      title: 'Change Password',
      currentPassword: 'Current Password',
      newPassword: 'New Password',
      confirmPassword: 'Confirm New Password',
      update: 'Update Password'
    },
    twoFactor: {
      title: 'Two-Factor Authentication',
      description: 'Two-factor authentication adds an extra layer of security to your account.',
      status: 'Status:',
      enabled: 'Enabled',
      disabled: 'Disabled',
      setup: 'Set up two-factor authentication',
      disable: 'Disable two-factor authentication',
      qrCode: 'Scan this QR code with your authenticator app',
      confirmCode: 'Enter the 6-digit code from your app',
      confirm: 'Confirm'
    },
    sessions: {
      title: 'Active Sessions',
      thisDevice: 'This Device',
      lastAccess: 'Last Access:',
      browser: 'Browser:',
      location: 'Location:',
      ip: 'IP:',
      revoke: 'Revoke',
      revokeAll: 'Revoke All Others'
    }
  },
  cookies: {
    title: 'Cookies',
    info: 'Manage how cookies are used on this site.',
    necessary: {
      title: 'Necessary',
      description: 'Necessary cookies help make a website usable by enabling basic functions like page navigation and access to secure areas of the website. The website cannot function properly without these cookies.'
    },
    preferences: {
      title: 'Preferences',
      description: 'Preference cookies enable a website to remember information that changes the way the website behaves or looks, like your preferred language or the region that you are in.'
    },
    statistics: {
      title: 'Statistics',
      description: 'Statistic cookies help website owners to understand how visitors interact with websites by collecting and reporting information anonymously.'
    },
    marketing: {
      title: 'Marketing',
      description: 'Marketing cookies are used to track visitors across websites. The intention is to display ads that are relevant and engaging for the individual user and thereby more valuable for publishers and third party advertisers.'
    },
    save: 'Save Preferences',
    deleteAll: 'Delete All Cookies'
  },
  privacy: {
    title: 'Data & Privacy',
    info: 'Manage your personal data and privacy settings.',
    exportData: {
      title: 'Export Your Data',
      description: 'Download a copy of your personal data.',
      button: 'Export Data'
    },
    deleteAccount: {
      title: 'Delete Account',
      description: 'Permanently delete your account and all associated data.',
      warning: 'Warning: This action cannot be undone. All your data will be permanently deleted.',
      button: 'Delete Account',
      confirm: 'Yes, Delete My Account',
      cancel: 'Cancel',
      confirmation: 'Type "DELETE" to confirm'
    },
    premiumStatus: {
      title: 'Premium Status',
      description: 'Your current subscription status is:',
      premium: 'Premium',
      standard: 'Standard',
      trial: 'Trial',
      free: 'Free'
    }
  },
  notifications: {
    saved: 'Settings saved successfully',
    error: 'There was an error saving your settings',
    passwordChanged: 'Password updated successfully',
    passwordError: 'Error updating password',
    dataCopied: 'Data copied to clipboard',
    sitemapDownloaded: 'Sitemap downloaded',
    analysisStarted: 'Analysis started',
    analysisComplete: 'Analysis complete',
    accountDeleted: 'Account deleted successfully',
    appearanceUpdated: 'Appearance updated successfully',
    cookiesDeleted: 'All cookies have been deleted',
    invalidUrl: 'Please enter a valid URL starting with https://'
  }
} 