import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const Login = () => {
    const [credenciales, setCredenciales] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [enviando, setEnviando] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredenciales({ ...credenciales, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEnviando(true);
        setError('');
        try {
            const response = await api.post('/auth/login', credenciales);
            if (!response.data?.token) throw new Error('La respuesta no incluye un token de acceso.');
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard');
        } catch (requestError) {
            setError(requestError.response?.data?.message || requestError.response?.data?.error || 'No se pudo iniciar sesión. Revisa tus credenciales e inténtalo nuevamente.');
        } finally {
            setEnviando(false);
        }
    };

    return (
        <main className="login-page">
            <section className="login-panel" aria-labelledby="login-title">
                <div className="login-panel__eyebrow">CONTROL DE ALMACÉN</div>
                <h1 id="login-title">Iniciar sesión</h1>
                <p className="login-panel__subtitle">Accede a tu espacio de inventario.</p>
                {error && <div className="form-error" role="alert">{error}</div>}
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-field">
                    <label htmlFor="login-email">Correo electrónico</label>
                    <input
                        id="login-email"
                        type="email"
                        name="email"
                        value={credenciales.email}
                        onChange={handleChange}
                        autoComplete="username"
                        placeholder="nombre@empresa.com"
                        required
                    />
                </div>
                    <div className="form-field">
                    <label htmlFor="login-password">Contraseña</label>
                    <input
                        id="login-password"
                        type="password"
                        name="password"
                        value={credenciales.password}
                        onChange={handleChange}
                        autoComplete="current-password"
                        placeholder="Ingresa tu contraseña"
                        required
                    />
                </div>
                <button
                    className="button button--primary login-form__submit"
                    type="submit"
                    disabled={enviando}
                >
                    {enviando ? 'Verificando...' : 'Ingresar'}
                </button>
            </form>
            </section>
        </main>
    );
};

export default Login;