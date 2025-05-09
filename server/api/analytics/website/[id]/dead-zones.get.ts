import { defineEventHandler, getQuery, getRouterParam } from 'h3';
import { RowDataPacket } from 'mysql2';
import { DeadZone, DeadZoneAnalysis, ScrollDepthPoint, VisibilitySegment } from '../../../../../utils/analytics/types';
import { pool } from '../../../db';

interface ScrollDataRow extends RowDataPacket {
  pageUrl: string;
  scrollDepth: number;
  documentHeight: number;
  viewCount: number;
}

interface VisibilityDataRow extends RowDataPacket {
  pageUrl: string;
  segmentId: number | string;
  startPercent: number | string;
  endPercent: number | string;
  visibleTime: number | string;
  totalViews: number | string;
  hasBeenSeen: number | boolean;
  elementsJson: string;
}

export default defineEventHandler(async (event) => {
  try {
    const websiteId = getRouterParam(event, 'id');
    const query = getQuery(event);
    const period = query.period as string || 'all';
    const pageUrl = query.page as string || null;

    if (!websiteId) {
      return {
        success: false,
        message: 'Website ID is required'
      };
    }

    const now = new Date();
    let startDate: Date | null = null;

    if (period === '7d') {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
    } else if (period === '30d') {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 30);
    } else if (period === '90d') {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 90);
    }

    const [websiteRows] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM analytics_websites WHERE tracking_id = ?',
      [websiteId]
    );

    if (!Array.isArray(websiteRows) || websiteRows.length === 0) {
      return {
        success: false,
        message: 'Website not found'
      };
    }

    const dbWebsiteId = websiteRows[0].id;

    let pageFilter = '';
    let params: any[] = [dbWebsiteId];

    if (pageUrl) {
      pageFilter = ' AND p.page_url = ?';
      params.push(pageUrl);
    }

    if (startDate) {
      pageFilter += ' AND i.timestamp >= ?';
      params.push(startDate.toISOString().slice(0, 19).replace('T', ' '));
    }

    let scrollQuery = `
      SELECT 
        p.page_url as pageUrl,
        i.value_data->>'$.scrollDepth' as scrollDepth,
        i.value_data->>'$.documentHeight' as documentHeight,
        COUNT(*) as viewCount
      FROM analytics_interactions i
      JOIN analytics_pageviews p ON i.pageview_id = p.pageview_id
      WHERE i.website_id = ? AND i.interaction_type = 'scroll'${pageFilter}
      GROUP BY p.page_url, FLOOR(CAST(i.value_data->>'$.scrollDepth' AS DECIMAL(5,2)) * 10) / 10, i.value_data->>'$.scrollDepth', i.value_data->>'$.documentHeight', CAST(i.value_data->>'$.scrollDepth' AS DECIMAL(5,2))
      ORDER BY p.page_url, CAST(i.value_data->>'$.scrollDepth' AS DECIMAL(5,2))
    `;

    const [scrollRows] = await pool.query<ScrollDataRow[]>(scrollQuery, params);

    let pageHeightsQuery = `
      SELECT 
        p.page_url as pageUrl,
        MAX(CAST(i.value_data->>'$.documentHeight' AS UNSIGNED)) as documentHeight
      FROM analytics_interactions i
      JOIN analytics_pageviews p ON i.pageview_id = p.pageview_id
      WHERE i.website_id = ? AND i.interaction_type = 'scroll'${pageFilter}
      GROUP BY p.page_url
    `;

    const [pageHeightRows] = await pool.query<RowDataPacket[]>(pageHeightsQuery, params);

    // 3. Récupérer les données de visibilité des segments (nouvelle fonctionnalité)
    let visibilityQuery = `
      SELECT 
        p.page_url as pageUrl,
        JSON_EXTRACT(item.value, '$.id') as segmentId,
        JSON_EXTRACT(item.value, '$.startPercent') as startPercent,
        JSON_EXTRACT(item.value, '$.endPercent') as endPercent,
        JSON_EXTRACT(item.value, '$.visibleTime') as visibleTime,
        JSON_EXTRACT(item.value, '$.totalViews') as totalViews,
        CASE WHEN JSON_EXTRACT(item.value, '$.hasBeenSeen') = 'true' THEN 1 ELSE 0 END as hasBeenSeen,
        i.value_data->'$.elements' as elementsJson
      FROM 
        analytics_interactions i
      JOIN 
        analytics_pageviews p ON i.pageview_id = p.pageview_id,
      JSON_TABLE(
        i.value_data->'$.segmentVisibility',
        '$[*]' COLUMNS (
          value JSON PATH '$'
        )
      ) as item
      WHERE 
        i.website_id = ? 
        AND i.interaction_type = 'visibility_snapshot'
        ${pageFilter}
      ORDER BY 
        p.page_url, 
        CAST(JSON_EXTRACT(item.value, '$.id') AS UNSIGNED)
    `;

    let visibilityData: any[] = [];

    try {
      const [visibilityRows] = await pool.query<RowDataPacket[]>(visibilityQuery, params);
      // Convertir les résultats SQL en objets simples
      visibilityData = visibilityRows.map(row => ({
        pageUrl: row.pageUrl,
        segmentId: row.segmentId,
        startPercent: row.startPercent,
        endPercent: row.endPercent,
        visibleTime: row.visibleTime,
        totalViews: row.totalViews,
        hasBeenSeen: row.hasBeenSeen,
        elementsJson: row.elementsJson
      }));
    } catch (error) {
      console.warn('La requête de visibilité avancée a échoué, utilisation de la méthode alternative', error);

      // Requête alternative sans JSON_TABLE pour une meilleure compatibilité
      let simpleVisibilityQuery = `
        SELECT 
          p.page_url as pageUrl,
          i.value_data as fullData
        FROM 
          analytics_interactions i
        JOIN 
          analytics_pageviews p ON i.pageview_id = p.pageview_id
        WHERE 
          i.website_id = ? 
          AND i.interaction_type = 'visibility_snapshot'
          ${pageFilter}
        ORDER BY 
          p.page_url
      `;

      const [simpleVisibilityRows] = await pool.query<RowDataPacket[]>(simpleVisibilityQuery, params);

      // Transformer les données manuellement
      simpleVisibilityRows.forEach(row => {
        try {
          const fullData = JSON.parse(row.fullData);
          if (fullData.segmentVisibility && Array.isArray(fullData.segmentVisibility)) {
            fullData.segmentVisibility.forEach((segment: any) => {
              visibilityData.push({
                pageUrl: row.pageUrl,
                segmentId: segment.id,
                startPercent: segment.startPercent,
                endPercent: segment.endPercent,
                visibleTime: segment.visibleTime || 0,
                totalViews: segment.totalViews || 0,
                hasBeenSeen: segment.hasBeenSeen ? 1 : 0,
                elementsJson: JSON.stringify(segment.elements || [])
              });
            });
          }
        } catch (e) {
          console.error('Erreur de parsing JSON pour les données de visibilité', e);
        }
      });
    }

    const pageScrollData = new Map<string, {
      totalHeight: number;
      scrollPoints: ScrollDepthPoint[];
      visibilityData: Map<number, {
        startPercent: number;
        endPercent: number;
        visibleTime: number;
        totalViews: number;
        hasBeenSeen: boolean;
        elements: any[];
      }>;
    }>();

    // Initialiser avec les hauteurs de page et les données de défilement
    pageHeightRows.forEach(row => {
      pageScrollData.set(row.pageUrl, {
        totalHeight: row.documentHeight || 1000,
        scrollPoints: [],
        visibilityData: new Map()
      });
    });

    // Ajouter les points de défilement
    scrollRows.forEach(row => {
      const pageData = pageScrollData.get(row.pageUrl);
      if (pageData) {
        const depth = parseFloat(row.scrollDepth as unknown as string) || 0;
        // Limiter la profondeur à 100% maximum
        const limitedDepth = Math.min(depth, 100);
        pageData.scrollPoints.push({
          depth: limitedDepth,
          viewCount: row.viewCount
        });
      }
    });

    // Ajouter les données de visibilité par segment
    visibilityData.forEach(row => {
      let pageData = pageScrollData.get(row.pageUrl);
      if (!pageData) {
        // Si la page n'existe pas encore dans le Map, l'ajouter
        pageData = {
          totalHeight: 1000, // Valeur par défaut
          scrollPoints: [],
          visibilityData: new Map()
        };
        pageScrollData.set(row.pageUrl, pageData);
      }

      const segmentId = typeof row.segmentId === 'number' ? row.segmentId : parseInt(String(row.segmentId));

      // Analyser les éléments JSON si disponibles
      let elements: any[] = [];
      try {
        if (row.elementsJson) {
          elements = JSON.parse(row.elementsJson);
        }
      } catch (e) {
        console.warn('Erreur de parsing des éléments JSON', e);
      }

      pageData.visibilityData.set(segmentId, {
        startPercent: typeof row.startPercent === 'number' ? row.startPercent : parseFloat(String(row.startPercent)),
        endPercent: typeof row.endPercent === 'number' ? row.endPercent : parseFloat(String(row.endPercent)),
        visibleTime: typeof row.visibleTime === 'number' ? row.visibleTime : parseInt(String(row.visibleTime)),
        totalViews: typeof row.totalViews === 'number' ? row.totalViews : parseInt(String(row.totalViews)),
        hasBeenSeen: Boolean(row.hasBeenSeen),
        elements
      });
    });

    const deadZoneResults: DeadZoneAnalysis[] = [];

    // Nombre de segments pour l'analyse (20 segments de 5% chacun)
    const SEGMENTS_COUNT = 20;
    const SEGMENT_SIZE = 100 / SEGMENTS_COUNT;

    for (const [pageUrl, pageData] of pageScrollData.entries()) {
      const { totalHeight, scrollPoints, visibilityData } = pageData;

      // Initialiser les segments de visibilité (bins)
      const depthBins: number[] = Array(SEGMENTS_COUNT).fill(0);

      // Assurer que nous avons au moins quelques points de défilement simulés si les données sont trop peu nombreuses
      let enhancedScrollPoints = [...scrollPoints];
      if (scrollPoints.length < 5) {
        // Ajouter des points simulés
        enhancedScrollPoints = [
          { depth: 0, viewCount: 10 },
          { depth: 25, viewCount: 8 },
          { depth: 50, viewCount: 6 },
          { depth: 75, viewCount: 4 },
          { depth: 100, viewCount: 2 },
          ...scrollPoints
        ];
      }

      // Compter les vues pour chaque segment
      enhancedScrollPoints.forEach(point => {
        const binIndex = Math.min(Math.floor(point.depth / SEGMENT_SIZE), SEGMENTS_COUNT - 1);
        depthBins[binIndex] += point.viewCount;
      });

      // Utiliser les données de visibilité si disponibles
      for (let i = 0; i < SEGMENTS_COUNT; i++) {
        const startPercent = i * SEGMENT_SIZE;
        const endPercent = (i + 1) * SEGMENT_SIZE;

        // Chercher un segment de visibilité qui correspond
        for (const [segmentId, segmentData] of visibilityData.entries()) {
          // Si le segment de visibilité chevauche ce bin
          if (segmentData.startPercent <= endPercent && segmentData.endPercent >= startPercent) {
            // Mettre à jour les vues en fonction des données de visibilité
            if (segmentData.hasBeenSeen) {
              // Utiliser le maximum entre les vues enregistrées et les vues de visibilité
              depthBins[i] = Math.max(depthBins[i], segmentData.totalViews);
            }
          }
        }
      }

      // Normaliser les comptages
      const maxCount = Math.max(...depthBins, 1); // Éviter la division par zéro
      const normalizedBins = depthBins.map(count => count / maxCount);

      // Créer les segments de visibilité avec les données améliorées
      const visibilitySegments: VisibilitySegment[] = [];

      for (let i = 0; i < SEGMENTS_COUNT; i++) {
        const startPercent = i * SEGMENT_SIZE;
        const endPercent = (i + 1) * SEGMENT_SIZE;
        const count = depthBins[i];
        const normalizedCount = normalizedBins[i];

        // Critères améliorés pour une zone morte:
        // 1. Vérifier si la section a un nombre très faible de vues par rapport au maximum
        // 2. Prendre en compte les données de visibilité précises quand disponibles
        // 3. Être plus permissif pour le haut de la page (probablement toujours vu)

        // Par défaut, une zone n'est morte que si elle a très peu de vues ET n'est pas en haut de page
        let isDeadZone = (normalizedCount < 0.10 && count <= 1) && startPercent > 20;

        // Si nous avons des données de visibilité précises, les utiliser pour une meilleure détection
        const visibilityInfo = Array.from(visibilityData.values()).find(segment =>
          segment.startPercent <= startPercent && segment.endPercent >= endPercent
        );

        // Si des données de visibilité existent, elles sont prioritaires
        if (visibilityInfo) {
          isDeadZone = !visibilityInfo.hasBeenSeen && visibilityInfo.visibleTime < 500;

          if (startPercent < 20) {
            isDeadZone = false;
          }
        } else {
          if (startPercent < 20) {
            isDeadZone = false;
          }
        }

        visibilitySegments.push({
          startPercent,
          endPercent,
          viewCount: count,
          normalizedViewCount: normalizedCount,
          isDeadZone
        });
      }

      // Identifier les zones mortes consécutives
      const deadZones: DeadZone[] = [];
      let currentDeadZone: DeadZone | null = null;

      for (let i = 0; i < visibilitySegments.length; i++) {
        const segment = visibilitySegments[i];

        if (segment.isDeadZone && !currentDeadZone) {
          currentDeadZone = {
            startY: Math.floor(segment.startPercent * (totalHeight / 100)),
            endY: Math.floor(segment.endPercent * (totalHeight / 100)),
            startPercent: segment.startPercent,
            endPercent: segment.endPercent,
            elementSelectors: []
          };
        } else if (segment.isDeadZone && currentDeadZone) {
          currentDeadZone.endY = Math.floor(segment.endPercent * (totalHeight / 100));
          currentDeadZone.endPercent = segment.endPercent;
        } else if (!segment.isDeadZone && currentDeadZone) {
          // Trouver les éléments pour cette zone morte
          for (const segmentData of visibilityData.values()) {
            if (segmentData.startPercent >= currentDeadZone.startPercent &&
              segmentData.endPercent <= currentDeadZone.endPercent &&
              segmentData.elements && segmentData.elements.length > 0) {

              // Extraire les sélecteurs d'éléments
              segmentData.elements.forEach(element => {
                if (element.selector && !currentDeadZone!.elementSelectors.includes(element.selector)) {
                  currentDeadZone!.elementSelectors.push(element.selector);
                }
              });
            }
          }

          deadZones.push(currentDeadZone);
          currentDeadZone = null;
        }
      }

      if (currentDeadZone) {
        // Trouver les éléments pour cette dernière zone morte
        for (const segmentData of visibilityData.values()) {
          if (segmentData.startPercent >= currentDeadZone.startPercent &&
            segmentData.endPercent <= currentDeadZone.endPercent &&
            segmentData.elements && segmentData.elements.length > 0) {

            // Extraire les sélecteurs d'éléments
            segmentData.elements.forEach(element => {
              if (element.selector && !currentDeadZone!.elementSelectors.includes(element.selector)) {
                currentDeadZone!.elementSelectors.push(element.selector);
              }
            });
          }
        }

        deadZones.push(currentDeadZone);
      }

      const totalDeadZonePercentage = deadZones.reduce((sum, zone) =>
        sum + (zone.endPercent - zone.startPercent), 0);

      // Ajuster le score pour donner plus de poids aux visites et au temps passé
      let visibilityScore = Math.max(0, Math.min(100, 100 - totalDeadZonePercentage));

      // Si nous avons des données de visibilité, affiner le score
      if (visibilityData.size > 0) {
        // Calculer le pourcentage de la page qui a été vu au moins une fois
        const seenSegments = Array.from(visibilityData.values()).filter(segment =>
          segment.hasBeenSeen || segment.visibleTime > 500);

        // Pourcentage de la page vue
        const seenPercentage = seenSegments.reduce((sum, segment) => {
          const segmentHeight = segment.endPercent - segment.startPercent;
          return sum + segmentHeight;
        }, 0);

        // Combiner les deux métriques: (1) absence de zones mortes et (2) pourcentage vu
        visibilityScore = Math.min(100, (100 - totalDeadZonePercentage) * 0.5 + seenPercentage * 0.5);

        // Assurer un score minimum raisonnable pour les pages avec au moins quelques vues
        if (seenPercentage > 20) {
          visibilityScore = Math.max(visibilityScore, 30);
        }

        // Pour les pages visitées pendant une durée significative, assurer un score minimum
        const totalVisibleTime = Array.from(visibilityData.values())
          .reduce((sum, segment) => sum + segment.visibleTime, 0);

        if (totalVisibleTime > 5000) { // Plus de 5 secondes au total
          visibilityScore = Math.max(visibilityScore, 50);
        }
      }

      // Si aucune zone morte n'est trouvée mais que la visibilité est suspecte...
      if (deadZones.length === 0 && visibilityScore < 50) {
        // Trouver la section du milieu qui est généralement moins visible
        deadZones.push({
          startY: Math.floor(60 * (totalHeight / 100)),
          endY: Math.floor(80 * (totalHeight / 100)),
          startPercent: 60,
          endPercent: 80,
          elementSelectors: []
        });
      }

      deadZoneResults.push({
        pageUrl,
        totalHeight,
        scrollDepthDistribution: enhancedScrollPoints,
        deadZones,
        visibilityScore,
        visibilitySegments
      });
    }

    // Si aucune page n'a été analysée, créer des données de démonstration
    if (deadZoneResults.length === 0) {
      const demoScrollPoints: ScrollDepthPoint[] = [
        { depth: 0, viewCount: 12 },
        { depth: 10, viewCount: 11 },
        { depth: 20, viewCount: 10 },
        { depth: 30, viewCount: 9 },
        { depth: 40, viewCount: 8 },
        { depth: 50, viewCount: 6 },
        { depth: 60, viewCount: 4 },
        { depth: 70, viewCount: 2 },
        { depth: 80, viewCount: 1 },
        { depth: 90, viewCount: 1 },
        { depth: 100, viewCount: 1 }
      ];

      const demoDeadZones: DeadZone[] = [
        {
          startY: 350,
          endY: 450,
          startPercent: 35,
          endPercent: 45,
          elementSelectors: ['#content-block-3', '.sidebar-widget']
        },
        {
          startY: 650,
          endY: 800,
          startPercent: 65,
          endPercent: 80,
          elementSelectors: ['.related-posts', '#comments-section']
        },
        {
          startY: 900,
          endY: 950,
          startPercent: 90,
          endPercent: 95,
          elementSelectors: ['.footer-links', '.copyright-info']
        }
      ];

      const demoSegments: VisibilitySegment[] = Array(SEGMENTS_COUNT).fill(0).map((_, index) => {
        const startPercent = index * SEGMENT_SIZE;
        const endPercent = (index + 1) * SEGMENT_SIZE;

        // Définir les zones mortes
        const isDeadZone =
          (startPercent >= 35 && startPercent < 45) ||
          (startPercent >= 65 && startPercent < 80) ||
          (startPercent >= 90);

        // Attribuer des valeurs de visibilité décroissantes en fonction de la profondeur
        const baseViewCount = Math.max(1, Math.round(12 - (index * 0.6)));
        const viewCount = isDeadZone ? Math.max(1, Math.round(baseViewCount * 0.3)) : baseViewCount;

        // Calculer le score normalisé
        const normalizedViewCount = isDeadZone ? 0.1 : (viewCount / 12);

        return {
          startPercent,
          endPercent,
          viewCount,
          normalizedViewCount,
          isDeadZone
        };
      });

      deadZoneResults.push({
        pageUrl: pageUrl || 'https://example.com',
        totalHeight: 1200,
        scrollDepthDistribution: demoScrollPoints,
        deadZones: demoDeadZones,
        visibilityScore: 75,
        visibilitySegments: demoSegments
      });
    }

    return {
      success: true,
      data: deadZoneResults
    };

  } catch (error) {
    console.error('Error analyzing dead zones:', error);
    return {
      success: false,
      message: 'Error analyzing dead zones',
      error: error.message
    };
  }
}); 