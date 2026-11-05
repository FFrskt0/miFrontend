import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, ArrowDownRight, ArrowUpRight, Boxes, CircleAlert, Package, UserRound, Wallet } from 'lucide-react';
import api from '../services/api';

const formatCurrency = (value) => new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    maximumFractionDigits: 2,
}).format(value);

const formatDate = (value) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? 'Fecha no disponible' : new Intl.DateTimeFormat('es-PE', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(date);
};

export const DashboardView = () => {
    const [resumen, setResumen] = useState({ movimientosRecientes: [] });
    const [productos, setProductos] = useState([]);
    const [usuario, setUsuario] = useState(null);
    const [errores, setErrores] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        queueMicrotask(() => {
            void Promise.allSettled([
                api.get('/dashboard'),
                api.get('/productos'),
                api.get('/auth/me'),
            ]).then((resultados) => {
                const mensajes = [];

                if (resultados[0].status === 'fulfilled') {
                    setResumen(resultados[0].value.data);
                } else {
                    mensajes.push(resultados[0].reason.response?.data?.error || 'No se pudo cargar la actividad reciente.');
                }

                if (resultados[1].status === 'fulfilled') {
                    setProductos(Array.isArray(resultados[1].value.data) ? resultados[1].value.data : []);
                } else {
                    mensajes.push(resultados[1].reason.response?.data?.error || 'No se pudieron cargar las existencias.');
                }

                if (resultados[2].status === 'fulfilled') {
                    setUsuario(resultados[2].value.data);
                } else {
                    mensajes.push(resultados[2].reason.response?.data?.error || 'No se pudo identificar al usuario actual.');
                }

                setErrores([...new Set(mensajes)]);
                setCargando(false);
            });
        });
    }, []);

    const totalUnidades = productos.reduce((total, producto) => total + Math.max(0, Number(producto.stock) || 0), 0);
    const valorInventario = productos.reduce((total, producto) => total + (Number(producto.precio) || 0) * (Number(producto.stock) || 0), 0);
    const alertas = productos
        .filter((producto) => Number(producto.stock) < 10)
        .sort((primero, segundo) => Number(primero.stock) - Number(segundo.stock));
    const stockPorCategoria = Object.values(productos.reduce((grupos, producto) => {
        const categoria = producto.categoria?.nombre || 'Sin categoría';
        grupos[categoria] ||= { nombre: categoria, unidades: 0, productos: 0 };
        grupos[categoria].unidades += Math.max(0, Number(producto.stock) || 0);
        grupos[categoria].productos += 1;
        return grupos;
    }, {})).sort((primero, segundo) => segundo.unidades - primero.unidades);
    const unidadesMaximas = Math.max(...stockPorCategoria.map((categoria) => categoria.unidades), 0);
    const movimientosRecientes = Array.isArray(resumen.movimientosRecientes) ? resumen.movimientosRecientes : [];
    const fechaActual = new Intl.DateTimeFormat('es-PE', { dateStyle: 'full' }).format(new Date());

    const indicadores = [
        { label: 'Valor estimado', value: cargando ? '...' : formatCurrency(valorInventario), detail: 'A precio registrado', icon: Wallet, tone: 'green' },
        { label: 'Productos activos', value: cargando ? '...' : productos.length, detail: `${totalUnidades.toLocaleString('es-PE')} unidades en stock`, icon: Package, tone: 'blue' },
        { label: 'Unidades disponibles', value: cargando ? '...' : totalUnidades.toLocaleString('es-PE'), detail: 'Existencias actuales', icon: Boxes, tone: 'orange' },
        { label: 'Alertas de stock', value: cargando ? '...' : alertas.length, detail: 'Productos con menos de 10 unidades', icon: CircleAlert, tone: alertas.length ? 'red' : 'green' },
    ];

    return (
        <main className="dashboard-page">
            <header className="dashboard-heading">
                <div>
                    <p className="eyebrow">CONTROL DE ALMACÉN</p>
                    <h1>Resumen del inventario</h1>
                    <p className="dashboard-date">{fechaActual}</p>
                </div>
                <div className="dashboard-user">
                    <span className="dashboard-user__avatar"><UserRound size={19} aria-hidden="true" /></span>
                    <span className="dashboard-user__details">
                        <strong>{usuario?.nombre || 'Usuario actual'}</strong>
                        <span>{usuario?.rol || 'Sesión activa'}</span>
                    </span>
                </div>
            </header>

            {errores.length > 0 && (
                <div className="dashboard-notice" role="alert">
                    {errores.map((mensaje) => <p key={mensaje}>{mensaje}</p>)}
                </div>
            )}

            <section className="dashboard-stats" aria-label="Indicadores del inventario">
                {indicadores.map(({ label, value, detail, icon: Icon, tone }) => (
                    <article className="dashboard-stat" key={label}>
                        <div className={`dashboard-stat__icon dashboard-stat__icon--${tone}`}><Icon size={19} aria-hidden="true" /></div>
                        <p>{label}</p>
                        <strong>{value}</strong>
                        <span>{detail}</span>
                    </article>
                ))}
            </section>

            <div className="dashboard-grid">
                <section className="dashboard-panel" aria-labelledby="category-title">
                    <div className="dashboard-panel__heading">
                        <div>
                            <h2 id="category-title">Stock por categoría</h2>
                            <p>Unidades disponibles en cada grupo</p>
                        </div>
                        <Link className="dashboard-panel__link" to="/categorias">Ver categorías</Link>
                    </div>
                    {cargando ? <p className="dashboard-empty">Cargando distribución...</p> : stockPorCategoria.length === 0 ? (
                        <p className="dashboard-empty">Todavía no hay productos para mostrar.</p>
                    ) : (
                        <div className="category-bars">
                            {stockPorCategoria.slice(0, 7).map((categoria) => (
                                <div className="category-bar" key={categoria.nombre}>
                                    <div className="category-bar__labels">
                                        <span>{categoria.nombre}</span>
                                        <strong>{categoria.unidades.toLocaleString('es-PE')} <small>unid.</small></strong>
                                    </div>
                                    <div className="category-bar__track">
                                        <span style={{ width: `${unidadesMaximas ? Math.max(3, categoria.unidades / unidadesMaximas * 100) : 0}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <section className="dashboard-panel dashboard-alerts" aria-labelledby="alerts-title">
                    <div className="dashboard-panel__heading">
                        <div>
                            <h2 id="alerts-title">Alertas de stock</h2>
                            <p>Menos de 10 unidades</p>
                        </div>
                        <span className={`dashboard-alerts__count${alertas.length ? ' is-warning' : ''}`}>{cargando ? '...' : alertas.length}</span>
                    </div>
                    {cargando ? <p className="dashboard-empty">Revisando existencias...</p> : alertas.length === 0 ? (
                        <p className="dashboard-empty dashboard-empty--good">No hay productos por debajo del mínimo.</p>
                    ) : (
                        <ul className="alert-list">
                            {alertas.slice(0, 6).map((producto) => (
                                <li key={producto.id}>
                                    <span className="alert-list__name">{producto.nombre}</span>
                                    <span className={`alert-list__stock${Number(producto.stock) === 0 ? ' is-empty' : ''}`}>
                                        {Number(producto.stock) === 0 ? 'Agotado' : `${producto.stock} unid.`}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                    {alertas.length > 6 && <Link className="dashboard-panel__link dashboard-alerts__more" to="/productos">Ver {alertas.length - 6} alertas más</Link>}
                </section>

                <section className="dashboard-panel dashboard-activity" aria-labelledby="activity-title">
                    <div className="dashboard-panel__heading">
                        <div className="dashboard-panel__title-with-icon">
                            <span className="dashboard-section-icon"><Activity size={18} aria-hidden="true" /></span>
                            <div>
                                <h2 id="activity-title">Actividad reciente</h2>
                                <p>Últimos movimientos registrados</p>
                            </div>
                        </div>
                        <Link className="dashboard-panel__link" to="/movimientos">Abrir Kardex</Link>
                    </div>
                    <div className="dashboard-table-scroll">
                        <table className="dashboard-table">
                            <thead>
                                <tr><th>Movimiento</th><th>Producto</th><th>Usuario</th><th>Fecha</th><th>Cantidad</th></tr>
                            </thead>
                            <tbody>
                                {cargando ? <tr><td className="dashboard-empty" colSpan="5">Cargando actividad...</td></tr> : movimientosRecientes.length === 0 ? (
                                    <tr><td className="dashboard-empty" colSpan="5">Aún no hay movimientos registrados.</td></tr>
                                ) : movimientosRecientes.slice(0, 6).map((movimiento) => {
                                    const tipo = movimiento.tipo_movimiento || 'Movimiento';
                                    const delta = Number(movimiento.cantidad) || 0;
                                    const esEntrada = tipo.toLowerCase() === 'entrada';
                                    const esSalida = tipo.toLowerCase() === 'salida';
                                    const cantidad = esSalida ? `-${Math.abs(delta)}` : esEntrada ? `+${Math.abs(delta)}` : `${delta > 0 ? '+' : ''}${delta}`;

                                    return (
                                        <tr key={movimiento.id}>
                                            <td>
                                                <span className={`movement-type${esEntrada ? ' movement-type--in' : esSalida ? ' movement-type--out' : ''}`}>
                                                    {esEntrada ? <ArrowDownRight size={15} aria-hidden="true" /> : <ArrowUpRight size={15} aria-hidden="true" />}
                                                    {tipo}
                                                </span>
                                            </td>
                                            <td className="dashboard-table__product">{movimiento.producto?.nombre || 'Producto eliminado'}</td>
                                            <td>{movimiento.usuario?.nombre || 'Usuario'}</td>
                                            <td>{formatDate(movimiento.fecha_hora)}</td>
                                            <td className={`movement-quantity${delta < 0 || esSalida ? ' is-negative' : ' is-positive'}`}>{cantidad}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </main>
    );
};