import { BrowserRouter, Link, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import './App.css';
import Login from './components/Login/Login';
import CrudProductos from './components/Productos/crudProductos';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import { Layout } from './components/Layout';
import { DashboardView } from './views/DashboardView';
import { CategoriasView, KardexView, ProveedoresView, UsuariosView } from './views/InventoryViews';

const Navigation = () => {
    const navigate = useNavigate();
    useLocation();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <header className="topbar">
            <div className="topbar__inner">
                <Link className="topbar__brand" to={token ? '/productos' : '/'}>
                    <span className="topbar__mark" aria-hidden="true">S</span>
                    <span>SENATI <span className="topbar__brand-muted">/ Inventario</span></span>
                </Link>
            {token && (
                <button
                    className="topbar__logout"
                    onClick={handleLogout}
                    type="button"
                >
                    <LogOut size={17} aria-hidden="true" />
                    <span>Cerrar sesión</span>
                </button>
            )}
            </div>
        </header>
    );
};

function App() {
    return (
        <BrowserRouter>
            <Navigation />
            <Routes>
                <Route path="/" element={<Login />} />
                <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                    <Route path="/dashboard" element={<DashboardView />} />
                    <Route path="/productos" element={<CrudProductos />} />
                    <Route path="/categorias" element={<CategoriasView />} />
                    <Route path="/proveedores" element={<ProveedoresView />} />
                    <Route path="/movimientos" element={<KardexView />} />
                    <Route path="/usuarios" element={<UsuariosView />} />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;