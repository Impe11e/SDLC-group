import { Router } from 'express';
import { AuthService } from './auth.service.js';
import { InMemoryAuthRepository } from './auth.repository.js';
import { validateLogin, validateRegister } from './auth.schema.js';

const authService = new AuthService(new InMemoryAuthRepository());

export const authRouter = Router();

authRouter.post('/register', async (req, res) => {
  const error = validateRegister(req.body);
  if (error) {
    res.status(400).json({ error });
    return;
  }
  try {
    const { nickname, email, password } = req.body;
    const user = await authService.register(nickname, email, password);
    res.status(201).json({ id: user.id, nickname: user.nickname, email: user.email });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

authRouter.post('/login', async (req, res) => {
  const error = validateLogin(req.body);
  if (error) {
    res.status(400).json({ error });
    return;
  }
  try {
    const { email, password } = req.body;
    const token = await authService.login(email, password);
    res.json({ token });
  } catch (err) {
    res.status(401).json({ error: (err as Error).message });
  }
});