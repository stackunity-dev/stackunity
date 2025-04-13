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
    totalIssues: number;
    criticalIssues: number;
    highIssues: number;
    mediumIssues: number;
    lowIssues: number;
    resourceIssues: {
      css: number;
      js: number;
      images: number;
    };
  };
  generatedSitemap: string;
  rankedUrls: string[];
  issues: Array<{
    type: string;
    message: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
  }>;
  resources: {
    css: {
      total: number;
      minified: number;
      recommendations: string[];
    };
    js: {
      total: number;
      minified: number;
      recommendations: string[];
    };
    images: {
      total: number;
      optimized: number;
      unoptimized: number;
      totalSize: number;
      recommendations: string[];
    };
  };
}

interface SEOAuditResult {
  success: boolean;
  message?: string;
  result?: CrawlReport;
}

interface LoginResponse {
  success: boolean;
  message?: string;
}

interface RandomData {
  totalWarnings: number;
  criticalCount: number;
  majorCount: number;
  minorCount: number;
  infoCount: number;
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
    randomData: null as RandomData | null,
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

          const token = TokenUtils.retrieveToken();
          if (!token) {
            return false;
          }

          const validationResult = await this.validateToken();
          if (!validationResult.valid) {
            localStorage.removeItem('user_data');
            return false;
          }

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

          this.user = {
            ...parsedData.user,
            isPremium: isPremiumValue,
            isAdmin: isAdminValue
          };
          this.isAuthenticated = true;
          this.isPremium = isPremiumValue;
          this.isAdmin = isAdminValue;
          this.token = token;

