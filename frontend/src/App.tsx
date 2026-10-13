import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import ProfilePage from './components/ProfilePage';

export default function App() {
    return (
        <div>
            <h1>Інтернет-магазин спортивного харчування</h1>
            <LoginForm />
            <RegisterForm />
            <ProfilePage />
        </div>
    );
}
