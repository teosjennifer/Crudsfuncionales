import mongoose from "mongoose";

// 1- Configuro la URI o dirección de la base de datos
const URI = "mongodb://127.0.0.1:27017/ZonaDigitalDB20170508";

// 2- Conecto la base de datos con opciones para mayor compatibilidad
mongoose.connect(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout después de 5 segundos
  family: 4 // Usar IPv4, omitir IPv6
}).catch(err => {
  console.error('Error al conectar a MongoDB:', err.message);
});

// ------ Comprobar que todo funciona ------

// 3- Creo una constante que es igual a la conexión
const connection = mongoose.connection;

// Veo si funciona
connection.once("open", () => {
  console.log("DB is connected");
});

// Veo si se desconectó
connection.on("disconnected", () => {
  console.log("DB is disconnected");
});

// Veo si hay un error
connection.on("error", (error) => {
  console.log("error found" + error);
});
