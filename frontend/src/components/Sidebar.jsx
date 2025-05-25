import '../styles/Sidebar.css';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  return (
    <div className="sidebar">
      <div className="title">
        <h3>CRUD Jennifer Teos</h3>
      </div>
      <nav>
        <ul>
          <li>
            <Link 
              to="/clientes" 
              className={currentPath === '/clientes' ? 'active' : ''}
            >
              👤 Clientes
            </Link>
          </li>
          <li>
            <Link 
              to="/productos" 
              className={currentPath === '/productos' || currentPath === '/' ? 'active' : ''}
            >
              📦 Productos
            </Link>
          </li>
          <li>
            <Link 
              to="/proveedores" 
              className={currentPath === '/proveedores' ? 'active' : ''}
            >
              👳‍♂️ Proveedores
            </Link>
          </li>

        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
