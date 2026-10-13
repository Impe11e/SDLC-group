export const authService = {
  async login(email: string, password: string): Promise<void> {
    console.log('login', email, password.length);
  },

  async register(nickname: string, email: string, password: string): Promise<void> {
    console.log('register', nickname, email, password.length);
  },
};