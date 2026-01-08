// routes/loginDaily.routes.js
import { Router } from "express";
import { loginsPorFecha } from "../controllers/loginsPorFecha.controller.js";

const router = Router();

// GET /logins/count?fecha=2025-12-18&mobile=5515643496
router.get("/", loginsPorFecha );

export default router;
