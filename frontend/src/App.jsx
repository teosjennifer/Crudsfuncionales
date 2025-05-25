import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Componentes
import Sidebar from './components/Sidebar';

// Páginas
import ProductosPage from './pages/productos/ProductosPage';
import BranchesPage from './pages/branches/BranchesPage';
import ProvidersPage from './pages/providers/ProvidersPage';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="content">
          <Routes>
            <Route path="/" element={<ProductosPage />} />
            <Route path="/productos" element={<ProductosPage />} />
            <Route path="/clientes" element={<BranchesPage />} />
            <Route path="/proveedores" element={<ProvidersPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
