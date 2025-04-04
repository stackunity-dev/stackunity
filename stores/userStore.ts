import { $fetch } from 'ofetch';
import { defineStore } from 'pinia';
import type { PersistenceOptions } from 'pinia-plugin-persistedstate';
import { TokenUtils } from '../utils/token';

interface TableColumn {
  name: string;
  type: string;
  primaryKey: boolean;
  foreignKey: boolean;
  notNull: boolean;
  unique: boolean;
  autoIncrement: boolean;
  referencedTable?: string;
  referencedColumn?: string;
}

interface Table {
  name: string;
  columns: Array<TableColumn>;
}

interface DeleteResponse {
  success: boolean;
  error?: string;
  message?: string;
}

interface CpuData {
  usage: number;
  cores: number[];
  speed: number;
}

interface MemoryData {
  total: number;
  used: number;
  free: number;
  swapUsed: number;
  swapTotal: number;
}

interface DiskData {
  fs: string;
  size: number;
  used: number;
  use: number;
  mount: string;
}

interface SystemData {
  cpu: CpuData;
  memory: MemoryData;
  disks: Array<DiskData>;
}

interface SystemResponse {
  success: boolean;
  data?: SystemData;
  error?: string;
}

interface BaseSnippet {
  id: number;
  publishWorld: string;
  publishPersonal: string;
  title: string;
  description: string;
  username: string;
  framework: string;
  img: string | null;
  imgFile: string;
  content: string;
  snippet_date: string;
  date?: string;
  like?: number;
  favoris?: number;
  sourceType?: 'world' | 'personal';
  isFavorite?: boolean;
}

interface FavoriteSnippet {
  id: number;
  snippet_id: number;
  user_id: number;
}

interface SQLTable {
  name: string;
  columns: Array<TableColumn>;
}

interface SQLSchema {
  id?: number;
  database_name: string;
  tables: Array<SQLTable>;
}

interface StudioComponent {
  id: number;
  name: string;
  content: string;
  component_type: string;
  created_at: string;
  updated_at: string;
}

interface EmailHistoryItem {
  id: number;
  subject: string;
  date: string;
  status: string;
  opens: number;
}

interface User {
  id: number;
  username: string;
  email: string;
  isAdmin?: boolean;
  isPremium: boolean;
  company?: string;
  website?: string;
  bio?: string;
}

interface DeleteSnippetResponse {
  success: boolean;
  message?: string;
  error?: string;
}

interface CrawlReport {
  urlMap: Record<string, string[]>;
  visitedURLs: string[];
  seoResults: Record<string, any>;
  summary: {
    totalPages: number;
    averageLoadTime: number;
    totalWarnings: number;
    missingTitles: number;
    missingDescriptions: number;
    missingAltTags: number;
    averageFCP: number;
    averageLCP: number;
    averageTTFB: number;
    pagesWithStructuredData: number;
    pagesWithSocialTags: number;
    mobileCompatiblePages: number;
    securePages: number;
  };
  generatedSitemap: string;
  rankedUrls: string[];
}

