import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Package, Tags, Truck, ArrowLeftRight, Users } from 'lucide-react';

export const Layout = () => {
    const navItems = [
        { path: '/dashboard', label: 'Inicio', icon: <LayoutDashboard size={20} /> },
        { path: '/productos', label: 'Productos', icon: <Package size={20} /> },
        { path: '/categorias', label: 'Categorías', icon: <Tags size={20} /> },
        { path: '/proveedores', label: 'Proveedores', icon: <Truck size={20} /> },
        { path: '/movimientos', label: 'Movimientos', icon: <ArrowLeftRight size={20} /> },
        { path: '/usuarios', label: 'Usuarios', icon: <Users size={20} /> },
    ];

    return (
        <div className="app-shell">
            <aside className="app-sidebar">
                <h2 className="app-sidebar__title">
                    SENATI - Sistema de Inventario
                </h2>
                <nav className="app-sidebar__nav">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `app-nav-link${isActive ? ' is-active' : ''}`}
                        >
                            {item.icon}
                            {item.label}
                        </NavLink>
                    ))}
                </nav>
            </aside>

            <main className="app-main">
                <Outlet />
            </main>
        </div>
    );
};