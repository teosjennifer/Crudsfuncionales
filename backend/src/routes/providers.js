import express from "express";
import providersController from "../controllers/providersController.js";
import multer from "multer"

const router = express.Router();

//Configurar una carpeta local que guarde
//el registro de las imagenes subidas
const upload = multer({dest: "public/"})

// Rutas para todos los proveedores
router.route("/")
  .get(providersController.getAllProviders)
  .post(upload.single("image"), providersController.insertProviders);

// Rutas para un proveedor específico por ID
router.route("/:id")
  .get(providersController.getProviderById)
  .put(upload.single("image"), providersController.updateProvider)
  .delete(providersController.deleteProvider);

export default router;
