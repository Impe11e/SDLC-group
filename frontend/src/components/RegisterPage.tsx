import { Link, useNavigate } from 'react-router-dom';
import RegisterForm from './auth/RegisterForm';

export default function RegisterPage() {
    const navigate = useNavigate();

    return (
        <div className="app">
            <RegisterForm onSuccess={() => navigate('/login')} />
            <p>
                Вже є акаунт? <Link to="/login">Вхід</Link>
            </p>
            <Link to="/">← До каталогу</Link>
        </div>
    );
}