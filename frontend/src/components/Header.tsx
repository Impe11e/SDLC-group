import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

export function Header() {
    const navigate = useNavigate();
    const loggedIn = authService.isLoggedIn();

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <header>
            <h1>Інтернет-магазин спортивного харчування</h1>
            <nav>
                {loggedIn ? (
                    <>
                        {authService.isAdmin() && (
                            <>
                                <Link to="/admin/products">Адмінка</Link> |{' '}
                            </>
                        )}
                        <button type="button" onClick={handleLogout}>
                            Вийти
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Увійти</Link> | <Link to="/register">Реєстрація</Link>
                    </>
                )}
            </nav>
        </header>
    );
}
