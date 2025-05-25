import { useState, useEffect } from 'react';
import { clientesService } from '../../services/api';
import Alert from '../../components/Alert';
import Spinner from '../../components/Spinner';
import '../../styles/CrudPage.css';

const ClientesPage = () => {
  const [clientes, setClientes] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    telephone: '',
    birthday: '',
    dui: '',
    password: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    setLoading(true);
    try {
      const response = await clientesService.getAll();
      // La respuesta puede venir directamente o dentro de una propiedad data
      const clientesData = response.data || response;
      setClientes(clientesData);
    } catch (error) {
      console.error('Error fetching clientes:', error);
      setAlert({
        show: true,
        message: 'Error al cargar los clientes. ' + (error.message || ''),
        type: 'danger'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await clientesService.update(editingId, formData);
      } else {
        await clientesService.create(formData);
      }
      fetchClientes();
      resetForm();
      setAlert({
        show: true,
        message: editingId ? 'Cliente actualizado con éxito' : 'Cliente creado con éxito',
        type: 'success'
      });
    } catch (error) {
      console.error('Error saving cliente:', error);
      setAlert({
        show: true,
        message: `Error: ${error.response?.data?.message || 'No se pudo guardar el cliente'}`,
        type: 'danger'
      });
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (cliente) => {
    setFormData({
      name: cliente.name,
      lastName: cliente.lastName || '',
      email: cliente.email || '',
      telephone: cliente.telephone || '',
      birthday: cliente.birthday ? new Date(cliente.birthday).toISOString().split('T')[0] : '',
      dui: cliente.dui || '',
      password: ''  // Por seguridad no mostramos la contraseña al editar
    });
    // Guardar el ID para la edición
    setEditingId(cliente._id || cliente.id); // Considerar ambas posibilidades de nombres de campo
    setShowForm(true);
  };

  const deleteCliente = async (id) => {
    if (window.confirm('¿Está seguro que desea eliminar este cliente?')) {
      setLoading(true);
      try {
        await clientesService.delete(id);
        fetchClientes();
        setAlert({
          show: true,
          message: 'Cliente eliminado con éxito',
          type: 'success'
        });
      } catch (error) {
        console.error('Error deleting cliente:', error);
        setAlert({
          show: true,
          message: `Error: ${error.response?.data?.message || 'No se pudo eliminar el cliente'}`,
          type: 'danger'
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      lastName: '',
      email: '',
      telephone: '',
      birthday: '',
      dui: '',
      password: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  const clearAlert = () => {
    setAlert({ show: false, message: '', type: '' });
  };

  return (
    <div className="crud-container">
      {loading && <Spinner />}
      {alert.show && (
        <Alert 
          message={alert.message} 
          type={alert.type} 
          onClose={clearAlert}
        />
      )}
      <div className="crud-header">
        <h2>Lista de clientes</h2>
        <button className="add-button" onClick={() => setShowForm(true)}>
          Añadir nuevo Cliente
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Nombre</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Apellido</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Teléfono</label>
                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Fecha de Nacimiento</label>
                <input
                  type="date"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>DUI</label>
                <input
                  type="text"
                  name="dui"
                  value={formData.dui}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Contraseña</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required={!editingId}
                />
              </div>
            </div>
            <div className="form-buttons">
              <button type="submit">{editingId ? 'Actualizar' : 'Guardar'}</button>
              <button type="button" onClick={resetForm}>Cancelar</button>
            </div>
          </form>
        </div>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>DUI</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente._id}>
                <td>{cliente.name}</td>
                <td>{cliente.lastName}</td>
                <td>{cliente.email}</td>
                <td>{cliente.telephone}</td>
                <td>{cliente.dui}</td>
                <td>
                  <button className="edit-button" onClick={() => startEdit(cliente)}>
                    ✏️ Editar
                  </button>
                  <button className="delete-button" onClick={() => deleteCliente(cliente._id || cliente.id)}>
                    🗑️ Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientesPage;
