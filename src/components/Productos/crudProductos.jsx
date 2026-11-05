import { useState, useEffect, useCallback } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const formularioVacio = () => ({
    id: null,
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    categoria_id: "",
    proveedor_id: "",
});

const CrudProductos = () => {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [cargandoCategorias, setCargandoCategorias] = useState(true);
    const [cargandoProveedores, setCargandoProveedores] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState('');
    const [errorCategorias, setErrorCategorias] = useState('');
    const [errorProveedores, setErrorProveedores] = useState('');
    const [form, setForm] = useState(formularioVacio);

    const obtenerProductos = useCallback(async () => {
        try {
            const response = await api.get('/productos');
            setProductos(Array.isArray(response.data) ? response.data : []);
            setError('');
        } catch (requestError) {
            setError(requestError.response?.data?.message || requestError.response?.data?.error || 'No se pudieron cargar los productos. Comprueba tu conexión e inténtalo nuevamente.');
        } finally {
            setCargando(false);
        }
    }, []);

    const obtenerCategorias = useCallback(async () => {
        try {
            const response = await api.get('/categorias');
            setCategorias(Array.isArray(response.data) ? response.data : []);
            setErrorCategorias('');
        } catch (requestError) {
            setErrorCategorias(requestError.response?.data?.error || 'No se pudieron cargar las categorías.');
        } finally {
            setCargandoCategorias(false);
        }
    }, []);

    const obtenerProveedores = useCallback(async () => {
        try {
            const response = await api.get('/proveedores');
            setProveedores(Array.isArray(response.data) ? response.data : []);
            setErrorProveedores('');
        } catch (requestError) {
            setErrorProveedores(requestError.response?.data?.error || 'No se pudieron cargar los proveedores.');
        } finally {
            setCargandoProveedores(false);
        }
    }, []);

    useEffect(() => {
        queueMicrotask(() => {
            void obtenerProductos();
            void obtenerCategorias();
            void obtenerProveedores();
        });
    }, [obtenerProductos, obtenerCategorias, obtenerProveedores]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setGuardando(true);
        setError('');
        try {
            const { id, ...datosProducto } = form;
            const producto = {
                ...datosProducto,
                precio: Number(datosProducto.precio),
                stock: Number(datosProducto.stock),
                categoria_id: Number(datosProducto.categoria_id),
                proveedor_id: datosProducto.proveedor_id ? Number(datosProducto.proveedor_id) : null,
            };
            if (form.id) {
                await api.put(`/productos/${id}`, producto);
            } else {
                await api.post("/productos", producto);
            }
            setForm(formularioVacio());
            await obtenerProductos();
        } catch (requestError) {
            setError(requestError.response?.data?.message || requestError.response?.data?.error || 'No se pudo guardar el producto. Revisa los datos e inténtalo nuevamente.');
        } finally {
            setGuardando(false);
        }
    };

    const handleEdit = (producto) => {
        setForm({
            ...producto,
            precio: String(producto.precio),
            stock: String(producto.stock),
            categoria_id: String(producto.categoria_id ?? producto.categoria?.id ?? ''),
            proveedor_id: producto.proveedor_id ? String(producto.proveedor_id) : '',
        });
    };

    const handleDelete = async (id) => {
        if (window.confirm("¿Seguro que deseas eliminar este producto?")) {
            try {
                await api.delete(`/productos/${id}`);
                if (form.id === id) setForm(formularioVacio());
                await obtenerProductos();
            } catch (requestError) {
                setError(requestError.response?.data?.message || requestError.response?.data?.error || 'No se pudo eliminar el producto.');
            }
        }
    };

    return (
        <main className="inventory-page">
            <div className="page-heading">
                <div>
                    <p className="eyebrow">INVENTARIO</p>
                    <h1>Productos</h1>
                    <p className="page-heading__subtitle">Administra existencias, precios y detalles de tus productos.</p>
                </div>
                <span className="product-count">{productos.length} {productos.length === 1 ? 'producto' : 'productos'}</span>
            </div>
            {error && <div className="form-error" role="alert">{error}</div>}
            {errorCategorias && <div className="form-error" role="alert">{errorCategorias}</div>}
            {errorProveedores && <div className="form-error" role="alert">{errorProveedores}</div>}
            <div className="products-layout">
                <section className="product-form-panel" aria-labelledby="product-form-title">
                    <h2 id="product-form-title">{form.id ? "Editar producto" : "Nuevo producto"}</h2>
                    <form onSubmit={handleSubmit} className="product-form">
                        <div className="form-field">
                            <label htmlFor="product-name">Nombre</label>
                            <input
                                id="product-name"
                                type="text"
                                name="nombre"
                                value={form.nombre}
                                onChange={handleChange}
                                required
                                maxLength={120}
                                autoComplete="off"
                            />
                        </div>
                        <div className="form-field">
                            <label htmlFor="product-description">Descripción <span>(opcional)</span></label>
                            <input
                                id="product-description"
                                type="text"
                                name="descripcion"
                                value={form.descripcion}
                                onChange={handleChange}
                                maxLength={500}
                            />
                        </div>
                        <div className="form-field">
                            <label htmlFor="product-price">Precio (S/)</label>
                            <input
                                id="product-price"
                                type="number"
                                min="0"
                                step="0.01"
                                name="precio"
                                value={form.precio}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-field">
                            <label htmlFor="product-stock">Stock</label>
                            <input
                                id="product-stock"
                                type="number"
                                min="0"
                                name="stock"
                                value={form.stock}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-field">
                            <label htmlFor="product-category">Categoría</label>
                            <select
                                id="product-category"
                                name="categoria_id"
                                value={form.categoria_id}
                                onChange={handleChange}
                                disabled={cargandoCategorias || categorias.length === 0}
                                required
                            >
                                <option value="">{cargandoCategorias ? 'Cargando categorías...' : 'Seleccionar categoría'}</option>
                                {categorias.map((categoria) => (
                                    <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
                                ))}
                            </select>
                            {!cargandoCategorias && categorias.length === 0 && !errorCategorias && (
                                <span className="field-hint">Primero <Link to="/categorias">crea una categoría</Link> para asignarla al producto.</span>
                            )}
                        </div>
                        <div className="form-field">
                            <label htmlFor="product-supplier">Proveedor <span>(opcional)</span></label>
                            <select
                                id="product-supplier"
                                name="proveedor_id"
                                value={form.proveedor_id}
                                onChange={handleChange}
                                disabled={cargandoProveedores}
                            >
                                <option value="">Sin proveedor (compra minorista)</option>
                                {proveedores.map((proveedor) => (
                                    <option key={proveedor.id} value={proveedor.id}>{proveedor.razon_social}</option>
                                ))}
                            </select>
                        </div>
                        <div className="product-form__actions">
                            <button className="button button--primary" type="submit" disabled={guardando || cargandoCategorias || categorias.length === 0}>
                                <Plus size={17} aria-hidden="true" />
                                {guardando ? 'Guardando…' : form.id ? 'Actualizar producto' : 'Agregar producto'}
                            </button>
                            {form.id && <button className="button button--secondary" type="button" onClick={() => setForm(formularioVacio())}><X size={17} aria-hidden="true" />Cancelar</button>}
                        </div>
                    </form>
                </section>

                <section className="product-list-panel" aria-labelledby="product-list-title">
                    <div className="section-heading">
                        <h2 id="product-list-title">Lista de productos</h2>
                    </div>
                    <div className="table-scroll">
                        <table className="products-table">
                            <thead>
                                <tr>
                                    <th scope="col">ID</th>
                                    <th scope="col">Producto</th>
                                    <th scope="col">Categoría</th>
                                    <th scope="col">Proveedor</th>
                                    <th scope="col">Precio</th>
                                    <th scope="col">Stock</th>
                                    <th scope="col"><span className="visually-hidden">Acciones</span></th>
                                </tr>
                            </thead>
                            <tbody>
                                {cargando ? (
                                    <tr><td className="table-message" colSpan="7">Cargando productos...</td></tr>
                                ) : productos.length === 0 ? (
                                    <tr><td className="table-message" colSpan="7">Aún no hay productos. Agrega el primero desde el formulario.</td></tr>
                                ) : productos.map((prod) => (
                                    <tr key={prod.id}>
                                        <td className="product-id">{prod.id}</td>
                                        <td>
                                            <span className="product-name">{prod.nombre}</span>
                                            {prod.descripcion && <span className="product-description">{prod.descripcion}</span>}
                                        </td>
                                        <td>{prod.categoria?.nombre || 'Sin categoría'}</td>
                                        <td>{prod.proveedor?.razon_social || 'Sin proveedor'}</td>
                                        <td>S/ {Number(prod.precio).toFixed(2)}</td>
                                        <td><span className={`stock-value${Number(prod.stock) === 0 ? ' stock-value--empty' : ''}`}>{prod.stock}</span></td>
                                        <td className="table-actions">
                                            <button className="icon-button" type="button" title={`Editar ${prod.nombre}`} aria-label={`Editar ${prod.nombre}`} onClick={() => handleEdit({ ...prod, precio: String(prod.precio), stock: String(prod.stock) })}>
                                                <Pencil size={17} aria-hidden="true" />
                                            </button>
                                            <button className="icon-button icon-button--danger" type="button" title={`Eliminar ${prod.nombre}`} aria-label={`Eliminar ${prod.nombre}`} onClick={() => handleDelete(prod.id)}>
                                                <Trash2 size={17} aria-hidden="true" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </main>
    );
};

export default CrudProductos;