interface SEOAuditResult {
  success: boolean;
  message?: string;
  result?: CrawlReport;
}

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
    systemData: {
      cpu: { usage: 0, cores: [] as number[], speed: 0 },
      memory: { total: 0, used: 0, free: 0, swapUsed: 0, swapTotal: 0 },
      disks: [] as DiskData[]
    } as SystemData,
    personalSnippets: [] as BaseSnippet[],
    worldSnippets: [] as BaseSnippet[],
    favoritesSnippets: [] as FavoriteSnippet[],
    sqlSchemas: [] as SQLSchema[],
    studioComponents: [] as StudioComponent[],
    emailHistory: [] as EmailHistoryItem[],
    isAuthenticated: false,
    loading: false,
    error: null,
    seoData: null as CrawlReport | SEOAuditResult | null,
    seoError: '',
    isSeoLoading: false,
    isPremium: false,
    isAdmin: false
  }),
  getters: {
    isUserAuthenticated: (state) => state.isAuthenticated && !!state.token,
    getAuthHeader: () => ({ Authorization: `Bearer ${TokenUtils.retrieveToken() || ''}` })
  },
  actions: {
    async initializeStore() {
      try {
        const storedData = localStorage.getItem('user_data');
        if (storedData) {
          const parsedData = JSON.parse(storedData);

          console.log('[STORE] Données brutes récupérées du localStorage:', {
            isPremium: parsedData.user?.isPremium,
            isAdmin: parsedData.user?.isAdmin,
            types: {
              isPremium: typeof parsedData.user?.isPremium,
              isAdmin: typeof parsedData.user?.isAdmin
            }
          });

          // Vérifier d'abord le token
          const token = TokenUtils.retrieveToken();
          if (!token) {
            console.log('[STORE] Pas de token trouvé, mais données utilisateur présentes');
            return;
          }

          // Valider le token avant de restaurer les données
          const validationResult = await this.validateToken();
          if (!validationResult.valid) {
            console.log('[STORE] Token invalide, nettoyage des données');
            localStorage.removeItem('user_data');
            return;
          }

          // Vérifier les différentes valeurs possibles avec assertions de type
          let isPremiumValue = false;
          if (parsedData.user?.isPremium !== undefined) {
            isPremiumValue = parsedData.user.isPremium === true ||
              (typeof parsedData.user.isPremium === 'number' && parsedData.user.isPremium === 1) ||
              (typeof parsedData.user.isPremium === 'string' && (parsedData.user.isPremium === '1' || parsedData.user.isPremium === 'true'));
          }

          let isAdminValue = false;
          if (parsedData.user?.isAdmin !== undefined) {
            isAdminValue = parsedData.user.isAdmin === true ||
              (typeof parsedData.user.isAdmin === 'number' && parsedData.user.isAdmin === 1) ||
              (typeof parsedData.user.isAdmin === 'string' && (parsedData.user.isAdmin === '1' || parsedData.user.isAdmin === 'true'));
          }

          console.log('[STORE] Conversion des valeurs du localStorage:', {
            original: {
              isPremium: parsedData.user?.isPremium,
              isAdmin: parsedData.user?.isAdmin
            },
            converted: {
              isPremium: isPremiumValue,
              isAdmin: isAdminValue
            }
          });

          this.user = {
            ...parsedData.user,
            isPremium: isPremiumValue,
            isAdmin: isAdminValue
          };
          this.isAuthenticated = true;
          this.isPremium = isPremiumValue;
          this.isAdmin = isAdminValue;
          this.token = token;

          console.log('[STORE] Données utilisateur restaurées avec conversion explicite:', {
            isPremium: this.isPremium,
            isAdmin: this.isAdmin,
            userPremium: this.user.isPremium,
            userAdmin: this.user.isAdmin
          });

          await this.loadData();
        }
      } catch (error) {
        console.error('[STORE] Erreur lors de l\'initialisation:', error);
      }
    },

    async logout() {
      try {
        console.log('Déconnexion en cours...');

        if (this.isAuthenticated) {
          try {
            await fetch('/api/auth/logout', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
              }
            });
          } catch (error) {
            console.error('Erreur lors de l\'appel à l\'API de déconnexion:', error);
          }
        }

        TokenUtils.removeToken();

        this.user = null;
        this.token = null;
        this.isAuthenticated = false;
        this.isPremium = false;
        this.isAdmin = false;

        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem('user_data');
        }

        console.log('Déconnexion réussie');
      } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
      }
    },

    formatDate(dateString: string): string {
      const date = new Date(dateString);
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' } as const;
      return date.toLocaleDateString('fr-FR', options);
    },

    async setToken(token: string) {
      this.token = token;
      this.isAuthenticated = true;

      // Stocker le token pour une utilisation ultérieure
      TokenUtils.storeToken(token);

      // Décoder le token pour obtenir les informations de base
      try {
        const decodedData = TokenUtils.decodeToken(token);

        if (decodedData) {
          console.log('[STORE] Données brutes du token:', {
            isPremium: decodedData.isPremium,
            isAdmin: decodedData.isAdmin,
            types: {
              isPremium: typeof decodedData.isPremium,
              isAdmin: typeof decodedData.isAdmin
            }
          });

          // Vérifier les différentes valeurs possibles avec assertions de type
          let isPremiumValue = false;
          if (decodedData.isPremium !== undefined) {
            isPremiumValue = decodedData.isPremium === true ||
              (typeof decodedData.isPremium === 'number' && decodedData.isPremium === 1) ||
              (typeof decodedData.isPremium === 'string' && (decodedData.isPremium === '1' || decodedData.isPremium === 'true'));
          }

          let isAdminValue = false;
          if (decodedData.isAdmin !== undefined) {
            isAdminValue = decodedData.isAdmin === true ||
              (typeof decodedData.isAdmin === 'number' && decodedData.isAdmin === 1) ||
              (typeof decodedData.isAdmin === 'string' && (decodedData.isAdmin === '1' || decodedData.isAdmin === 'true'));
          }

          this.isPremium = isPremiumValue;
          this.isAdmin = isAdminValue;

          if (!this.user) {
            this.user = {
              id: decodedData.userId,
              username: decodedData.username || '',
              email: decodedData.email || '',
              isPremium: isPremiumValue,
              isAdmin: isAdminValue
            };
          } else {
            this.user.isPremium = isPremiumValue;
            this.user.isAdmin = isAdminValue;
          }

          console.log('[STORE] Valeurs après conversion dans setToken:', {
            isPremium: this.isPremium,
            isAdmin: this.isAdmin,
            userPremium: this.user.isPremium,
            userAdmin: this.user.isAdmin
          });
        }
      } catch (error) {
        console.error('Erreur lors du décodage du token:', error);
      }
    },

    persistUserData() {
      try {
        // S'assurer que les valeurs sont des booléens explicites avant de persister
        let isAdminValue = false;
        if (this.user?.isAdmin !== undefined) {
          isAdminValue = this.user.isAdmin === true ||
            (typeof this.user.isAdmin === 'number' && this.user.isAdmin === 1);
        }

        let isPremiumValue = false;
        if (this.user?.isPremium !== undefined) {
          isPremiumValue = this.user.isPremium === true ||
            (typeof this.user.isPremium === 'number' && this.user.isPremium === 1);
        }

        const userData = {
          user: {
            id: this.user?.id || 0,
            username: this.user?.username || '',
            email: this.user?.email || '',
            // Toujours stocker comme des booléens explicites
            isAdmin: isAdminValue,
            isPremium: isPremiumValue
          },
          isAuthenticated: this.isAuthenticated
        };

        console.log('[STORE] Données avant persistance:', {
          user: this.user,
          userType: {
            isAdmin: typeof this.user?.isAdmin,
            isPremium: typeof this.user?.isPremium
          }
        });

        console.log('[STORE] Données persistées:', {
          isAdmin: userData.user.isAdmin,
          isPremium: userData.user.isPremium,
          types: {
            isAdmin: typeof userData.user.isAdmin,
            isPremium: typeof userData.user.isPremium
          }
        });

        localStorage.setItem('user_data', JSON.stringify(userData));
      } catch (error) {
        console.warn('Impossible de persister les données utilisateur:', error);
      }
    },

    restoreUserData() {
      try {
        const storedData = localStorage.getItem('user_data');
        if (storedData) {
          const userData = JSON.parse(storedData);
          this.user = {
            id: userData.user.id || 0,
            username: userData.user.username || '',
            email: userData.user.email || '',
            isAdmin: userData.user.isAdmin || false,
            isPremium: userData.user.isPremium || false,
            company: userData.user.company || '',
            website: userData.user.website || '',
            bio: userData.user.bio || ''
          };
          this.isAuthenticated = userData.isAuthenticated || false;
        }
      } catch (error) {
        console.warn('Impossible de restaurer les données utilisateur:', error);
      }
    },

    async login(email: string, password: string) {
      this.loading = true;
      this.error = null;

      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password }),
          credentials: 'include'
        });

        const data = await response.json();
        console.log('Réponse du serveur:', data);

        if (data.success) {
          this.setToken(data.accessToken);

          // Force conversion des valeurs en booléens
          const isPremiumValue = data.user.isPremium === true || data.user.isPremium === 1;
          const isAdminValue = data.user.isAdmin === true || data.user.isAdmin === 1;

          this.user = {
            ...data.user,
            isPremium: isPremiumValue,
            isAdmin: isAdminValue
          };

          console.log("Données utilisateur après conversion:", {
            user: this.user,
            isPremium: isPremiumValue,
            isAdmin: isAdminValue,
            originalValues: {
              isPremium: data.user.isPremium,
              isAdmin: data.user.isAdmin
            }
          });

          this.isAuthenticated = true;
          this.isPremium = isPremiumValue;
          this.isAdmin = isAdminValue;

          this.persistUserData();
          await this.loadData();

          this.loading = false;
          return { success: true };
        } else {
          this.error = data.error || 'Erreur lors de la connexion';
          this.loading = false;
          return { success: false, error: this.error };
        }
      } catch (error: any) {
        this.error = error.message || 'Erreur lors de la connexion';
        this.loading = false;
        return { success: false, error: this.error };
      }
    },

    async updateUser(email: string, username: string, company?: string, website?: string, bio?: string) {
      try {
        const response = await fetch('/api/auth/updateUser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          },
          body: JSON.stringify({ email, username, company, website, bio })
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la mise à jour de l\'utilisateur');
        }

        const data = await response.json();
        this.user = data.user;
      } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
        throw error;
      }
    },

    async resetPassword(newPassword: string) {
      try {
        const response = await fetch('/api/auth/resetPassword', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          },
          body: JSON.stringify({ newPassword })
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la réinitialisation du mot de passe');
        }

        return response.json();
      } catch (error) {
        console.error('Erreur lors de la réinitialisation du mot de passe:', error);
        throw error;
      }
    },

    async signUp(username: string, email: string, password: string) {
      this.loading = true;
      this.error = null;

      try {
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, email, password }),
          credentials: 'include' // Important pour recevoir les cookies
        });

        const data = await response.json();

        if (data.success) {
          this.setToken(data.accessToken);
          this.user = data.user;
          this.isAuthenticated = true;
          this.isPremium = data.user.isPremium;
          this.isAdmin = data.user.isAdmin;

          // Persister les données utilisateur
          this.persistUserData();

          this.loading = false;
          return { success: true };
        } else {
          this.error = data.error || 'Erreur lors de l\'inscription';
          this.loading = false;
          return { success: false, error: this.error };
        }
      } catch (error: any) {
        this.error = error.message || 'Erreur lors de l\'inscription';
        this.loading = false;
        return { success: false, error: this.error };
      }
    },

    async deleteAccount() {
      try {
        const response = await fetch('/api/auth/deleteAccount', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          }
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la suppression du compte');
        }

        return response.json();
      } catch (error) {
        console.error('Erreur lors de la suppression du compte:', error);
        throw error;
      }
    },

    async saveSQLSchema(databaseName: string, tables: Table[]) {
      try {
        const schemaData = {
          database_name: databaseName,
          tables: tables.map(table => ({
            name: table.name,
            columns: table.columns.map(col => ({
              name: col.name,
              type: col.type,
              primaryKey: col.primaryKey,
              foreignKey: col.foreignKey,
              notNull: col.notNull,
              unique: col.unique,
              autoIncrement: col.autoIncrement,
              referencedTable: col.referencedTable,
              referencedColumn: col.referencedColumn
            }))
          }))
        };

        const userId = this.user.userId;
        console.log('userId', userId);
        console.log('schemaData', schemaData);

        const response: any = await $fetch('/api/sql/saveSQLSchema', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.token}`,
          },
          body: { ...schemaData, userId }
        });

        if (response.success) {
          this.sqlSchemas.push({
            ...schemaData,
            id: response.id
          });
        } else {
          throw new Error(response.error || 'Erreur lors de la sauvegarde');
        }

        return response;
      } catch (err: any) {
        console.error('Erreur lors de la sauvegarde du schéma:', err);
        throw err;
      }
    },

    async loadData() {
      try {
        this.loading = true;
        console.log('Chargement des données utilisateur...');

        const token = this.token || TokenUtils.retrieveToken();
        if (!token) {
          console.error('Pas de token disponible');
          return { success: false, error: 'Token manquant' };
        }

        console.log('Tentative avec /api/auth/validate');
        const validationResponse = await fetch('/api/auth/validate', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (validationResponse.ok) {
          const validationData = await validationResponse.json();
          if (validationData.valid && validationData.user) {
            console.log('[STORE] Données brutes reçues dans loadData:', {
              isPremium: validationData.user.isPremium,
              isAdmin: validationData.user.isAdmin,
              types: {
                isPremium: typeof validationData.user.isPremium,
                isAdmin: typeof validationData.user.isAdmin
              },
              valeurExacte: JSON.stringify(validationData.user)
            });

            console.log('[STORE] Tests de conversion:', {
              "isPremium === true": validationData.user.isPremium === true,
              "isPremium === 1": validationData.user.isPremium === 1,
              "isPremium == true": validationData.user.isPremium == true,
              "isPremium == 1": validationData.user.isPremium == 1,
              "!!isPremium": !!validationData.user.isPremium,
              "Boolean(isPremium)": Boolean(validationData.user.isPremium),
              "Number(isPremium) === 1": Number(validationData.user.isPremium) === 1
            });

            const isPremiumValue = validationData.user.isPremium === 1 || validationData.user.isPremium === true;
            const isAdminValue = validationData.user.isAdmin === 1 || validationData.user.isAdmin === true;

            this.user = {
              ...validationData.user,
              isPremium: isPremiumValue,
              isAdmin: isAdminValue
            };

            this.isAuthenticated = true;
            this.isPremium = isPremiumValue;
            this.isAdmin = isAdminValue;
            this.error = null;

            console.log('[STORE] Statut après conversion dans loadData:', {
              isPremium: this.isPremium,
              isAdmin: this.isAdmin,
              userPremium: this.user.isPremium,
              userAdmin: this.user.isAdmin,
              conversions: {
                isPremiumValue,
                isAdminValue
              }
            });

            this.persistUserData();
            console.log('Données chargées avec succès via validate:', this.user.id);
            return { success: true, user: this.user };
          }
        }

        console.log('Tentative avec /api/auth/session');
        const sessionResponse = await fetch('/api/auth/session', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!sessionResponse.ok) {
          console.log(`Échec de /api/auth/session (${sessionResponse.status})`);
          return { success: false, error: `Erreur HTTP ${sessionResponse.status}` };
        }

        const sessionData = await sessionResponse.json();
        if (!sessionData.success) {
          console.log('Session invalide:', sessionData.message);
          return { success: false, error: sessionData.message };
        }

        if (sessionData.user) {
          const isPremiumValue = typeof sessionData.user.isPremium === 'number'
            ? sessionData.user.isPremium === 1
            : !!sessionData.user.isPremium;

          const isAdminValue = typeof sessionData.user.isAdmin === 'number'
            ? sessionData.user.isAdmin === 1
            : !!sessionData.user.isAdmin;

          this.user = {
            ...sessionData.user,
            isPremium: isPremiumValue,
            isAdmin: isAdminValue
          };

          this.isAuthenticated = true;
          this.isPremium = isPremiumValue;
          this.isAdmin = isAdminValue;
          this.error = null;

          this.persistUserData();
          console.log('Données chargées avec succès via session:', this.user.id);
          return { success: true, user: this.user };
        }

        return { success: false, error: 'Données utilisateur incomplètes' };
      } catch (error) {
        console.error('Erreur:', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Erreur inconnue'
        };
      } finally {
        this.loading = false;
      }
    },

    async loadSnippets(retryCount = 0) {
      // Limiter le nombre de tentatives pour éviter les boucles infinies
      const MAX_RETRIES = 2;

      try {
        const token = TokenUtils.retrieveToken();
        if (!token) {
          console.log('Aucun token trouvé pour loadSnippets');
          return { success: false, error: 'Authentification requise' };
        }

        console.log('[STORE] Chargement des snippets avec token:', token.substring(0, 10) + '...');

        const response = await fetch('/api/snippets/loadSnippets', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });

        // Si 401, tentative explicite de rafraîchissement de token
        if (response.status === 401 && retryCount < MAX_RETRIES) {
          console.log('[STORE] Token expiré ou invalide pour loadSnippets, tentative de rafraîchissement...');
          try {
            // Vérifier d'abord si nous pouvons valider le token sans rafraîchir
            const validationResult = await this.validateToken();
            if (validationResult.valid) {
              console.log('[STORE] Token validé avec succès, nouvelle tentative');
              return this.loadSnippets(retryCount + 1);
            }

            // Si token invalide, essayer de le rafraîchir
            const refreshResponse = await fetch('/api/auth/refresh', {
              method: 'POST',
              credentials: 'include'
            });

            if (refreshResponse.ok) {
              const refreshData = await refreshResponse.json();
              if (refreshData.success && refreshData.accessToken) {
                console.log('[STORE] Token rafraîchi avec succès, nouvelle tentative');
                TokenUtils.storeToken(refreshData.accessToken);
                this.token = refreshData.accessToken;

                // Mettre à jour les données utilisateur si présentes
                if (refreshData.user) {
                  this.user = refreshData.user;
                  this.isAuthenticated = true;
                  this.isPremium = !!refreshData.user.isPremium;
                  this.isAdmin = !!refreshData.user.isAdmin;
                  this.persistUserData();
                }

                // Rappeler avec le compteur incrémenté pour éviter la boucle infinie
                return this.loadSnippets(retryCount + 1);
              }
            }

            // Si le rafraîchissement échoue, ne pas réessayer
            console.log('[STORE] Échec du rafraîchissement du token');
            return { success: false, error: 'Échec du rafraîchissement du token' };
          } catch (refreshError) {
            console.error('[STORE] Erreur lors du rafraîchissement du token:', refreshError);
            return { success: false, error: 'Erreur lors du rafraîchissement du token' };
          }
        }

        if (!response.ok) {
          console.error(`[STORE] Erreur lors du chargement des snippets: ${response.status}`);
          return { success: false, error: `Erreur HTTP ${response.status}` };
        }

        const data = await response.json();
        console.log('[STORE] Résultat du chargement des snippets:', data.success ? 'Succès' : 'Échec');

        if (data.success) {
          this.personalSnippets = data.data.personalSnippets || [];
          this.worldSnippets = data.data.worldSnippets || [];
          this.favoritesSnippets = data.data.favoritesSnippets || [];
          this.markFavoriteSnippets();
        }

        return data;
      } catch (err) {
        console.error('[STORE] Erreur lors du chargement des snippets:', err);
        return { success: false, error: err instanceof Error ? err.message : 'Erreur inconnue' };
      }
    },

    markFavoriteSnippets() {
      const favoriteIds = this.favoritesSnippets.map(fav => fav.snippet_id);

      this.worldSnippets.forEach(snippet => {
        snippet.isFavorite = favoriteIds.includes(snippet.id);
      });
    },

    async loadSQLSchemas(retryCount = 0) {
      const MAX_RETRIES = 2;

      try {
        const token = TokenUtils.retrieveToken();
        if (!token) {
          console.log('Aucun token trouvé pour loadSQLSchemas');
          return { success: false, error: 'Authentification requise' };
        }

        console.log('[STORE] Chargement des schémas SQL avec token:', token.substring(0, 10) + '...');

        const response = await fetch('/api/sql/loadSQLSchemas', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });

        if (response.status === 401 && retryCount < MAX_RETRIES) {
          console.log('[STORE] Token expiré ou invalide pour loadSQLSchemas, tentative de rafraîchissement...');
          try {
            const validationResult = await this.validateToken();
            if (validationResult.valid) {
              console.log('[STORE] Token validé avec succès, nouvelle tentative');
              return this.loadSQLSchemas(retryCount + 1);
            }

            const refreshResponse = await fetch('/api/auth/refresh', {
              method: 'POST',
              credentials: 'include'
            });

            if (refreshResponse.ok) {
              const refreshData = await refreshResponse.json();
              if (refreshData.success && refreshData.accessToken) {
                console.log('[STORE] Token rafraîchi avec succès, nouvelle tentative');
                TokenUtils.storeToken(refreshData.accessToken);
                this.token = refreshData.accessToken;

                if (refreshData.user) {
                  this.user = refreshData.user;
                  this.isAuthenticated = true;
                  this.isPremium = !!refreshData.user.isPremium;
                  this.isAdmin = !!refreshData.user.isAdmin;
                  this.persistUserData();
                }

                return this.loadSQLSchemas(retryCount + 1);
              }
            }

            console.log('[STORE] Échec du rafraîchissement du token');
            return { success: false, error: 'Échec du rafraîchissement du token' };
          } catch (refreshError) {
            console.error('[STORE] Erreur lors du rafraîchissement du token:', refreshError);
            return { success: false, error: 'Erreur lors du rafraîchissement du token' };
          }
        }

        if (!response.ok) {
          console.error(`[STORE] Erreur lors du chargement des schémas: ${response.status}`);
          return { success: false, error: `Erreur HTTP ${response.status}` };
        }

        const data = await response.json();
        console.log('[STORE] Schémas SQL chargés:', data.success ? 'Succès' : 'Échec');
        if (data && data.schemas) {
          this.sqlSchemas = data.schemas;
        }
        return data;
      } catch (err) {
        console.error('[STORE] Erreur lors du chargement des schémas:', err);
        return { success: false, error: err instanceof Error ? err.message : 'Erreur inconnue' };
      }
    },

    async uploadImage(file: File) {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        return data.url;
      }
      throw new Error(data.error || "Erreur lors de l'upload de l'image");
    },

    async addSnippets(title: string, description: string, framework: string, file: File, publishWorld: string, publishPersonal: string) {
      try {
        const userId = this.user.userId;
        const username = this.user?.username || '';
        const date = new Date().toISOString().slice(0, 10);
        const imageUrl = await this.uploadImage(file);

        const response = await $fetch('/api/snippets/addSnippets', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.token}`,
          },
          body: {
            username,
            date,
            title,
            description,
            framework,
            img: imageUrl,
            publishWorld,
            publishPersonal,
            userId
          }
        });

        if (!response) {
          throw new Error('Pas de réponse du serveur');
        }

        await this.loadData();

        return response;
      }
      catch (err: any) {
        console.error('Erreur lors de l\'ajout du snippet:', err.message, err.stack);
        throw err;
      }
    },

    async updateSnippet(id: number, code: string, type: 'world' | 'personal') {
      try {
        const userId = this.user.userId;
        const response: any = await $fetch('/api/snippets/updateSnippet', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.token}`,
          },
          body: { id, code, type, userId }
        });

        console.table(response);

        await this.loadData();
      }
      catch (err: any) {
        console.error(err.message, err.stack)
      }
    },

    async deleteSnippet(id: number, type: 'world' | 'personal') {
      try {
        console.log(this.user);
        const userId = this.user.userId;
        console.log('[STORE] Suppression du snippet', id, 'pour l\'utilisateur', userId);

        const response = await $fetch<DeleteSnippetResponse>('/api/snippets/deleteSnippet', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.token}`,
          },
          body: { id, type, userId }
        });

        if (!response || !response.success) {
          throw new Error(response?.error || 'Échec de la suppression du snippet');
        }

        console.log('[STORE] Snippet supprimé avec succès');
        await this.loadData();
        return response;
      } catch (err) {
        console.error('[STORE] Erreur lors de la suppression du snippet:', err);
        throw err;
      }
    },

    async addFavorite(snippetId: number, type: 'world' | 'personal') {
      try {
        const userId = this.user.userId;
        const response = await fetch('/api/snippets/addFavorite', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          },
          body: JSON.stringify({ snippetId, type, userId })
        });

        return response;
      } catch (err: any) {
        console.error('Erreur lors de l\'ajout du favori:', err.message, err.stack);
        return null;
      }
    },

    async removeFavorite(snippetId: number) {
      try {
        const userId = this.user.userId;
        const response = await fetch('/api/snippets/removeFavorite', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          },
          body: JSON.stringify({ snippetId, userId })
        });

        return response;
      } catch (err: any) {
        console.error('Erreur lors de la suppression du favori:', err.message, err.stack);
        return null;
      }
    },

    async deleteSQLSchema(databaseId: number) {
      try {
        const userId = this.user.userId;
        const response = await $fetch<DeleteResponse>(`/api/sql/${databaseId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
          body: { userId }
        });

        if (response.success) {
          this.sqlSchemas = this.sqlSchemas.filter(schema => schema.id !== databaseId);
        } else {
          throw new Error(response.error || 'Erreur lors de la suppression');
        }

      } catch (err: any) {
        console.error('Erreur lors de la suppression du schéma:', err);
        throw err;
      }
    },

    async getMonitoringData() {
      try {
        const response = await fetch('/api/monitoring/system', {
          headers: this.getAuthHeader
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des données système');
        }

        const data = await response.json();
        if (data.success && data.data) {
          this.systemData = {
            cpu: {
              usage: data.data.cpu?.usage || 0,
              cores: data.data.cpu?.cores || [],
              speed: data.data.cpu?.speed || 0
            },
            memory: {
              total: data.data.memory?.total || 0,
              used: data.data.memory?.used || 0,
              free: data.data.memory?.free || 0,
              swapUsed: data.data.memory?.swapUsed || 0,
              swapTotal: data.data.memory?.swapTotal || 0
            },
            disks: data.data.disks || []
          };
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données système:', error);
        this.systemData = {
          cpu: { usage: 0, cores: [], speed: 0 },
          memory: { total: 0, used: 0, free: 0, swapUsed: 0, swapTotal: 0 },
          disks: []
        };
      }
    },

    async auditSEO(url: string, options: any): Promise<any> {
      try {
        this.isSeoLoading = true;
        this.seoError = '';
        this.seoData = null;

        let response;
        // Nouvelle API d'analyse personnalisée
        response = await fetch('/api/website-analyzer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.token}`
          },
          body: JSON.stringify({ url })
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(`Erreur ${response.status}: ${errorData.message || response.statusText}`);
        }

        const data = await response.json();
        // Adapter la réponse pour qu'elle corresponde au format attendu par l'interface
        const formattedData = this.formatAnalyzerResponse(data, url);
        this.seoData = formattedData;
        return formattedData;

      } catch (error: any) {
        console.error('Erreur lors de l\'audit SEO:', error);
        this.seoError = error.message || 'Une erreur est survenue';

        throw error;
      } finally {
        this.isSeoLoading = false;
      }
    },

    // Fonction pour convertir le format de notre nouvelle API au format attendu par l'interface
    formatAnalyzerResponse(response: any, url: string) {
      const seoResults: Record<string, any> = {};

      seoResults[url] = {
        url,
        title: response.seo.title,
        description: response.seo.description,
        h1: response.seo.headings.h1,
        h2: response.seo.headings.h2,
        h3: response.seo.headings.h3,
        metaTags: Object.entries(response.seo.meta.og || {}).map(([name, content]) => ({
          name,
          content: content as string
        })),
        robotsMeta: {
          index: !response.seo.meta.robots?.includes('noindex'),
          follow: !response.seo.meta.robots?.includes('nofollow'),
          noindex: response.seo.meta.robots?.includes('noindex') || false,
          nofollow: response.seo.meta.robots?.includes('nofollow') || false,
          noarchive: response.seo.meta.robots?.includes('noarchive') || false,
          nosnippet: response.seo.meta.robots?.includes('nosnippet') || false,
          noodp: response.seo.meta.robots?.includes('noodp') || false
        },
        imageAlt: response.seo.images.data.map((img: any) => ({
          src: img.src,
          alt: img.alt || '',
          title: img.title || '',
          width: img.dimensions?.width,
          height: img.dimensions?.height,
          hasDimensions: !!(img.dimensions?.width && img.dimensions?.height)
        })),
        videoInfo: [],
        loadTime: response.performance.loadTime,
        statusCode: response.technical.statusCode,
        internalLinks: response.seo.links.internal,
        externalLinks: response.seo.links.external,
        warnings: response.issues.map((issue: any) => ({
          message: issue.message,
          severity: issue.type === 'error' ? 'critical' : issue.type === 'warning' ? 'high' : 'medium',
          type: issue.code
        })),
        coreWebVitals: {
          FCP: response.performance.fcp,
          LCP: response.performance.lcp,
          TTFB: response.performance.ttfb,
          domLoad: response.performance.totalBlockingTime,
          speedIndex: response.performance.speedIndex,
          timeToInteractive: response.performance.totalBlockingTime + response.performance.fcp,
          totalBlockingTime: response.performance.totalBlockingTime,
          cumulativeLayoutShift: response.performance.cls,
          performanceScore: Math.round((100 - (response.performance.ttfb / 5) - (response.performance.lcp / 40)) * 0.6),
          firstContentfulPaintScore: Math.round(100 - (response.performance.fcp / 25)),
          speedIndexScore: Math.round(100 - (response.performance.speedIndex / 40)),
          largestContentfulPaintScore: Math.round(100 - (response.performance.lcp / 40)),
          interactiveScore: Math.round(100 - (response.performance.totalBlockingTime / 30)),
          totalBlockingTimeScore: Math.round(100 - (response.performance.totalBlockingTime / 30)),
          cumulativeLayoutShiftScore: Math.round(100 - (response.performance.cls * 100)),
          serverResponseTime: response.performance.ttfb
        },
        headingStructure: response.seo.headings,
        structuredData: response.seo.structuredData,
        socialTags: {
          ogTags: Object.entries(response.seo.meta.og || {}).map(([property, content]) => ({
            property,
            content
          })),
          twitterTags: Object.entries(response.seo.meta.twitter || {}).map(([name, content]) => ({
            name,
            content
          }))
        },
        mobileCompatibility: {
          hasViewport: !!response.technical.mobile.viewport,
          viewportContent: response.technical.mobile.viewport || '',
          smallTouchTargets: 0
        },
        securityChecks: {
          https: response.technical.https,
          validCertificate: response.technical.security.certificate,
          securityHeaders: Object.entries(response.technical.security.headers || {}).map(([name, value]) => ({
            name,
            value: value as string
          }))
        },
        links: {
          internal: response.seo.links.internal,
          external: response.seo.links.external
        },
        contentStats: {
          wordCount: response.seo.wordCount,
          keywordDensity: Object.values(response.seo.keywordDensity || {}),
          readabilityScore: response.seo.readabilityScore
        },
        technicalSEO: {
          sitemapFound: false,
          sitemapUrl: '',
          sitemapUrls: 0,
          robotsTxtFound: false,
          robotsTxtContent: '',
          schemaTypeCount: response.seo.structuredData?.types || {}
        }
      };

      return {
        urlMap: { [url]: [] },
        visitedURLs: [url],
        seoResults,
        summary: {
          totalPages: 1,
          averageLoadTime: response.performance.loadTime,
          totalWarnings: response.issues.length,
          missingTitles: !response.seo.title ? 1 : 0,
          missingDescriptions: !response.seo.description ? 1 : 0,
          missingAltTags: response.seo.images.withoutAlt,
          averageFCP: response.performance.fcp,
          averageLCP: response.performance.lcp,
          averageTTFB: response.performance.ttfb,
          pagesWithStructuredData: response.seo.structuredData?.count || 0,
          pagesWithSocialTags: Object.keys(response.seo.meta.og || {}).length +
            Object.keys(response.seo.meta.twitter || {}).length > 0 ? 1 : 0,
          mobileCompatiblePages: response.technical.mobile.viewport ? 1 : 0,
          securePages: response.technical.https ? 1 : 0
        },
        generatedSitemap: '',
        rankedUrls: [url]
      };
    },

    async saveTemplate(templateName: string, templateData: any, componentType: string) {
      try {
        const userId = this.user.userId;
        const response = await fetch('/api/studio/saveTemplate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          },
          body: JSON.stringify({ templateName, templateData, componentType, userId })
        });

        return response;
      } catch (err: any) {
        console.error(err.message, err.stack);
      }
    },

    async removeTemplate(templateId: number) {
      if (!templateId) {
        throw new Error('Template ID is required');
      }

      try {
        const response = await fetch(`/api/studio/removeTemplate/${templateId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            templateId: templateId,
            userId: this.user.userId
          })
        });

        if (!response.ok) {
          const error = await response.text();
          throw new Error(error || 'Failed to delete template');
        }

        return response;
      } catch (error: any) {
        console.error('Error removing template:', error);
        throw error;
      }
    },

    async sendEmail(emailData: any) {
      try {
        if (!emailData.subject || !emailData.html || !emailData.text) {
          console.error('Données manquantes pour l\'envoi d\'email:', emailData);
          return null;
        }

        const response = await fetch('/api/newsletter/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          },
          body: JSON.stringify(emailData)
        });

        return response;
      } catch (err: any) {
        console.error('Erreur lors de l\'envoi d\'email:', err.message, err.stack);
        return null;
      }
    },

    async addNewsletter(newsletterName: string) {
      try {
        const response = await fetch('/api/newsletter/createNewsletter', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          },
          body: JSON.stringify({ name: newsletterName })
        });

        return response;
      } catch (err: any) {
        console.error('Erreur lors de la création de la newsletter:', err.message, err.stack);
        return null;
      }
    },

    async subscribeToNewsletter(email: string) {
      try {
        const response = await fetch('/api/newsletter/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          },
          body: JSON.stringify({ email })
        });

        return response;
      } catch (err: any) {
        console.error('Erreur lors de l\'inscription à la newsletter:', err.message, err.stack);
        return null;
      }
    },

    async getEmailHistory() {
      try {
        const response = await fetch('/api/newsletter/history', {
          headers: {
            'Authorization': `Bearer ${this.token}`
          },
        });

        return response;
      } catch (err: any) {
        console.error('Erreur lors de la récupération de l\'historique des emails:', err.message, err.stack);
        return null;
      }
    },

    async unsubscribe(email: string) {
      try {
        const response = await fetch('/api/newsletter/unsubscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email })
        });

        return response;
      } catch (err: any) {
        console.error('Erreur lors de la désinscription:', err.message, err.stack);
        return null;
      }
    },

    async fetchSEOData(url: string) {
      this.isSeoLoading = true;
      this.seoError = '';

      try {
        const response = await $fetch('/api/seo-audit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          },
          body: JSON.stringify({
            url,
            options: {
              maxDepth: 1,
              sameDomainOnly: true,
              timeout: 30000
            }
          })
        });

        // Vérifier si la réponse est valide
        if (!response) {
          throw new Error('Failed to fetch SEO data');
        }

        // Stocker la réponse complète (peut être soit un CrawlReport soit un SEOAuditResult)
        this.seoData = response;
        return this.seoData;
      } catch (err) {
        this.seoError = err instanceof Error ? err.message : 'An error occurred';
        throw err;
      } finally {
        this.isSeoLoading = false;
      }
    },

    async forgotPassword(email: string) {
      try {
        const response = await $fetch('/api/auth/forgot-password', {
          method: 'POST',
          body: { email }
        });
        return response;
      } catch (error: any) {
        throw new Error(error.data?.message || 'Erreur lors de la réinitialisation du mot de passe');
      }
    },

    async updatePremiumStatus(isPremium: boolean) {
      try {
        // Appel à l'API pour mettre à jour le statut premium
        const response = await fetch('/api/users/update-premium', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...this.getAuthHeader
          },
          body: JSON.stringify({ isPremium }),
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la mise à jour du statut premium');
        }

        const data = await response.json();

        if (data.success) {
          // Mise à jour du statut dans le store
          if (this.user) {
            this.user.isPremium = isPremium;
          }
          this.persistUserData();
          return { success: true };
        } else {
          throw new Error(data.error || 'Erreur lors de la mise à jour du statut premium');
        }
      } catch (error) {
        console.error('Erreur lors de la mise à jour du statut premium:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' };
      }
    },

    async checkout(cardholderName: string, countryCode: string = 'FR'): Promise<{
      success: boolean;
      clientSecret?: string;
      error?: string;
      taxDetails?: {
        baseAmount: number;
        taxAmount: number;
        totalAmount: number;
        taxPercentage: number;
      }
    }> {
      const currency = 'eur';
      try {
        const response = await $fetch('/api/payment/create-intent', {
          method: 'POST',
          body: {
            currency,
            customer_name: cardholderName,
            country_code: countryCode
          }
        });

        if (response && typeof response === 'object' && 'success' in response) {
          if (response.success && 'clientSecret' in response) {
            const taxDetails = 'taxDetails' in response ? response.taxDetails : undefined;

            return {
              success: true,
              clientSecret: response.clientSecret as string,
              taxDetails: taxDetails as {
                baseAmount: number;
                taxAmount: number;
                totalAmount: number;
                taxPercentage: number;
              } | undefined
            };
          }
        }

        return {
          success: false,
          error: (response && typeof response === 'object' && 'error' in response)
            ? response.error as string
            : 'Invalid server response'
        };
      } catch (error) {
        console.error('Payment error:', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown payment error'
        };
      }
    },

    async checkAuthentication() {
      console.log('Vérification de l\'état d\'authentification...');

      try {
        const token = TokenUtils.retrieveToken();

        // Si pas de token, l'utilisateur n'est pas authentifié
        if (!token) {
          console.log('Aucun token trouvé');
          return { isAuthenticated: false };
        }

        // Valider le token
        const validationResponse = await fetch('/api/auth/validate', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const validationData = await validationResponse.json();

        if (!validationData.valid) {
          console.log('Token invalide selon /api/auth/validate');
          return { isAuthenticated: false };
        }

        console.log('Token validé avec succès');
        this.token = token;

        // Charger les données utilisateur
        const result = await this.loadData();

        if (!result || !result.success) {
          console.log('Échec du chargement des données utilisateur:', result?.error);
          // Ne pas déconnecter, retourner simplement false
          return { isAuthenticated: false };
        }

        console.log('Utilisateur authentifié avec succès');
        this.isAuthenticated = true;
        return { isAuthenticated: true, user: this.user };
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
        // Ne pas déconnecter, retourner simplement false
        return { isAuthenticated: false, error };
      }
    },

    async validateToken() {
      try {
        const token = this.token || TokenUtils.retrieveToken();

        if (!token) {
          console.log('[STORE] Pas de token à valider');
          return { valid: false, message: 'Pas de token disponible' };
        }

        const response = await fetch('/api/auth/validate', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        console.log('[STORE] Résultat de la validation du token:', data.valid ? 'Valide' : 'Invalide');

        if (data.valid && data.user) {
          console.log('[STORE] Valeurs brutes reçues de validate:', {
            isPremium: data.user.isPremium,
            isAdmin: data.user.isAdmin,
            type_isPremium: typeof data.user.isPremium,
            type_isAdmin: typeof data.user.isAdmin
          });
        }

        if (data.valid) {
          this.isAuthenticated = true;
          if (data.user) {
            // Vérifier les différentes valeurs possibles avec assertions de type
            let isPremiumValue = false;
            if (data.user.isPremium !== undefined) {
              isPremiumValue = data.user.isPremium === true ||
                (typeof data.user.isPremium === 'number' && data.user.isPremium === 1) ||
                (typeof data.user.isPremium === 'string' && (data.user.isPremium === '1' || data.user.isPremium === 'true'));
            }

            let isAdminValue = false;
            if (data.user.isAdmin !== undefined) {
              isAdminValue = data.user.isAdmin === true ||
                (typeof data.user.isAdmin === 'number' && data.user.isAdmin === 1) ||
                (typeof data.user.isAdmin === 'string' && (data.user.isAdmin === '1' || data.user.isAdmin === 'true'));
            }

            this.user = {
              id: data.user.userId,
              username: data.user.username || '',
              email: data.user.email || '',
              isPremium: isPremiumValue,
              isAdmin: isAdminValue
            };

            this.isPremium = isPremiumValue;
            this.isAdmin = isAdminValue;

            console.log('[STORE] Conversion des valeurs:', {
              isPremiumOriginal: data.user.isPremium,
              isAdminOriginal: data.user.isAdmin,
              isPremiumConverti: isPremiumValue,
              isAdminConverti: isAdminValue
            });

            this.persistUserData();
          }
        }

        return data;
      } catch (error) {
        console.error('[STORE] Erreur lors de la validation du token:', error);
        return { valid: false, message: 'Erreur lors de la validation' };
      }
    },

    async loadStudioComponents() {
      try {
        console.log('[STORE] Chargement des composants du studio');
        const response = await fetch('/api/studio/getComponent', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        });

        if (!response.ok) {
          throw new Error('Erreur lors du chargement des composants');
        }

        const data = await response.json();
        if (data.success) {
          this.studioComponents = data.components;
          console.log('[STORE] Composants chargés:', this.studioComponents);
        } else {
          console.error('[STORE] Erreur lors du chargement des composants:', data.error);
        }
      } catch (error) {
        console.error('[STORE] Erreur lors du chargement des composants:', error);
        throw error;
      }
    }
  },
  persist: {
    enabled: true
  } as PersistenceOptions
});
