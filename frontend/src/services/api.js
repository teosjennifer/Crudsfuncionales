// URL correcta con el puerto 4000 (el puerto real del servidor backend)
const API_URL = 'http://localhost:4000/api';
// Alternativa si 'localhost' no funciona
// const API_URL = 'http://127.0.0.1:4000/api';

console.log('Usando API URL:', API_URL);

// Función auxiliar para manejar respuestas fetch
const handleResponse = async (response) => {
  // Registrar información sobre la respuesta para debugging
  console.log('Respuesta del servidor:', {
    status: response.status,
    statusText: response.statusText,
    headers: Object.fromEntries([...response.headers])
  });
  
  // Verificar si la respuesta es exitosa
  if (!response.ok) {
    let errorMsg;
    try {
      // Intentar parsear el error como JSON
      const errorData = await response.json();
      errorMsg = errorData.message || JSON.stringify(errorData);
    } catch (e) {
      // Si no es JSON, obtener como texto
      errorMsg = await response.text();
    }
    throw new Error(errorMsg || `Error ${response.status}: ${response.statusText}`);
  }
  
  // Si el contenido es JSON, devolverlo parseado
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  
  // Si es una respuesta vacía (ejemplo: DELETE), devolver un objeto con éxito
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return { success: true };
  }
  
  // Por defecto, intentar parsear como JSON
  try {
    return response.json();
  } catch (e) {
    return response.text();
  }
};

// Servicios para Productos
export const productosService = {
  getAll: () => {
    console.log('Obteniendo todos los productos');
    return fetch(`${API_URL}/products`).then(handleResponse);
  },
  getById: (id) => {
    console.log(`Obteniendo producto con ID: ${id}`);
    return fetch(`${API_URL}/products/${id}`).then(handleResponse);
  },
  create: (producto) => {
    console.log('Creando producto:', producto);
    return fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(producto)
    }).then(handleResponse);
  },
  update: (id, producto) => {
    console.log(`Actualizando producto con ID: ${id}`, producto);
    return fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(producto)
    }).then(handleResponse);
  },
  delete: (id) => {
    console.log(`Eliminando producto con ID: ${id}`);
    return fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE'
    }).then(handleResponse);
  }
};

// Servicios para Empleados
export const empleadosService = {
  getAll: () => {
    console.log('Obteniendo todos los empleados');
    return fetch(`${API_URL}/employee`).then(handleResponse);
  },
  getById: (id) => {
    console.log(`Obteniendo empleado con ID: ${id}`);
    return fetch(`${API_URL}/employee/${id}`).then(handleResponse);
  },
  create: (empleado) => {
    console.log('Creando empleado:', empleado);
    return fetch(`${API_URL}/employee`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(empleado)
    }).then(handleResponse);
  },
  update: (id, empleado) => {
    console.log(`Actualizando empleado con ID: ${id}`, empleado);
    return fetch(`${API_URL}/employee/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(empleado)
    }).then(handleResponse);
  },
  delete: (id) => {
    console.log(`Eliminando empleado con ID: ${id}`);
    return fetch(`${API_URL}/employee/${id}`, {
      method: 'DELETE'
    }).then(handleResponse);
  }
};

// Servicios para Clientes
export const clientesService = {
  getAll: () => {
    console.log('Obteniendo todos los clientes');
    return fetch(`${API_URL}/customers`).then(handleResponse);
  },
  getById: (id) => {
    console.log(`Obteniendo cliente con ID: ${id}`);
    return fetch(`${API_URL}/customers/${id}`).then(handleResponse);
  },
  create: (cliente) => {
    console.log('Creando cliente:', cliente);
    return fetch(`${API_URL}/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cliente)
    }).then(handleResponse);
  },
  update: (id, cliente) => {
    console.log(`Actualizando cliente con ID: ${id}`, cliente);
    return fetch(`${API_URL}/customers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cliente)
    }).then(handleResponse);
  },
  delete: (id) => {
    console.log(`Eliminando cliente con ID: ${id}`);
    return fetch(`${API_URL}/customers/${id}`, {
      method: 'DELETE'
    }).then(handleResponse);
  }
};
