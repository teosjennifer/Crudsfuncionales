// Importo todo lo de la libreria de Express
import express from "express";
import productsRoutes from "./src/routes/products.js";
import customersRoutes from "./src/routes/customers.js";
import employeeRoutes from "./src/routes/employees.js";
import branchesRoutes from "./src/routes/branches.js";
import registerEmployessRoutes from "./src/routes/registerEmployees.js";
import cookieParser from "cookie-parser";
import loginRoutes from "./src/routes/login.js";
import logoutRoutes from "./src/routes/logout.js";
import registerClientRoutes from "./src/routes/registerClients.js";
import recoveryPasswordRoutes from "./src/routes/recoveryPassword.js";
import providersRoutes from "./src/routes/providers.js";
import testRoutes from "./src/routes/test.js";
import cors from "cors";

// Creo una constante que es igual a la libreria que importé
const app = express();

// Configuración de CORS para permitir peticiones desde cualquier origen
app.use(cors({
  origin: '*', // Permitir peticiones desde cualquier origen
  credentials: true, // Permitir cookies en las peticiones
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'] // Cabeceras permitidas
}));

//Que acepte datos en json
app.use(express.json());
//Que postman acepte guardar cookies
app.use(cookieParser());

// Definir las rutas de las funciones que tendrá la página web
app.use("/api/products", productsRoutes);
app.use("/api/customers", customersRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/branches", branchesRoutes);

app.use("/api/registerEmployees", registerEmployessRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/logout", logoutRoutes);

app.use("/api/registerClients", registerClientRoutes);

app.use("/api/recoveryPassword", recoveryPasswordRoutes);

app.use("/api/providers", providersRoutes);

// Ruta de prueba para diagnosticar problemas de conexión
app.use("/api", testRoutes);

// Exporto la constante para poder usar express en otros archivos
export default app;
