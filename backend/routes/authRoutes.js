import express from "express";
import {
  verifyTokenWithRole,
  checkAdminPrivileges,
} from "../middleware/auth.js";

const router = express.Router();

// POST 
router.post("/verify", verifyTokenWithRole([]), (req, res) => {
  res.json({ valid: true });
});

// GET 
router.get("/admin", verifyTokenWithRole([]), checkAdminPrivileges);

export default router;
