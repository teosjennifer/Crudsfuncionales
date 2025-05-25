import { useState, useEffect } from 'react';
import { productosService } from '../../services/api';
import Alert from '../../components/Alert';
import Spinner from '../../components/Spinner';
import '../../styles/CrudPage.css';

const ProductosPage = () => {
  const [productos, setProductos] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    desciption: '',
    price: '',
    stock: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    setLoading(true);
    try {
      const response = await productosService.getAll();
      // La respuesta puede venir directamente o dentro de una propiedad data
      const productsData = response.data || response;
      setProductos(productsData);
    } catch (error) {
      console.error('Error fetching productos:', error);
      setAlert({
        show: true,
        message: 'Error al cargar los productos. ' + (error.message || ''),
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
    
    // Convertir price y stock a números
    const productoData = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock)
    };
    
    console.log('Enviando datos al servidor:', productoData);
    
    try {
      let response;
      if (editingId) {
        console.log('Actualizando producto con ID:', editingId);
        response = await productosService.update(editingId, productoData);
        console.log('Respuesta de actualización:', response);
      } else {
        console.log('Creando nuevo producto');
        response = await productosService.create(productoData);
        console.log('Respuesta de creación:', response);
      }
      
      // Verificar si la respuesta fue exitosa
      if (response) {
        fetchProductos();
        resetForm();
        setAlert({
          show: true,
          message: editingId ? 'Producto actualizado con éxito' : 'Producto creado con éxito',
          type: 'success'
        });
      }
    } catch (error) {
      // Mostrar detalles completos del error en la consola
      console.error('Error al guardar producto:', error);
      console.error('Stack trace:', error.stack);
      
      // Intentar obtener más información sobre el error
      let errorDetails = '';
      if (error.response) {
        // Error de respuesta del servidor
        errorDetails = `Respuesta del servidor: ${error.response.status} ${error.response.statusText}`;
        console.error('Datos de respuesta:', error.response.data);
      } else if (error.request) {
        // Error de petición (no se recibió respuesta)
        errorDetails = 'No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.';
      } else {
        // Error inesperado
        errorDetails = error.message || 'Error desconocido';
      }
      
      setAlert({
        show: true,
        message: `Error: No se pudo guardar el producto. ${errorDetails}`,
        type: 'danger'
      });
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (producto) => {
    setFormData({
      name: producto.name,
      desciption: producto.desciption || '',
      price: producto.price,
      stock: producto.stock
    });
    // Guardar el ID para la edición
    setEditingId(producto._id || producto.id); // Considerar ambas posibilidades de nombres de campo
    setShowForm(true);
  };

  const deleteProducto = async (id) => {
    if (window.confirm('¿Está seguro que desea eliminar este producto?')) {
      setLoading(true);
      try {
        await productosService.delete(id);
        fetchProductos();
        setAlert({
          show: true,
          message: 'Producto eliminado con éxito',
          type: 'success'
        });
      } catch (error) {
        console.error('Error deleting producto:', error);
        setAlert({
          show: true,
          message: `Error: ${error.response?.data?.message || 'No se pudo eliminar el producto'}`,
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
      desciption: '',
      price: '',
      stock: ''
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
        <h2>Lista de productos</h2>
        <button className="add-button" onClick={() => setShowForm(true)}>
          Añadir nuevo Producto
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <form onSubmit={handleSubmit}>
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
              <label>Descripción</label>
              <textarea
                name="desciption"
                value={formData.desciption}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Precio</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
              />
            </div>
            <div className="form-group">
              <label>Stock</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                required
                min="0"
              />
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
              <th>Descripción</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto._id}>
                <td>{producto.name}</td>
                <td>{producto.desciption}</td>
                <td>${producto.price}</td>
                <td>{producto.stock}</td>
                <td>
                  <button className="edit-button" onClick={() => startEdit(producto)}>
                    ✏️ Editar
                  </button>
                  <button className="delete-button" onClick={() => deleteProducto(producto._id || producto.id)}>
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

export default ProductosPage;
