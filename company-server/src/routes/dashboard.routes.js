import { Router } from "express";
import { dashboard } from "../controllers/dashboard.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/welcome").get(verifyJWT, dashboard);

export default router;
