import express from "express";
import {
  createDivision,
  getDivisionCredentials,
  addCredential,
} from "../controllers/divisionController.js";
import { verifyTokenWithRole } from "../middleware/auth.js";

const router = express.Router();

router.post("/create", verifyTokenWithRole(["admin"]), createDivision);

router.get("/credentials", verifyTokenWithRole([]), getDivisionCredentials);

router.post("/credentials", addCredential);

export default router;
