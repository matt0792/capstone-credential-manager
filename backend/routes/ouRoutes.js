import express from "express";
import { verifyTokenWithRole } from "../middleware/auth.js";
import { createOu, getOUsAndDivisions } from "../controllers/OUController.js";

const router = express.Router();

// POST 
router.post("/create", verifyTokenWithRole(["admin"]), createOu);

// GET 
router.get(
  "/info",
  verifyTokenWithRole(["normal", "management", "admin"]),
  getOUsAndDivisions
);

export default router;
