import { useNuxtApp } from 'nuxt/app';
import { defineStore } from 'pinia';
import type { CrawlReport, SEOAuditResult } from '../server/api/seo-audit';
import { TokenManager } from '../server/utils/TokenManager';

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

export const useUserStore = defineStore('user', {
  state: () => ({
    user: {
      id: 0,
      username: '',
      email: '',
      isAdmin: false,
      isPremium: false,
      company: '',
      website: '',
      bio: ''
    } as User | null,
    token: '' as string | null,
    systemData: {
      cpu: {
        usage: 0,
        cores: [] as number[],
        speed: 0
      },
      memory: {
        total: 0,
        used: 0,
        free: 0,
        swapUsed: 0,
        swapTotal: 0
      },
      disks: [] as DiskData[]
    } as SystemData,
    personalSnippets: [] as BaseSnippet[],
    worldSnippets: [] as BaseSnippet[],
    favoritesSnippets: [] as FavoriteSnippet[],
    sqlSchemas: [] as SQLSchema[],
    studioComponents: [] as StudioComponent[],
    emailHistory: [] as EmailHistoryItem[],
    isAuthenticated: false,
    authError: '',
    seoData: null as CrawlReport | SEOAuditResult | null,
    seoError: '',
    isSeoLoading: false,
  }),

  persist: false,

  getters: {
    isUserAuthenticated(): boolean {
      return this.isAuthenticated && !!this.token;
    },

    getAuthHeader(): { Authorization: string } {
      const token = TokenManager.retrieveToken();
      return { Authorization: `Bearer ${token || ''}` };
    }
  },

  actions: {
    initializeStore() {
      const nuxtApp = useNuxtApp();
      if (!nuxtApp.ssrContext) {
        this.restoreUserData();
        const token = TokenManager.retrieveToken();
        if (token) {
          this.token = token;
          this.isAuthenticated = true;

          this.loadData().then(result => {
            if (!result.success) {
              console.error('Erreur lors du chargement des données:', result.error);
              this.logout();
            }
          }).catch(err => {
            console.error('Erreur lors du chargement des données:', err);
            this.logout();
          });
        } else {
          this.logout();
        }
      }
    },

    async logout() {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          credentials: 'include' // Important pour envoyer le cookie HttpOnly
        });

        this.user = null;
        this.isAuthenticated = false;
        this.token = null;
        this.authError = '';

        // Supprimer le token du localStorage
        TokenManager.removeToken();

        return { success: true };
      } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
        return { success: false, error: 'Erreur lors de la déconnexion' };
      }
    },

    formatDate(dateString: string): string {
      const date = new Date(dateString);
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' } as const;
      return date.toLocaleDateString('fr-FR', options);
    },

    setToken(newToken: string): void {
      if (!newToken) {
        console.error('Tentative de définir un token vide');
        return;
      }

      this.token = newToken;
      this.isAuthenticated = true;

      // Stocker le token dans localStorage
      TokenManager.storeToken(newToken);
    },

    persistUserData() {
      try {
        const userData = {
          user: {
            id: this.user?.id || 0,
            username: this.user?.username || '',
            email: this.user?.email || '',
            isAdmin: this.user?.isAdmin || false,
            isPremium: this.user?.isPremium || false
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
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password }),
          credentials: 'include' // Important pour recevoir le cookie HttpOnly
        });

        if (!response.ok) {
          throw new Error('Identifiants invalides');
        }

        const data = await response.json();

        if (!data.success || !data.accessToken || !data.user) {
          console.error('Format de réponse invalide:', data);
          throw new Error('Format de réponse invalide');
        }

        this.setToken(data.accessToken);
        this.user = {
          id: data.user.id || 0,
          username: data.user.username || '',
          email: data.user.email || '',
          isAdmin: Boolean(data.user.isAdmin),
          isPremium: Boolean(data.user.isPremium),
          company: data.user.company || '',
          website: data.user.website || '',
          bio: data.user.bio || ''
        };
        this.isAuthenticated = true;
        this.authError = '';

        return { success: true, user: this.user };
      } catch (error) {
        this.authError = 'Identifiants invalides';
        console.error('Erreur de connexion:', error);
        return { success: false, error: this.authError };
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
      try {
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, email, password }),
          credentials: 'include' // Important pour recevoir les cookies HttpOnly
        });

        if (!response.ok) {
          throw new Error('Erreur lors de l\'inscription');
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Erreur lors de l\'inscription');
        }

        // Utiliser le nom de propriété accessToken qui est maintenant renvoyé par l'API
        const authToken = data.accessToken;

        if (!authToken) {
          throw new Error('Token d\'authentification manquant dans la réponse');
        }

        this.setToken(authToken);
        this.user = {
          id: data.user.id || 0,
          username: data.user.username,
          email: data.user.email,
          isAdmin: data.user.isAdmin || false,
          isPremium: data.user.isPremium || false,
          company: data.user.company || '',
          website: data.user.website || '',
          bio: data.user.bio || ''
        };
        this.isAuthenticated = true;
        this.authError = '';
        this.persistUserData();

        return { success: true, user: this.user };
      } catch (error) {
        this.authError = error instanceof Error ? error.message : 'Erreur lors de l\'inscription';
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

        const response: any = await $fetch('/api/sql/saveSQLSchema', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.token}`,
          },
          body: schemaData
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
        const response = await fetch('/api/user/loadData', {
          headers: this.getAuthHeader
        });

        if (!response.ok) {
          throw new Error('Erreur lors du chargement des données');
        }

        const data = await response.json();
        console.log('Réponse de loadData:', data);

        if (!data || !data.data || !data.data.userData || !Array.isArray(data.data.userData) || data.data.userData.length === 0) {
          console.error('Données utilisateur invalides:', data);
          throw new Error('Format de données utilisateur invalide');
        }

        const userData = data.data.userData[0];
        this.user = {
          id: userData?.id || 0,
          username: userData?.username || '',
          email: userData?.email || '',
          isAdmin: Boolean(userData?.isAdmin),
          isPremium: Boolean(userData?.isPremium),
          company: userData?.company || '',
          website: userData?.website || '',
          bio: userData?.bio || ''
        };
        console.log('Données utilisateur chargées:', this.user);
        console.log('Statut premium:', this.user.isPremium ? 'PREMIUM' : 'NON PREMIUM');

        if (Array.isArray(data.data.studioComponents)) {
          this.studioComponents = data.data.studioComponents;
          console.log(`${this.studioComponents.length} composants studio chargés`);
        } else {
          this.studioComponents = [];
          console.log('Aucun composant studio trouvé');
        }

        console.log('Chargement des données terminé avec succès');
        return { success: true, user: this.user };
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' };
      }
    },

    async loadSnippets() {
      try {
        const response: any = await $fetch('/api/snippets/loadSnippets', {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        });

        console.log('Résultat du chargement des snippets:', response);

        if (response.success) {
          this.personalSnippets = response.data.personalSnippets;
          this.worldSnippets = response.data.worldSnippets;
          this.favoritesSnippets = response.data.favoritesSnippets;

          this.markFavoriteSnippets();
        }

        return response;
      } catch (err: any) {
        console.error('Erreur lors du chargement des snippets:', err.message, err.stack);
        return null;
      }
    },

    markFavoriteSnippets() {
      const favoriteIds = this.favoritesSnippets.map(fav => fav.snippet_id);

      this.worldSnippets.forEach(snippet => {
        snippet.isFavorite = favoriteIds.includes(snippet.id);
      });
    },

    async loadSQLSchemas() {
      try {
        const response: any = await $fetch('/api/sql/loadSQLSchemas', {
          headers: { Authorization: `Bearer ${this.token}` }
        });

        console.log(response.schemas)
        this.sqlSchemas = response.schemas;
      } catch (err) {
        console.error('Erreur lors du chargement des schémas:', err);
        throw err;
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
        const username = this.user?.username || '';
        const date = new Date().toISOString().slice(0, 10);
        const imageUrl = await this.uploadImage(file);
        const response: any = await $fetch('/api/snippets/addSnippets', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.token}`,
          },
          body: { username, date, title, description, framework, img: imageUrl, publishWorld, publishPersonal }
        });

        console.table(response.data);
      }
      catch (err: any) {
        console.error(err.message, err.stack);
      }
    },

    async updateSnippet(id: number, code: string, type: 'world' | 'personal') {
      try {
        const response: any = await $fetch('/api/snippets/updateSnippet', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.token}`,
          },
          body: { id, code, type }
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
        const response: any = await $fetch('/api/snippets/deleteSnippet', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.token}`,
          },
          body: { id, type }
        });

        console.table(response);

        await this.loadData();
      }
      catch (err: any) {
        console.error(err.message, err.stack)
      }
    },

    async deleteSQLSchema(databaseId: number) {
      try {
        const response = await $fetch<DeleteResponse>(`/api/sql/${databaseId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${this.token}`,
          }
        });

        if (response.success) {
          this.sqlSchemas = this.sqlSchemas.filter(schema => schema.id !== databaseId);
        } else {
          throw new Error(response.error || 'Erreur lors de la suppression');
        }

        return response;
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
          this.systemData = data.data;
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données système:', error);
        throw error;
      }
    },

    async auditSEO(url: string) {
      try {
        this.isSeoLoading = true;
        this.seoError = '';
        this.seoData = null;

        const token = TokenManager.retrieveToken();
        console.log('Token disponible pour auditSEO:', !!token);

        // Créer les headers avec le token
        const headers: HeadersInit = {
          'Content-Type': 'application/json'
        };

        // Ajouter le header d'authorization si un token est disponible
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch('/api/seo-audit', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            url,
            options: {
              maxDepth: 2,
              sameDomainOnly: true,
              timeout: 30000
            }
          })
        });

        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        this.seoData = data;
        console.log('Données d\'audit SEO reçues:', data);
        return data;
      } catch (err) {
        this.seoError = err instanceof Error ? err.message : 'An error occurred';
        console.error('Erreur lors de l\'audit SEO:', err);
        throw err;
      } finally {
        this.isSeoLoading = false;
      }
    },

    async saveTemplate(templateName: string, templateData: any, componentType: string) {
      try {
        const response = await fetch('/api/studio/saveTemplate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          },
          body: JSON.stringify({ templateName, templateData, componentType })
        });

        return response;
      } catch (err: any) {
        console.error(err.message, err.stack);
      }
    },

    async removeTemplate(templateId: number) {
      try {
        const response = await fetch(`/api/studio/removeTemplate/${templateId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${this.token}`
          },
          body: JSON.stringify({ templateId: templateId })
        });

        return response;
      } catch (err: any) {
        console.error(err.message, err.stack);
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

    async addFavorite(snippetId: number, type: 'world' | 'personal') {
      try {
        const response = await fetch('/api/snippets/addFavorite', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          },
          body: JSON.stringify({ snippetId, type })
        });

        return response;
      } catch (err: any) {
        console.error('Erreur lors de l\'ajout du favori:', err.message, err.stack);
        return null;
      }
    },

    async removeFavorite(snippetId: number) {
      try {
        const response = await fetch('/api/snippets/removeFavorite', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          },
          body: JSON.stringify({ snippetId })
        });

        return response;
      } catch (err: any) {
        console.error('Erreur lors de la suppression du favori:', err.message, err.stack);
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
    }
  },
});
