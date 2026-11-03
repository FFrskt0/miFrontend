import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Package, Tags, Truck, ArrowLeftRight, Users } from 'lucide-react';

export const Layout = () => {
    const navItems = [
        { path: '/', label: 'Inicio (Dashboard)', icon: <LayoutDashboard size={20} /> },
        { path: '/productos', label: 'Productos', icon: <Package size={20} /> },
        { path: '/categorias', label: 'Categorías', icon: <Tags size={20} /> },
        { path: '/proveedores', label: 'Proveedores', icon: <Truck size={20} /> },
        { path: '/kardex', label: 'Kardex / Movimientos', icon: <ArrowLeftRight size={20} /> },
        { path: '/usuarios', label: 'Usuarios', icon: <Users size={20} /> },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
            {/* Sidebar */}
            <aside style={{ width: '260px', backgroundColor: '#1e293b', color: '#fff', padding: '24px 16px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '24px', textAlign: 'center' }}>
                    SENATI - Sistema de Inventario
                </h2>
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            style={({ isActive }) => ({
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '10px 14px',
                                borderRadius: '6px',
                                color: isActive ? '#fff' : '#94a3b8',
                                backgroundColor: isActive ? '#2563eb' : 'transparent',
                                textDecoration: 'none',
                                fontWeight: isActive ? '600' : '400'
                            })}
                        >
                            {item.icon}
                            {item.label}
                        </NavLink>
                    ))}
                </nav>
            </aside>

            {/* Contenido principal */}
            <main style={{ flex: 1, padding: '32px' }}>
                <Outlet />
            </main>
        </div>
    );
};