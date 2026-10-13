export interface User {
  id: number;
  nickname: string;
  email: string;
  passwordHash: string;
}

export interface IAuthRepository {
  findByEmail(email: string): Promise<User | null>;
  create(nickname: string, email: string, passwordHash: string): Promise<User>;
}

export class InMemoryAuthRepository implements IAuthRepository {
  private users: User[] = [];

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((u) => u.email === email) ?? null;
  }

  async create(nickname: string, email: string, passwordHash: string): Promise<User> {
    const user = { id: this.users.length + 1, nickname, email, passwordHash };
    this.users.push(user);
    return user;
  }
}