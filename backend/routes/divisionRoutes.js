import express from "express";
import {
  createDivision,
  getDivisionCredentials,
  addCredential,
  updateCredential,
  deleteCredential,
} from "../controllers/divisionController.js";
import { verifyTokenWithRole } from "../middleware/auth.js";

const router = express.Router();

// POST
router.post("/create", verifyTokenWithRole(["admin"]), createDivision);
router.post("/credentials", verifyTokenWithRole([]), addCredential);

// GET
router.get("/credentials", verifyTokenWithRole([]), getDivisionCredentials);

// PUT
router.put(
  "/credentials",
  verifyTokenWithRole(["management", "admin"]),
  updateCredential
);

// DELETE
router.delete(
  "/credentials/delete",
  verifyTokenWithRole(["management", "admin"]),
  deleteCredential
);

export default router;
