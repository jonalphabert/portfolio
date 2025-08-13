import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  user_id: string;
  username: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isSetupComplete: boolean;
  rememberedCredentials: { usernameOrEmail: string } | null;

  // Actions
  login: (usernameOrEmail: string, password: string, rememberMe: boolean) => Promise<boolean>;
  logout: () => void;
  setupAdmin: (username: string, email: string, password: string) => Promise<boolean>;
  checkSetup: () => boolean;
  getRememberedCredentials: () => { usernameOrEmail: string } | null;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isSetupComplete: false,
      rememberedCredentials: null,

      login: async (usernameOrEmail, password, rememberMe) => {
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ usernameOrEmail, password }),
          });

          const result = await response.json();

          if (!response.ok || result.error) {
            return false;
          }

          // Store JWT token
          localStorage.setItem('jwt-token', result.token);

          set({
            user: {
              user_id: result.user.id,
              username: result.user.username,
              email: result.user.email,
            },
            isAuthenticated: true,
            isSetupComplete: true
          });

          if (rememberMe) {
            localStorage.setItem('auth-remember', 'true');
            localStorage.setItem('remembered-credentials', JSON.stringify({ usernameOrEmail }));
            set({ rememberedCredentials: { usernameOrEmail } });
          } else {
            sessionStorage.setItem('auth-session', 'true');
            localStorage.removeItem('remembered-credentials');
            set({ rememberedCredentials: null });
          }

          return true;
        } catch (error) {
          return false;
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
        localStorage.removeItem('auth-remember');
        sessionStorage.removeItem('auth-session');
        localStorage.removeItem('jwt-token');
      },

      setupAdmin: async (username, email, password) => {
        try {
          const response = await fetch('/api/auth/setup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
          });

          const result = await response.json();

          if (!response.ok || result.error) {
            return false;
          }

          // Store admin setup data
          localStorage.setItem(
            'admin-setup',
            JSON.stringify({
              user_id: result.user.id,
              username: result.user.username,
              email: result.user.email,
            })
          );

          set({
            user: {
              user_id: result.user.id,
              username: result.user.username,
              email: result.user.email,
            },
            isAuthenticated: true,
            isSetupComplete: true,
          });

          return true;
        } catch (error) {
          return false;
        }
      },

      checkSetup: () => {
        const storedAdmin = localStorage.getItem('admin-setup');
        const isComplete = !!storedAdmin;

        if (isComplete) {
          set({ isSetupComplete: true });
        }

        return isComplete;
      },

      getRememberedCredentials: () => {
        const stored = localStorage.getItem('remembered-credentials');
        if (stored) {
          const credentials = JSON.parse(stored);
          set({ rememberedCredentials: credentials });
          return credentials;
        }
        return null;
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isSetupComplete: state.isSetupComplete,
        // Only persist user and auth if remember me was checked
        ...(localStorage.getItem('auth-remember') && {
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }),
    }
  )
);
