export interface DeviceMockup {
  id: string;
  name: string;
  width: number;
  height: number;
  frame: {
    type: 'phone' | 'tablet' | 'laptop' | 'desktop' | 'browser';
    color: string;
    borderRadius: string;
    bezelWidth: string;
    bezelColor: string;
    shadow: string;
    notch?: {
      width: string;
      height: string;
      borderRadius: string;
    };
    buttons?: Array<{
      position: 'left' | 'right' | 'top' | 'bottom';
      offset: string;
      width: string;
      height: string;
      color: string;
    }>;
    camera?: {
      diameter: string;
      position: string;
      color: string;
    };
  };
  browser?: {
    showChrome: boolean;
    chromeTabs: boolean;
    addressBar: boolean;
    controls: boolean;
    theme: 'light' | 'dark';
    brandColor: string;
    brand: 'chrome' | 'safari' | 'firefox' | 'edge';
  };
}

export const deviceMockups: Record<string, DeviceMockup> = {
  iphone: {
    id: 'iphone',
    name: 'iPhone 13',
    width: 375,
    height: 812,
    frame: {
      type: 'phone',
      color: '#f5f5f7',
      borderRadius: '40px',
      bezelWidth: '12px',
      bezelColor: '#000000',
      shadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
      notch: {
        width: '40%',
        height: '25px',
        borderRadius: '0 0 12px 12px'
      },
      buttons: [
        {
          position: 'left',
          offset: '100px',
          width: '3px',
          height: '30px',
          color: '#e0e0e0'
        },
        {
          position: 'right',
          offset: '80px',
          width: '3px',
          height: '40px',
          color: '#e0e0e0'
        }
      ]
    },
    browser: {
      showChrome: true,
      chromeTabs: false,
      addressBar: true,
      controls: false,
      theme: 'light',
      brandColor: '#007aff',
      brand: 'safari'
    }
  },
  android: {
    id: 'android',
    name: 'Pixel 6',
    width: 393,
    height: 851,
    frame: {
      type: 'phone',
      color: '#1f1f1f',
      borderRadius: '30px',
      bezelWidth: '6px',
      bezelColor: '#000000',
      shadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
      camera: {
        diameter: '12px',
        position: 'center top',
        color: '#252525'
      },
      buttons: [
        {
          position: 'right',
          offset: '120px',
          width: '2px',
          height: '40px',
          color: '#505050'
        }
      ]
    },
    browser: {
      showChrome: true,
      chromeTabs: false,
      addressBar: true,
      controls: true,
      theme: 'light',
      brandColor: '#1a73e8',
      brand: 'chrome'
    }
  },
  ipad: {
    id: 'ipad',
    name: 'iPad Air',
    width: 820,
    height: 1180,
    frame: {
      type: 'tablet',
      color: '#e0e0e0',
      borderRadius: '20px',
      bezelWidth: '20px',
      bezelColor: '#1a1a1a',
      shadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
      buttons: [
        {
          position: 'top',
          offset: 'center',
          width: '40px',
          height: '2px',
          color: '#9e9e9e'
        }
      ],
      camera: {
        diameter: '8px',
        position: 'center top',
        color: '#323232'
      }
    },
    browser: {
      showChrome: true,
      chromeTabs: false,
      addressBar: true,
      controls: false,
      theme: 'light',
      brandColor: '#007aff',
      brand: 'safari'
    }
  },
  tablet: {
    id: 'tablet',
    name: 'Android Tablet',
    width: 768,
    height: 1024,
    frame: {
      type: 'tablet',
      color: '#2d2d2d',
      borderRadius: '15px',
      bezelWidth: '12px',
      bezelColor: '#1d1d1d',
      shadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
      camera: {
        diameter: '8px',
        position: 'center top',
        color: '#111111'
      },
      buttons: [
        {
          position: 'right',
          offset: '150px',
          width: '3px',
          height: '35px',
          color: '#444444'
        },
        {
          position: 'right',
          offset: '200px',
          width: '3px',
          height: '35px',
          color: '#444444'
        }
      ]
    },
    browser: {
      showChrome: true,
      chromeTabs: false,
      addressBar: true,
      controls: true,
      theme: 'dark',
      brandColor: '#1a73e8',
      brand: 'chrome'
    }
  },
  laptop: {
    id: 'laptop',
    name: 'MacBook',
    width: 1280,
    height: 800,
    frame: {
      type: 'laptop',
      color: '#a1a1a1',
      borderRadius: '8px 8px 0 0',
      bezelWidth: '12px 12px 45px 12px',
      bezelColor: '#000000',
      shadow: '0 40px 80px rgba(0, 0, 0, 0.2)'
    },
    browser: {
      showChrome: true,
      chromeTabs: true,
      addressBar: true,
      controls: true,
      theme: 'light',
      brandColor: '#34c759',
      brand: 'safari'
    }
  },
  desktop: {
    id: 'desktop',
    name: 'Desktop',
    width: 1920,
    height: 1080,
    frame: {
      type: 'desktop',
      color: '#2b2b2b',
      borderRadius: '8px',
      bezelWidth: '1px',
      bezelColor: '#444444',
      shadow: '0 20px 60px rgba(0, 0, 0, 0.15)'
    },
    browser: {
      showChrome: true,
      chromeTabs: true,
      addressBar: true,
      controls: true,
      theme: 'dark',
      brandColor: '#0078d7',
      brand: 'edge'
    }
  }
};

