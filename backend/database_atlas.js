import mongoose from "mongoose";

// Cadena de conexión a MongoDB Atlas (base de datos en la nube)
// Esta es una cuenta gratuita creada específicamente para tu proyecto
const URI = "mongodb+srv://teosj_mern:NsxT9iClWpZJeMDE@crudsmern.5eazyc2.mongodb.net/ZonaDigitalDB?retryWrites=true&w=majority";

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
