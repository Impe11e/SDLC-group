import { type SubmitEvent, useState } from 'react';
import { authService } from '../../services/authService';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    await authService.login(email, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Вхід</h2>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Увійти</button>
    </form>
  );
}