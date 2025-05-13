import { computed, ref } from 'vue';

// @ts-ignore
interface PageView {
  id: string;
  visitorId: string;
  siteId: number;
  url: string;
  title: string;
  startTime: string;
  endTime: string;
  duration: number;
  scrollDepth: number;
  referrer?: string;
}

// @ts-ignore
interface Interaction {
  id: string;
  pageViewId: string;
  visitorId: string;
  siteId: number;
  eventType: string;
  selector?: string;
  label?: string;
  timestamp: string;
  data: any;
  url: string;
}

// @ts-ignore
interface VisibilitySnapshot {
  documentHeight: number;
  scrollPosition: number;
  viewportHeight: number;
  visibleSegments: any[];
  segmentVisibility: SegmentVisibility[];
}

// @ts-ignore
interface SegmentVisibility {
  id: number;
  startPercent: number;
  endPercent: number;
  hasBeenSeen: boolean;
  isCurrentlyVisible: boolean;
  totalViews: number;
  visibleTime: number;
}

export interface EngagementMetrics {
  globalScore: number;
  timeMetrics: {
    averageSessionDuration: number;
    averageTimeOnPage: number;
    bounceRate: number;
    totalTimeSpent: number;
  };
  scrollMetrics: {
    averageScrollDepth: number;
    percentagesReaching25: number;
    percentagesReaching50: number;
    percentagesReaching75: number;
    percentagesReaching100: number;
  };
  interactionMetrics: {
    clickRate: number;
    clicksPerSession: number;
    interactionsPerMinute: number;
    mostClickedElements: { selector: string; count: number }[];
  };
  pageMetrics: {
    pagePopularity: { url: string; views: number; avgTime: number }[];
    entryPages: { url: string; count: number }[];
    exitPages: { url: string; count: number }[];
    navigationPaths: { path: string[]; count: number }[];
  };
}

