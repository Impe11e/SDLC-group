import { type SubmitEvent, useState } from 'react';
import { getErrorMessage } from '../../services/api';
import { authService } from '../../services/authService';

interface RegisterFormProps {
    onSuccess?: () => void;
}

export default function RegisterForm({ onSuccess }: RegisterFormProps) {
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
            await authService.register(nickname, email, password);
            onSuccess?.();
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Реєстрація</h2>
            <input
                placeholder="Нікнейм"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                required
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            {error && (
                <p className="alert" role="alert">
                    {error}
                </p>
            )}
            <button type="submit" disabled={submitting}>
                {submitting ? 'Реєструємо…' : 'Зареєструватися'}
            </button>
        </form>
    );
}