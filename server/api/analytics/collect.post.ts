import { defineEventHandler, getQuery, readBody } from 'h3';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { pool } from '../db';

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    if (query.emergency === '1' && query.websiteId && query.sessionId) {

      try {
        const [websiteRows] = await pool.query<RowDataPacket[]>(
          'SELECT id FROM analytics_websites WHERE tracking_id = ?',
          [query.websiteId]
        );

        if (Array.isArray(websiteRows) && websiteRows.length > 0) {
          const dbWebsiteId = websiteRows[0].id;

          if (query.cancelBounce === '1') {
            console.log('Annulation de rebond pour la session:', query.sessionId);

            const [sessionExists] = await pool.query<RowDataPacket[]>(
              'SELECT COUNT(*) as count FROM analytics_sessions WHERE session_id = ?',
              [query.sessionId]
            );

            if (sessionExists[0].count > 0) {
              await pool.query(
                `UPDATE analytics_sessions
                 SET is_bounce = 0
                 WHERE session_id = ? AND website_id = ?`,
                [query.sessionId, dbWebsiteId]
              );
              console.log('Rebond annulé pour la session:', query.sessionId);
            } else {
              console.log('Session non trouvée pour annulation de rebond:', query.sessionId);
            }
          }
          else if (query.bounce === '1') {
            const [sessionExists] = await pool.query<RowDataPacket[]>(
              'SELECT COUNT(*) as count FROM analytics_sessions WHERE session_id = ?',
              [query.sessionId]
            );

            const visitorId = query.visitorId || 'unknown';
            const pageUrl = query.url || '/';
            const pageTitle = query.title || 'Page sans titre';

            console.log(`Traitement de rebond pour session ${query.sessionId}, visitor ${visitorId}, url: ${pageUrl}`);

            if (sessionExists[0].count > 0) {
              await pool.query(
                `UPDATE analytics_sessions
                 SET is_bounce = 1, 
                     is_complete = 1,
                     end_time = NOW(),
                     duration = TIMESTAMPDIFF(SECOND, start_time, NOW()),
                     exit_page = ?
                 WHERE session_id = ?`,
                [pageUrl, query.sessionId]
              );
              console.log('Session existante marquée comme rebond et terminée via requête d\'urgence');
            } else {
              console.log('Création d\'une nouvelle session avec rebond:', {
                sessionId: query.sessionId,
                websiteId: dbWebsiteId,
                visitorId: visitorId,
                url: pageUrl
              });

              try {
                await pool.query(
                  `INSERT INTO analytics_sessions
                     (session_id, website_id, visitor_id, start_time, end_time, is_bounce, is_complete, duration, is_short_session, landing_page, exit_page)
                   VALUES (?, ?, ?, NOW(), NOW(), 1, 1, 0, 1, ?, ?)`,
                  [query.sessionId, dbWebsiteId, visitorId, pageUrl, pageUrl]
                );
                console.log('Nouvelle session avec rebond créée avec succès');

                const pageViewId = require('crypto').randomUUID();
                await pool.query(
                  `INSERT INTO analytics_pageviews 
                    (pageview_id, session_id, website_id, page_url, page_title, enter_time, exit_time, is_short_visit) 
                   VALUES (?, ?, ?, ?, ?, NOW(), NOW(), 1)`,
                  [
                    pageViewId,
                    query.sessionId,
                    dbWebsiteId,
                    pageUrl,
                    pageTitle
                  ]
                );
                console.log('Page vue créée pour la session de rebond');
              } catch (insertError) {
                console.error('Erreur lors de la création de la session avec rebond:', insertError);
              }
            }
          }
        } else {
          console.error('Site web non trouvé:', query.websiteId);
        }
      } catch (err) {
        console.error('Erreur lors du traitement de la requête d\'urgence:', err);
      }

      event.node.res.setHeader('Content-Type', 'image/gif');
    }

    const data = await readBody(event);
    const { websiteId, sessionId, visitorId, events } = data;

    if (!websiteId || !sessionId || !visitorId || !events || !Array.isArray(events)) {
      console.error('Format de données invalide:', { websiteId, sessionId, visitorId, eventsLength: events?.length });
      return {
        success: false,
        message: 'Format de données invalide'
      };
    }

    if (events.length === 0) {
      console.warn('Aucun événement à enregistrer');
      return {
        success: false,
        message: 'Aucun événement à enregistrer'
      };
    }

    const pageViewEvents = events.filter(event => event.type === 'pageView');
    console.log('Événements pageView trouvés:', pageViewEvents.length);

    const [websiteRows] = await pool.query<RowDataPacket[]>(
      'SELECT id, tracking_id FROM analytics_websites WHERE tracking_id = ?',
      [websiteId]
    );
    console.log('Résultat de la recherche du site web:', websiteRows);

    let dbWebsiteId;
    if (!Array.isArray(websiteRows) || websiteRows.length === 0) {
      let domain = 'localhost';
      try {
        const firstEvent = events.find(e => e.pageUrl);
        if (firstEvent && firstEvent.pageUrl) {
          domain = new URL(firstEvent.pageUrl).hostname || 'localhost';
        }
      } catch (error) {
        console.error('Erreur lors de l\'extraction du domaine:', error);
      }

      const isSessionId = websiteId.startsWith('session-');

      if (isSessionId) {
        const [domainSites] = await pool.query<RowDataPacket[]>(
          'SELECT id, tracking_id FROM analytics_websites WHERE url = ?',
          [domain]
        );

        if (Array.isArray(domainSites) && domainSites.length > 0) {
          dbWebsiteId = domainSites[0].id;
        } else {
          try {
            const [result] = await pool.query<ResultSetHeader>(
              `INSERT INTO analytics_websites 
                (tracking_id, name, url, created_at) 
               VALUES (?, ?, ?, NOW())`,
              [websiteId, `User Session - ${domain}`, domain]
            );
            dbWebsiteId = result.insertId;
          } catch (error) {
            console.error('Erreur lors de la création du site de session:', error);
            return {
              success: false,
              message: 'Erreur lors de la création du site de session',
              error: error.message
            };
          }
        }
      } else {
        const [domainSites] = await pool.query<RowDataPacket[]>(
          'SELECT id, tracking_id FROM analytics_websites WHERE url = ?',
          [domain]
        );

        if (Array.isArray(domainSites) && domainSites.length > 0) {
          dbWebsiteId = domainSites[0].id;
          await pool.query(
            'UPDATE analytics_websites SET tracking_id = ? WHERE id = ?',
            [websiteId, dbWebsiteId]
          );
        } else {
          try {
            const [result] = await pool.query<ResultSetHeader>(
              `INSERT INTO analytics_websites 
                (tracking_id, name, url, created_at) 
               VALUES (?, ?, ?, NOW())`,
              [websiteId, `Site auto-généré ${websiteId}`, domain]
            );
            dbWebsiteId = result.insertId;
          } catch (error) {
            console.error('Erreur lors de la création automatique du site:', error);
            return {
              success: false,
              message: 'Erreur lors de la création du site',
              error: error.message
            };
          }
        }
      }
    } else {
      dbWebsiteId = (websiteRows as RowDataPacket[])[0]?.id;
      if (!dbWebsiteId) {
        return {
          success: false,
          message: 'ID de site web invalide dans la base de données'
        };
      }
    }

    const sessionData = events.find(event => event.type === 'session');
    if (!sessionData) {
      try {
        await pool.query(
          `INSERT INTO analytics_sessions 
            (session_id, website_id, visitor_id, start_time, device_type, browser, os, referrer, referrer_source, referrer_name, landing_page) 
           VALUES (?, ?, ?, NOW(), ?, ?, ?, NULL, NULL, NULL, ?)
           ON DUPLICATE KEY UPDATE 
            last_activity = NOW(),
            device_type = COALESCE(device_type, ?),
            browser = COALESCE(browser, ?),
            os = COALESCE(os, ?)`,
          [
            sessionId,
            dbWebsiteId,
            visitorId,
            'desktop', // Valeur par défaut pour device_type
            'Chrome 100.0', // Valeur par défaut pour browser
            'Windows 10', // Valeur par défaut pour os
            pageViewEvents[0]?.pageUrl || '/',
            'desktop', // Valeur par défaut pour update en cas de null
            'Chrome 100.0', // Valeur par défaut pour update en cas de null
            'Windows 10' // Valeur par défaut pour update en cas de null
          ]
        );
      } catch (error) {
        console.error('Erreur lors de la création de la session:', error);
      }
    } else {
      try {
        // Récupérer et valider les données
        const deviceType = sessionData.deviceType || 'desktop';
        const browser = sessionData.browser || 'Chrome 100.0';
        const os = sessionData.os || 'Windows 10';
        const referrer = sessionData.referrer || null;
        const referrerSource = sessionData.referrerSource || 'direct';
        const referrerName = sessionData.referrerName || 'Direct';
        const landingPage = sessionData.landingPage || '/';
        const startTime = sessionData.startTime ? new Date(sessionData.startTime) : new Date();

        await pool.query(
          `INSERT INTO analytics_sessions 
            (session_id, website_id, visitor_id, start_time, device_type, browser, os, referrer, referrer_source, referrer_name, landing_page) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE 
            last_activity = NOW(),
            device_type = COALESCE(device_type, ?),
            browser = COALESCE(browser, ?),
            os = COALESCE(os, ?)`,
          [
            sessionId,
            dbWebsiteId,
            visitorId,
            startTime,
            deviceType,
            browser,
            os,
            referrer,
            referrerSource,
            referrerName,
            landingPage,
            deviceType, // Valeurs pour l'update en cas de null
            browser,
            os
          ]
        );
      } catch (error) {
        console.error('Erreur lors de l\'enregistrement de la session:', error);
      }
    }

    for (const event of pageViewEvents) {
      try {
        console.log('Traitement de la page vue:', event.pageUrl);

        // Assurer que les valeurs critiques sont toujours définies
        const deviceType = event.deviceType || 'desktop';
        const browser = event.browser || 'Chrome 100.0';
        const os = event.os || 'Windows 10';
        const pageUrl = event.pageUrl || 'https://stackunity.tech/fallback';
        const referrer = event.referrer || null;
        const referrerSource = event.referrerSource || 'direct';
        const referrerName = event.referrerName || 'Direct';

        // Valider l'URL avant insertion
        let validatedUrl = pageUrl;
        try {
          // Vérifier que l'URL est au moins un format valide
          if (!pageUrl.startsWith('http')) {
            validatedUrl = 'https://' + pageUrl;
          }
          // Valider avec URL constructor
          new URL(validatedUrl);
        } catch (e) {
          console.error('URL invalide, utilisation de l\'URL par défaut:', e);
          validatedUrl = 'https://stackunity.tech/fallback';
        }

        let processedReferrerSource = referrerSource;
        let processedReferrerName = referrerName;
        let processedReferrer = referrer;

        if (referrer && typeof referrer === 'string') {
          try {
            const referrerLower = referrer.toLowerCase();
            const linkedinDomains = ['linkedin.com', 'lnkd.in', 'licdn.com', 'linked.in'];
            const isLinkedIn = linkedinDomains.some(domain => referrerLower.includes(domain));

            if (isLinkedIn) {
              processedReferrerSource = 'linkedin';
              processedReferrerName = 'LinkedIn';
              console.log('Référent LinkedIn détecté et traité:', {
                original: referrer,
                processed: 'LinkedIn'
              });
            }

            // Journaliser pour le débogage
            console.log('Traitement référent:', {
              original: { referrer, referrerSource, referrerName },
              processed: { processedReferrer, processedReferrerSource, processedReferrerName }
            });
          } catch (e) {
            console.error('Erreur lors du traitement du référent:', e);
          }
        }

        try {
          if (processedReferrerSource === 'linkedin') {
            await pool.query(
              `UPDATE analytics_sessions 
               SET referrer_source = 'linkedin', referrer_name = 'LinkedIn'
               WHERE session_id = ?`,
              [sessionId]
            );
            console.log('Mise à jour spécifique référent LinkedIn pour la session:', sessionId);
          }

          await pool.query(
            `INSERT INTO analytics_pageviews 
              (pageview_id, session_id, website_id, page_url, page_title, enter_time, duration, utm_source, utm_medium, utm_campaign, referrer, referrer_source, referrer_name) 
              VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?, ?)
              ON DUPLICATE KEY UPDATE
              page_title = VALUES(page_title)`,
            [
              event.id,
              sessionId,
              dbWebsiteId,
              validatedUrl,
              event.title || '',
              new Date(event.enterTime || event.timestamp || new Date()),
              event.utm_source || null,
              event.utm_medium || null,
              event.utm_campaign || null,
              processedReferrer,
              processedReferrerSource,
              processedReferrerName
            ]
          );
          console.log('Page vue enregistrée:', event.id, validatedUrl, `Référent: ${processedReferrerSource} (${processedReferrerName})`);
        } catch (error) {
          console.error(`Erreur lors du traitement de la page vue ${event.pageUrl}:`, error);
        }
      } catch (error) {
        console.error(`Erreur lors du traitement de la page vue ${event.pageUrl}:`, error);
      }
    }

    for (const event of events) {
      if (event.type === 'pageView') {
        // Déjà traité
        continue;
      }

      try {
        switch (event.type) {
          case 'pageViewExit':
            try {
              if (!event.pageViewId) {
                console.error('pageViewExit: pageViewId manquant', event);
                break;
              }

              const exitTime = event.exitTime ? new Date(event.exitTime) : new Date();
              const duration = event.duration !== undefined ? event.duration : 0;
              const scrollDepth = event.scrollDepth !== undefined ? event.scrollDepth : 0;

              console.log('Traitement de pageViewExit:', {
                pageViewId: event.pageViewId,
                duration: duration,
                exitTime: exitTime
              });

              const [pageViewRows] = await pool.query<RowDataPacket[]>(
                'SELECT pageview_id FROM analytics_pageviews WHERE pageview_id = ?',
                [event.pageViewId]
              );

              if (Array.isArray(pageViewRows) && pageViewRows.length > 0) {
                const updateResult = await pool.query(
                  `UPDATE analytics_pageviews 
                   SET exit_time = ?, 
                       duration = GREATEST(COALESCE(duration, 0), ?), 
                       scroll_depth = GREATEST(COALESCE(scroll_depth, 0), ?), 
                       is_short_visit = ? 
                   WHERE pageview_id = ?`,
                  [
                    exitTime,
                    duration,
                    scrollDepth,
                    duration < 20 ? 1 : 0,
                    event.pageViewId
                  ]
                );
                console.log('Page vue mise à jour avec exit - Résultat:', JSON.stringify(updateResult));
              } else {
                console.warn('pageViewExit: Création d\'un nouvel enregistrement pageview pour l\'ID', event.pageViewId);

                // Extraire le titre de la page depuis l'URL
                let pageTitle = "Page sans titre";
                let pageUrl = event.pageUrl || '/';
                if (pageUrl) {
                  try {
                    const segments = pageUrl.split('/').filter(s => s);
                    pageTitle = segments.length > 0 ? segments[segments.length - 1] : "Page d'accueil";
                    pageTitle = pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1).replace(/-/g, ' ');
                  } catch (e) {
                    // Continuer avec le titre par défaut
                  }
                }

                // Créer un nouvel enregistrement pageview
                try {
                  const enterTime = new Date(exitTime.getTime() - (duration * 1000));

                  const insertResult = await pool.query(
                    `INSERT INTO analytics_pageviews
                      (pageview_id, session_id, website_id, page_url, page_title, enter_time, exit_time, duration, scroll_depth, is_short_visit)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                      event.pageViewId,
                      sessionId,
                      dbWebsiteId,
                      pageUrl,
                      pageTitle,
                      enterTime,
                      exitTime,
                      duration,
                      scrollDepth,
                      duration < 20 ? 1 : 0
                    ]
                  );
                  console.log('Nouvel enregistrement pageview créé - Résultat:', JSON.stringify(insertResult));
                } catch (insertError) {
                  console.error('Erreur lors de la création d\'un nouvel enregistrement pageview:', insertError);
                }
              }
            } catch (error) {
              console.error('Erreur lors du traitement de pageViewExit:', error);
            }
            break;

          case 'pageVisitDuration':
            try {
              if (!event.pageViewId) {
                console.error('pageVisitDuration: pageViewId manquant', event);
                break;
              }

              const duration = event.duration !== undefined ? event.duration : 0;
              const scrollDepth = event.scrollDepth !== undefined ? event.scrollDepth : 0;
              const timestamp = event.timestamp ? new Date(event.timestamp) : new Date();

              // Normaliser l'URL
              let pageUrl = event.pageUrl || null;
              if (pageUrl) {
                try {
                  const url = new URL(pageUrl);
                  pageUrl = url.pathname || '/';
                } catch (e) {
                  // Continuer avec l'URL originale
                }
              }

              console.log('Traitement de la durée de visite DÉTAILLÉ:', {
                pageViewId: event.pageViewId,
                duration: duration,
                pageUrl: pageUrl,
                timestamp: timestamp,
                eventData: JSON.stringify(event)
              });

              const [pageViewRows] = await pool.query<RowDataPacket[]>(
                'SELECT pageview_id FROM analytics_pageviews WHERE pageview_id = ?',
                [event.pageViewId]
              );

              console.log('Page view trouvée?', Array.isArray(pageViewRows) && pageViewRows.length > 0 ? 'OUI' : 'NON');

              if (Array.isArray(pageViewRows) && pageViewRows.length > 0) {
                const updateResult = await pool.query(
                  `UPDATE analytics_pageviews 
                    SET duration = GREATEST(COALESCE(duration, 0), ?), 
                        scroll_depth = GREATEST(COALESCE(scroll_depth, 0), ?), 
                        is_short_visit = ?,
                        exit_time = NOW()
                    WHERE pageview_id = ?`,
                  [
                    duration,
                    scrollDepth,
                    duration < 20 ? 1 : 0,
                    event.pageViewId
                  ]
                );
                console.log('Page vue mise à jour avec durée - Résultat:', JSON.stringify(updateResult));
              } else {
                console.warn('pageVisitDuration: Création d\'un nouvel enregistrement pageview pour l\'ID', event.pageViewId);

                // Extraire le titre de la page depuis l'URL
                let pageTitle = "Page sans titre";
                if (pageUrl) {
                  try {
                    const segments = pageUrl.split('/').filter(s => s);
                    pageTitle = segments.length > 0 ? segments[segments.length - 1] : "Page d'accueil";
                    pageTitle = pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1).replace(/-/g, ' ');
                  } catch (e) {
                    // Continuer avec le titre par défaut
                  }
                }

                // Créer un nouvel enregistrement pageview
                try {
                  const insertResult = await pool.query(
                    `INSERT INTO analytics_pageviews
                      (pageview_id, session_id, website_id, page_url, page_title, enter_time, exit_time, duration, scroll_depth, is_short_visit)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                      event.pageViewId,
                      sessionId,
                      dbWebsiteId,
                      pageUrl || '/',
                      pageTitle,
                      new Date(timestamp.getTime() - duration * 1000), // Estimer l'heure d'entrée
                      timestamp,
                      duration,
                      scrollDepth,
                      duration < 20 ? 1 : 0
                    ]
                  );
                  console.log('Nouvel enregistrement pageview créé - Résultat:', JSON.stringify(insertResult));
                } catch (insertError) {
                  console.error('Erreur lors de la création d\'un nouvel enregistrement pageview:', insertError);

                  // Comme fallback, enregistrer comme interaction
                  await pool.query(
                    `INSERT INTO analytics_interactions
                      (interaction_id, pageview_id, website_id, session_id, interaction_type, timestamp, value_data, page_url)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                      event.id || require('crypto').randomUUID(),
                      null,
                      dbWebsiteId,
                      sessionId,
                      'page_duration',
                      timestamp,
                      JSON.stringify({
                        duration: duration,
                        scrollDepth: scrollDepth
                      }),
                      pageUrl
                    ]
                  );
                }
              }
            } catch (error) {
              console.error('Erreur lors du traitement de pageVisitDuration:', error);
            }
            break;

          case 'interaction':
            let normalizedPageUrl = event.pageUrl || null;
            if (normalizedPageUrl) {
              normalizedPageUrl = normalizedPageUrl.split('#')[0];
            }

            try {
              if (event.pageViewId) {
                const [pageViewRows] = await pool.query<RowDataPacket[]>(
                  'SELECT pageview_id FROM analytics_pageviews WHERE pageview_id = ?',
                  [event.pageViewId]
                );

                if (Array.isArray(pageViewRows) && pageViewRows.length > 0) {
                  await pool.query(
                    `INSERT INTO analytics_interactions
                      (interaction_id, pageview_id, website_id, session_id, interaction_type, element_selector, timestamp, element_text, value_data, page_url)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                      event.id,
                      event.pageViewId,
                      dbWebsiteId,
                      sessionId,
                      event.interactionType,
                      event.elementSelector || '',
                      new Date(event.timestamp),
                      event.elementText || null,
                      JSON.stringify(event.value || {}),
                      normalizedPageUrl
                    ]
                  );
                } else {
                  console.warn(`Interaction ignorée: pageViewId ${event.pageViewId} non trouvé dans la base de données`);
                }
              } else {
                await pool.query(
                  `INSERT INTO analytics_interactions
                    (interaction_id, pageview_id, website_id, session_id, interaction_type, element_selector, timestamp, element_text, value_data, page_url)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                  [
                    event.id,
                    null,
                    dbWebsiteId,
                    sessionId,
                    event.interactionType,
                    event.elementSelector || '',
                    new Date(event.timestamp),
                    event.elementText || null,
                    JSON.stringify(event.value || {}),
                    normalizedPageUrl
                  ]
                );
              }
            } catch (error) {
              console.error('Erreur lors du traitement de l\'interaction:', error);
            }
            break;

          case 'error':
            await pool.query(
              `INSERT INTO analytics_errors
                (error_id, pageview_id, website_id, session_id, message, stack_trace, timestamp, browser_info)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                event.id,
                event.pageViewId,
                dbWebsiteId,
                sessionId,
                event.message || 'Unknown error',
                event.stackTrace || null,
                new Date(event.timestamp),
                event.browserInfo || '{}'
              ]
            );
            break;

          case 'customEvent':
            await pool.query(
              `INSERT INTO analytics_custom_events
                (event_id, pageview_id, website_id, session_id, event_name, event_category, timestamp, properties)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                event.id,
                event.pageViewId,
                dbWebsiteId,
                sessionId,
                event.name,
                event.category || 'general',
                new Date(event.timestamp),
                JSON.stringify(event.properties || {})
              ]
            );
            break;

          case 'sessionEnd':
            try {
              if (!sessionId) {
                console.error('sessionEnd: sessionId manquant', event);
                break;
              }

              const endTime = event.endTime ? new Date(event.endTime) : new Date();
              const duration = event.duration !== undefined ? event.duration : 0;
              const isBounce = event.isBounce === true;
              const isComplete = event.isComplete === true;
              const isShortSession = duration < 20;

              await pool.query(
                `UPDATE analytics_sessions
                 SET end_time = ?, duration = ?, is_bounce = ?, is_complete = ?, exit_page = ?, is_short_session = ?
                 WHERE session_id = ?`,
                [
                  endTime,
                  duration,
                  isBounce ? 1 : 0,
                  isComplete ? 1 : 0,
                  event.exitPage || null,
                  isShortSession ? 1 : 0,
                  sessionId
                ]
              );
              console.log('Session terminée:', sessionId, 'durée:', duration, 'rebond:', isBounce ? 'OUI' : 'NON');

              if (isShortSession) {
                await pool.query(
                  `UPDATE analytics_pageviews
                   SET is_short_visit = 1
                   WHERE session_id = ?`,
                  [sessionId]
                );
              }
            } catch (error) {
              console.error('Erreur lors du traitement de sessionEnd:', error);
            }
            break;
        }
      } catch (error) {
        console.error(`Erreur lors du traitement de l'événement ${event.type}:`, error);
      }
    }

    try {
      await pool.query(
        `INSERT INTO analytics_visitors (visitor_id, last_activity)
         VALUES (?, NOW())
         ON DUPLICATE KEY UPDATE last_activity = NOW()`,
        [visitorId]
      );
    } catch (error) {
      console.error('Erreur lors de la mise à jour du visiteur:', error);
    }

    return {
      success: true,
      message: 'Données sauvegardées avec succès',
      processed: {
        pageViews: pageViewEvents.length,
        totalEvents: events.length
      }
    };
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des données analytiques:', error);
    return {
      success: false,
      message: 'Erreur lors de la sauvegarde des données',
      error: error.message
    };
  }
}); 