          await this.loadData();
          return true;
        }
        return false;
      } catch (error) {
        console.error('[STORE] Erreur lors de l\'initialisation:', error);
        return false;
      }
    },

    async logout() {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          }
        });

        this.token = null;
        this.user = null;
        this.isAuthenticated = false;
        TokenUtils.removeToken();
        this.persistData();

      } catch (error) {
        console.error('Erreur lors de l\'appel à l\'API de déconnexion:', error);
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


      TokenUtils.storeToken(token);

      try {
        const decodedData = TokenUtils.decodeToken(token);

        if (decodedData) {


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
              userId: decodedData.userId,
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
        }
      } catch (error) {
        console.error('Erreur lors du décodage du token:', error);
      }
    },

    persistData() {
      try {

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

          if (!userData.user) {
            console.warn('[STORE] Données utilisateur invalides dans le localStorage');
            return false;
          }

          let isPremiumValue = false;
          if (userData.user?.isPremium !== undefined) {
            isPremiumValue = userData.user.isPremium === true ||
              (typeof userData.user.isPremium === 'number' && userData.user.isPremium === 1) ||
              (typeof userData.user.isPremium === 'string' && (userData.user.isPremium === '1' || userData.user.isPremium === 'true'));
          }

          let isAdminValue = false;
          if (userData.user?.isAdmin !== undefined) {
            isAdminValue = userData.user.isAdmin === true ||
              (typeof userData.user.isAdmin === 'number' && userData.user.isAdmin === 1) ||
              (typeof userData.user.isAdmin === 'string' && (userData.user.isAdmin === '1' || userData.user.isAdmin === 'true'));
          }

          this.user = {
            id: userData.user.id || 0,
            userId: userData.user.id || 0,
            username: userData.user.username || '',
            email: userData.user.email || '',
            isAdmin: isAdminValue,
            isPremium: isPremiumValue,
            company: userData.user.company || '',
            website: userData.user.website || '',
            bio: userData.user.bio || ''
          };
          this.isAuthenticated = userData.isAuthenticated || false;
          this.isPremium = isPremiumValue;
          this.isAdmin = isAdminValue;

          return true;
        } else {
          console.log('[STORE] Aucune donnée utilisateur trouvée dans le localStorage');
          return false;
        }
      } catch (error) {
        console.warn('[STORE] Erreur lors de la restauration des données utilisateur:', error);
        return false;
      }
    },

    async login(
      email: string,
      password: string,
      rememberMe: boolean,
      csrfToken: string
    ): Promise<LoginResponse> {
      this.loading = true;
      this.error = null;

      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken
          },
          body: JSON.stringify({ email, password, rememberMe }),
          credentials: 'include'
        });

        const data = await response.json();

        if (data.success) {
          this.setToken(data.accessToken);

          const isPremiumValue = data.user.isPremium === true || data.user.isPremium === 1;
          const isAdminValue = data.user.isAdmin === true || data.user.isAdmin === 1;

          this.user = {
            ...data.user,
            isPremium: isPremiumValue,
            isAdmin: isAdminValue
          };

          this.user.userId = this.user.id;


          this.isAuthenticated = true;
          this.isPremium = isPremiumValue;
          this.isAdmin = isAdminValue;

          this.persistData();
          await this.loadData();

          this.loading = false;
          return { success: true };
        } else {
          this.error = data.error || 'Erreur lors de la connexion';
          this.loading = false;
          return { success: false };
        }
      } catch (error: any) {
        this.error = error.message || 'Erreur lors de la connexion';
        this.loading = false;
        return { success: false };
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
          credentials: 'include'
        });

        const data = await response.json();

        if (data.success) {
          this.setToken(data.accessToken);
          this.user = data.user;
          this.isAuthenticated = true;
          this.isPremium = data.user.isPremium;
          this.isAdmin = data.user.isAdmin;

          this.persistData();

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

    async validateToken() {
      try {
        const token = this.token || TokenUtils.retrieveToken();

        if (!token) {
          return { valid: false, message: 'Pas de token disponible' };
        }

        const response = await fetch('/api/auth/validate', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (data.valid) {
          this.isAuthenticated = true;
          this.token = token;

          if (data.user) {

            const userId = data.user.userId || data.user.id;

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

            if (!this.user) {
              this.user = {
                id: userId,
                userId: userId,
                username: data.user.username || '',
                email: data.user.email || '',
                isPremium: isPremiumValue,
                isAdmin: isAdminValue
              };
            } else {
              this.user.id = userId;
              this.user.userId = userId;
              this.user.username = data.user.username || this.user.username;
              this.user.email = data.user.email || this.user.email;
              this.user.isPremium = isPremiumValue;
              this.user.isAdmin = isAdminValue;
            }

            this.isPremium = isPremiumValue;
            this.isAdmin = isAdminValue;


            this.persistData();
          }
        }

        return data;
      } catch (error) {
        console.error('[STORE] Erreur lors de la validation du token:', error);
        return { valid: false, message: 'Erreur lors de la validation' };
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

    async loadData() {
      try {
        this.loading = true;

        const token = this.token || TokenUtils.retrieveToken();
        if (!token) {
          console.error('Pas de token disponible');
          return { success: false, error: 'Token manquant' };
        }

        const validationResponse = await fetch('/api/auth/validate', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (validationResponse.ok) {
          const validationData = await validationResponse.json();
          if (validationData.valid && validationData.user) {

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
            this.token = token;

            this.persistData();
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
          this.token = token;

          this.persistData();
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

    async loadSQLSchemas(retryCount = 0) {
      const MAX_RETRIES = 2;

      try {
        const token = TokenUtils.retrieveToken();
        if (!token) {
          return { success: false, error: 'Authentification requise' };
        }


        const response = await fetch('/api/sql/loadSQLSchemas', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });

        if (response.status === 401 && retryCount < MAX_RETRIES) {
          try {
            const validationResult = await this.validateToken();
            if (validationResult.valid) {
              return this.loadSQLSchemas(retryCount + 1);
            }

            const refreshResponse = await fetch('/api/auth/refresh', {
              method: 'POST',
              credentials: 'include'
            });

            if (refreshResponse.ok) {
              const refreshData = await refreshResponse.json();
              if (refreshData.success && refreshData.accessToken) {
                TokenUtils.storeToken(refreshData.accessToken);
                this.token = refreshData.accessToken;

                if (refreshData.user) {
                  this.user = refreshData.user;
                  this.isAuthenticated = true;
                  this.isPremium = !!refreshData.user.isPremium;
                  this.isAdmin = !!refreshData.user.isAdmin;
                  this.persistData();
                }

                return this.loadSQLSchemas(retryCount + 1);
              }
            }

            return { success: false, error: 'Échec du rafraîchissement du token' };
          } catch (refreshError) {
            return { success: false, error: 'Erreur lors du rafraîchissement du token' };
          }
        }

        if (!response.ok) {
          console.error(`[STORE] Erreur lors du chargement des schémas: ${response.status}`);
          return { success: false, error: `Erreur HTTP ${response.status}` };
        }

        const data = await response.json();
        if (data && data.schemas) {
          this.sqlSchemas = data.schemas;
        }
        return data;
      } catch (err) {
        console.error('[STORE] Erreur lors du chargement des schémas:', err);
        return { success: false, error: err instanceof Error ? err.message : 'Erreur inconnue' };
      }
    },

    async loadSnippets(retryCount = 0) {
      const MAX_RETRIES = 2;

      try {
        const token = TokenUtils.retrieveToken();
        if (!token) {
          return { success: false, error: 'Authentification requise' };
        }


        const response = await fetch('/api/snippets/loadSnippets', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });

        if (response.status === 401 && retryCount < MAX_RETRIES) {
          try {
            const validationResult = await this.validateToken();
            if (validationResult.valid) {
              return this.loadSnippets(retryCount + 1);
            }

            const refreshResponse = await fetch('/api/auth/refresh', {
              method: 'POST',
              credentials: 'include'
            });

            if (refreshResponse.ok) {
              const refreshData = await refreshResponse.json();
              if (refreshData.success && refreshData.accessToken) {
                TokenUtils.storeToken(refreshData.accessToken);
                this.token = refreshData.accessToken;

                if (refreshData.user) {
                  this.user = refreshData.user;
                  this.isAuthenticated = true;
                  this.isPremium = !!refreshData.user.isPremium;
                  this.isAdmin = !!refreshData.user.isAdmin;
                  this.persistData();
                }

                return this.loadSnippets(retryCount + 1);
              }
            }

            return { success: false, error: 'Échec du rafraîchissement du token' };
          } catch (refreshError) {
            return { success: false, error: 'Erreur lors du rafraîchissement du token' };
          }
        }

        if (!response.ok) {
          console.error(`[STORE] Erreur lors du chargement des snippets: ${response.status}`);
          return { success: false, error: `Erreur HTTP ${response.status}` };
        }

        const data = await response.json();

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

    markFavoriteSnippets() {
      const favoriteIds = this.favoritesSnippets.map(fav => fav.snippet_id);

      this.worldSnippets.forEach(snippet => {
        snippet.isFavorite = favoriteIds.includes(snippet.id);
      });
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
        if (!this.token) {
          console.warn('Aucun token disponible pour getMonitoringData');
          return;
        }

        const response = await fetch('/api/monitoring/system', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            console.warn('Session expirée ou non autorisée pour les données de monitoring');
            return;
          }
          throw new Error(`Erreur ${response.status} lors de la récupération des données système`);
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

    async auditSEO(url: string): Promise<any> {
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


        const initialResponse = await fetch('/api/analyze/website-analyzer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.token}`
          },
          body: JSON.stringify({
            url
          })
        });

        if (!initialResponse.ok) {
          const errorData = await initialResponse.json().catch(() => ({}));
          throw new Error(`Erreur ${initialResponse.status}: ${errorData.message || initialResponse.statusText}`);
        }

        const initialData = await initialResponse.json();
        const urlsToAnalyze = initialData.visitedURLs || [url];

        const allResults = await Promise.all(
          urlsToAnalyze.map(async (pageUrl: string) => {
            try {
              const response = await fetch('/api/analyze/website-analyzer', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${this.token}`
                },
                body: JSON.stringify({
                  url: pageUrl,
                })
              });

              if (!response.ok) {
                console.error(`Erreur lors de l'analyse de ${pageUrl}:`, response.status);
                return null;
              }

              const data = await response.json();
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
            return;
          }

          const pageData = result.data.seoResults[result.url];
          if (!pageData) {
            return;
          }

          mergedData.seoResults[result.url] = pageData;

          totalLoadTime += pageData.loadTime || 0;
          totalFCP += pageData.coreWebVitals?.FCP || 0;
          totalLCP += pageData.coreWebVitals?.LCP || 0;
          totalTTFB += pageData.coreWebVitals?.TTFB || 0;

          if (!pageData.title) {
            mergedData.summary.missingTitles++;
          }
          if (!pageData.description) {
            mergedData.summary.missingDescriptions++;
          }
          if (pageData.imageAlt?.some(img => !img.alt)) {
            const missingAltCount = pageData.imageAlt.filter(img => !img.alt).length;
            mergedData.summary.missingAltTags += missingAltCount;
          }

          if (pageData.structuredData?.length > 0) {
            mergedData.summary.pagesWithStructuredData++;
          }
          if ((pageData.socialTags?.ogTags?.length > 0) ||
            (pageData.socialTags?.twitterTags?.length > 0)) {
            mergedData.summary.pagesWithSocialTags++;
          }
          if (pageData.mobileCompatibility?.hasViewport) {
            mergedData.summary.mobileCompatiblePages++;
          }
          if (pageData.securityChecks?.https) {
            mergedData.summary.securePages++;
          }

          const warningsCount = pageData.warnings?.length || 0;
          mergedData.summary.totalWarnings += warningsCount;
        });

        const validResultsCount = validResults.length || 1;

        mergedData.summary.averageLoadTime = totalLoadTime / validResultsCount;
        mergedData.summary.averageFCP = totalFCP / validResultsCount;
        mergedData.summary.averageLCP = totalLCP / validResultsCount;
        mergedData.summary.averageTTFB = totalTTFB / validResultsCount;

        mergedData.summary.pagesWithStructuredData = (mergedData.summary.pagesWithStructuredData / validResultsCount) * 100;
        mergedData.summary.pagesWithSocialTags = (mergedData.summary.pagesWithSocialTags / validResultsCount) * 100;
        mergedData.summary.mobileCompatiblePages = (mergedData.summary.mobileCompatiblePages / validResultsCount) * 100;
        mergedData.summary.securePages = (mergedData.summary.securePages / validResultsCount) * 100;


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
      if (!response) {
        throw new Error('Réponse vide de l\'analyseur');
      }

      if (typeof response !== 'object') {
        throw new Error('La réponse de l\'analyseur n\'est pas un objet valide');
      }

      if (response.seoResults) {
        Object.keys(response.seoResults).forEach(pageUrl => {
          const result = response.seoResults[pageUrl];
          if (!result.technicalSEO) {
            result.technicalSEO = {
              sitemapFound: false,
              robotsTxtFound: false,
              schemaTypeCount: {}
            };
          }
        });
      }

      const issues = response.issues || [];
      const criticalIssues = issues.filter(issue => issue.severity === 'critical').length;
      const highIssues = issues.filter(issue => issue.severity === 'high').length;
      const mediumIssues = issues.filter(issue => issue.severity === 'medium').length;
      const lowIssues = issues.filter(issue => issue.severity === 'low').length;

      // Calculer les scores moyens de sécurité et d'engagement
      let totalSecurityScore = 0;
      let pagesWithSecurityScore = 0;
      let totalEngagementScore = 0;
      let pagesWithEngagementScore = 0;

      if (response.seoResults) {
        Object.values(response.seoResults).forEach((result: any) => {
          if (result.securityChecks && result.securityChecks.securityScore !== undefined) {
            totalSecurityScore += Number(result.securityChecks.securityScore);
            pagesWithSecurityScore++;
          }

          if (result.engagement && result.engagement.engagementScore !== undefined) {
            totalEngagementScore += Number(result.engagement.engagementScore);
            pagesWithEngagementScore++;
          }
        });
      }

      const securityScore = pagesWithSecurityScore > 0 ? Math.round(totalSecurityScore / pagesWithSecurityScore) : 0;
      const engagementScore = pagesWithEngagementScore > 0 ? Math.round(totalEngagementScore / pagesWithEngagementScore) : 0;

      return {
        seoResults: response.seoResults || {},
        summary: {
          ...(response.summary || {
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
          }),
          totalIssues: issues.length,
          criticalIssues,
          highIssues,
          mediumIssues,
          lowIssues,
          securityScore,
          engagementScore,
          resourceIssues: {
            css: response.resources?.css?.recommendations?.length || 0,
            js: response.resources?.js?.recommendations?.length || 0,
            images: response.resources?.images?.recommendations?.length || 0
          }
        },
        visitedURLs: response.visitedURLs || [],
        urlMap: response.urlMap || {},
        generatedSitemap: response.generatedSitemap || '',
        rankedUrls: response.rankedUrls || [],
        issues: issues,
        framework: response.framework || {},
        hosting: response.hosting || {},
        domainProvider: response.domainProvider || {},
      };
    },

    async generateSitemap(targetUrl: string, report: string) {
      try {
        const response = await fetch('/api/sitemap.ts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          },
          body: JSON.stringify({ targetUrl, report })
        });

        return response;
      } catch (err: any) {
        console.error(err.message, err.stack);
      }
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

    async loadStudioComponents() {
      try {
        const response = await fetch('/api/studio/getComponent', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.token}`
          },
        });

        if (!response.ok) {
          throw new Error('Erreur lors du chargement des composants');
        }

        const data = await response.json();
        if (data.success) {
          this.studioComponents = data.components;
        } else {
          console.error('[STORE] Erreur lors du chargement des composants:', data.error);
        }
      } catch (error) {
        console.error('[STORE] Erreur lors du chargement des composants:', error);
        throw error;
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

    async updatePremiumStatus() {
      try {
        if (!this.user) {
          return { success: false, error: 'user not found' };
        }

        const userId = this.user.id || this.user.userId;

        if (!userId) {
          console.error('ID utilisateur manquant pour la mise à jour du statut premium');
          return { success: false, error: 'ID utilisateur manquant' };
        }

        console.log('Mise à jour du statut premium pour l\'utilisateur:', userId);

        const response = await fetch('/api/user/premium-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          },
          body: JSON.stringify({ userId })
        });

        if (!response.ok) {
          return { success: false, error: `Erreur serveur: ${response.status}` };
        }

        const data = await response.json();

        if (data.success) {
          if (this.user) {
            this.user.isPremium = true;
            this.isPremium = true;
            this.persistData();
          }

          return { success: true, isPremium: true, requireRelogin: true };
        } else {
          console.error('Échec mise à jour premium:', data.error);
          return { success: false, error: data.error };
        }
      } catch (error) {
        console.error('Exception lors de la mise à jour du statut premium:', error);
        return { success: false, error: 'Erreur technique' };
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
          return { isAuthenticated: false };
        }

        this.token = token;

        const result = await this.loadData();

        if (!result || !result.success) {
          return { isAuthenticated: false };
        }

        this.isAuthenticated = true;
        return { isAuthenticated: true, user: this.user };
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
        return { isAuthenticated: false, error };
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
    },

    async submitFormContact(formData: any) {
      try {
        const response = await $fetch('/api/contact/submit', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.token}`
          },
          body: formData
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
        console.error('Erreur lors de la soumission du formulaire de contact:', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Erreur inconnue lors de la soumission du formulaire de contact'
        };
      }
    },
  },

  persist: {
    enabled: true
  } as PersistenceOptions
});