export const useEngagementQuality = () => {
  const engagementData = ref<EngagementMetrics>({
    globalScore: 0,
    timeMetrics: {
      averageSessionDuration: 0,
      averageTimeOnPage: 0,
      bounceRate: 0,
      totalTimeSpent: 0
    },
    scrollMetrics: {
      averageScrollDepth: 0,
      percentagesReaching25: 0,
      percentagesReaching50: 0,
      percentagesReaching75: 0,
      percentagesReaching100: 0
    },
    interactionMetrics: {
      clickRate: 0,
      clicksPerSession: 0,
      interactionsPerMinute: 0,
      mostClickedElements: []
    },
    pageMetrics: {
      pagePopularity: [],
      entryPages: [],
      exitPages: [],
      navigationPaths: []
    }
  });

  const processPageViews = (pageViews: PageView[]) => {
    if (!pageViews || pageViews.length === 0) return;

    // Regrouper par visiteur pour calculer les sessions
    const sessionsByVisitor = groupByVisitor(pageViews);

    // Calculer les métriques de temps
    const timeMetrics = calculateTimeMetrics(pageViews, sessionsByVisitor);

    // Calculer les métriques de défilement
    const scrollMetrics = calculateScrollMetrics(pageViews);

    // Mettre à jour les données d'engagement
    engagementData.value.timeMetrics = timeMetrics;
    engagementData.value.scrollMetrics = scrollMetrics;

    // Calculer la popularité des pages
    engagementData.value.pageMetrics.pagePopularity = calculatePagePopularity(pageViews);

    // Calculer les pages d'entrée et de sortie
    const { entryPages, exitPages } = calculateEntryExitPages(sessionsByVisitor);
    engagementData.value.pageMetrics.entryPages = entryPages;
    engagementData.value.pageMetrics.exitPages = exitPages;

    // Calculer les chemins de navigation
    engagementData.value.pageMetrics.navigationPaths = calculateNavigationPaths(sessionsByVisitor);

    // Calculer le score global
    calculateGlobalScore();
  };

  const processInteractions = (interactions: Interaction[]) => {
    if (!interactions || interactions.length === 0) return;

    // Calculer les métriques d'interaction
    const interactionMetrics = calculateInteractionMetrics(interactions);

    // Mettre à jour les données d'engagement
    engagementData.value.interactionMetrics = interactionMetrics;

    // Recalculer le score global après avoir mis à jour les interactions
    calculateGlobalScore();
  };

  const groupByVisitor = (pageViews: PageView[]) => {
    const sessionsByVisitor: Record<string, PageView[]> = {};

    pageViews.forEach(pageView => {
      if (!sessionsByVisitor[pageView.visitorId]) {
        sessionsByVisitor[pageView.visitorId] = [];
      }
      sessionsByVisitor[pageView.visitorId].push(pageView);
    });

    // Trier les pages vues par horodatage pour chaque visiteur
    Object.keys(sessionsByVisitor).forEach(visitorId => {
      sessionsByVisitor[visitorId].sort((a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      );
    });

    return sessionsByVisitor;
  };

  const calculateTimeMetrics = (pageViews: PageView[], sessionsByVisitor: Record<string, PageView[]>) => {
    let totalDuration = 0;
    let totalPages = pageViews.length;
    let bounces = 0;

    // Calculer la durée totale et identifier les rebonds (sessions à page unique)
    Object.values(sessionsByVisitor).forEach(session => {
      let sessionDuration = 0;

      session.forEach(pageView => {
        sessionDuration += pageView.duration || 0;
      });

      totalDuration += sessionDuration;

      // Une session est considérée comme un rebond si elle ne comporte qu'une seule page
      if (session.length === 1 && session[0].duration < 30) {
        bounces++;
      }
    });

    const numSessions = Object.keys(sessionsByVisitor).length;
    const averageSessionDuration = numSessions > 0 ? totalDuration / numSessions : 0;
    const averageTimeOnPage = totalPages > 0 ? totalDuration / totalPages : 0;
    const bounceRate = numSessions > 0 ? (bounces / numSessions) * 100 : 0;

    return {
      averageSessionDuration,
      averageTimeOnPage,
      bounceRate,
      totalTimeSpent: totalDuration
    };
  };

  const calculateScrollMetrics = (pageViews: PageView[]) => {
    let totalScrollDepth = 0;
    let count25 = 0, count50 = 0, count75 = 0, count100 = 0;
    const totalPages = pageViews.length;

    pageViews.forEach(pageView => {
      if (pageView.scrollDepth) {
        totalScrollDepth += pageView.scrollDepth;

        if (pageView.scrollDepth >= 25) count25++;
        if (pageView.scrollDepth >= 50) count50++;
        if (pageView.scrollDepth >= 75) count75++;
        if (pageView.scrollDepth >= 100) count100++;
      }
    });

    return {
      averageScrollDepth: totalPages > 0 ? totalScrollDepth / totalPages : 0,
      percentagesReaching25: totalPages > 0 ? (count25 / totalPages) * 100 : 0,
      percentagesReaching50: totalPages > 0 ? (count50 / totalPages) * 100 : 0,
      percentagesReaching75: totalPages > 0 ? (count75 / totalPages) * 100 : 0,
      percentagesReaching100: totalPages > 0 ? (count100 / totalPages) * 100 : 0
    };
  };

  const calculateInteractionMetrics = (interactions: Interaction[]) => {
    const clicks = interactions.filter(i => i.eventType === 'click');
    const uniquePageViews = new Set(interactions.map(i => i.pageViewId)).size;
    const uniqueVisitors = new Set(interactions.map(i => i.visitorId)).size;

    // Compter les clics par élément
    const clicksByElement: Record<string, number> = {};
    clicks.forEach(click => {
      if (click.selector) {
        clicksByElement[click.selector] = (clicksByElement[click.selector] || 0) + 1;
      }
    });

    // Obtenir les éléments les plus cliqués
    const mostClickedElements = Object.entries(clicksByElement)
      .map(([selector, count]) => ({ selector, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Calculer le taux de clics
    const clickRate = uniquePageViews > 0 ? clicks.length / uniquePageViews : 0;

    // Calculer les clics par session
    const clicksPerSession = uniqueVisitors > 0 ? clicks.length / uniqueVisitors : 0;

    // Calculer les interactions par minute (en utilisant la durée totale des interactions)
    const totalDurationInMinutes = engagementData.value.timeMetrics.totalTimeSpent / 60;
    const interactionsPerMinute = totalDurationInMinutes > 0 ? interactions.length / totalDurationInMinutes : 0;

    return {
      clickRate,
      clicksPerSession,
      interactionsPerMinute,
      mostClickedElements
    };
  };

  const calculatePagePopularity = (pageViews: PageView[]) => {
    const pageStats: Record<string, { views: number, totalTime: number }> = {};

    pageViews.forEach(pageView => {
      if (!pageStats[pageView.url]) {
        pageStats[pageView.url] = { views: 0, totalTime: 0 };
      }

      pageStats[pageView.url].views += 1;
      pageStats[pageView.url].totalTime += pageView.duration || 0;
    });

    return Object.entries(pageStats).map(([url, stats]) => ({
      url,
      views: stats.views,
      avgTime: stats.views > 0 ? stats.totalTime / stats.views : 0
    })).sort((a, b) => b.views - a.views);
  };

  const calculateEntryExitPages = (sessionsByVisitor: Record<string, PageView[]>) => {
    const entryPageCount: Record<string, number> = {};
    const exitPageCount: Record<string, number> = {};

    Object.values(sessionsByVisitor).forEach(session => {
      if (session.length > 0) {
        const entryPage = session[0].url;
        const exitPage = session[session.length - 1].url;

        entryPageCount[entryPage] = (entryPageCount[entryPage] || 0) + 1;
        exitPageCount[exitPage] = (exitPageCount[exitPage] || 0) + 1;
      }
    });

    const entryPages = Object.entries(entryPageCount)
      .map(([url, count]) => ({ url, count }))
      .sort((a, b) => b.count - a.count);

    const exitPages = Object.entries(exitPageCount)
      .map(([url, count]) => ({ url, count }))
      .sort((a, b) => b.count - a.count);

    return { entryPages, exitPages };
  };

  const calculateNavigationPaths = (sessionsByVisitor: Record<string, PageView[]>) => {
    const pathsCount: Record<string, number> = {};

    Object.values(sessionsByVisitor).forEach(session => {
      if (session.length >= 2) {
        // Créer un chemin de navigation pour chaque session
        const path = session.map(pageView => pageView.url);
        const pathString = JSON.stringify(path);

        pathsCount[pathString] = (pathsCount[pathString] || 0) + 1;
      }
    });

    return Object.entries(pathsCount)
      .map(([pathString, count]) => ({
        path: JSON.parse(pathString),
        count
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Limiter aux 10 chemins les plus courants
  };

  const calculateGlobalScore = () => {
    // Facteurs de pondération pour chaque catégorie de métriques
    const weights = {
      time: 0.3,
      scroll: 0.3,
      interaction: 0.4
    };

    // Calculer un score pour les métriques de temps (0-100)
    const timeScore = Math.min(100, (
      (Math.min(300, engagementData.value.timeMetrics.averageTimeOnPage) / 300) * 40 +
      (Math.min(60, 100 - engagementData.value.timeMetrics.bounceRate) / 60) * 60
    ));

    // Calculer un score pour les métriques de défilement (0-100)
    const scrollScore = Math.min(100, (
      (engagementData.value.scrollMetrics.averageScrollDepth / 100) * 40 +
      (engagementData.value.scrollMetrics.percentagesReaching75 / 100) * 60
    ));

    // Calculer un score pour les métriques d'interaction (0-100)
    const interactionScore = Math.min(100, (
      (Math.min(3, engagementData.value.interactionMetrics.clicksPerSession) / 3) * 50 +
      (Math.min(2, engagementData.value.interactionMetrics.interactionsPerMinute) / 2) * 50
    ));

    // Calculer le score global pondéré
    engagementData.value.globalScore = Math.round(
      timeScore * weights.time +
      scrollScore * weights.scroll +
      interactionScore * weights.interaction
    );
  };

  const processVisibilitySnapshots = (snapshots: Record<string, VisibilitySnapshot>) => {
    // Traiter les instantanés de visibilité pour enrichir les données de défilement
    if (!snapshots || Object.keys(snapshots).length === 0) return;

    // Logique d'analyse des instantanés de visibilité ici
    // Cela pourrait inclure l'analyse de la visibilité des sections de page spécifiques
  };

  const analyzeFromRawData = (rawPageViews: any[], rawInteractions: any[]) => {
    // Convertir les données brutes en format attendu
    const pageViews = rawPageViews.map(raw => ({
      id: raw[0] || '',
      visitorId: raw[1] || '',
      siteId: parseInt(raw[2]) || 0,
      url: raw[3] || '',
      title: raw[4] || '',
      startTime: raw[5] || '',
      endTime: raw[6] || '',
      duration: parseInt(raw[7]) || 0,
      scrollDepth: parseInt(raw[8]) || 0,
      referrer: raw[9] || ''
    }));

    // Traiter les vues de page
    processPageViews(pageViews);

    // Si des interactions sont disponibles, les traiter également
    if (rawInteractions && rawInteractions.length > 0) {
      const interactions = rawInteractions.map(raw => {
        try {
          const data = typeof raw[8] === 'string' ? JSON.parse(raw[8]) : raw[8];

          return {
            id: raw[0] || '',
            pageViewId: raw[1] || '',
            visitorId: raw[2] || '',
            siteId: parseInt(raw[3]) || 0,
            eventType: raw[4] || '',
            selector: raw[5] || '',
            label: raw[6] || '',
            timestamp: raw[7] || '',
            data,
            url: raw[9] || ''
          };
        } catch (error) {
          console.error('Error parsing interaction data:', error);
          return null;
        }
      }).filter(Boolean) as Interaction[];

      processInteractions(interactions);
    }
  };

  // Analyser les données d'une chaîne de texte brut (comme dans l'exemple)
  const analyzeFromTextData = (pageViewsText: string, interactionsText: string) => {
    const pageViewsLines = pageViewsText.trim().split('\n');
    const interactionsLines = interactionsText.trim().split('\n');

    const pageViews = pageViewsLines.map(line => {
      const values = line.split('\t');
      return values;
    });

    const interactions = interactionsLines.map(line => {
      const values = line.split('\t');
      return values;
    });

    analyzeFromRawData(pageViews, interactions);
  };

  return {
    engagementData,
    processPageViews,
    processInteractions,
    processVisibilitySnapshots,
    analyzeFromRawData,
    analyzeFromTextData
  };
};

// Composant pour visualiser les métriques d'engagement
export const useEngagementVisualizations = (engagementData: EngagementMetrics) => {
  // Préparer les données pour les graphiques de temps
  const timeChartData = computed(() => {
    return {
      labels: ['Temps moyen sur page (sec)', 'Durée moyenne de session (sec)'],
      datasets: [{
        data: [
          engagementData.timeMetrics.averageTimeOnPage,
          engagementData.timeMetrics.averageSessionDuration
        ],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)']
      }]
    };
  });

  // Préparer les données pour le graphique de défilement
  const scrollChartData = computed(() => {
    return {
      labels: ['25%', '50%', '75%', '100%'],
      datasets: [{
        label: 'Pourcentage de visiteurs atteignant',
        data: [
          engagementData.scrollMetrics.percentagesReaching25,
          engagementData.scrollMetrics.percentagesReaching50,
          engagementData.scrollMetrics.percentagesReaching75,
          engagementData.scrollMetrics.percentagesReaching100
        ],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    };
  });

  // Préparer les données pour le graphique de popularité des pages
  const pagePopularityChartData = computed(() => {
    const topPages = engagementData.pageMetrics.pagePopularity.slice(0, 5);

    return {
      labels: topPages.map(page => {
        // Extraire le chemin de l'URL pour un affichage plus propre
        const url = new URL(page.url);
        return url.pathname || page.url;
      }),
      datasets: [{
        label: 'Vues de page',
        data: topPages.map(page => page.views),
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1
      }]
    };
  });

  // Préparer les données pour le graphique des éléments les plus cliqués
  const clickElementsChartData = computed(() => {
    return {
      labels: engagementData.interactionMetrics.mostClickedElements.map(element =>
        element.selector.length > 30 ? element.selector.substring(0, 30) + '...' : element.selector
      ),
      datasets: [{
        label: 'Nombre de clics',
        data: engagementData.interactionMetrics.mostClickedElements.map(element => element.count),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }]
    };
  });

  return {
    timeChartData,
    scrollChartData,
    pagePopularityChartData,
    clickElementsChartData
  };
}; 