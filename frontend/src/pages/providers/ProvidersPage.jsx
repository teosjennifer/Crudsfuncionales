import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, Search, X, Upload } from 'lucide-react';
import '../../styles/CrudPage.css';

const ProvidersPage = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    telephone: ''
  });
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProviders = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      };
      const { data } = await axios.get('http://localhost:4000/api/providers', config);
      setProviders(data);
    } catch (error) {
      console.error('Error al obtener proveedores:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      // Crear un objeto FormData para enviar el archivo
      const formDataWithImage = new FormData();
      formDataWithImage.append('name', formData.name);
      formDataWithImage.append('telephone', formData.telephone);
      
      if (image) {
        formDataWithImage.append('image', image);
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          // No establecer Content-Type, FormData lo establece automáticamente
        }
      };

      if (editId) {
        await axios.put(`http://localhost:4000/api/providers/${editId}`, formDataWithImage, config);
      } else {
        await axios.post('http://localhost:4000/api/providers', formDataWithImage, config);
      }

      resetForm();
      fetchProviders();
    } catch (error) {
      console.error('Error al guardar proveedor:', error);
      alert('Error al guardar el proveedor: ' + error.response?.data?.message || error.message);
    }
  };

  const handleEdit = (provider) => {
    setEditId(provider._id);
    setFormData({
      name: provider.name || '',
      telephone: provider.telephone || ''
    });
    if (provider.image) {
      setPreviewUrl(provider.image);
    } else {
      setPreviewUrl('');
    }
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este proveedor?')) {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        };
        await axios.delete(`http://localhost:4000/api/providers/${id}`, config);
        fetchProviders();
      } catch (error) {
        console.error('Error al eliminar proveedor:', error);
        alert('Error al eliminar el proveedor');
      }
    }
  };

  const resetForm = () => {
    setEditId(null);
    setFormData({
      name: '',
      telephone: ''
    });
    setImage(null);
    setPreviewUrl('');
    setShowModal(false);
  };

  // Asegurarse de que providers sea un array antes de aplicar filter
  const filteredProviders = Array.isArray(providers)
    ? providers.filter(
        provider => 
          provider.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          provider.telephone?.includes(searchTerm)
      )
    : [];

  return (
    <div className="crud-container">
      <div className="crud-header">
        <h2>Gestión de Proveedores</h2>
        <button 
          onClick={() => setShowModal(true)}
          className="add-button"
        >
          Añadir nuevo Proveedor
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
              <label>Imagen</label>
              {previewUrl ? (
                <div style={{position: 'relative', display: 'inline-block'}}>
                  <img
                    src={previewUrl}
                    alt="Vista previa"
                    style={{height: '80px', width: '80px', objectFit: 'cover', borderRadius: '4px'}}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImage(null);
                      setPreviewUrl('');
                    }}
                    style={{position: 'absolute', top: '-8px', right: '-8px', background: '#ff6b6b', color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer'}}
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <label style={{display: 'block', width: '100%', textAlign: 'center'}}>
                  <div style={{border: '2px dashed #ddd', borderRadius: '4px', padding: '20px', cursor: 'pointer', backgroundColor: '#f9f9f9'}}>
                    <Upload size={24} style={{margin: '0 auto', display: 'block', color: '#999'}} />
                    <span style={{display: 'block', marginTop: '8px', fontSize: '14px', color: '#666'}}>Subir imagen</span>
                  </div>
                  <input
                    type="file"
                    style={{display: 'none'}}
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              )}
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
            placeholder="Buscar proveedores..."
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
        ) : filteredProviders.length === 0 ? (
          <div style={{textAlign: 'center', padding: '20px'}}>
            No se encontraron proveedores
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Teléfono</th>
                <th>Acciones</th>
              </tr>
              </thead>
              <tbody>
                {filteredProviders.map((provider) => (
                  <tr key={provider._id}>
                    <td>
                      {provider.image ? (
                        <img 
                          src={provider.image} 
                          alt={provider.name}
                          style={{height: '40px', width: '40px', borderRadius: '50%', objectFit: 'cover'}} 
                        />
                      ) : (
                        <div style={{height: '40px', width: '40px', borderRadius: '50%', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: '12px'}}>
                          N/A
                        </div>
                      )}
                    </td>
                    <td>{provider.name}</td>
                    <td>{provider.telephone}</td>
                    <td>
                      <button className="edit-button" onClick={() => handleEdit(provider)}>
                        ✏️ Editar
                      </button>
                      <button className="delete-button" onClick={() => handleDelete(provider._id)}>
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

export default ProvidersPage;
