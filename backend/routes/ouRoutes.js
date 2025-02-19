import express from "express";
import { verifyTokenWithRole } from "../middleware/auth.js";
import { createOu, getOUsAndDivisions } from "../controllers/OUController.js";

const router = express.Router();

router.post("/create", verifyTokenWithRole(["admin"]), createOu);

router.get(
  "/info",
  verifyTokenWithRole(["normal", "management", "admin"]),
  getOUsAndDivisions
);

export default router;
