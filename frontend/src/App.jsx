import { useState } from 'react';
import './App.css';

// Componentes
import Sidebar from './components/Sidebar';

// Páginas
import ProductosPage from './pages/productos/ProductosPage';
import EmpleadosPage from './pages/empleados/EmpleadosPage';
import ClientesPage from './pages/clientes/ClientesPage';

function App() {
  const [currentPage, setCurrentPage] = useState('productos');

  // Función para cambiar de página
  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  // Renderizar la página actual
  const renderPage = () => {
    switch(currentPage) {
      case 'productos':
        return <ProductosPage />;
      case 'empleados':
        return <EmpleadosPage />;
      case 'clientes':
        return <ClientesPage />;
      default:
        return <ProductosPage />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar onNavigate={navigateTo} currentPage={currentPage} />
      <div className="content">
        {renderPage()}
      </div>
    </div>
  )
}

export default App
