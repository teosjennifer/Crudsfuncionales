import '../styles/Sidebar.css';

const Sidebar = ({ onNavigate, currentPage }) => {
  return (
    <div className="sidebar">
      <div className="title">
        <h3>CRUD Jennifer Teos</h3>
      </div>
      <nav>
        <ul>
          <li>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); onNavigate('empleados'); }}
              className={currentPage === 'empleados' ? 'active' : ''}
            >
              👥 Empleados
            </a>
          </li>
          <li>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); onNavigate('productos'); }}
              className={currentPage === 'productos' ? 'active' : ''}
            >
              📦 Productos
            </a>
          </li>
          <li>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); onNavigate('clientes'); }}
              className={currentPage === 'clientes' ? 'active' : ''}
            >
              👤 Clientes
            </a>
          </li>

        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
