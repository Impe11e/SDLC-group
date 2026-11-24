import { type SubmitEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ApiError, getErrorMessage } from '../services/api';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import type { UserProfile } from '../types/user';

export default function ProfilePage() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [nickname, setNickname] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!authService.isLoggedIn()) {
            navigate('/login');
            return;
        }
        userService
            .getMe()
            .then((data) => {
                setProfile(data);
                setNickname(data.nickname);
            })
            .catch((err) => {
                if (err instanceof ApiError && err.status === 401) {
                    navigate('/login');
                } else {
                    setError(getErrorMessage(err));
                }
            })
            .finally(() => setLoading(false));
    }, [navigate]);

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setMessage(null);
        try {
            const updated = await userService.updateNickname(nickname);
            setProfile(updated);
            setNickname(updated.nickname);
            setMessage('Збережено');
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="app">
            <Link to="/">← До каталогу</Link>
            <h1>Особистий кабінет</h1>

            {loading && <p className="muted">Завантаження…</p>}
            {error && (
                <p className="alert" role="alert">
                    {error}
                </p>
            )}
            {message && (
                <p className="alert success" role="status">
                    {message}
                </p>
            )}

            {profile && (
                <form onSubmit={handleSubmit}>
                    <p>Email: {profile.email}</p>
                    <input
                        placeholder="Нікнейм"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        required
                    />
                    <button type="submit" disabled={saving}>
                        {saving ? 'Зберігаємо…' : 'Зберегти'}
                    </button>
                </form>
            )}
        </div>
    );
}