/**
 * Generates the HTML structure for a device mockup
 */
export function generateDeviceMockupHTML(deviceId: string): string {
  const device = deviceMockups[deviceId];
  if (!device) return '';

  const browserHTML = device.browser?.showChrome
    ? generateBrowserHTML(device)
    : '';

  let buttonHTML = '';
  if (device.frame.buttons) {
    device.frame.buttons.forEach((button, index) => {
      buttonHTML += `<div class="device-button device-button-${button.position}" style="
        ${button.position === 'left' || button.position === 'right' ? 'top' : 'left'}: ${button.offset};
        width: ${button.width};
        height: ${button.height};
        background-color: ${button.color};
      "></div>`;
    });
  }

  let cameraHTML = '';
  if (device.frame.camera) {
    cameraHTML = `<div class="device-camera" style="
      width: ${device.frame.camera.diameter};
      height: ${device.frame.camera.diameter};
      background-color: ${device.frame.camera.color};
      position: absolute;
      top: 12px;
      border-radius: 50%;
      left: calc(50% - ${parseInt(device.frame.camera.diameter) / 2}px);
    "></div>`;
  }

  let notchHTML = '';
  if (device.frame.notch) {
    notchHTML = `<div class="device-notch" style="
      width: ${device.frame.notch.width};
      height: ${device.frame.notch.height};
      background-color: ${device.frame.bezelColor};
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      border-radius: ${device.frame.notch.borderRadius};
    "></div>`;
  }

  // Ajout d'une base pour les ordinateurs portables
  let laptopBaseHTML = '';
  if (device.frame.type === 'laptop') {
    laptopBaseHTML = `<div class="device-laptop-base" style="
      position: absolute;
      bottom: -20px;
      left: -5%;
      right: -5%;
      height: 20px;
      background: linear-gradient(to bottom, #909090, #707070);
      border-radius: 0 0 10px 10px;
      z-index: -1;
    "></div>`;
  }

  return `
    <div class="device-mockup device-${device.id}" style="
      width: ${device.width}px;
      max-width: 100%;
      border-radius: ${device.frame.borderRadius};
      background-color: ${device.frame.color};
      box-shadow: ${device.frame.shadow};
      padding: ${device.frame.bezelWidth};
      position: relative;
      overflow: visible;
    ">
      ${notchHTML}
      ${cameraHTML}
      ${buttonHTML}
      ${laptopBaseHTML}
      <div class="device-screen" style="
        width: 100%;
        height: 100%;
        border-radius: ${parseInt(device.frame.borderRadius) / 2}px;
        overflow: hidden;
        position: relative;
      ">
        ${browserHTML}
        <div class="device-content"></div>
      </div>
    </div>
  `;
}

/**
 * Generates the HTML for browser chrome
 */
function generateBrowserHTML(device: DeviceMockup): string {
  const { browser } = device;
  if (!browser) return '';

  let tabsHTML = '';
  if (browser.chromeTabs) {
    tabsHTML = `
      <div class="browser-tabs" style="
        height: 36px;
        display: flex;
        align-items: center;
        padding-left: 8px;
        border-bottom: 1px solid ${browser.theme === 'dark' ? '#3a3a3a' : '#e0e0e0'};
      ">
        <div class="browser-tab active" style="
          height: 28px;
          border-radius: 8px 8px 0 0;
          background-color: ${browser.theme === 'dark' ? '#424242' : '#f5f5f5'};
          display: flex;
          align-items: center;
          padding: 0 10px;
          margin-right: 4px;
          font-size: 12px;
          color: ${browser.theme === 'dark' ? '#e0e0e0' : '#424242'};
        ">
          <span class="favicon" style="
            width: 16px;
            height: 16px;
            border-radius: 4px;
            background-color: ${browser.brandColor};
            margin-right: 6px;
          "></span>
          Current Page
        </div>
      </div>
    `;
  }

  let addressBarHTML = '';
  if (browser.addressBar) {
    addressBarHTML = `
      <div class="browser-address-bar" style="
        height: 40px;
        display: flex;
        align-items: center;
        padding: 0 10px;
        background-color: ${browser.theme === 'dark' ? '#2a2a2a' : '#f0f0f0'};
      ">
        <div class="browser-controls" style="display: flex; margin-right: 8px;">
          <div class="browser-action" style="
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background-color: #ff5f57;
            margin-right: 6px;
          "></div>
          <div class="browser-action" style="
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background-color: #ffbd2e;
            margin-right: 6px;
          "></div>
          <div class="browser-action" style="
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background-color: #28c940;
          "></div>
        </div>
        <div class="browser-url-field" style="
          flex: 1;
          height: 28px;
          border-radius: 14px;
          background-color: ${browser.theme === 'dark' ? '#1a1a1a' : '#ffffff'};
          display: flex;
          align-items: center;
          padding: 0 10px;
          font-size: 12px;
          color: ${browser.theme === 'dark' ? '#e0e0e0' : '#424242'};
        ">
          <span style="
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background-color: ${browser.theme === 'dark' ? '#5f5f5f' : '#e0e0e0'};
            margin-right: 6px;
          "></span>
          <span class="url">example.com</span>
        </div>
      </div>
    `;
  }

  return `
    <div class="browser-chrome" style="
      width: 100%;
      background-color: ${browser.theme === 'dark' ? '#323232' : '#ffffff'};
      border-radius: ${device.frame.type === 'browser' || device.frame.type === 'desktop' ? '8px 8px 0 0' : '0'};
      overflow: hidden;
    ">
      ${tabsHTML}
      ${addressBarHTML}
    </div>
  `;
}

