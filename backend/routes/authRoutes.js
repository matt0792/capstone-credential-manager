import express from "express";
import { verifyTokenWithRole } from "../middleware/auth.js";

const router = express.Router();

router.post("/verify", verifyTokenWithRole([]), (req, res) => {
  res.json({ valid: true });
});

export default router;
