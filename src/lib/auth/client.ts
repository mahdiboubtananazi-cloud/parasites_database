class AuthClient {
    async signOut(): Promise<{ error?: string }> {
      // Simulate sign out
      localStorage.removeItem('token');
      return {};
    }
  }
  
  export const authClient = new AuthClient();