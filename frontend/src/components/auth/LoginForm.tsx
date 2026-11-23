import { type SubmitEvent, useState } from 'react';
import { getErrorMessage } from '../../services/api';
import { authService } from '../../services/authService';

interface LoginFormProps {
    onSuccess?: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
            await authService.login(login, password);
            onSuccess?.();
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Вхід</h2>
            <input
                placeholder="Нікнейм або email"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
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
                {submitting ? 'Входимо…' : 'Увійти'}
            </button>
        </form>
    );
}