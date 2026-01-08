import { Router } from "express";
import { sendSMS } from '../controllers/sms.controller.js'; // ✅ Importación correcta

const router = Router();

router.post('/', sendSMS); // ✅ Llamada a la función correctamente

export default router;
