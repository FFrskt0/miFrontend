import { useEffect, useState } from 'react';
import { Pencil, Trash2, X } from 'lucide-react';
import api from '../services/api';

const panelStyle = { backgroundColor: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '24px' };
const fieldStyle = { width: '100%', marginBottom: '10px', padding: '9px', border: '1px solid #d1d5db', borderRadius: '4px' };
const actionStyle = { border: 0, background: 'transparent', cursor: 'pointer', padding: '4px' };

function ErrorMessage({ children }) {
    return children ? <p role="alert" style={{ color: '#b91c1c', marginBottom: '12px' }}>{children}</p> : null;
}

function Table({ headings, children, empty }) {
    return (
        <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', backgroundColor: '#fff', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                    <tr style={{ backgroundColor: '#1e293b', color: '#fff' }}>
                        {headings.map((heading) => <th key={heading} style={{ padding: '10px' }}>{heading}</th>)}
                    </tr>
                </thead>
                <tbody>{children}</tbody>
            </table>
            {empty && <p style={{ padding: '14px', color: '#6b7280' }}>{empty}</p>}
        </div>
    );
}

export function CategoriasView() {
    const [categorias, setCategorias] = useState([]);
    const [form, setForm] = useState({ nombre: '', descripcion: '' });
    const [error, setError] = useState('');

    const cargarCategorias = async () => {
        try {
            const response = await api.get('/categorias');
            setCategorias(response.data);
            setError('');
        } catch (requestError) {
            setError(requestError.response?.data?.error || 'No se pudieron cargar las categorías.');
        }
    };

    useEffect(() => { queueMicrotask(cargarCategorias); }, []);

    const guardarCategoria = async (event) => {
        event.preventDefault();
        try {
            if (form.id) await api.put(`/categorias/${form.id}`, form);
            else await api.post('/categorias', form);
            setForm({ nombre: '', descripcion: '' });
            await cargarCategorias();
        } catch (requestError) {
            setError(requestError.response?.data?.error || 'No se pudo guardar la categoría.');
        }
    };

    const eliminarCategoria = async (categoria) => {
        if (!window.confirm(`¿Eliminar la categoría "${categoria.nombre}"?`)) return;
        try {
            await api.delete(`/categorias/${categoria.id}`);
            if (form.id === categoria.id) setForm({ nombre: '', descripcion: '' });
            await cargarCategorias();
        } catch (requestError) {
            setError(requestError.response?.data?.error || 'No se pudo eliminar la categoría.');
        }
    };

    return (
        <section>
            <h1 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '16px' }}>Categorías</h1>
            <ErrorMessage>{error}</ErrorMessage>
            <form onSubmit={guardarCategoria} style={{ ...panelStyle, maxWidth: '500px' }}>
                <input style={fieldStyle} placeholder="Nombre" value={form.nombre} onChange={(event) => setForm({ ...form, nombre: event.target.value })} required />
                <textarea style={{ ...fieldStyle, minHeight: '80px', resize: 'vertical' }} placeholder="Descripción (opcional)" value={form.descripcion} onChange={(event) => setForm({ ...form, descripcion: event.target.value })} />
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button type="submit" style={{ flex: 1, padding: '10px', backgroundColor: '#2563eb', color: '#fff', border: 0, borderRadius: '4px' }}>{form.id ? 'Actualizar categoría' : 'Agregar categoría'}</button>
                    {form.id && <button type="button" title="Cancelar edición" onClick={() => setForm({ nombre: '', descripcion: '' })} style={{ ...actionStyle, border: '1px solid #d1d5db', borderRadius: '4px' }}><X size={18} /></button>}
                </div>
            </form>
            <Table headings={['ID', 'Nombre', 'Descripción', 'Acciones']} empty={categorias.length ? '' : 'Aún no hay categorías.'}>
                {categorias.map((categoria) => (
                    <tr key={categoria.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '10px' }}>{categoria.id}</td>
                        <td style={{ padding: '10px' }}>{categoria.nombre}</td>
                        <td style={{ padding: '10px' }}>{categoria.descripcion || '—'}</td>
                        <td style={{ padding: '10px', whiteSpace: 'nowrap' }}>
                            <button type="button" title="Editar categoría" onClick={() => setForm({ id: categoria.id, nombre: categoria.nombre, descripcion: categoria.descripcion || '' })} style={{ ...actionStyle, marginRight: '8px' }}><Pencil size={17} /></button>
                            <button type="button" title="Eliminar categoría" onClick={() => eliminarCategoria(categoria)} style={{ ...actionStyle, color: '#b91c1c' }}><Trash2 size={17} /></button>
                        </td>
                    </tr>
                ))}
            </Table>
        </section>
    );
}

