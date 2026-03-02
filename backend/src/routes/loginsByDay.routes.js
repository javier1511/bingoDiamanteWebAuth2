import { Router } from "express";
const router = Router();


import { getLoginsByDay } from "../controllers/loginsByDay.controller";

router.get("/", getLoginsByDay)

export default router;