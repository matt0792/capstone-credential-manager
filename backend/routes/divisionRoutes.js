import express from "express";
import { createDivision } from "../controllers/divisionController.js";
import { verifyTokenWithRole } from "../middleware/auth.js";

const router = express.Router();

router.post("/create", verifyTokenWithRole(["admin"]), createDivision);

export default router;