export function ProveedoresView() {
    const [proveedores, setProveedores] = useState([]);
    const [form, setForm] = useState({ razon_social: '', contacto: '', telefono: '', email: '' });
    const [error, setError] = useState('');

    const cargarProveedores = async () => {
        try {
            const response = await api.get('/proveedores');
            setProveedores(response.data);
            setError('');
        } catch (requestError) {
            setError(requestError.response?.data?.error || 'No se pudieron cargar los proveedores.');
        }
    };

    useEffect(() => { queueMicrotask(cargarProveedores); }, []);

    const guardarProveedor = async (event) => {
        event.preventDefault();
        try {
            await api.post('/proveedores', form);
            setForm({ razon_social: '', contacto: '', telefono: '', email: '' });
            await cargarProveedores();
        } catch (requestError) {
            setError(requestError.response?.data?.error || 'No se pudo guardar el proveedor.');
        }
    };

    const eliminarProveedor = async (proveedor) => {
        if (!window.confirm(`¿Eliminar al proveedor "${proveedor.razon_social}"?`)) return;

        try {
            await api.delete(`/proveedores/${proveedor.id}`);
            await cargarProveedores();
        } catch (requestError) {
            setError(requestError.response?.data?.error || 'No se pudo eliminar el proveedor. Verifica tus permisos o si tiene productos asociados.');
        }
    };

    return (
        <section>
            <h1 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '16px' }}>Proveedores</h1>
            <ErrorMessage>{error}</ErrorMessage>
            <form onSubmit={guardarProveedor} style={{ ...panelStyle, maxWidth: '500px' }}>
                <input style={fieldStyle} placeholder="Razón social" value={form.razon_social} onChange={(event) => setForm({ ...form, razon_social: event.target.value })} required />
                <input style={fieldStyle} placeholder="Persona de contacto" value={form.contacto} onChange={(event) => setForm({ ...form, contacto: event.target.value })} />
                <input style={fieldStyle} placeholder="Teléfono" value={form.telefono} onChange={(event) => setForm({ ...form, telefono: event.target.value })} />
                <input style={fieldStyle} type="email" placeholder="Correo electrónico" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
                <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#2563eb', color: '#fff', border: 0, borderRadius: '4px' }}>Agregar proveedor</button>
            </form>
            <Table headings={['ID', 'Razón social', 'Contacto', 'Teléfono', 'Correo', 'Acciones']} empty={proveedores.length ? '' : 'Aún no hay proveedores.'}>
                {proveedores.map((proveedor) => (
                    <tr key={proveedor.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '10px' }}>{proveedor.id}</td>
                        <td style={{ padding: '10px' }}>{proveedor.razon_social}</td>
                        <td style={{ padding: '10px' }}>{proveedor.contacto || '—'}</td>
                        <td style={{ padding: '10px' }}>{proveedor.telefono || '—'}</td>
                        <td style={{ padding: '10px' }}>{proveedor.email || '—'}</td>
                        <td style={{ padding: '10px', whiteSpace: 'nowrap' }}>
                            <button
                                type="button"
                                title={`Eliminar ${proveedor.razon_social}`}
                                aria-label={`Eliminar ${proveedor.razon_social}`}
                                onClick={() => eliminarProveedor(proveedor)}
                                style={{ ...actionStyle, color: '#b91c1c' }}
                            >
                                <Trash2 size={17} />
                            </button>
                        </td>
                    </tr>
                ))}
            </Table>
        </section>
    );
}

