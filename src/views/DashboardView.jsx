import { useEffect, useState } from 'react';
import api from '../services/api';

export const DashboardView = () => {
    const [kpis, setKpis] = useState({
        totalProductos: 0,
        totalCategorias: 0,
        totalProveedores: 0,
        bajoStock: 0,
        movimientosRecientes: []
    });

    useEffect(() => {
        api.get('/dashboard')
            .then(res => setKpis(res.data))
            .catch(err => console.error(err));
    }, []);

    const cards = [
        { label: 'Total Productos', val: kpis.totalProductos, color: '#3b82f6' },
        { label: 'Categorías', val: kpis.totalCategorias, color: '#8b5cf6' },
        { label: 'Proveedores', val: kpis.totalProveedores, color: '#10b981' },
        { label: 'Bajo Stock (Alertas)', val: kpis.bajoStock, color: '#ef4444' }
    ];

    return (
        <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Dashboard</h1>

            {/* Tarjetas KPI */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
                {cards.map((c, i) => (
                    <div key={i} style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <span style={{ fontSize: '14px', color: '#6b7280' }}>{c.label}</span>
                        <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: c.color, margin: '8px 0 0 0' }}>{c.val}</h2>
                    </div>
                ))}
            </div>

            {/* Movimientos Recientes */}
            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Movimientos Recientes (Kardex)</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #e5e7eb', color: '#6b7280' }}>
                            <th style={{ padding: '8px' }}>Fecha</th>
                            <th style={{ padding: '8px' }}>Producto</th>
                            <th style={{ padding: '8px' }}>Tipo</th>
                            <th style={{ padding: '8px' }}>Cantidad</th>
                            <th style={{ padding: '8px' }}>Usuario</th>
                        </tr>
                    </thead>
                    <tbody>
                        {kpis.movimientosRecientes.map((m) => (
                            <tr key={m.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                <td style={{ padding: '10px 8px' }}>{new Date(m.fecha_hora).toLocaleDateString()}</td>
                                <td style={{ padding: '10px 8px' }}>{m.producto?.nombre}</td>
                                <td style={{ padding: '10px 8px' }}>
                                    <span style={{
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        fontSize: '12px',
                                        backgroundColor: m.tipo_movimiento === 'Entrada' ? '#dcfce7' : '#fee2e2',
                                        color: m.tipo_movimiento === 'Entrada' ? '#15803d' : '#b91c1c'
                                    }}>
                                        {m.tipo_movimiento}
                                    </span>
                                </td>
                                <td style={{ padding: '10px 8px' }}>{m.cantidad}</td>
                                <td style={{ padding: '10px 8px' }}>{m.usuario?.nombre}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};