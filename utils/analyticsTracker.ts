import { useCookieStore } from '~/stores/cookieStore';
import { useUserStore } from '~/stores/userStore';

class AnalyticsTracker {
  private sessionId: string;
  private startTime: Date;
  private pages: string[] = [];
  private deviceType: string;
  private country: string = 'unknown';
  private city: string = 'unknown';
  private referrer: string = '';
  private isNewVisitor: boolean = false;
  private hasConverted: boolean = false;
  private userStore = useUserStore();
  private cookieStore = useCookieStore();
  private sessionUpdateInterval: number | null = null;
  private lastPageTime: Date | null = null;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.startTime = new Date();
    this.lastPageTime = new Date();
    this.deviceType = this.detectDeviceType();
    this.isNewVisitor = !localStorage.getItem('devunity_visited');

    if (this.isNewVisitor) {
      localStorage.setItem('devunity_visited', 'true');
    }

    if (typeof document !== 'undefined') {
      this.referrer = document.referrer;
    }

    this.detectLocation();

    if (process.client) {
      this.sessionUpdateInterval = window.setInterval(() => {
        if (this.cookieStore.hasGivenConsent && this.cookieStore.preferences.analytics) {
          this.updateSession();
        } else {
          this.stopTracking();
        }
      }, 30000);

      window.addEventListener('beforeunload', () => {
        if (this.cookieStore.hasGivenConsent && this.cookieStore.preferences.analytics) {
          this.updateSession();
        }
      });

      window.addEventListener('analytics-preference-changed', ((event: CustomEvent) => {
        const isEnabled = event.detail?.enabled;
        console.log('Préférence analytics modifiée (tracker):', isEnabled);

        if (!isEnabled) {
          this.stopTracking();
        }
      }) as EventListener);
    }
  }

  private generateSessionId(): string {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
  }

  private detectDeviceType(): string {
    if (typeof navigator !== 'undefined') {
      const userAgent = navigator.userAgent;
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
        return 'mobile';
      } else if (/iPad|Tablet|PlayBook/i.test(userAgent)) {
        return 'tablet';
      }
    }
    return 'desktop';
  }

  private detectLocation(): void {
    const countries = ['France', 'Allemagne', 'États-Unis', 'Canada', 'Royaume-Uni'];
    const cities = ['Paris', 'Berlin', 'New York', 'Toronto', 'Londres'];

    const randomIndex = Math.floor(Math.random() * countries.length);
    this.country = countries[randomIndex];
    this.city = cities[randomIndex];
  }

  public trackPageView(url: string, title: string): void {
    if (!process.client) return;

    const now = new Date();
    let timeOnPage = 0;

    if (this.lastPageTime) {
      timeOnPage = Math.floor((now.getTime() - this.lastPageTime.getTime()) / 1000);
    }

    this.lastPageTime = now;

    const pageView = {
      type: 'pageview',
      url,
      title,
      userId: this.userStore.user?.id || 'anonymous',
      sessionId: this.sessionId,
      deviceType: this.deviceType,
      country: this.country,
      city: this.city,
      referrer: this.referrer,
      timeOnPage: timeOnPage,
      isNewVisitor: this.isNewVisitor,
      hasConverted: this.hasConverted
    };

    if (!this.pages.includes(url)) {
      this.pages.push(url);
    }

    this.sendToServer(pageView);

    this.updateSession();
  }

  public trackConversion(): void {
    this.hasConverted = true;
    this.updateSession();
  }

  public updateSession(): void {
    if (!process.client) return;

    if (!this.cookieStore.hasGivenConsent || !this.cookieStore.preferences.analytics) {
      console.log('Suivi analytique désactivé - session non mise à jour');
      return;
    }

    const now = new Date();
    const timeOnSite = Math.floor((now.getTime() - this.startTime.getTime()) / 1000);

    console.log(`Mise à jour de la session - temps sur site: ${timeOnSite}s`);

    const sessionData = {
      type: 'session',
      userId: this.userStore.user?.id || 'anonymous',
      sessionId: this.sessionId,
      startTime: this.startTime.toISOString(),
      endTime: now.toISOString(),
      pages: this.pages,
      deviceType: this.deviceType,
      country: this.country,
      city: this.city,
      referrer: this.referrer,
      isNewVisitor: this.isNewVisitor,
      hasConverted: this.hasConverted,
      timeOnSite: timeOnSite
    };

    this.sendToServer(sessionData);
  }

  private async sendToServer(data: any): Promise<void> {
    if (!this.cookieStore.hasGivenConsent || !this.cookieStore.preferences.analytics) {
      console.log('Suivi analytique désactivé - données non envoyées');
      return;
    }

    try {
      const token = this.userStore.getTokenFromCookie();

      const timestamp = new Date().getTime();

      const response = await fetch(`/api/analytics?_=${timestamp}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        console.error('Erreur lors de l\'envoi des données analytics:', response.statusText);
      } else {
        const result = await response.json();
        console.log(`Données analytics de type ${data.type} envoyées avec succès:`, result);
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi des données analytics:', error);
    }
  }

  private stopTracking(): void {
    console.log('Arrêt du suivi analytique (tracker)');

    if (this.sessionUpdateInterval) {
      window.clearInterval(this.sessionUpdateInterval);
      this.sessionUpdateInterval = null;
    }
  }
}

export const analyticsTracker = process.client ? new AnalyticsTracker() : null;

export const useAnalytics = () => {
  return {
    trackPageView: (url: string, title: string) => {
      if (analyticsTracker) {
        analyticsTracker.trackPageView(url, title);
      }
    },
    trackConversion: () => {
      if (analyticsTracker) {
        analyticsTracker.trackConversion();
      }
    },
    updateSession: () => {
      if (analyticsTracker) {
        analyticsTracker.updateSession();
      }
    }
  };
}; 