export function UsuariosView() {
    const [usuarios, setUsuarios] = useState([]);
    const [form, setForm] = useState({ nombre: '', email: '', password: '', rol: 'Almacenero' });
    const [error, setError] = useState('');

    const cargarUsuarios = async () => {
        try {
            const response = await api.get('/usuarios');
            setUsuarios(response.data);
            setError('');
        } catch (requestError) {
            setError(requestError.response?.data?.error || 'No se pudieron cargar los usuarios.');
        }
    };

    useEffect(() => { queueMicrotask(cargarUsuarios); }, []);

    const guardarUsuario = async (event) => {
        event.preventDefault();
        try {
            await api.post('/usuarios', form);
            setForm({ nombre: '', email: '', password: '', rol: 'Almacenero' });
            await cargarUsuarios();
        } catch (requestError) {
            setError(requestError.response?.data?.error || 'No se pudo guardar el usuario.');
        }
    };

    const eliminarUsuario = async (usuario) => {
        if (!window.confirm(`¿Eliminar al usuario "${usuario.nombre}"?`)) return;

        try {
            await api.delete(`/usuarios/${usuario.id}`);
            await cargarUsuarios();
        } catch (requestError) {
            setError(requestError.response?.data?.error || 'No se pudo eliminar el usuario.');
        }
    };

    return (
        <section>
            <h1 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '16px' }}>Usuarios</h1>
            <ErrorMessage>{error}</ErrorMessage>
            <form onSubmit={guardarUsuario} style={{ ...panelStyle, maxWidth: '500px' }}>
                <input style={fieldStyle} placeholder="Nombre" value={form.nombre} onChange={(event) => setForm({ ...form, nombre: event.target.value })} required />
                <input style={fieldStyle} type="email" placeholder="Correo electrónico" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
                <input style={fieldStyle} type="password" placeholder="Contraseña" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
                <select style={fieldStyle} value={form.rol} onChange={(event) => setForm({ ...form, rol: event.target.value })}>
                    <option>Administrador</option>
                    <option>Almacenero</option>
                    <option>Supervisor</option>
                </select>
                <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#2563eb', color: '#fff', border: 0, borderRadius: '4px' }}>Agregar usuario</button>
            </form>
            <Table headings={['ID', 'Nombre', 'Correo', 'Rol', 'Acciones']} empty={usuarios.length ? '' : 'Aún no hay usuarios.'}>
                {usuarios.map((usuario) => (
                    <tr key={usuario.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '10px' }}>{usuario.id}</td>
                        <td style={{ padding: '10px' }}>{usuario.nombre}</td>
                        <td style={{ padding: '10px' }}>{usuario.email}</td>
                        <td style={{ padding: '10px' }}>{usuario.rol}</td>
                        <td style={{ padding: '10px', whiteSpace: 'nowrap' }}>
                            <button
                                type="button"
                                title={`Eliminar ${usuario.nombre}`}
                                aria-label={`Eliminar ${usuario.nombre}`}
                                onClick={() => eliminarUsuario(usuario)}
                                style={{ ...actionStyle, color: '#b91c1c' }}
                            >
                                <Trash2 size={17} />
                            </button>
                        </td>
                    </tr>
                ))}
            </Table>
        </section>
    );
}

