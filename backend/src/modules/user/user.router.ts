import { Router } from 'express';
import { UserService } from './user.service.js';
import { InMemoryUserRepository } from './user.repository.js';
import { validateUpdateName } from './user.schema.js';

const userService = new UserService(new InMemoryUserRepository());

export const userRouter = Router();

userRouter.get('/:id', async (req, res) => {
  try {
    res.json(await userService.getProfile(Number(req.params.id)));
  } catch (err) {
    res.status(404).json({ error: (err as Error).message });
  }
});

userRouter.patch('/:id', async (req, res) => {
  const error = validateUpdateName(req.body);
  if (error) {
    res.status(400).json({ error });
    return;
  }
  try {
    res.json(await userService.updateName(Number(req.params.id), req.body.nickname));
  } catch (err) {
    res.status(404).json({ error: (err as Error).message });
  }
});