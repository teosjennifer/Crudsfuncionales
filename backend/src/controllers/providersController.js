import providerModel from "../models/providers.js";
import { v2 as cloudinary } from "cloudinary";
import fs from 'fs';
import { config } from "../config.js";

//1- Configurar cloudinary con nuestra cuenta
cloudinary.config({
  cloud_name: config.cloudinary.cloudinary_name,
  api_key: config.cloudinary.cloudinary_api_key,
  api_secret: config.cloudinary.cloudinary_api_secret,
});

//Objeto de controladores
const providersController = {};

//SELECT
providersController.getAllProviders = async (req, res) => {
  const providers = await providerModel.find();
  res.json(providers);
};

//INSERT
providersController.insertProviders = async (req, res) => {
  const { name, telephone } = req.body;
  let imageURL = "";

  //Subir la imagen a Cloudinary
  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "public",
      allowed_formats: ["png", "jpg", "jpeg"],
    });
    //Guardo en la variable la URL de donde se subió la imagen
    imageURL = result.secure_url;
  }

  //Guardar todo en la base de datos
  const newProvider = new providerModel({ name, telephone, image: imageURL });
  await newProvider.save();

  res.json({ message: "Provider saved" });
};

//UPDATE
providersController.updateProvider = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, telephone } = req.body;
    let updateData = { name, telephone };

    // Si hay una imagen nueva, subirla a Cloudinary
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "public",
        allowed_formats: ["png", "jpg", "jpeg"],
      });
      // Agregar la URL de la imagen a los datos de actualización
      updateData.image = result.secure_url;
      
      // Eliminar el archivo temporal después de subirlo
      fs.unlinkSync(req.file.path);
    }

    // Buscar y actualizar el proveedor
    const updatedProvider = await providerModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true } // Para devolver el documento actualizado
    );

    if (!updatedProvider) {
      return res.status(404).json({ message: "Proveedor no encontrado" });
    }

    res.json({ message: "Proveedor actualizado correctamente", provider: updatedProvider });
  } catch (error) {
    console.error("Error al actualizar el proveedor:", error);
    res.status(500).json({ message: "Error al actualizar el proveedor", error: error.message });
  }
};

//DELETE
providersController.deleteProvider = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Buscar el proveedor para obtener la URL de la imagen
    const provider = await providerModel.findById(id);
    
    if (!provider) {
      return res.status(404).json({ message: "Proveedor no encontrado" });
    }
    
    // Si el proveedor tiene una imagen, eliminarla de Cloudinary
    if (provider.image) {
      // Extraer el public_id de la URL
      const publicId = provider.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    }
    
    // Eliminar el proveedor de la base de datos
    await providerModel.findByIdAndDelete(id);
    
    res.json({ message: "Proveedor eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar el proveedor:", error);
    res.status(500).json({ message: "Error al eliminar el proveedor", error: error.message });
  }
};

//GET ONE
providersController.getProviderById = async (req, res) => {
  try {
    const { id } = req.params;
    const provider = await providerModel.findById(id);
    
    if (!provider) {
      return res.status(404).json({ message: "Proveedor no encontrado" });
    }
    
    res.json(provider);
  } catch (error) {
    console.error("Error al obtener el proveedor:", error);
    res.status(500).json({ message: "Error al obtener el proveedor", error: error.message });
  }
};

export default providersController;
