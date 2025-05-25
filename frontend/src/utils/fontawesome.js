// Este archivo configura Font Awesome para su uso en toda la aplicación
import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  faUsers, 
  faHeart, 
  faUserFriends, 
  faEdit, 
  faTrash, 
  faPlus
} from '@fortawesome/free-solid-svg-icons';

// Añadir iconos a la biblioteca para usar en toda la aplicación
library.add(
  faUsers,      // Para la sección de empleados
  faHeart,      // Para la sección de productos
  faUserFriends, // Para la sección de clientes
  faEdit,       // Para el botón de editar
  faTrash,      // Para el botón de eliminar
  faPlus        // Para botones de añadir
);
