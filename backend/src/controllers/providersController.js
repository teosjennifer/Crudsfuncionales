import providerModel from "../models/providers.js";
import { v2 as cloudinary } from "cloudinary";

import { config } from "../config.js";

//1- Configurar cloudinary con nuestra cuenta
cloudinary.config({
  cloud_name: config.cloudinary.cloudinary_name,
  api_key: config.cloudinary.cloudinary_api_key,
  api_secret: config.cloudinary.cloudinary_api_secret,
});

//Array de funcionas vacío
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

export default providersController;
