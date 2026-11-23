import { Link, useNavigate } from 'react-router-dom';
import LoginForm from './auth/LoginForm';

export default function LoginPage() {
    const navigate = useNavigate();

    return (
        <div className="app">
            <LoginForm onSuccess={() => navigate('/')} />
            <p>
                Немає акаунта? <Link to="/register">Реєстрація</Link>
            </p>
            <Link to="/">← До каталогу</Link>
        </div>
    );
}