import { Router } from "express";
import mongoose from "mongoose";

const router = Router();

// Endpoint para probar la conexión a la base de datos
router.get("/test-db", async (req, res) => {
  try {
    // Comprueba el estado de la conexión a MongoDB
    const dbState = mongoose.connection.readyState;
    
    /*
     * 0 = desconectado
     * 1 = conectado
     * 2 = conectando
     * 3 = desconectando
     */
    
    let statusText = "";
    switch (dbState) {
      case 0:
        statusText = "Desconectado";
        break;
      case 1:
        statusText = "Conectado";
        break;
      case 2:
        statusText = "Conectando";
        break;
      case 3:
        statusText = "Desconectando";
        break;
      default:
        statusText = "Estado desconocido";
    }
    
    // Intenta realizar una operación simple en la base de datos
    let testCollection = null;
    let writeResult = null;
    let readResult = null;
    let error = null;
    
    if (dbState === 1) {
      try {
        // Intenta escribir un documento de prueba
        testCollection = mongoose.connection.db.collection("test_connection");
        writeResult = await testCollection.insertOne({
          test: true,
          timestamp: new Date()
        });
        
        // Intenta leer el documento de prueba
        readResult = await testCollection.findOne({ test: true });
      } catch (err) {
        error = err.message;
      }
    }
    
    res.json({
      connection: {
        status: dbState,
        statusText,
        uri: mongoose.connection.host + ":" + mongoose.connection.port,
        database: mongoose.connection.name
      },
      test: {
        write: writeResult ? "success" : "not attempted",
        read: readResult ? "success" : "not attempted",
        error: error
      },
      info: {
        mongoVersion: mongoose.version,
        nodeVersion: process.version
      }
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
      stack: error.stack
    });
  }
});

export default router;
