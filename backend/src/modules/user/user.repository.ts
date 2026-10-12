export interface UserProfile {
  id: number;
  nickname: string;
  email: string;
}

export interface IUserRepository {
  findById(id: number): Promise<UserProfile | null>;
  updateNickname(id: number, nickname: string): Promise<UserProfile | null>;
}

export class InMemoryUserRepository implements IUserRepository {
  private users: UserProfile[] = [{ id: 1, nickname: 'test', email: 'test@example.com' }];

  async findById(id: number): Promise<UserProfile | null> {
    return this.users.find((u) => u.id === id) ?? null;
  }

  async updateNickname(id: number, nickname: string): Promise<UserProfile | null> {
    const user = await this.findById(id);
    if (user) user.nickname = nickname;
    return user;
  }
}