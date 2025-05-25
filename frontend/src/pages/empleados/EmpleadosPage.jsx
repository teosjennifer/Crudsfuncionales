import { useState, useEffect } from 'react';
import { empleadosService } from '../../services/api';
import Alert from '../../components/Alert';
import Spinner from '../../components/Spinner';
import '../../styles/CrudPage.css';

const EmpleadosPage = () => {
  const [empleados, setEmpleados] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    telephone: '',
    birthday: '',
    address: '',
    hireDate: '',
    dui: '',
    issnumber: '',
    password: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEmpleados();
  }, []);

  const fetchEmpleados = async () => {
    setLoading(true);
    try {
      const response = await empleadosService.getAll();
      // La respuesta puede venir directamente o dentro de una propiedad data
      const empleadosData = response.data || response;
      setEmpleados(empleadosData);
    } catch (error) {
      console.error('Error fetching empleados:', error);
      setAlert({
        show: true,
        message: 'Error al cargar los empleados. ' + (error.message || ''),
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
        await empleadosService.update(editingId, formData);
      } else {
        await empleadosService.create(formData);
      }
      fetchEmpleados();
      resetForm();
      setAlert({
        show: true,
        message: editingId ? 'Empleado actualizado con éxito' : 'Empleado creado con éxito',
        type: 'success'
      });
    } catch (error) {
      console.error('Error saving empleado:', error);
      setAlert({
        show: true,
        message: `Error: ${error.response?.data?.message || 'No se pudo guardar el empleado'}`,
        type: 'danger'
      });
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (empleado) => {
    setFormData({
      name: empleado.name,
      lastName: empleado.lastName || '',
      email: empleado.email || '',
      telephone: empleado.telephone || '',
      birthday: empleado.birthday ? new Date(empleado.birthday).toISOString().split('T')[0] : '',
      address: empleado.address || '',
      hireDate: empleado.hireDate || '',
      dui: empleado.dui || '',
      issnumber: empleado.issnumber || '',
      password: ''  // Por seguridad no mostramos la contraseña al editar
    });
    // Guardar el ID para la edición
    setEditingId(empleado._id || empleado.id); // Considerar ambas posibilidades de nombres de campo
    setShowForm(true);
  };

  const deleteEmpleado = async (id) => {
    if (window.confirm('¿Está seguro que desea eliminar este empleado?')) {
      setLoading(true);
      try {
        await empleadosService.delete(id);
        fetchEmpleados();
        setAlert({
          show: true,
          message: 'Empleado eliminado con éxito',
          type: 'success'
        });
      } catch (error) {
        console.error('Error deleting empleado:', error);
        setAlert({
          show: true,
          message: `Error: ${error.response?.data?.message || 'No se pudo eliminar el empleado'}`,
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
      address: '',
      hireDate: '',
      dui: '',
      issnumber: '',
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
        <h2>Lista de empleados</h2>
        <button className="add-button" onClick={() => setShowForm(true)}>
          Añadir nuevo Empleado
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
                <label>Dirección</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Fecha de Contratación</label>
                <input
                  type="date"
                  name="hireDate"
                  value={formData.hireDate}
                  onChange={handleInputChange}
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
                <label>Número de ISSS</label>
                <input
                  type="text"
                  name="issnumber"
                  value={formData.issnumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
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
              <th>Fecha de Contratación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {empleados.map((empleado) => (
              <tr key={empleado._id}>
                <td>{empleado.name}</td>
                <td>{empleado.lastName}</td>
                <td>{empleado.email}</td>
                <td>{empleado.telephone}</td>
                <td>{empleado.hireDate}</td>
                <td>
                  <button className="edit-button" onClick={() => startEdit(empleado)}>
                    ✏️ Editar
                  </button>
                  <button className="delete-button" onClick={() => deleteEmpleado(empleado._id || empleado.id)}>
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

export default EmpleadosPage;
