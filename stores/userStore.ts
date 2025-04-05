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
  userId?: number;
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
            this.user.userId = this.user.id;
          } else {
            this.user.isPremium = isPremiumValue;
            this.user.isAdmin = isAdminValue;
            this.user.userId = this.user.id;
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
            userId: this.user?.id || 0,
            username: this.user?.username || '',
            email: this.user?.email || '',
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
            userId: userData.user.id || 0,
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

    async login(email: string, password: string, rememberMe: boolean) {
      this.loading = true;
      this.error = null;

      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password, rememberMe }),
          credentials: 'include'
        });

        const data = await response.json();
        console.log('Réponse du serveur:', data);

        if (data.success) {
          this.setToken(data.accessToken);

          const isPremiumValue = data.user.isPremium === true || data.user.isPremium === 1;
          const isAdminValue = data.user.isAdmin === true || data.user.isAdmin === 1;

          this.user = {
            ...data.user,
            isPremium: isPremiumValue,
            isAdmin: isAdminValue
          };

          // Assurer que userId est défini pour rétrocompatibilité
          this.user.userId = this.user.id;

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

        if (response.status === 401 && retryCount < MAX_RETRIES) {
          console.log('[STORE] Token expiré ou invalide pour loadSnippets, tentative de rafraîchissement...');
          try {
            const validationResult = await this.validateToken();
            if (validationResult.valid) {
              console.log('[STORE] Token validé avec succès, nouvelle tentative');
              return this.loadSnippets(retryCount + 1);
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

                return this.loadSnippets(retryCount + 1);
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

        if (!url) {
          throw new Error('URL non spécifiée');
        }

        try {
          new URL(url);
        } catch (e) {
          throw new Error('URL invalide');
        }

        console.log('Démarrage de l\'audit SEO pour:', url);
        console.log('Options:', JSON.stringify(options, null, 2));

        const initialResponse = await fetch('/api/website-analyzer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.token}`
          },
          body: JSON.stringify({
            url,
            maxPages: options?.maxUrlsToAnalyze || 10,
            checkSitemap: options?.checkSitemap,
            checkRobotsTxt: options?.checkRobotsTxt,
            timeout: options?.timeout || 30000,
            focusOnContact: options?.focusOnContact || false
          })
        });

        console.log('Réponse initiale:', initialResponse);

        if (!initialResponse.ok) {
          const errorData = await initialResponse.json().catch(() => ({}));
          throw new Error(`Erreur ${initialResponse.status}: ${errorData.message || initialResponse.statusText}`);
        }

        const initialData = await initialResponse.json();
        const urlsToAnalyze = initialData.visitedURLs || [url];
        console.log('URLs à analyser:', urlsToAnalyze);

        const allResults = await Promise.all(
          urlsToAnalyze.map(async (pageUrl: string) => {
            try {
              const response = await fetch('/api/website-analyzer', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${this.token}`
                },
                body: JSON.stringify({
                  url: pageUrl,
                  options: {
                    ...options,
                    maxDepth: 0,
                    sameDomainOnly: true
                  }
                })
              });

              if (!response.ok) {
                console.error(`Erreur lors de l'analyse de ${pageUrl}:`, response.status);
                return null;
              }

              const data = await response.json();
              console.log("HEREEEEEE", data);
              return {
                url: pageUrl,
                data
              };
            } catch (error) {
              console.error(`Erreur lors de l'analyse de ${pageUrl}:`, error);
              return null;
            }
          })
        );

        const validResults = allResults.filter(result => result !== null);
        const mergedData = {
          urlMap: initialData.urlMap || {},
          visitedURLs: urlsToAnalyze,
          seoResults: {},
          summary: {
            totalPages: urlsToAnalyze.length,
            averageLoadTime: 0,
            totalWarnings: 0,
            missingTitles: 0,
            missingDescriptions: 0,
            missingAltTags: 0,
            averageFCP: 0,
            averageLCP: 0,
            averageTTFB: 0,
            pagesWithStructuredData: 0,
            pagesWithSocialTags: 0,
            mobileCompatiblePages: 0,
            securePages: 0
          },
          generatedSitemap: initialData.generatedSitemap || '',
          rankedUrls: urlsToAnalyze
        };

        let totalLoadTime = 0;
        let totalFCP = 0;
        let totalLCP = 0;
        let totalTTFB = 0;

        validResults.forEach(result => {
          if (!result?.data?.seoResults) {
            console.log('Pas de seoResults dans:', result);
            return;
          }

          const pageData = result.data.seoResults[result.url];
          if (!pageData) {
            console.log('Pas de pageData pour:', result.url);
            return;
          }

          console.log('Traitement de la page:', result.url);
          console.log('PageData:', pageData);

          mergedData.seoResults[result.url] = pageData;

          totalLoadTime += pageData.loadTime || 0;
          totalFCP += pageData.coreWebVitals?.FCP || 0;
          totalLCP += pageData.coreWebVitals?.LCP || 0;
          totalTTFB += pageData.coreWebVitals?.TTFB || 0;

          if (!pageData.title) {
            console.log('Titre manquant pour:', result.url);
            mergedData.summary.missingTitles++;
          }
          if (!pageData.description) {
            console.log('Description manquante pour:', result.url);
            mergedData.summary.missingDescriptions++;
          }
          if (pageData.imageAlt?.some(img => !img.alt)) {
            const missingAltCount = pageData.imageAlt.filter(img => !img.alt).length;
            console.log(`${missingAltCount} images sans alt pour:`, result.url);
            mergedData.summary.missingAltTags += missingAltCount;
          }

          if (pageData.structuredData?.length > 0) {
            console.log('Données structurées trouvées pour:', result.url);
            mergedData.summary.pagesWithStructuredData++;
          }
          if ((pageData.socialTags?.ogTags?.length > 0) ||
            (pageData.socialTags?.twitterTags?.length > 0)) {
            console.log('Tags sociaux trouvés pour:', result.url);
            mergedData.summary.pagesWithSocialTags++;
          }
          if (pageData.mobileCompatibility?.hasViewport) {
            console.log('Viewport mobile trouvé pour:', result.url);
            mergedData.summary.mobileCompatiblePages++;
          }
          if (pageData.securityChecks?.https) {
            console.log('HTTPS trouvé pour:', result.url);
            mergedData.summary.securePages++;
          }

          const warningsCount = pageData.warnings?.length || 0;
          console.log(`${warningsCount} avertissements pour:`, result.url);
          mergedData.summary.totalWarnings += warningsCount;
        });

        const validResultsCount = validResults.length || 1;
        console.log('Nombre de résultats valides:', validResultsCount);
        console.log('Résumé avant moyennes:', mergedData.summary);

        mergedData.summary.averageLoadTime = totalLoadTime / validResultsCount;
        mergedData.summary.averageFCP = totalFCP / validResultsCount;
        mergedData.summary.averageLCP = totalLCP / validResultsCount;
        mergedData.summary.averageTTFB = totalTTFB / validResultsCount;

        mergedData.summary.pagesWithStructuredData = (mergedData.summary.pagesWithStructuredData / validResultsCount) * 100;
        mergedData.summary.pagesWithSocialTags = (mergedData.summary.pagesWithSocialTags / validResultsCount) * 100;
        mergedData.summary.mobileCompatiblePages = (mergedData.summary.mobileCompatiblePages / validResultsCount) * 100;
        mergedData.summary.securePages = (mergedData.summary.securePages / validResultsCount) * 100;

        console.log('Résumé final:', mergedData.summary);

        const formattedData = this.formatAnalyzerResponse(mergedData, url);
        this.seoData = formattedData;
        return formattedData;

      } catch (error: any) {
        console.error('Erreur détaillée lors de l\'audit SEO:', error.stack ? error.stack : error);
        this.seoError = error.message || 'Une erreur est survenue lors de l\'analyse SEO';
        throw error;
      } finally {
        this.isSeoLoading = false;
      }
    },

    formatAnalyzerResponse(response: any, url: string) {
      console.log('Response reçue de l\'analyseur:', JSON.stringify(response, null, 2));

      if (!response) {
        throw new Error('Réponse vide de l\'analyseur');
      }

      // Vérifier si la réponse est un objet
      if (typeof response !== 'object') {
        throw new Error('La réponse de l\'analyseur n\'est pas un objet valide');
      }

      // Vérifier et propager technicalSEO aux résultats
      if (response.seoResults) {
        Object.keys(response.seoResults).forEach(pageUrl => {
          const result = response.seoResults[pageUrl];
          // Si technicalSEO n'est pas déjà défini, initialiser avec les valeurs par défaut
          if (!result.technicalSEO) {
            console.log(`Initialisation de technicalSEO pour ${pageUrl}`);
            result.technicalSEO = {
              sitemapFound: false,
              robotsTxtFound: false,
              schemaTypeCount: {}
            };
          } else {
            console.log(`technicalSEO existant pour ${pageUrl}:`, result.technicalSEO);
          }
        });
      }

      // Préserver la structure existante
      return {
        seoResults: response.seoResults || {},
        summary: response.summary || {
          totalPages: 0,
          averageLoadTime: 0,
          totalWarnings: 0,
          missingTitles: 0,
          missingDescriptions: 0,
          missingAltTags: 0,
          averageFCP: 0,
          averageLCP: 0,
          averageTTFB: 0,
          pagesWithStructuredData: 0,
          pagesWithSocialTags: 0,
          mobileCompatiblePages: 0,
          securePages: 0
        },
        visitedURLs: response.visitedURLs || [],
        urlMap: response.urlMap || {},
        generatedSitemap: response.generatedSitemap || '',
        rankedUrls: response.rankedUrls || []
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

    async updatePremiumStatus() {
      try {
        console.log('Début mise à jour statut premium, userId:', this.user?.id);

        const userId = this.user?.id;
        console.log('ID utilisé pour la requête premium-status:', userId);

        const response = await $fetch('/api/user/premium-status', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.token}`
          },
          body: {
            userId
          }
        });

        console.log('Réponse API premium-status:', response);

        if (response.success) {
          console.log('Mise à jour réussie, passage premium:', response.isPremium);
          if (this.user && response.user) {
            // Mettre à jour toutes les propriétés de l'utilisateur
            this.user.isPremium = true;
            this.user.id = response.user.id;
            this.user.userId = response.user.id; // Garder userId synchronisé
            this.user.username = response.user.username;
            this.user.email = response.user.email;
            this.user.isAdmin = response.user.isAdmin;

            this.persistUserData();
            console.log('Données utilisateur mises à jour et persistées:', this.user);
          } else {
            if (this.user) {
              this.user.isPremium = true;
              this.persistUserData();
            }
            console.log('Mise à jour manuelle du statut premium réussie');
          }
          return {
            success: true,
            requireRelogin: response.requireRelogin || false
          };
        } else {
          console.error('Échec mise à jour premium:', response.error);
          return { success: false, error: response.error || 'Erreur lors de la mise à jour du statut premium' };
        }
      } catch (error) {
        console.error('Exception lors de la mise à jour du statut premium:', error);
        return { success: false, error: 'Erreur lors de la mise à jour du statut premium' };
      }
    },

    async checkout(cardholderName: string, countryCode: string = 'FR', isBusinessCustomer: boolean = false, vatNumber: string = ''): Promise<{
      success: boolean;
      clientSecret?: string;
      error?: string;
      taxDetails?: {
        baseAmount: number;
        taxAmount: number;
        totalAmount: number;
        taxPercentage: number;
        isVatExempt?: boolean;
        vatNumber?: string;
      }
    }> {
      const currency = 'eur';
      try {
        const response = await $fetch('/api/payment/create-intent', {
          method: 'POST',
          body: {
            currency,
            customer_name: cardholderName,
            country_code: countryCode,
            is_business: isBusinessCustomer,
            vat_number: vatNumber
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
                isVatExempt?: boolean;
                vatNumber?: string;
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

        if (!token) {
          console.log('Aucun token trouvé');
          return { isAuthenticated: false };
        }

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

        const result = await this.loadData();

        if (!result || !result.success) {
          console.log('Échec du chargement des données utilisateur:', result?.error);
          return { isAuthenticated: false };
        }

        console.log('Utilisateur authentifié avec succès');
        this.isAuthenticated = true;
        return { isAuthenticated: true, user: this.user };
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
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
            this.user.userId = this.user.id;

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
    },

    async generateInvoice(
      paymentId: string,
      customerName: string,
      customerEmail: string,
      vatNumber: string,
      country: string,
      isBusinessCustomer: boolean,
      baseAmount: number,
      taxAmount: number,
      totalAmount: number,
      taxPercentage: number,
      isVatExempt: boolean
    ): Promise<{ success: boolean; error?: string }> {
      try {
        const response = await $fetch('/api/payment/generate-invoice', {
          method: 'POST',
          body: {
            paymentId,
            customerName,
            customerEmail,
            vatNumber,
            country,
            isBusinessCustomer,
            baseAmount,
            taxAmount,
            totalAmount,
            taxPercentage,
            isVatExempt,
            date: new Date().toLocaleDateString('fr-FR')
          }
        });

        if (response && typeof response === 'object' && 'success' in response) {
          return {
            success: response.success as boolean,
            error: 'error' in response ? response.error as string : undefined
          };
        }

        return {
          success: false,
          error: 'Réponse du serveur invalide'
        };
      } catch (error) {
        console.error('Error generating invoice:', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Erreur inconnue lors de la génération de la facture'
        };
      }
    }
  },
  persist: {
    enabled: true
  } as PersistenceOptions
});
