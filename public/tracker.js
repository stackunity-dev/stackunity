(function() {
  const config = {
    apiEndpoint: '/api/analytics/collect',
    flushInterval: 10 * 1000,
    sessionTimeout: 30 * 60 * 1000, 
    trackClicks: true,
    trackForms: true,
    trackErrors: true,
    trackScroll: true,
    trackVisibility: true,
    visibilitySampleRate: 5,
    visibilityThreshold: 0.5,
    minVisibilityTime: 250,
    inputThrottleTime: 2000,
    inputDebounceTime: 2000,
    inputMinimumCharChange: 3,
    bounceTimeout: 30 * 1000,
    exclusionsEndpoint: '/api/analytics/website/{id}/exclusions'
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
    hasActivity: false,
    /** @type {Array<IntersectionObserver>} */
    visibilityObservers: [],
    /** @type {Map<string, any>} */
    visibilityData: new Map(),
    /** @type {Map<string, any>} */
    trackedElements: new Map(),
    /** @type {Map<string, {lastValue: string, lastTrackedAt: number, changeCount: number}>} */
    inputTracker: new Map(),
    /** @type {Array<{id: number, startPercent: number, endPercent: number, startY: number, endY: number, marker: HTMLElement, elementsInSegment: Array<any>, visibleTime: number, lastVisibleTime: Date|null, totalViews: number, isCurrentlyVisible: boolean}>} */
    pageSegments: [],
    lastScrollPosition: 0,
    lastScrollTimestamp: 0,
    /** @type {Map<number, boolean>} */
    visibilityMap: new Map(),
    bounceDetected: false,
    /** @type {ReturnType<typeof setTimeout>|null} */
    bounceTimeout: null,
    tabHidden: false,
    lastActiveTime: new Date(),
    isExcluded: false
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
    
    getReferrerSource: function() {
      const referrer = document.referrer;
      if (!referrer) return { source: 'direct', name: 'Direct' };
      
      try {
        const url = new URL(referrer);
        const hostname = url.hostname.toLowerCase();
        
        if (hostname.includes('linkedin.com') || hostname.includes('lnkd.in')) {
          return { source: 'linkedin', name: 'LinkedIn' };
        } else if (hostname.includes('facebook.com') || hostname.includes('fb.com')) {
          return { source: 'facebook', name: 'Facebook' };
        } else if (hostname.includes('twitter.com') || hostname.includes('t.co')) {
          return { source: 'twitter', name: 'Twitter' };
        } else if (hostname.includes('instagram.com')) {
          return { source: 'instagram', name: 'Instagram' };
        } else if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
          return { source: 'youtube', name: 'YouTube' };
        }
        
        if (hostname.includes('google.')) {
          return { source: 'google', name: 'Google' };
        } else if (hostname.includes('bing.com')) {
          return { source: 'bing', name: 'Bing' };
        } else if (hostname.includes('yahoo.com')) {
          return { source: 'yahoo', name: 'Yahoo' };
        } else if (hostname.includes('duckduckgo.com')) {
          return { source: 'duckduckgo', name: 'DuckDuckGo' };
        }
        
        return { source: 'referral', name: hostname };
      } catch (e) {
        return { source: 'unknown', name: 'Unknown' };
      }
    },
    
    getUTMParams: function() {
      const urlParams = new URLSearchParams(window.location.search);
      return {
        utm_source: urlParams.get('utm_source') || null,
        utm_medium: urlParams.get('utm_medium') || null,
        utm_campaign: urlParams.get('utm_campaign') || null,
        utm_content: urlParams.get('utm_content') || null,
        utm_term: urlParams.get('utm_term') || null
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
      let lastFunc;
      let lastRan;
      let firstCall = true;
      return function() {
        const context = this;
        const args = arguments;
        
        if (firstCall) {
          func.apply(context, args);
          lastRan = Date.now();
          firstCall = false;
          return;
        }
        
        clearTimeout(lastFunc);
        lastFunc = setTimeout(function() {
          if ((Date.now() - lastRan) >= limit) {
            func.apply(context, args);
            lastRan = Date.now();
          }
        }, limit - (Date.now() - lastRan));
      };
    },
    
    debounce: function(func, wait) {
      let timeout;
      return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          func.apply(context, args);
        }, wait);
      };
    },
    
    hasConsent: function() {
      return true;
    },
    
    estimateReadingTime: function(element) {
      const text = element.textContent || '';
      const wpm = 200;
      const words = text.trim().split(/\s+/).length;
      return Math.max(1, Math.ceil(words / wpm * 60));
    },
    
    isImportantElement: function(element) {
      if (!element) return false;
      
      const tagName = element.tagName.toLowerCase();
      const importantTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'img', 'video', 'button', 'a', 'form', 'input', 'iframe'];
      
      if (importantTags.includes(tagName)) return true;
      
      const classAttr = element.getAttribute('class') || '';
      const idAttr = element.getAttribute('id') || '';
      const attrs = (classAttr + ' ' + idAttr).toLowerCase();
      
      const importantKeywords = ['hero', 'banner', 'content', 'main', 'feature', 'cta', 'button', 'card', 'product', 'price', 'important'];
      
      return importantKeywords.some(keyword => attrs.includes(keyword));
    },
    
    getElementSelector: function(element) {
      if (!element || element === document || element === window) return 'window';
      
      if (element.id) return `#${element.id}`;
      
      if (element.className && typeof element.className === 'string') {
        const classes = element.className.trim().split(/\s+/);
        const significantClasses = classes.filter(cls => 
          cls.length > 3 && !['row', 'col', 'container', 'wrapper'].includes(cls)
        );
        
        if (significantClasses.length > 0) {
          return `.${significantClasses.join('.')}`;
        }
      }
      
      let selector = element.tagName.toLowerCase();
      
      if (element.hasAttribute('role')) {
        selector += `[role="${element.getAttribute('role')}"]`;
      } else if (element.hasAttribute('data-testid')) {
        selector += `[data-testid="${element.getAttribute('data-testid')}"]`;
      } else if (element.hasAttribute('name')) {
        selector += `[name="${element.getAttribute('name')}"]`;
      }
      
      let parentNode = element.parentNode;
      if (parentNode && parentNode.children.length > 1) {
        const siblings = Array.from(parentNode.children);
        const sameTagSiblings = siblings.filter(sibling => 
          sibling.tagName === element.tagName
        );
        
        if (sameTagSiblings.length > 1) {
          const index = siblings.indexOf(element) + 1;
          selector += `:nth-child(${index})`;
        }
      }
      
      return selector;
    },
    
    getElementsInZone: function(startY, endY) {
      const elements = [];
      const allElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, img, video, button, a, form, section, article, div.content, div.main, div[role="main"]');
      
      allElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const elementTop = rect.top + window.pageYOffset;
        const elementBottom = rect.bottom + window.pageYOffset;
        
        if (elementBottom >= startY && elementTop <= endY) {
          const elementHeight = elementBottom - elementTop;
          const overlapTop = Math.max(elementTop, startY);
          const overlapBottom = Math.min(elementBottom, endY);
          const overlapHeight = overlapBottom - overlapTop;
          const overlapPercentage = overlapHeight / elementHeight;
          
          if (overlapPercentage > 0.5) {
            elements.push({
              selector: utils.getElementSelector(element),
              importance: utils.isImportantElement(element) ? 'high' : 'normal',
              text: element.textContent?.substring(0, 100).trim() || ''
            });
          }
        }
      });
      
      return elements;
    },
    
    initPageSegments: function() {
      const segmentSize = 100 / config.visibilitySampleRate;
      const documentHeight = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      );
      
      state.pageSegments = [];
      
      for (let i = 0; i < config.visibilitySampleRate; i++) {
        const startPercent = i * segmentSize;
        const endPercent = (i + 1) * segmentSize;
        const startY = Math.floor(startPercent * documentHeight / 100);
        const endY = Math.floor(endPercent * documentHeight / 100);
        
        const marker = document.createElement('div');
        marker.style.position = 'absolute';
        marker.style.top = startY + 'px';
        marker.style.left = '0';
        marker.style.width = '100%';
        marker.style.height = (endY - startY) + 'px';
        marker.style.pointerEvents = 'none';
        marker.style.zIndex = '-9999';
        marker.setAttribute('data-segment-id', i.toString());
        marker.setAttribute('data-start-percent', startPercent.toString());
        marker.setAttribute('data-end-percent', endPercent.toString());
        
        document.body.appendChild(marker);
        
        const elementsInSegment = utils.getElementsInZone(startY, endY);
        
        state.pageSegments.push({
          id: i,
          startPercent,
          endPercent,
          startY,
          endY,
          marker,
          elementsInSegment,
          visibleTime: 0,
          lastVisibleTime: null,
          totalViews: 0,
          isCurrentlyVisible: false
        });
      }

      return state.pageSegments;
    },
    
    getFormPurpose: function(form) {
      if (!form) return 'unknown';
      
      const formId = (form.id || '').toLowerCase();
      const formAction = (form.action || '').toLowerCase();
      const formClass = (form.className || '').toLowerCase();
      const formMethod = (form.method || '').toLowerCase();
      
      const formText = form.textContent ? form.textContent.toLowerCase() : '';
      
      const submitButtons = form.querySelectorAll('button[type="submit"], input[type="submit"]');
      const buttonTexts = Array.from(submitButtons).map(btn => 
        btn.textContent || btn.value || ''
      ).join(' ').toLowerCase();
      
      const loginKeywords = ['login', 'log in', 'sign in', 'signin', 'connexion', 'connecter', 'identifier'];
      const registerKeywords = ['register', 'sign up', 'signup', 'create account', 'inscription', 'créer un compte'];
      const searchKeywords = ['search', 'find', 'recherche', 'chercher', 'trouver'];
      const contactKeywords = ['contact', 'message', 'send', 'envoyer', 'contact us', 'contactez-nous'];
      const newsletterKeywords = ['newsletter', 'subscribe', 'abonnement', 'updates', 'bulletin'];
      const checkoutKeywords = ['checkout', 'payment', 'purchase', 'buy', 'order', 'commander', 'achat', 'paiement'];
      
      const containsAny = (text, keywords) => 
        keywords.some(keyword => text.includes(keyword));
      
      const allText = `${formId} ${formAction} ${formClass} ${formMethod} ${formText} ${buttonTexts}`;
      
      if (containsAny(allText, loginKeywords)) return 'login';
      if (containsAny(allText, registerKeywords)) return 'registration';
      if (containsAny(allText, searchKeywords)) return 'search';
      if (containsAny(allText, contactKeywords)) return 'contact';
      if (containsAny(allText, newsletterKeywords)) return 'newsletter';
      if (containsAny(allText, checkoutKeywords)) return 'checkout';
      
      const hasEmailField = form.querySelector('input[type="email"]') !== null;
      const hasPasswordField = form.querySelector('input[type="password"]') !== null;
      const hasCreditCardField = form.querySelector('input[name*="card"], input[name*="credit"], input[id*="card"], input[id*="credit"]') !== null;
      
      if (hasEmailField && hasPasswordField) return 'authentication';
      if (hasEmailField && !hasPasswordField) return 'email_collection';
      if (hasCreditCardField) return 'payment';
      
      return 'other';
    },
    
    getInputFieldPurpose: function(input) {
      if (!input) return 'unknown';
      
      const type = (input.type || '').toLowerCase();
      const name = (input.name || '').toLowerCase();
      const id = (input.id || '').toLowerCase();
      const placeholder = (input.placeholder || '').toLowerCase();
      
      let labelText = '';
      if (input.id) {
        const label = document.querySelector(`label[for="${input.id}"]`);
        if (label && label.textContent) {
          labelText = label.textContent.trim().toLowerCase();
        }
      }
      
      const allAttrs = `${type} ${name} ${id} ${placeholder} ${labelText}`;
      
      if (type === 'email' || allAttrs.includes('email') || allAttrs.includes('courriel')) return 'email';
      if (type === 'password' || allAttrs.includes('password') || allAttrs.includes('mot de passe')) return 'password';
      if (type === 'tel' || allAttrs.includes('phone') || allAttrs.includes('telephone') || allAttrs.includes('téléphone')) return 'phone';
      if (type === 'search' || allAttrs.includes('search') || allAttrs.includes('recherche')) return 'search';
      
      if (allAttrs.includes('name') || allAttrs.includes('nom') || allAttrs.includes('fullname') || allAttrs.includes('full-name')) return 'name';
      if (allAttrs.includes('firstname') || allAttrs.includes('first-name') || allAttrs.includes('prénom') || allAttrs.includes('prenom')) return 'first_name';
      if (allAttrs.includes('lastname') || allAttrs.includes('last-name') || allAttrs.includes('surname') || allAttrs.includes('nom de famille')) return 'last_name';
      
      if (allAttrs.includes('address') || allAttrs.includes('adresse')) return 'address';
      if (allAttrs.includes('city') || allAttrs.includes('ville')) return 'city';
      if (allAttrs.includes('country') || allAttrs.includes('pays')) return 'country';
      if (allAttrs.includes('zip') || allAttrs.includes('postal') || allAttrs.includes('code postal')) return 'postal_code';
      
      if (allAttrs.includes('card') || allAttrs.includes('credit') || allAttrs.includes('payment') || allAttrs.includes('carte')) return 'payment';
      
      if (allAttrs.includes('message') || allAttrs.includes('comment') || allAttrs.includes('commentaire')) return 'message';
      
      if (allAttrs.includes('subject') || allAttrs.includes('sujet')) return 'subject';
      if (allAttrs.includes('company') || allAttrs.includes('société') || allAttrs.includes('entreprise')) return 'company';
      if (allAttrs.includes('website') || allAttrs.includes('site web') || allAttrs.includes('url')) return 'website';
      
      return 'other';
    },
    
    sendBounceEvent: function(forceSend = false) {
      if (state.bounceDetected && !forceSend) return;
      
      state.bounceDetected = true;
      const endTime = new Date();
      const duration = Math.round((endTime.getTime() - state.startTime.getTime()) / 1000);
      
      const bounceEvent = {
        type: 'sessionEnd',
        id: utils.generateUUID(),
        sessionId: state.sessionId,
        endTime: endTime.toISOString(),
        exitPage: window.location.href,
        duration: duration,
        isBounce: true,
        isComplete: false,
        reason: 'tab_closed'
      };
      

      if (navigator.sendBeacon) {
        navigator.sendBeacon(config.apiEndpoint, JSON.stringify({
          websiteId: state.websiteId,
          sessionId: state.sessionId,
          visitorId: state.visitorId,
          events: [bounceEvent]
        }));
      }
      
      const img = new Image();
      img.src = `${config.apiEndpoint}?emergency=1&websiteId=${encodeURIComponent(state.websiteId)}&sessionId=${encodeURIComponent(state.sessionId)}&visitorId=${encodeURIComponent(state.visitorId)}&bounce=1&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(document.title)}&duration=${duration}&t=${Date.now()}`;
      document.body.appendChild(img);
      
      try {
        fetch(config.apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            websiteId: state.websiteId,
            sessionId: state.sessionId,
            visitorId: state.visitorId,
            events: [bounceEvent]
          }),
          keepalive: true
        }).catch(() => {});
      } catch (e) {
      }
      
      try {
        const storedBounces = JSON.parse(localStorage.getItem('stackunity_pending_bounces') || '[]');
        storedBounces.push({
          websiteId: state.websiteId,
          sessionId: state.sessionId,
          visitorId: state.visitorId,
          event: bounceEvent,
          timestamp: Date.now()
        });
        while (storedBounces.length > 5) {
          storedBounces.shift();
        }
        localStorage.setItem('stackunity_pending_bounces', JSON.stringify(storedBounces));
      } catch (e) {
        console.error('Erreur lors du stockage du rebond dans localStorage:', e);
      }
      
      return bounceEvent;
    },
    
    checkPendingBounces: function() {
      try {
        const storedBounces = JSON.parse(localStorage.getItem('stackunity_pending_bounces') || '[]');
        if (storedBounces.length === 0) return;
        
        storedBounces.forEach(bounce => {
          fetch(config.apiEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              websiteId: bounce.websiteId,
              sessionId: bounce.sessionId,
              visitorId: bounce.visitorId,
              events: [bounce.event]
            })
          }).catch(() => {});
        });
        
        localStorage.setItem('stackunity_pending_bounces', '[]');
      } catch (e) {
        console.error('Erreur lors de la vérification des rebonds en attente:', e);
      }
    },
    
    getUserIP: async function() {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
      } catch (e) {
        console.error('Erreur lors de la récupération de l\'IP:', e);
        return null;
      }
    },

    getAuthenticatedUserId: function() {
      // @ts-ignore
      if (window.stackunityUserId) {
        // @ts-ignore
        return window.stackunityUserId;
      }
      
      const userIdFromStorage = localStorage.getItem('stackunity_auth_user_id');
      if (userIdFromStorage) {
        return userIdFromStorage;
      }
      
      return null;
    },
    
    checkExclusions: async function(websiteId) {
      try {
        const [ip, userId] = await Promise.all([
          utils.getUserIP(),
          Promise.resolve(utils.getAuthenticatedUserId())
        ]);
        
        if (!ip && !userId) {
          return false;
        }
        
        const endpoint = config.exclusionsEndpoint.replace('{id}', websiteId);
        
        const response = await fetch(endpoint);
        const result = await response.json();
        
        if (!result.success || !result.data || !Array.isArray(result.data)) {
          return false;
        }
        
        for (const exclusion of result.data) {
          if (exclusion.type === 'ip' && ip && exclusion.value === ip) {
            return true;
          }
          
          if (exclusion.type === 'user' && userId && exclusion.value === userId) {
            return true;
          }
        }
        
        return false;
      } catch (e) {
        console.error('Erreur lors de la vérification des exclusions:', e);
        return false;
      }
    }
  };

  const api = {
    sendData: function(endpoint, data) {
      if (navigator.sendBeacon && state.isUnloading) {
        try {
          navigator.sendBeacon(endpoint, JSON.stringify(data));
          return Promise.resolve();
        } catch (e) {
          console.error('Beacon API failed:', e);
        }
      }
      
      const hasOnlySubtleEvents = data.events && data.events.every(event => 
        event.interactionType === 'input_change' || 
        event.interactionType === 'scroll'
      );
      
      if (hasOnlySubtleEvents && data.events && data.events.length < 5) {
        return api.sendDataNoCors(endpoint, data);
      }
      
      return fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        keepalive: state.isUnloading 
      });
    },
    
    sendDataNoCors: function(endpoint, data) {
      try {
        const queryParams = `data=${encodeURIComponent(JSON.stringify(data))}&t=${Date.now()}`;
        const img = new Image();
        img.src = `${endpoint}?${queryParams}`;
        img.style.display = 'none';
        img.onload = function() {
          document.body.removeChild(img);
        };
        img.onerror = function() {
          document.body.removeChild(img);
        };
        document.body.appendChild(img);
        return Promise.resolve();
      } catch (error) {
        console.error('Erreur sendDataNoCors:', error);
        return Promise.reject(error);
      }
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
      }).catch(error => {
        console.error('Erreur lors de l\'envoi des données:', error);
        state.buffer = [...state.buffer, ...dataToSend];
      });
    }
  };

  const tracker = {
    init: function() {
      try {
        const script = document.currentScript || document.querySelector('script[data-website-id]');
        if (!script) return;
        
        state.websiteId = script.getAttribute('data-website-id') || '';
        if (!state.websiteId) return;
        
        state.visitorId = utils.getVisitorId();
        state.sessionId = sessionStorage.getItem('stackunity_session_id') || utils.generateUUID();
        sessionStorage.setItem('stackunity_session_id', state.sessionId);
        
        utils.checkExclusions(state.websiteId).then(isExcluded => {
          if (isExcluded) {
            state.isExcluded = true;
            return;
          }
          
          tracker.setupTracking();
        });
      } catch (e) {
        console.error('Erreur lors de l\'initialisation du tracker:', e);
      }
    },
    
    setupTracking: function() {
      state.currentPageViewId = utils.generateUUID();
      
      tracker.trackPageView();
      
      tracker.setupEventListeners();
      
      setInterval(() => {
        if (state.buffer.length > 0) {
          tracker.flushEvents();
        }
      }, config.flushInterval);
      
      state.bounceTimeout = setTimeout(() => {
        state.bounceDetected = !state.hasActivity;
      }, config.bounceTimeout);
      
      if (typeof utils.setupPageVisibilityObserver === 'function') {
        utils.setupPageVisibilityObserver();
      }
      
    },

    setupEventListeners: function() {
      document.addEventListener('click', function(e) {
        if (config.trackClicks) {
          tracker.handleClickEvent(e);
        }
      });
      
      document.addEventListener('input', utils.throttle(function(e) {
        if (config.trackForms) {
          tracker.handleInputEvent(e);
        }
      }, config.inputThrottleTime));
      
      document.addEventListener('change', function(e) {
        if (config.trackForms) {
          tracker.handleInputEvent(e);
        }
      });
      
      document.addEventListener('submit', function(e) {
        if (config.trackForms) {
          tracker.handleFormSubmit(e);
        }
      });
      
      window.addEventListener('error', function(e) {
        if (config.trackErrors) {
          tracker.handleError(e);
        }
      });
      
      window.addEventListener('unhandledrejection', function(e) {
        if (config.trackErrors) {
          tracker.handlePromiseRejection(e);
        }
      });
      
      window.addEventListener('scroll', utils.throttle(function() {
        if (config.trackScroll) {
          tracker.handleScroll();
        }
      }, 300));
      
      window.addEventListener('beforeunload', function() {
        state.isUnloading = true;
        tracker.flushEvents(true);
      });
      
      window.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'hidden') {
          state.tabHidden = true;
          
          state.buffer.push({
            type: 'interaction',
            id: utils.generateUUID(),
            pageViewId: state.currentPageViewId,
            interactionType: 'page_exit',
            timestamp: new Date().toISOString(),
            value: {
              scrollDepth: state.scrollDepth,
              duration: Math.round((new Date().getTime() - state.startTime.getTime()) / 1000)
            },
            pageUrl: window.location.href
          });
          
          tracker.flushEvents(true);
        } else {
          state.tabHidden = false;
          state.lastActivity = new Date();
          
          if (new Date().getTime() - state.lastActiveTime.getTime() > config.sessionTimeout) {
            state.sessionId = utils.generateUUID();
            sessionStorage.setItem('stackunity_session_id', state.sessionId);
            
            state.currentPageViewId = utils.generateUUID();
            state.startTime = new Date();
            state.scrollDepth = 0;
            
            tracker.trackPageView();
          }
        }
      });
      
      ['mousedown', 'keydown', 'touchstart', 'scroll'].forEach(eventType => {
        window.addEventListener(eventType, utils.throttle(function() {
          tracker.handleUserActivity();
        }, 1000));
      });
      
      if (window.history && window.history.pushState) {
        const originalPushState = window.history.pushState;
        window.history.pushState = function() {
          originalPushState.apply(this, arguments);
          
          setTimeout(() => tracker.handleHistoryChange(), 100);
        };
        
        window.addEventListener('popstate', function() {
          setTimeout(() => tracker.handleHistoryChange(), 100);
        });
      }
      
      if (config.trackVisibility && 'IntersectionObserver' in window) {
        setTimeout(() => {
          tracker.setupVisibilityTracking();
        }, 1000);
      }
    },
    
    trackPageView: function() {
      if (state.isExcluded) return;
      
      state.startTime = new Date();
      
      const deviceType = utils.getDeviceType();
      const browserInfo = utils.getBrowserInfo();
      const osInfo = utils.getOSInfo();
      const referrer = utils.getReferrer();
      const { source: referrerSource } = utils.getReferrerSource();
      const utmParams = utils.getUTMParams();
      
      const pageview = {
        type: 'pageView',
        id: state.currentPageViewId,
        sessionId: state.sessionId,
        visitorId: state.visitorId,
        websiteId: state.websiteId,
        url: window.location.href,
        path: window.location.pathname,
        title: document.title,
        referrer: referrer,
        referrerSource: referrerSource,
        browserInfo: browserInfo,
        osInfo: osInfo,
        deviceType: deviceType,
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        timestamp: new Date().toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
        utmParams: utmParams
      };
      
      state.buffer.push(pageview);
      state.hasActivity = false;
      state.scrollDepth = 0;
      
        if (config.trackVisibility) {
        setTimeout(() => {
          const pageContent = utils.analyzePageContent();
          
          const pageAnalysis = {
            type: 'pageAnalysis',
            id: utils.generateUUID(),
            pageViewId: state.currentPageViewId,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            data: pageContent
          };
          
          state.buffer.push(pageAnalysis);
        }, 500);
      }
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
        },
        pageUrl: window.location.href
      };
      
      state.buffer.push(interaction);
      state.hasActivity = true;
      state.lastActivity = new Date();
    },
    
    handleFormSubmit: function(e) {
      const form = e.target;
      
      if (!form || form.tagName !== 'FORM') {
        return;
      }
      
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
            .filter(el => el.name && !el.name.match(/password|token|key|secret/i))
            .map(el => ({ name: el.name, type: el.type }))
        },
        pageUrl: window.location.href
      };
      
      state.buffer.push(interaction);
      state.hasActivity = true;
      state.lastActivity = new Date();
      setTimeout(() => {
        api.flushBuffer();
      }, 10);
    },
    
    handleInput: function(e) {
      const input = e.target;
      if (!input) return;
      
      if (!['INPUT', 'TEXTAREA', 'SELECT'].includes(input.tagName)) return;
      
      if (input.type === 'password') return;
      
      const fieldIdentifier = input.name || input.id || input.getAttribute('data-testid') || input.placeholder;
      if (!fieldIdentifier) return;
      
      const fieldKey = `${fieldIdentifier}-${window.location.pathname}`;
      
      const now = Date.now();
      const currentValue = input.value;
      const trackedData = state.inputTracker.get(fieldKey) || {
        lastValue: '',
        lastTrackedAt: 0,
        changeCount: 0
      };
      
      trackedData.changeCount++;
      
      const timeSinceLastTrack = now - trackedData.lastTrackedAt;
      const valueHasChanged = currentValue !== trackedData.lastValue;
      const significantTimeHasPassed = timeSinceLastTrack > config.inputDebounceTime;
      const enoughChanges = trackedData.changeCount >= config.inputMinimumCharChange;
      const isChangeEvent = e.type === 'change';

      trackedData.lastValue = currentValue;
      
      if (isChangeEvent) {
        trackedData.changeCount = 0;
        trackedData.lastTrackedAt = now;
        state.inputTracker.set(fieldKey, trackedData);
        tracker.recordInputInteraction(input, fieldIdentifier);
      } else if (valueHasChanged && (significantTimeHasPassed || enoughChanges)) {
        trackedData.changeCount = 0;
        trackedData.lastTrackedAt = now;
        state.inputTracker.set(fieldKey, trackedData);
        tracker.recordInputInteraction(input, fieldIdentifier);
      } else {
        state.inputTracker.set(fieldKey, trackedData);
      }
    },
    
    recordInputInteraction: function(input, fieldIdentifier) {
      let labelText = '';
      
      if (input.id) {
        const label = document.querySelector(`label[for="${input.id}"]`);
        if (label) {
          labelText = label.textContent ? label.textContent.trim() : '';
        }
      }
      
      if (!labelText && input.parentElement) {
        const parentLabel = input.closest('label');
        if (parentLabel) {
          const clone = parentLabel.cloneNode(true);
          Array.from(clone.querySelectorAll('input, select, textarea, button')).forEach(el => el.remove());
          labelText = clone.textContent.trim();
        }
      }
      
      if (!labelText && input.parentElement) {
        const nearbyLabel = input.parentElement.querySelector('.label, .form-label, [class*="label"]');
        if (nearbyLabel) {
          labelText = nearbyLabel.textContent.trim();
        }
      }
      
      let selector = '';
      if (input.id) {
        selector = `#${input.id}`;
      } else if (input.name) {
        selector = `[name="${input.name}"]`;
      } else {
        selector = input.tagName.toLowerCase();
        if (input.className && typeof input.className === 'string') {
          selector += `.${input.className.trim().replace(/\s+/g, '.')}`;
        }
      }
      
      let formInfo = {};
      let formPurpose = 'unknown';
      if (input.form) {
        formPurpose = utils.getFormPurpose(input.form);
        formInfo = {
          formId: input.form.id || null,
          formAction: input.form.action || null,
          formName: input.form.name || null,
          formPurpose: formPurpose
        };
      }
      
      const fieldPurpose = utils.getInputFieldPurpose(input);
      
      const inputDescription = labelText || input.placeholder || fieldIdentifier;
      
      let surroundingText = '';
      if (input.parentElement) {
        const parentText = input.parentElement.textContent.trim();
        if (parentText.length > 0) {
          surroundingText = parentText.substring(0, 100);
        }
      }
      
      let formatInfo = {};
      if (input.pattern) {
        formatInfo.pattern = input.pattern;
      }
      if (input.minLength) {
        formatInfo.minLength = input.minLength;
      }
      if (input.maxLength && input.maxLength < 524288) {
        formatInfo.maxLength = input.maxLength;
      }
      if (input.min) {
        formatInfo.min = input.min;
      }
      if (input.max) {
        formatInfo.max = input.max;
      }
      if (input.step && input.step !== 'any') {
        formatInfo.step = input.step;
      }
      
      const inputValue = input.value;
      let safeValue = '';
      
      if (fieldPurpose === 'email' || fieldPurpose === 'phone' || fieldPurpose === 'payment') {
        safeValue = '(valeur présente)';
      } else if (inputValue.length > 0) {
        safeValue = inputValue.length > 20 ? inputValue.substring(0, 20) + '...' : inputValue;
      }
      
      const interaction = {
        type: 'interaction',
        id: utils.generateUUID(),
        pageViewId: state.currentPageViewId,
        interactionType: 'input_change',
        elementSelector: selector,
        elementText: inputDescription,
        timestamp: new Date().toISOString(),
        value: {
          fieldName: fieldIdentifier,
          fieldType: input.type || 'text',
          fieldPurpose: fieldPurpose,
          isValid: input.validity ? input.validity.valid : true,
          hasValue: input.value.length > 0,
          valueLength: input.value.length,
          valuePreview: safeValue,
          label: labelText,
          placeholder: input.placeholder || '',
          required: input.required || false,
          format: Object.keys(formatInfo).length > 0 ? formatInfo : null,
          formInfo: formInfo,
          contextDescription: surroundingText.length > 0 ? surroundingText : null
        },
        pageUrl: window.location.href
      };
      
      state.buffer.push(interaction);
      state.hasActivity = true;
      state.lastActivity = new Date();
    },
    
    handleScroll: function() {
      const newScrollDepth = utils.getMaxScrollDepth();
      const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
      const currentTimestamp = new Date().getTime();
      
      let scrollSpeed = 0;
      if (state.lastScrollTimestamp > 0) {
        const timeDiff = currentTimestamp - state.lastScrollTimestamp;
        if (timeDiff > 0) {
          const distanceMoved = Math.abs(currentScrollPosition - state.lastScrollPosition);
          scrollSpeed = distanceMoved / timeDiff * 1000;
        }
      }
      
      state.lastScrollPosition = currentScrollPosition;
      state.lastScrollTimestamp = currentTimestamp;
      
      if (newScrollDepth > state.scrollDepth) {
        state.scrollDepth = newScrollDepth;
        
        const interaction = {
          type: 'interaction',
          id: utils.generateUUID(),
          pageViewId: state.currentPageViewId,
          interactionType: 'scroll',
          elementSelector: 'window',
          elementText: 'Page scroll depth',
          timestamp: new Date().toISOString(),
          value: { 
            scrollDepth: state.scrollDepth,
            viewportHeight: window.innerHeight,
            documentHeight: Math.max(
              document.body.scrollHeight,
              document.body.offsetHeight,
              document.documentElement.clientHeight,
              document.documentElement.scrollHeight,
              document.documentElement.offsetHeight
            ),
            scrollPosition: currentScrollPosition,
            scrollSpeed: scrollSpeed
          },
          pageUrl: window.location.href
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
      if (config.trackVisibility) {
        tracker.recordVisibilitySnapshot();
      }
      
      state.isUnloading = true;
      
      const endTime = new Date();
      const duration = Math.round((endTime.getTime() - state.startTime.getTime()) / 1000);
      
      const pageViewExit = {
        type: 'pageViewExit',
        id: utils.generateUUID(),
        pageViewId: state.currentPageViewId,
        exitTime: endTime.toISOString(),
        duration: duration,
        scrollDepth: state.scrollDepth
      };
      
      state.buffer.push(pageViewExit);
      
      if (!state.hasActivity) {
        utils.sendBounceEvent();
      } else {
        const sessionEndEvent = {
          type: 'sessionEnd',
          id: utils.generateUUID(),
          sessionId: state.sessionId,
          endTime: endTime.toISOString(),
          exitPage: window.location.href,
          duration: duration,
          isBounce: false,
          isComplete: true
        };
        
        state.buffer.push(sessionEndEvent);
      }
      
      api.flushBuffer();
      
      if (navigator.sendBeacon && state.buffer.length > 0) {
        try {
          navigator.sendBeacon(config.apiEndpoint, JSON.stringify({
            websiteId: state.websiteId,
            sessionId: state.sessionId,
            visitorId: state.visitorId,
            events: [...state.buffer]
          }));
        } catch (e) {
          const img = new Image();
          img.src = `${config.apiEndpoint}?emergency=1&websiteId=${encodeURIComponent(state.websiteId)}&sessionId=${encodeURIComponent(state.sessionId)}&visitorId=${encodeURIComponent(state.visitorId)}&unload=1&t=${Date.now()}`;
        }
      }
    },
    
    handlePageHide: function(e) {
      if (!e.persisted) {
        tracker.handleUnload(e);
      }
    },
    
    handleVisibilityChange: function() {
      if (document.visibilityState === 'hidden') {
        state.tabHidden = true;
        
        if (!state.hasActivity) {
          utils.sendBounceEvent();
        }
        
        api.flushBuffer();
      } else if (document.visibilityState === 'visible') {
        state.tabHidden = false;
        state.hasActivity = true;
        state.lastActivity = new Date();
        state.lastActiveTime = new Date();
        
        if (state.bounceDetected) {
          const img = new Image();
          img.src = `${config.apiEndpoint}?emergency=1&websiteId=${encodeURIComponent(state.websiteId)}&sessionId=${encodeURIComponent(state.sessionId)}&visitorId=${encodeURIComponent(state.visitorId)}&cancelBounce=1&t=${Date.now()}`;
          document.body.appendChild(img);
          
          state.bounceDetected = false;
        }
      }
    },
    
    handleUserActivity: function() {
      if (!state.hasActivity) {
        const img = new Image();
        img.src = `${config.apiEndpoint}?emergency=1&websiteId=${encodeURIComponent(state.websiteId)}&sessionId=${encodeURIComponent(state.sessionId)}&visitorId=${encodeURIComponent(state.visitorId)}&cancelBounce=1&t=${Date.now()}`;
        document.body.appendChild(img);
        
        if (state.bounceTimeout !== null) {
          clearTimeout(state.bounceTimeout);
          state.bounceTimeout = null;
        }
      }
      
      state.hasActivity = true;
      state.lastActivity = new Date();
      state.lastActiveTime = new Date();
      state.bounceDetected = false;
    },
    
    handleHistoryChange: function() {
      const endTime = new Date();
      const duration = Math.round((endTime.getTime() - state.startTime.getTime()) / 1000);
      
      const pageViewExit = {
        type: 'pageViewExit',
        id: utils.generateUUID(),
        pageViewId: state.currentPageViewId,
        exitTime: endTime.toISOString(),
        duration: duration,
        scrollDepth: state.scrollDepth
      };
      
      state.buffer.push(pageViewExit);
      
      Promise.resolve(api.flushBuffer())
        .then(() => {
          setTimeout(() => tracker.trackPageView(), 100);
        })
        .catch(() => {
          setTimeout(() => tracker.trackPageView(), 100);
        });
    },
    
    setupVisibilityTracking: function() {
      state.visibilityObservers.forEach(observer => observer.disconnect());
      state.visibilityObservers = [];
      
      const segments = utils.initPageSegments();
      
      const segmentObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            const segmentId = entry.target.getAttribute('data-segment-id');
            if (!segmentId) return;
            
            const segment = state.pageSegments[parseInt(segmentId, 10)];
            if (!segment) return;
            
            segment.isCurrentlyVisible = entry.isIntersecting;
            
            if (entry.isIntersecting) {
              segment.lastVisibleTime = new Date();
              segment.totalViews++;
              
              state.visibilityMap.set(segment.id, true);
            } else if (segment.lastVisibleTime) {
              const visibleDuration = new Date().getTime() - segment.lastVisibleTime.getTime();
              if (visibleDuration > config.minVisibilityTime) {
                segment.visibleTime += visibleDuration;
                
                if (visibleDuration > 1000) {
                  tracker.trackSegmentVisibility(segment, visibleDuration);
                }
              }
              segment.lastVisibleTime = null;
            }
          });
        },
        {
          threshold: [0, config.visibilityThreshold, 1.0],
          rootMargin: '0px'
        }
      );
      
      segments.forEach(segment => {
        segmentObserver.observe(segment.marker);
      });
      
      state.visibilityObservers.push(segmentObserver);
      
      setTimeout(() => {
        tracker.recordVisibilitySnapshot();
      }, 2000);
      
      setInterval(() => {
        tracker.recordVisibilitySnapshot();
      }, 10000);
    },
    
    trackSegmentVisibility: function(segment, duration) {
      const visibilityEvent = {
        type: 'interaction',
        id: utils.generateUUID(),
        pageViewId: state.currentPageViewId,
        interactionType: 'segment_visibility',
        elementSelector: `segment-${segment.id}`,
        timestamp: new Date().toISOString(),
        value: {
          segmentId: segment.id,
          startPercent: segment.startPercent,
          endPercent: segment.endPercent,
          visibleTime: duration,
          elements: segment.elementsInSegment
        },
        pageUrl: window.location.href
      };
      
      state.buffer.push(visibilityEvent);
    },
    
    recordVisibilitySnapshot: function() {
      const visibleSegments = state.pageSegments.filter(segment => segment.isCurrentlyVisible);
      
      const documentHeight = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      );
      
      const visibilitySnapshot = {
        type: 'interaction',
        id: utils.generateUUID(),
        pageViewId: state.currentPageViewId,
        interactionType: 'visibility_snapshot',
        elementSelector: 'document',
        timestamp: new Date().toISOString(),
        value: {
          documentHeight: documentHeight,
          viewportHeight: window.innerHeight,
          scrollPosition: window.pageYOffset || document.documentElement.scrollTop,
          visibleSegments: visibleSegments.map(segment => ({
            id: segment.id,
            startPercent: segment.startPercent,
            endPercent: segment.endPercent
          })),
          segmentVisibility: state.pageSegments.map(segment => ({
            id: segment.id,
            startPercent: segment.startPercent,
            endPercent: segment.endPercent,
            visibleTime: segment.visibleTime,
            totalViews: segment.totalViews,
            isCurrentlyVisible: segment.isCurrentlyVisible,
            hasBeenSeen: state.visibilityMap.has(segment.id)
          }))
        },
        pageUrl: window.location.href
      };
      
      state.buffer.push(visibilitySnapshot);
    },
    
    flushEvents: function(isBeforeUnload = false) {
      if (state.isExcluded) return;
      
      if (state.buffer.length === 0) return;
      
      const eventsToSend = [...state.buffer];
      state.buffer = [];
      
      if (isBeforeUnload) {
        if (navigator.sendBeacon) {
          const data = new Blob([JSON.stringify(eventsToSend)], { type: 'application/json' });
          navigator.sendBeacon(config.apiEndpoint, data);
        } else {
          utils.sendSyncXhr(config.apiEndpoint, eventsToSend);
        }
      } else {
        fetch(config.apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(eventsToSend),
          keepalive: true
        }).catch(error => {
          console.error('Erreur lors de l\'envoi des événements:', error);
          
          state.buffer = [...eventsToSend, ...state.buffer];
        });
      }
    }
  };

  // @ts-ignore - Ignorer l'erreur TS pour l'ajout de propriété à window
  window.StackUnityAnalytics = window.StackUnityAnalytics || {
    init: tracker.init,
    trackEvent: function(eventName, data) {
      if (state.isExcluded) return;
      
      tracker.trackEvent(eventName, data);
    },
    forceBounce: function() {
      return utils.sendBounceEvent(true);
    }
  };

  document.addEventListener('DOMContentLoaded', function() {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      setTimeout(tracker.init, 100);
    } else {
      document.addEventListener('DOMContentLoaded', function() {
        setTimeout(tracker.init, 100);
      });
    }
  });
})(); 