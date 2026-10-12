import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';

export default function App() {
  return (
    <div>
      <h1>Інтернет-магазин спортивного харчування</h1>
      <LoginForm />
      <RegisterForm />
    </div>
  );
}