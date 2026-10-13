import { type SubmitEvent, useState } from 'react';
import { authService } from '../../services/authService';

export default function RegisterForm() {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    await authService.register(nickname, email, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Реєстрація</h2>
      <input placeholder="Нікнейм" value={nickname} onChange={(e) => setNickname(e.target.value)} />
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Зареєструватися</button>
    </form>
  );
}