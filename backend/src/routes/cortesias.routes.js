import { Router } from "express";
import { createCortesia, getResumenCortesiasPorDia, getCortesiasByPlayerId } from "../controllers/cortesias.controller";

const router = Router();

// GET /logins/count?fecha=2025-12-18&mobile=5515643496
router.post("/", createCortesia );
router.get("/reporte", getResumenCortesiasPorDia);
router.get('/:playerId', getCortesiasByPlayerId)

export default router;
