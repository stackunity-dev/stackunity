import { $fetch } from 'ofetch';
import { defineStore } from 'pinia';
import type { PersistenceOptions } from 'pinia-plugin-persistedstate';
import { TokenUtils } from '../utils/token';
import { CrawlReport, DeleteResponse, EmailHistoryItem, LoginResponse, RandomData, SEOAuditResult, SQLSchema, StudioComponent, Table, User, WebsiteData } from './types';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
    sqlSchemas: [] as SQLSchema[],
    studioComponents: [] as StudioComponent[],
    emailHistory: [] as EmailHistoryItem[],
    randomData: null as RandomData | null,
    websiteData: null as WebsiteData | null,
    isAuthenticated: false,
    loading: false,
    error: null,
    seoData: null as CrawlReport | SEOAuditResult | null,
    seoError: '',
    isSeoLoading: false,
    isPremium: false,
    isStandard: false,
    isAdmin: false,
    isBuying: false,
    subscription_status: 'none' as 'active' | 'trial' | 'expired' | 'none',
    payment_status: 'none' as 'paid' | 'pending' | 'none',
    trial_end_date: null as Date | null,
    daysLeft: 0
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

          let isStandardValue = false;
          if (parsedData.user?.isStandard !== undefined) {
            isStandardValue = parsedData.user.isStandard === true ||
              (typeof parsedData.user.isStandard === 'number' && parsedData.user.isStandard === 1) ||
              (typeof parsedData.user.isStandard === 'string' && (parsedData.user.isStandard === '1' || parsedData.user.isStandard === 'true'));
          }

          let isAdminValue = false;
          if (parsedData.user?.isAdmin !== undefined) {
            isAdminValue = parsedData.user.isAdmin === true ||
              (typeof parsedData.user.isAdmin === 'number' && parsedData.user.isAdmin === 1) ||
              (typeof parsedData.user.isAdmin === 'string' && (parsedData.user.isAdmin === '1' || parsedData.user.isAdmin === 'true'));
          }

          const subscription_status = parsedData.user?.subscription_status || 'none';
          const payment_status = parsedData.user?.payment_status || 'none';
          const trial_end_date = parsedData.user?.trial_end_date ? new Date(parsedData.user.trial_end_date) : null;
          const daysLeft = parsedData.user?.daysLeft || 0;

          this.user = {
            ...parsedData.user,
            isPremium: isPremiumValue,
            isStandard: isStandardValue,
            isAdmin: isAdminValue,
            subscription_status,
            payment_status,
            trial_end_date,
            daysLeft
          };
          this.isAuthenticated = true;
          this.isPremium = isPremiumValue;
          this.isStandard = isStandardValue;
          this.isAdmin = isAdminValue;
          this.subscription_status = subscription_status;
          this.payment_status = payment_status;
          this.trial_end_date = trial_end_date;
          this.daysLeft = daysLeft;
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

          let isStandardValue = false;
          if (decodedData.isStandard !== undefined) {
            isStandardValue = decodedData.isStandard === true ||
              (typeof decodedData.isStandard === 'number' && decodedData.isStandard === 1) ||
              (typeof decodedData.isStandard === 'string' && (decodedData.isStandard === '1' || decodedData.isStandard === 'true'));
          }

          let isAdminValue = false;
          if (decodedData.isAdmin !== undefined) {
            isAdminValue = decodedData.isAdmin === true ||
              (typeof decodedData.isAdmin === 'number' && decodedData.isAdmin === 1) ||
              (typeof decodedData.isAdmin === 'string' && (decodedData.isAdmin === '1' || decodedData.isAdmin === 'true'));
          }

          this.isPremium = isPremiumValue;
          this.isStandard = isStandardValue;
          this.isAdmin = isAdminValue;

          if (!this.user) {
            this.user = {
              id: decodedData.userId,
              userId: decodedData.userId,
              username: decodedData.username || '',
              email: decodedData.email || '',
              isPremium: isPremiumValue,
              isStandard: isStandardValue,
              isAdmin: isAdminValue
            };
            this.user.userId = this.user.id;
          } else {
            this.user.isPremium = isPremiumValue;
            this.user.isStandard = isStandardValue;
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

        let isStandardValue = false;
        if (this.user?.isStandard !== undefined) {
          isStandardValue = this.user.isStandard === true ||
            (typeof this.user.isStandard === 'number' && this.user.isStandard === 1);
        }

        const userData = {
          user: {
            id: this.user?.id || 0,
            userId: this.user?.id || 0,
            username: this.user?.username || '',
            email: this.user?.email || '',
            isAdmin: isAdminValue,
            isPremium: isPremiumValue,
            isStandard: isStandardValue,
            isBuying: this.user?.isBuying || false
          },
          isAuthenticated: this.isAuthenticated
        };

        localStorage.setItem('user_data', JSON.stringify(userData));
      } catch (error) {
        console.warn('Impossible de persister les données utilisateur:', error);
      }
    },

    restoreUserData() {
      const response = localStorage.getItem('user_data');
      if (response) {
        try {
          const userData = JSON.parse(response);

          let isPremiumValue = false;
          if (userData.user?.isPremium !== undefined) {
            isPremiumValue = userData.user.isPremium === true ||
              (typeof userData.user.isPremium === 'number' && userData.user.isPremium === 1) ||
              (typeof userData.user.isPremium === 'string' && (userData.user.isPremium === '1' || userData.user.isPremium === 'true'));
          }

          let isStandardValue = false;
          if (userData.user?.isStandard !== undefined) {
            isStandardValue = userData.user.isStandard === true ||
              (typeof userData.user.isStandard === 'number' && userData.user.isStandard === 1) ||
              (typeof userData.user.isStandard === 'string' && (userData.user.isStandard === '1' || userData.user.isStandard === 'true'));
          }

          let isAdminValue = false;
          if (userData.user?.isAdmin !== undefined) {
            isAdminValue = userData.user.isAdmin === true ||
              (typeof userData.user.isAdmin === 'number' && userData.user.isAdmin === 1) ||
              (typeof userData.user.isAdmin === 'string' && (userData.user.isAdmin === '1' || userData.user.isAdmin === 'true'));
          }

          let isBuyingValue = false;
          if (userData.user?.isBuying !== undefined) {
            isBuyingValue = userData.user.isBuying === true ||
              (typeof userData.user.isBuying === 'number' && userData.user.isBuying === 1) ||
              (typeof userData.user.isBuying === 'string' && (userData.user.isBuying === '1' || userData.user.isBuying === 'true'));
          }

          const subscription_status = userData.user?.subscription_status || 'none';
          const payment_status = userData.user?.payment_status || 'none';
          const trial_end_date = userData.user?.trial_end_date ? new Date(userData.user.trial_end_date) : null;
          const daysLeft = userData.user?.daysLeft || 0;

          this.token = userData.token;
          this.user = {
            ...userData.user,
            isPremium: isPremiumValue,
            isStandard: isStandardValue,
            isAdmin: isAdminValue,
            isBuying: isBuyingValue,
            subscription_status,
            payment_status,
            trial_end_date,
            daysLeft
          };
          this.isAuthenticated = true;
          this.isPremium = isPremiumValue;
          this.isStandard = isStandardValue;
          this.isAdmin = isAdminValue;
          this.isBuying = isBuyingValue;
          this.subscription_status = subscription_status;
          this.payment_status = payment_status;
          this.trial_end_date = trial_end_date;
          this.daysLeft = daysLeft;
        } catch (error) {
          console.error('Erreur lors de la restauration des données utilisateur:', error);
        }
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
          const isStandardValue = data.user.isStandard === true || data.user.isStandard === 1;
          const isBuyingValue = data.user.isBuying === true || data.user.isBuying === 1;
          const subscription_status = data.user.subscription_status || 'none';
          const payment_status = data.user.payment_status || 'none';
          const trial_end_date = data.user.trial_end_date ? new Date(data.user.trial_end_date) : null;
          const daysLeft = data.user.daysLeft || 0;

          this.user = {
            ...data.user,
            isPremium: isPremiumValue,
            isStandard: isStandardValue,
            isAdmin: isAdminValue,
            isBuying: isBuyingValue,
            subscription_status,
            payment_status,
            trial_end_date,
            daysLeft
          };

          this.user.userId = this.user.id;


          this.isAuthenticated = true;
          this.isPremium = isPremiumValue;
          this.isAdmin = isAdminValue;
          this.isStandard = isStandardValue;
          this.isBuying = isBuyingValue;
          this.subscription_status = subscription_status;
          this.payment_status = payment_status;
          this.trial_end_date = trial_end_date;
          this.daysLeft = daysLeft;
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

          if (data.user.trial_end_date && !data.user.daysLeft) {
            const now = new Date();
            const trialEndDate = new Date(data.user.trial_end_date);
            if (trialEndDate > now) {
              const diffTime = trialEndDate.getTime() - now.getTime();
              data.user.daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            } else {
              data.user.daysLeft = 0;
            }
          }

          this.user = {
            ...data.user,
            isPremium: data.user.isPremium === true || data.user.isPremium === 1,
            isStandard: data.user.isStandard === true || data.user.isStandard === 1,
            isAdmin: data.user.isAdmin === true || data.user.isAdmin === 1,
            subscription_status: data.user.subscription_status || 'trial',
            daysLeft: data.user.daysLeft || 7
          };

          this.isAuthenticated = true;
          this.isPremium = this.user.isPremium;
          this.isAdmin = this.user.isAdmin;
          this.isStandard = this.user.isStandard;
          this.subscription_status = this.user.subscription_status;
          this.daysLeft = this.user.daysLeft;
          this.trial_end_date = data.user.trial_end_date ? new Date(data.user.trial_end_date) : null;

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

            let isStandardValue = false;
            if (data.user.isStandard !== undefined) {
              isStandardValue = data.user.isStandard === true ||
                (typeof data.user.isStandard === 'number' && data.user.isStandard === 1) ||
                (typeof data.user.isStandard === 'string' && (data.user.isStandard === '1' || data.user.isStandard === 'true'));
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
                isStandard: isStandardValue,
                isAdmin: isAdminValue
              };
            } else {
              this.user.id = userId;
              this.user.userId = userId;
              this.user.username = data.user.username || this.user.username;
              this.user.email = data.user.email || this.user.email;
              this.user.isPremium = isPremiumValue;
              this.user.isStandard = isStandardValue;
              this.user.isAdmin = isAdminValue;
            }

            this.isPremium = isPremiumValue;
            this.isAdmin = isAdminValue;
            this.isStandard = isStandardValue;

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
            const isStandardValue = validationData.user.isStandard === 1 || validationData.user.isStandard === true;
            this.user = {
              ...validationData.user,
              isPremium: isPremiumValue,
              isStandard: isStandardValue,
              isAdmin: isAdminValue
            };

            this.isAuthenticated = true;
            this.isPremium = isPremiumValue;
            this.isStandard = isStandardValue;
            this.isAdmin = isAdminValue;
            this.error = null;
            this.token = token;

            this.persistData();
            return { success: true, user: this.user };
          }
        }

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

          let isStandardValue = false;
          if (sessionData.user?.isStandard !== undefined) {
            isStandardValue = sessionData.user.isStandard === true ||
              (typeof sessionData.user.isStandard === 'number' && sessionData.user.isStandard === 1) ||
              (typeof sessionData.user.isStandard === 'string' && (sessionData.user.isStandard === '1' || sessionData.user.isStandard === 'true'));
          }

          const isAdminValue = typeof sessionData.user.isAdmin === 'number'
            ? sessionData.user.isAdmin === 1
            : !!sessionData.user.isAdmin;

          this.user = {
            ...sessionData.user,
            isPremium: isPremiumValue,
            isStandard: isStandardValue,
            isAdmin: isAdminValue
          };

          this.isAuthenticated = true;
          this.isPremium = isPremiumValue;
          this.isStandard = isStandardValue;
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

    async updatePremiumStatus(selectedPlan: string) {
      try {
        if (!this.user) {
          return { success: false, error: 'user not found' };
        }

        const userId = this.user.id || this.user.userId;

        if (!userId) {
          console.error('User ID missing for premium status update');
          return { success: false, error: 'User ID missing' };
        }

        const response = await fetch('/api/user/premium-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          },
          body: JSON.stringify({ userId, selectedPlan })
        });

        if (!response.ok) {
          return { success: false, error: `Server error: ${response.status}` };
        }

        const data = await response.json();

        if (data.success) {
          if (this.user) {
            if (selectedPlan === 'premium') {
              this.user.isPremium = true;
              this.user.isStandard = false;
              this.isPremium = true;
              this.isStandard = false;
            } else if (selectedPlan === 'standard') {
              this.user.isPremium = false;
              this.user.isStandard = true;
              this.isPremium = false;
              this.isStandard = true;
            }

            if (data.subscription_status) {
              this.user.subscription_status = data.subscription_status;
              this.subscription_status = data.subscription_status;
            }

            if (data.payment_status) {
              this.user.payment_status = data.payment_status;
              this.payment_status = data.payment_status;
            }

            if (data.trial_end_date) {
              this.user.trial_end_date = new Date(data.trial_end_date);
              this.trial_end_date = new Date(data.trial_end_date);
            }

            if (data.daysLeft !== undefined) {
              this.user.daysLeft = data.daysLeft;
              this.daysLeft = data.daysLeft;
            }

            this.persistData();
          }

          return {
            success: true,
            isPremium: selectedPlan === 'premium',
            isStandard: selectedPlan === 'standard',
            subscription_status: data.subscription_status,
            requireRelogin: true
          };
        } else {
          console.error('Premium update failed:', data.error);
          return { success: false, error: data.error };
        }
      } catch (error) {
        console.error('Exception during premium status update:', error);
        return { success: false, error: 'Technical error' };
      }
    },

    async checkout(cardholderName: string, countryCode: string = 'FR', isBusinessCustomer: boolean = false, vatNumber: string = '', promoCode: string = '', selectedPlan: string = ''): Promise<{
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
        discountAmount?: number;
        discountDescription?: string;
        discountedBaseAmount?: number;
        selectedPlan?: string;
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
            vat_number: vatNumber,
            promo_code: promoCode,
            selected_plan: selectedPlan,
            user_id: this.user.userId,
            email: this.user.email,
            name: this.user.username
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
                discountAmount?: number;
                discountDescription?: string;
                discountedBaseAmount?: number;
                selectedPlan?: string;
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
      isVatExempt: boolean,
      selectedPlan: string
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
            selectedPlan,
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
          error: 'Invalid server response'
        };
      } catch (error) {
        console.error('Error generating invoice:', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error generating invoice'
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

    async insertWebsiteData(name: string, url: string, analyzisUrls: string[], sitemapContent: string) {
      try {
        const userId = this.user.userId;
        const response = await $fetch('/api/website/insert-website-data', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.token}`
          },
          body: {
            name,
            url,
            analyzisUrls,
            sitemapContent,
            userId
          }
        });

        return response;
      } catch (error) {
        console.error('Erreur lors de la mise à jour des données du site web:', error);
        return null;
      }
    },

    async loadWebsiteData() {
      try {
        const response = await $fetch('/api/website/load-website-data', {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        });

        if (response && typeof response === 'object' && 'success' in response) {
          this.websiteData = response.data[0] as WebsiteData;
          return {
            success: response.success as boolean,
            data: response.data[0] as WebsiteData
          };
        }

        return { success: false, error: 'Invalid server response' };
      } catch (error) {
        console.error('Erreur lors de la récupération des données du site web:', error);
        return null;
      }
    },

    async submitFeedback(feedback: any) {
      try {
        const response = await $fetch('/api/feedback/submit', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.token}`
          },
          body: feedback
        });

        return response;
      } catch (error) {
        console.error('Erreur lors de la soumission du feedback:', error);
        return null;
      }
    }
  },
  persist: {
    enabled: true
  } as PersistenceOptions
});
