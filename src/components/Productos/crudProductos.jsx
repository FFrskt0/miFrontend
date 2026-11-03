import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Trash2, X } from 'lucide-react';
import api from '../../services/api';

const emptyForm = { nombre: '', descripcion: '', precio: '', stock: '', categoria_id: '' };

export const CrudProductos = () => {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [error, setError] = useState('');

    const cargarDatos = async () => {
        try {
            const [resProd, resCat] = await Promise.all([
                api.get('/productos'),
                api.get('/categorias')
            ]);
            setProductos(resProd.data);
            setCategorias(resCat.data);
            setError('');
        } catch (requestError) {
            setError(requestError.response?.data?.error || 'No se pudieron cargar los productos.');
        }
    };

    useEffect(() => {
        queueMicrotask(cargarDatos);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (form.id) {
                await api.put(`/productos/${form.id}`, form);
            } else {
                await api.post('/productos', form);
            }
            setForm(emptyForm);
            await cargarDatos();
        } catch (requestError) {
            setError(requestError.response?.data?.error || 'No se pudo guardar el producto.');
        }
    };

    const editarProducto = (producto) => {
        setForm({
            id: producto.id,
            nombre: producto.nombre || '',
            descripcion: producto.descripcion || '',
            precio: producto.precio ?? '',
            stock: producto.stock ?? '',
            categoria_id: producto.categoria_id || producto.categoria?.id || ''
        });
        setError('');
    };

    const eliminarProducto = async (producto) => {
        if (!window.confirm(`¿Eliminar el producto "${producto.nombre}"?`)) return;
        try {
            await api.delete(`/productos/${producto.id}`);
            if (form.id === producto.id) setForm(emptyForm);
            await cargarDatos();
        } catch (requestError) {
            setError(requestError.response?.data?.error || 'No se pudo eliminar el producto.');
        }
    };

    return (
        <div>
            <h1 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '16px' }}>Gestión de Productos</h1>
            {error && <p role="alert" style={{ color: '#b91c1c', marginBottom: '12px' }}>{error}</p>}
            {categorias.length === 0 && (
                <p style={{ marginBottom: '12px' }}>
                    Primero agrega una categoría en <Link to="/categorias">Categorías</Link> para poder registrar productos.
                </p>
            )}
            
            {/* Formulario */}
            <form onSubmit={handleSubmit} style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', maxWidth: '450px', marginBottom: '24px' }}>
                <input
                    type="text"
                    placeholder="Nombre"
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    required
                    style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
                />
                <input
                    type="text"
                    placeholder="Descripción"
                    value={form.descripcion}
                    onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                    style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
                />
                <input
                    type="number"
                    step="0.01"
                    placeholder="Precio"
                    value={form.precio}
                    onChange={(e) => setForm({ ...form, precio: e.target.value })}
                    required
                    style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
                />
                <input
                    type="number"
                    placeholder="Stock"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    required
                    disabled={categorias.length === 0}
                    style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
                />
                
                {/* Select Relacional */}
                <select
                    value={form.categoria_id}
                    onChange={(e) => setForm({ ...form, categoria_id: e.target.value })}
                    required
                    style={{ width: '100%', marginBottom: '12px', padding: '8px' }}
                >
                    <option value="">-- Seleccionar Categoría --</option>
                    {categorias.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                    ))}
                </select>

                <div style={{ display: 'flex', gap: '8px' }}>
                    <button type="submit" disabled={categorias.length === 0} style={{ flex: 1, padding: '10px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: categorias.length ? 'pointer' : 'not-allowed' }}>
                        {form.id ? 'Actualizar Producto' : 'Guardar Producto'}
                    </button>
                    {form.id && <button type="button" title="Cancelar edición" onClick={() => setForm(emptyForm)} style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '4px', background: '#fff' }}><X size={18} /></button>}
                </div>
            </form>

            {/* Tabla con Categoría Relacionada */}
            <table style={{ width: '100%', backgroundColor: '#fff', borderRadius: '8px', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ backgroundColor: '#1e293b', color: '#fff', textAlign: 'left' }}>
                        <th style={{ padding: '10px' }}>ID</th>
                        <th style={{ padding: '10px' }}>Nombre</th>
                        <th style={{ padding: '10px' }}>Categoría</th>
                        <th style={{ padding: '10px' }}>Precio</th>
                        <th style={{ padding: '10px' }}>Stock</th>
                        <th style={{ padding: '10px' }}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {productos.map(p => (
                        <tr key={p.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                            <td style={{ padding: '10px' }}>{p.id}</td>
                            <td style={{ padding: '10px' }}>{p.nombre}</td>
                            <td style={{ padding: '10px' }}>{p.categoria?.nombre || 'Sin categoría'}</td>
                            <td style={{ padding: '10px' }}>S/ {p.precio}</td>
                            <td style={{ padding: '10px' }}>{p.stock}</td>
                            <td style={{ padding: '10px', whiteSpace: 'nowrap' }}>
                                <button type="button" title="Editar producto" onClick={() => editarProducto(p)} style={{ border: 0, background: 'transparent', cursor: 'pointer', marginRight: '8px' }}><Pencil size={17} /></button>
                                <button type="button" title="Eliminar producto" onClick={() => eliminarProducto(p)} style={{ border: 0, background: 'transparent', color: '#b91c1c', cursor: 'pointer' }}><Trash2 size={17} /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};