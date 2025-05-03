export default {
  meta: {
    title: 'API Testing Hub',
    description: 'Test your RESTful APIs with our user-friendly interface'
  },
  alerts: {
    deleteWarning: 'Warning: take precautions when using the DELETE method.',
    noCustomHeaders: 'No custom headers were sent with this request.',
    runTests: 'Run tests to see results.'
  },
  cardTitles: {
    newTest: 'New API Test',
    response: 'Response',
    history: 'Request History',
    documentation: 'OpenAPI Documentation',
    apiTests: 'Automated API Tests',
    status: 'Status',
    historySettings: 'History Settings',
    historyCount: 'Request count'
  },
  tooltips: {
    historySettings: 'History settings',
    commonHeaders: 'Common headers automatically added by browsers'
  },
  forms: {
    method: 'Method',
    url: 'URL',
    urlPlaceholder: 'https://api.example.com/endpoint',
    tabs: {
      headers: 'Headers',
      body: 'Body',
      params: 'Params',
      docs: 'Docs',
      tests: 'Tests',
      raw: 'Raw',
      tree: 'Tree',
      response: 'Response Headers',
      request: 'Request Headers'
    },
    headers: {
      key: 'Key',
      keyPlaceholder: 'Authorization',
      value: 'Value',
      valuePlaceholder: 'Bearer token123',
      add: 'Add a header',
      common: 'Common Headers',
      commonNote: 'Some standard headers are automatically added by browsers and not shown here.',
      etc: 'etc.) are automatically added by browsers and not shown here.'
    },
    params: {
      key: 'Key',
      keyPlaceholder: 'page',
      value: 'Value',
      valuePlaceholder: '1',
      add: 'Add a parameter'
    },
    body: {
      label: 'Body',
      placeholder: '{"key": "value"}'
    },
    submit: 'Send the Request',
    send: 'Send the Request',
    schemaDepth: 'Schema Depth',
    showExamples: 'Show Examples',
    impact: 'Impact:',
    result: 'Result',
    status: 'Status',
    data: 'Data',
    saveToHistory: 'Save requests to history'
  },
  response: {
    status: 'Status',
    tabs: {
      body: 'Body',
      headers: 'Headers',
      docs: 'Docs',
      tests: 'Tests'
    },
    bodyViews: {
      raw: 'Raw',
      tree: 'Tree'
    },
    headerTypes: {
      response: 'Response Headers',
      request: 'Request Headers'
    },
    noCustomHeaders: 'No custom headers were sent with this request.'
  },
  docs: {
    title: 'OpenAPI Documentation',
    download: 'Download',
    schemaDepth: 'Schema Depth',
    showExamples: 'Show Examples'
  },
  apiTests: {
    title: 'Automated API Tests',
    run: 'Run Tests',
    results: {
      success: 'Success',
      failure: 'Failure',
      pending: 'Pending'
    },
    generate: 'Generate Tests',
    testTypes: {
      status: 'Status Check',
      schema: 'Schema Validation',
      dataPresence: 'Data Presence',
      performance: 'Performance'
    }
  },
  history: {
    title: 'Request History',
    noHistory: 'No history available',
    clearAll: 'Clear All',
    saveAs: 'Save As',
    load: 'Load',
    delete: 'Delete',
    settings: {
      title: 'History Settings',
      maxEntries: 'Maximum entries',
      saveAutomatically: 'Save requests automatically',
      includeHeaders: 'Include headers',
      includeBody: 'Include body',
      save: 'Save Settings'
    }
  },
  collection: {
    title: 'Collections',
    create: 'Create Collection',
    import: 'Import',
    export: 'Export',
    addRequest: 'Add request to collection',
    name: 'Collection name',
    description: 'Description'
  },
  errors: {
    invalidUrl: 'Invalid URL',
    networkError: 'Network error',
    timeout: 'Request timeout',
    serverError: 'Server error'
  },
  buttons: {
    save: 'Save',
    cancel: 'Cancel',
    close: 'Close',
    run: 'Run',
    copy: 'Copy',
    clear: 'Clear',
    delete: 'Delete',
    download: 'Download'
  }
} 