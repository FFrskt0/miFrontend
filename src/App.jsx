import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { DashboardView } from './views/DashboardView';
import { CrudProductos } from './components/Productos/crudProductos';
import { CategoriasView, KardexView, ProveedoresView, UsuariosView } from './views/InventoryViews';

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<DashboardView />} />
                    <Route path="productos" element={<CrudProductos />} />
                    <Route path="categorias" element={<CategoriasView />} />
                    <Route path="proveedores" element={<ProveedoresView />} />
                    <Route path="kardex" element={<KardexView />} />
                    <Route path="usuarios" element={<UsuariosView />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}