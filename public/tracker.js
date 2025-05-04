(function() {
  const config = {
    apiEndpoint: 'https://analytics.stackunity.tech/api/analytics/collect',
    flushInterval: 30 * 1000, 
    sessionTimeout: 30 * 60 * 1000, 
    trackClicks: true,
    trackForms: true,
    trackErrors: true,
    trackScroll: true
  };

  const state = {
    websiteId: '',
    sessionId: '',
    visitorId: '',
    currentPageViewId: '',
    /** @type {Array<any>} */
    buffer: [], 
    scrollDepth: 0,
    startTime: new Date(),
    isUnloading: false,
    lastActivity: new Date(),
    hasActivity: false
  };

  const utils = {
    generateUUID: function() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    },
    
    getVisitorId: function() {
      let id = localStorage.getItem('stackunity_visitor_id');
      if (!id) {
        id = utils.generateUUID();
        localStorage.setItem('stackunity_visitor_id', id);
      }
      return id;
    },
    
    getCookies: function() {
      return document.cookie.split(';').reduce((cookies, cookie) => {
        const [name, value] = cookie.trim().split('=').map(decodeURIComponent);
        cookies[name] = value;
        return cookies;
      }, {});
    },
    
    getDeviceType: function() {
      const width = window.innerWidth;
      if (width < 768) return 'mobile';
      if (width < 1024) return 'tablet';
      return 'desktop';
    },
    
    getBrowserInfo: function() {
      const ua = navigator.userAgent;
      let browser = '';
      let version = '';
      
      if (ua.indexOf('Chrome') > -1) {
        browser = 'Chrome';
        const match = ua.match(/Chrome\/(\d+\.\d+)/);
        version = match ? match[1] : '0.0';
      } else if (ua.indexOf('Safari') > -1) {
        browser = 'Safari';
        const match = ua.match(/Version\/(\d+\.\d+)/);
        version = match ? match[1] : '0.0';
      } else if (ua.indexOf('Firefox') > -1) {
        browser = 'Firefox';
        const match = ua.match(/Firefox\/(\d+\.\d+)/);
        version = match ? match[1] : '0.0';
      } else if (ua.indexOf('MSIE') > -1 || ua.indexOf('Trident/') > -1) {
        browser = 'Internet Explorer';
        const match = ua.match(/MSIE (\d+\.\d+)/);
        version = match ? match[1] : '11.0';
      } else if (ua.indexOf('Edge') > -1) {
        browser = 'Edge';
        const match = ua.match(/Edge\/(\d+\.\d+)/);
        version = match ? match[1] : '0.0';
      } else {
        browser = 'Unknown';
        version = '0.0';
      }
      
      return browser + ' ' + version;
    },
    
    getOSInfo: function() {
      const ua = navigator.userAgent;
      
      if (ua.indexOf('Windows') > -1) return 'Windows';
      if (ua.indexOf('Mac OS X') > -1) return 'macOS';
      if (ua.indexOf('Linux') > -1) return 'Linux';
      if (ua.indexOf('iOS') > -1) return 'iOS';
      if (ua.indexOf('Android') > -1) return 'Android';
      
      return 'Unknown';
    },
    
    getReferrer: function() {
      return document.referrer || null;
    },
    
    getUTMParams: function() {
      const urlParams = new URLSearchParams(window.location.search);
      return {
        utm_source: urlParams.get('utm_source'),
        utm_medium: urlParams.get('utm_medium'),
        utm_campaign: urlParams.get('utm_campaign')
      };
    },
    
    getMaxScrollDepth: function() {
      const documentHeight = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      );
      
      const windowHeight = window.innerHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      const scrollDepth = Math.floor((scrollTop + windowHeight) / documentHeight * 100);
      return Math.max(state.scrollDepth, Math.min(100, scrollDepth));
    },
    
    throttle: function(func, limit) {
      let inThrottle;
      return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
          func.apply(context, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      };
    },
    
    setConsent: function(hasConsent) {
      localStorage.setItem('stackunity_consent', hasConsent ? 'true' : 'false');
    },
    
    hasConsent: function() {
      const directConsent = localStorage.getItem('stackunity_consent') === 'true';
      if (directConsent) return true;
      
      try {
        const cookieConsent = document.cookie
          .split('; ')
          .find(row => row.startsWith('stackunity_cookie_consent='));
          
        if (cookieConsent) {
          const cookieValue = decodeURIComponent(cookieConsent.split('=')[1]);
          const preferences = JSON.parse(cookieValue);
          return preferences.analytics === true;
        }
      } catch (e) {
        console.error('Erreur lors de la vérification du consentement:', e);
      }
      
      return false;
    }
  };

  const api = {
    sendData: function(endpoint, data) {
      if (!utils.hasConsent()) {
        console.log('Analytics: No consent given, storing locally');
        return Promise.resolve({ success: true, stored: true });
      }
      
      return fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        keepalive: state.isUnloading 
      }).catch(err => console.error('StackUnity Analytics Error:', err));
    },
    
    flushBuffer: function() {
      if (state.buffer.length === 0) return;
      
      const dataToSend = [...state.buffer];
      state.buffer = [];
      
      return api.sendData(config.apiEndpoint, {
        websiteId: state.websiteId,
        sessionId: state.sessionId,
        visitorId: state.visitorId,
        events: dataToSend
      });
    }
  };

  const tracker = {
    init: function(websiteId) {
      if (!websiteId) {
        console.error('StackUnity Analytics: Website ID is required');
        return;
      }
      
      state.websiteId = websiteId;
      state.visitorId = utils.getVisitorId();
      
      const savedSessionId = sessionStorage.getItem('stackunity_session_id');
      const savedSessionTimestamp = sessionStorage.getItem('stackunity_session_timestamp');
      
      const now = new Date();
      
      if (savedSessionId && savedSessionTimestamp) {
        const elapsed = now.getTime() - parseInt(savedSessionTimestamp, 10);
        
        if (elapsed < config.sessionTimeout) {
          state.sessionId = savedSessionId;
        } else {
          state.sessionId = utils.generateUUID();
          sessionStorage.setItem('stackunity_session_id', state.sessionId);
        }
      } else {
        state.sessionId = utils.generateUUID();
        sessionStorage.setItem('stackunity_session_id', state.sessionId);
      }
      
      sessionStorage.setItem('stackunity_session_timestamp', now.getTime().toString());
      
      tracker.trackPageView();
      
      if (config.trackClicks) {
        document.addEventListener('click', tracker.handleClick);
      }
      
      if (config.trackForms) {
        document.addEventListener('submit', tracker.handleFormSubmit);
        document.addEventListener('input', utils.throttle(tracker.handleInput, 1000));
      }
      
      if (config.trackScroll) {
        document.addEventListener('scroll', utils.throttle(tracker.handleScroll, 500));
      }
      
      if (config.trackErrors) {
        window.addEventListener('error', tracker.handleError);
        window.addEventListener('unhandledrejection', tracker.handlePromiseRejection);
      }
      
      window.addEventListener('beforeunload', tracker.handleUnload);
      
      const activityEvents = ['mousemove', 'keypress', 'scroll', 'click', 'touchstart'];
      activityEvents.forEach(event => {
        document.addEventListener(event, tracker.handleUserActivity);
      });
      
      setInterval(api.flushBuffer, config.flushInterval);
      
      console.log('StackUnity Analytics initialized');
    },
    
    trackPageView: function() {
      state.currentPageViewId = utils.generateUUID();
      state.scrollDepth = 0;
      state.startTime = new Date();
      
      const utmParams = utils.getUTMParams();
      
      const pageView = {
        type: 'pageView',
        id: state.currentPageViewId,
        pageUrl: window.location.href,
        title: document.title,
        enterTime: state.startTime.toISOString(),
        utm_source: utmParams.utm_source,
        utm_medium: utmParams.utm_medium,
        utm_campaign: utmParams.utm_campaign,
        referrer: utils.getReferrer()
      };
      
      if (state.buffer.length === 0) {
        state.buffer.push({
          type: 'session',
          id: state.sessionId,
          startTime: state.startTime.toISOString(),
          deviceType: utils.getDeviceType(),
          browser: utils.getBrowserInfo(),
          os: utils.getOSInfo(),
          referrer: utils.getReferrer(),
          landingPage: window.location.href
        });
      }
      
      state.buffer.push(pageView);
    },
    
    trackEvent: function(category, action, label, value) {
      const event = {
        type: 'customEvent',
        id: utils.generateUUID(),
        pageViewId: state.currentPageViewId,
        name: action,
        category: category,
        timestamp: new Date().toISOString(),
        properties: {
          label: label,
          value: value
        }
      };
      
      state.buffer.push(event);
      state.hasActivity = true;
      state.lastActivity = new Date();
    },
    
    handleClick: function(e) {
      const target = e.target.closest('a, button, [role="button"], input[type="button"], input[type="submit"]');
      
      if (!target) return;
      
      let selector = '';
      
      if (target.id) {
        selector = `#${target.id}`;
      } else if (target.className && typeof target.className === 'string') {
        selector = `.${target.className.trim().replace(/\s+/g, '.')}`;
      } else {
        selector = target.tagName.toLowerCase();
        
        if (target.parentNode && target.parentNode.childNodes.length > 1) {
          const siblings = Array.from(target.parentNode.childNodes).filter(n => n.nodeType === 1);
          const index = siblings.indexOf(target);
          if (index > -1) {
            selector += `:nth-child(${index + 1})`;
          }
        }
      }
      
      const interaction = {
        type: 'interaction',
        id: utils.generateUUID(),
        pageViewId: state.currentPageViewId,
        interactionType: 'click',
        elementSelector: selector,
        elementText: target.textContent ? target.textContent.trim() : '',
        timestamp: new Date().toISOString(),
        value: {
          href: target.href || null,
          x: e.clientX,
          y: e.clientY
        }
      };
      
      state.buffer.push(interaction);
      state.hasActivity = true;
      state.lastActivity = new Date();
    },
    
    handleFormSubmit: function(e) {
      const form = e.target;
      if (!form || form.tagName !== 'FORM') return;
      
      const interaction = {
        type: 'interaction',
        id: utils.generateUUID(),
        pageViewId: state.currentPageViewId,
        interactionType: 'form_submit',
        elementSelector: form.id ? `#${form.id}` : 'form',
        timestamp: new Date().toISOString(),
        value: {
          formId: form.id || null,
          action: form.action || null,
          fields: Array.from(form.elements)
            .filter(el => el.name && !el.name.match(/password|token|key|secret/i)) // Exclure les données sensibles
            .map(el => ({ name: el.name, type: el.type }))
        }
      };
      
      state.buffer.push(interaction);
      state.hasActivity = true;
      state.lastActivity = new Date();
    },
    
    handleInput: function(e) {
      const input = e.target;
      if (!input || !input.name || input.name.match(/password|token|key|secret/i)) return;
      
      const interaction = {
        type: 'interaction',
        id: utils.generateUUID(),
        pageViewId: state.currentPageViewId,
        interactionType: 'input_change',
        elementSelector: input.id ? `#${input.id}` : `input[name="${input.name}"]`,
        timestamp: new Date().toISOString(),
        value: {
          fieldName: input.name,
          fieldType: input.type,
          isValid: input.validity && input.validity.valid
        }
      };
      
      state.buffer.push(interaction);
      state.hasActivity = true;
      state.lastActivity = new Date();
    },
    
    handleScroll: function() {
      const newScrollDepth = utils.getMaxScrollDepth();
      
      if (newScrollDepth > state.scrollDepth) {
        state.scrollDepth = newScrollDepth;
        
        const interaction = {
          type: 'interaction',
          id: utils.generateUUID(),
          pageViewId: state.currentPageViewId,
          interactionType: 'scroll',
          timestamp: new Date().toISOString(),
          value: { scrollDepth: state.scrollDepth }
        };
        
        state.buffer.push(interaction);
        state.hasActivity = true;
        state.lastActivity = new Date();
      }
    },
    
    handleError: function(e) {
      const error = {
        type: 'error',
        id: utils.generateUUID(),
        pageViewId: state.currentPageViewId,
        message: e.message || 'Unknown error',
        stackTrace: e.error && e.error.stack ? e.error.stack : null,
        timestamp: new Date().toISOString(),
        browserInfo: utils.getBrowserInfo() + ' ' + utils.getOSInfo()
      };
      
      state.buffer.push(error);
    },
    
    handlePromiseRejection: function(e) {
      const error = {
        type: 'error',
        id: utils.generateUUID(),
        pageViewId: state.currentPageViewId,
        message: ((e.reason && e.reason.message) || e.reason || 'Promise rejected') + ' (unhandled promise rejection)',
        stackTrace: e.reason && e.reason.stack ? e.reason.stack : null,
        timestamp: new Date().toISOString(),
        browserInfo: utils.getBrowserInfo() + ' ' + utils.getOSInfo()
      };
      
      state.buffer.push(error);
    },
    
    handleUnload: function(e) {
      state.isUnloading = true;
      
      const endTime = new Date();
      const duration = Math.round((endTime.getTime() - state.startTime.getTime()) / 1000);
      
      state.buffer.push({
        type: 'pageViewExit',
        id: utils.generateUUID(),
        pageViewId: state.currentPageViewId,
        exitTime: endTime.toISOString(),
        duration: duration,
        scrollDepth: state.scrollDepth
      });
      
      const isExternalNavigation = (window.location.host !== window.location.host);
      if (isExternalNavigation) {
        state.buffer.push({
          type: 'sessionEnd',
          id: utils.generateUUID(),
          sessionId: state.sessionId,
          endTime: endTime.toISOString(),
          exitPage: window.location.href,
          duration: Math.round((endTime.getTime() - state.startTime.getTime()) / 1000),
          isBounce: state.hasActivity === false,
          isComplete: true
        });
      }
      
      api.flushBuffer();
    },
    
    handleUserActivity: function() {
      state.hasActivity = true;
      state.lastActivity = new Date();
    }
  };

  // @ts-ignore
  window.StackUnityAnalytics = window.StackUnityAnalytics || {
    init: tracker.init,
    trackEvent: tracker.trackEvent,
    setConsent: utils.setConsent
  };

  const currentScript = document.currentScript;
  if (currentScript) {
    const websiteId = currentScript.getAttribute('data-website-id');
    if (websiteId) {
      tracker.init(websiteId);
    }
  }
})(); 