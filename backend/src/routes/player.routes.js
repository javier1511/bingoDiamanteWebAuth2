import { Router } from "express";
const router = Router();

import * as playerController from "../controllers/player.controller.js";
import { verifySignup } from "../middlewares";

router.get("/", playerController.getPlayer);
router.post("/signup", verifySignup.checkDuplicateUsername, playerController.createPlayer);
router.post("/signin", playerController.loginPlayer);

// ✅ si app.use('/player', router)
router.get("/mobile/:mobile", playerController.getPlayerByMobile);
router.put("/:playerId", playerController.updatePlayerById)

export default router;