export function KardexView() {
    const [movimientos, setMovimientos] = useState([]);
    const [productos, setProductos] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [form, setForm] = useState({ producto_id: '', usuario_id: '', tipo_movimiento: 'Entrada', cantidad: '', observaciones: '' });
    const [error, setError] = useState('');

    const cargarDatos = async () => {
        const resultados = await Promise.allSettled([
            api.get('/movimientos'),
            api.get('/productos'),
            api.get('/usuarios')
        ]);
        const mensajes = [];

        resultados.forEach((resultado, indice) => {
            if (resultado.status === 'fulfilled') {
                const datos = Array.isArray(resultado.value.data) ? resultado.value.data : [];
                if (indice === 0) setMovimientos(datos);
                if (indice === 1) setProductos(datos);
                if (indice === 2) {
                    setUsuarios(datos);
                    if (datos.length === 1) {
                        setForm((actual) => ({ ...actual, usuario_id: String(datos[0].id) }));
                    }
                }
            } else {
                mensajes.push(resultado.reason.response?.data?.error || 'No se pudieron cargar todos los datos del Kardex.');
            }
        });

        setError(mensajes.join(' '));
    };

    useEffect(() => { queueMicrotask(cargarDatos); }, []);

    const registrarMovimiento = async (event) => {
        event.preventDefault();
        setError('');
        try {
            await api.post('/movimientos', form);
            setForm({ producto_id: '', usuario_id: '', tipo_movimiento: 'Entrada', cantidad: '', observaciones: '' });
            await cargarDatos();
        } catch (requestError) {
            setError(requestError.response?.data?.error || 'No se pudo registrar el movimiento.');
        }
    };

    return (
        <section>
            <h1 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '16px' }}>Kardex / Movimientos</h1>
            <ErrorMessage>{error}</ErrorMessage>
            <form onSubmit={registrarMovimiento} style={{ ...panelStyle, maxWidth: '560px' }}>
                <select style={fieldStyle} value={form.producto_id} onChange={(event) => setForm({ ...form, producto_id: event.target.value })} required>
                    <option value="">Seleccionar producto</option>
                    {productos.map((producto) => <option key={producto.id} value={producto.id}>{producto.nombre} (stock: {producto.stock})</option>)}
                </select>
                <select style={fieldStyle} value={form.usuario_id} onChange={(event) => setForm({ ...form, usuario_id: event.target.value })} required>
                    <option value="">Seleccionar usuario</option>
                    {usuarios.map((usuario) => <option key={usuario.id} value={usuario.id}>{usuario.nombre}</option>)}
                </select>
                <select style={fieldStyle} value={form.tipo_movimiento} onChange={(event) => setForm({ ...form, tipo_movimiento: event.target.value })}>
                    <option>Entrada</option>
                    <option>Salida</option>
                    <option>Ajuste</option>
                </select>
                <input style={fieldStyle} type="number" min={form.tipo_movimiento === 'Ajuste' ? '0' : '1'} placeholder={form.tipo_movimiento === 'Ajuste' ? 'Stock contado' : 'Cantidad'} value={form.cantidad} onChange={(event) => setForm({ ...form, cantidad: event.target.value })} required />
                <textarea style={{ ...fieldStyle, minHeight: '70px', resize: 'vertical' }} placeholder="Observaciones (opcional)" value={form.observaciones} onChange={(event) => setForm({ ...form, observaciones: event.target.value })} />
                <button type="submit" disabled={!productos.length || !usuarios.length} style={{ width: '100%', padding: '10px', backgroundColor: '#2563eb', color: '#fff', border: 0, borderRadius: '4px' }}>Registrar movimiento</button>
                {(!productos.length || !usuarios.length) && <p style={{ color: '#6b7280', marginTop: '10px' }}>Agrega al menos un producto y un usuario para registrar movimientos.</p>}
            </form>
            <Table headings={['Fecha', 'Producto', 'Movimiento', 'Cantidad', 'Usuario', 'Observaciones']} empty={movimientos.length ? '' : 'Aún no hay movimientos.'}>
                {movimientos.map((movimiento) => (
                    <tr key={movimiento.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '10px' }}>{new Date(movimiento.fecha_hora).toLocaleString()}</td>
                        <td style={{ padding: '10px' }}>{movimiento.producto?.nombre || movimiento.producto_id}</td>
                        <td style={{ padding: '10px' }}>{movimiento.tipo_movimiento}</td>
                        <td style={{ padding: '10px' }}>{movimiento.cantidad}</td>
                        <td style={{ padding: '10px' }}>{movimiento.usuario?.nombre || movimiento.usuario_id}</td>
                        <td style={{ padding: '10px' }}>{movimiento.observaciones || '—'}</td>
                    </tr>
                ))}
            </Table>
        </section>
    );
}