import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';
import '../../styles/CrudPage.css';

const BranchesPage = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    birthday: new Date().toISOString().split('T')[0],
    email: '',
    password: '',
    telephone: '',
    dui: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  const fetchBranches = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      };
      const { data } = await axios.get('http://localhost:4000/api/branches', config);
      setBranches(data);
    } catch (error) {
      console.error('Error al obtener sucursales:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      };

      if (editId) {
        await axios.put(`http://localhost:4000/api/branches/${editId}`, formData, config);
      } else {
        await axios.post('http://localhost:4000/api/branches', formData, config);
      }

      resetForm();
      fetchBranches();
    } catch (error) {
      console.error('Error al guardar sucursal:', error);
      alert('Error al guardar la sucursal: ' + error.response?.data?.message || error.message);
    }
  };

  const handleEdit = (branch) => {
    setEditId(branch._id);
    setFormData({
      name: branch.name || '',
      lastName: branch.lastName || '',
      birthday: branch.birthday ? new Date(branch.birthday).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      email: branch.email || '',
      password: '',  // Por seguridad no mostramos la contraseña al editar
      telephone: branch.telephone || '',
      dui: branch.dui || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta sucursal?')) {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        };
        await axios.delete(`http://localhost:4000/api/branches/${id}`, config);
        fetchBranches();
      } catch (error) {
        console.error('Error al eliminar sucursal:', error);
        alert('Error al eliminar la sucursal');
      }
    }
  };

  const resetForm = () => {
    setEditId(null);
    setFormData({
      name: '',
      lastName: '',
      birthday: new Date().toISOString().split('T')[0],
      email: '',
      password: '',
      telephone: '',
      dui: ''
    });
    setShowModal(false);
  };

  // Asegurarse de que branches sea un array antes de aplicar filter
  const filteredBranches = Array.isArray(branches)
    ? branches.filter(
        branch => 
          branch.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          branch.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          branch.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          branch.telephone?.toString().includes(searchTerm) ||
          branch.dui?.includes(searchTerm)
      )
    : [];

  return (
    <div className="crud-container">
      <div className="crud-header">
        <h2>Gestión de Clientes</h2>
        <button 
          onClick={() => setShowModal(true)}
          className="add-button"
        >
          Añadir nuevo Cliente
        </button>
      </div>

      <div className="form-container" style={{display: showModal ? 'block' : 'none'}}>
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
                required
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
                required
              />
            </div>
            <div className="form-group">
              <label>Teléfono</label>
              <input
                type="text"
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
                required={!editId}
              />
              {editId && <small>Dejar en blanco para mantener la contraseña actual</small>}
            </div>
          </div>
          <div className="form-buttons">
            <button type="submit">{editId ? 'Actualizar' : 'Guardar'}</button>
            <button type="button" onClick={resetForm}>Cancelar</button>
          </div>
        </form>
      </div>

      <div className="table-container">
        <div style={{marginBottom: '20px', display: 'flex'}}>
          <input
            type="text"
            placeholder="Buscar clientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{padding: '8px', borderRadius: '4px', border: '1px solid #ddd', flex: '1', marginRight: '10px'}}
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} style={{background: 'none', border: 'none', cursor: 'pointer'}}>
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {loading ? (
          <div style={{textAlign: 'center', padding: '20px'}}>
            Cargando...
          </div>
        ) : filteredBranches.length === 0 ? (
          <div style={{textAlign: 'center', padding: '20px'}}>
            No se encontraron clientes
          </div>
        ) : (
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
                {filteredBranches.map((branch) => (
                  <tr key={branch._id}>
                    <td>{branch.name}</td>
                    <td>{branch.lastName}</td>
                    <td>{branch.email}</td>
                    <td>{branch.telephone}</td>
                    <td>{branch.dui}</td>
                    <td>
                      <button className="edit-button" onClick={() => handleEdit(branch)}>
                        ✏️ Editar
                      </button>
                      <button className="delete-button" onClick={() => handleDelete(branch._id)}>
                        🗑️ Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        )}
      </div>


    </div>
  );
};

export default BranchesPage;
