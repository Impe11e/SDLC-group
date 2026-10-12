import { useState } from 'react';

export default function ProfilePage() {
  const [nickname, setNickname] = useState('test');

  return (
    <main>
      <h2>Особистий кабінет</h2>
      <input value={nickname} onChange={(e) => setNickname(e.target.value)} />
      <button onClick={() => console.log('update name', nickname)}>Зберегти</button>
    </main>
  );
}