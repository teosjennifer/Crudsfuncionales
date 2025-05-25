import express from "express";
import registerClientController from "../controllers/registerClientsController.js";
const router = express.Router()

// /api/registerClients
router.route("/").post(registerClientController.registerClient)

// /api/registerClients/verifyCodeEmail
router.route("/verifyCodeEmail").post(registerClientController.verifyCodeEmail)

export default router