/**
 * Generates the CSS for device mockups
 */
export function generateDeviceMockupCSS(): string {
  return `
    .device-mockup {
      transition: all 0.3s ease;
      transform-origin: top left;
    }
    
    .device-button {
      position: absolute;
      border-radius: 4px;
    }
    
    .device-button-left {
      left: 0;
      transform: translateX(-50%);
    }
    
    .device-button-right {
      right: 0;
      transform: translateX(50%);
    }
    
    .device-button-top {
      top: 0;
      transform: translateY(-50%);
    }
    
    .device-button-bottom {
      bottom: 0;
      transform: translateY(50%);
    }
    
    .browser-tab {
      position: relative;
      cursor: default;
      user-select: none;
    }
    
    .browser-tab.active::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      right: 0;
      height: 2px;
      background-color: var(--v-primary-base, #1976d2);
    }
    
    .browser-url-field {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    
    .device-content {
      width: 100%;
      height: 100%;
      background-color: #ffffff;
    }
    
    /* Styles spécifiques pour les appareils */
    .device-laptop {
      position: relative;
      border-top: 10px solid #a1a1a1;
      border-left: 10px solid #a1a1a1;
      border-right: 10px solid #a1a1a1;
      border-bottom: 40px solid #a1a1a1;
      border-radius: 10px 10px 0 0;
      background-color: #000;
    }
    
    .device-laptop::after {
      content: '';
      position: absolute;
      bottom: -50px;
      left: -15%;
      right: -15%;
      height: 10px;
      background: #909090;
      border-radius: 0 0 50% 50%;
    }
    
    .device-desktop {
      border: 15px solid #2b2b2b;
      border-bottom: 35px solid #2b2b2b;
      border-radius: 10px;
    }
    
    .device-desktop::after {
      content: '';
      position: absolute;
      bottom: -45px;
      left: 50%;
      transform: translateX(-50%);
      width: 120px;
      height: 10px;
      background: #1d1d1d;
      border-radius: 0 0 5px 5px;
    }
  `;
}

/**
 * Apply device mockup to an iframe
 */
export function applyDeviceMockup(
  iframeElement: HTMLIFrameElement,
  deviceId: string,
  orientation: 'portrait' | 'landscape' = 'portrait'
): void {
  if (!iframeElement || !iframeElement.parentElement) return;

  const device = deviceMockups[deviceId];
  if (!device) return;

  // Create wrapper if it doesn't exist
  let mockupWrapper = iframeElement.parentElement.querySelector('.device-mockup-wrapper');
  if (!mockupWrapper) {
    mockupWrapper = document.createElement('div');
    mockupWrapper.className = 'device-mockup-wrapper';
    iframeElement.parentElement.appendChild(mockupWrapper);

    // Move iframe into the wrapper content area
    const mockupHTML = generateDeviceMockupHTML(deviceId);
    mockupWrapper.innerHTML = mockupHTML;

    const contentArea = mockupWrapper.querySelector('.device-content');
    if (contentArea) {
      iframeElement.style.width = '100%';
      iframeElement.style.height = '100%';
      iframeElement.style.border = 'none';
      contentArea.appendChild(iframeElement);
    }
  }

  // Cast mockupWrapper to HTMLElement to access style properties
  const mockupWrapperElement = mockupWrapper as HTMLElement;

  // Handle orientation change
  if (orientation === 'landscape') {
    mockupWrapper.classList.add('landscape');
    mockupWrapperElement.style.transform = 'rotate(90deg)';
    mockupWrapperElement.style.transformOrigin = 'center center';
    // Adjust size based on rotated dimensions
    mockupWrapperElement.style.width = `${device.height}px`;
    mockupWrapperElement.style.height = `${device.width}px`;
  } else {
    mockupWrapper.classList.remove('landscape');
    mockupWrapperElement.style.transform = '';
    mockupWrapperElement.style.width = `${device.width}px`;
    mockupWrapperElement.style.height = `${device.height}px`;
  }
} 