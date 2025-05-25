import mongoose from "mongoose";
import dotenv from "dotenv";

// Cargar variables de entorno
dotenv.config();

// Usar la cadena de conexión del archivo .env
const URI = process.env.DB_URI;

// Conexión a la base de datos con manejo de errores
mongoose.connect(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000 // Timeout después de 10 segundos
}).then(() => {
  console.log("Conectado a MongoDB Atlas exitosamente");
}).catch(err => {
  console.error('Error al conectar a MongoDB Atlas:', err.message);
});

// Obtener la conexión
const connection = mongoose.connection;

// Eventos de conexión
connection.once("open", () => {
  console.log("DB is connected");
});

connection.on("disconnected", () => {
  console.log("DB is disconnected");
});

connection.on("error", (err) => {
  console.log("DB connection error:", err);
});

export default connection;
