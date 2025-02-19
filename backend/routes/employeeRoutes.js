import express from "express";
import {
  registerEmployee,
  loginUser,
  getOrganizationalData,
  getDivisionData,
} from "../controllers/employeeController.js";
import { verifyTokenWithRole } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", registerEmployee);

router.post("/login", loginUser);

router.get(
  "/data",
  verifyTokenWithRole(["normal", "management", "admin"]),
  getOrganizationalData
);

router.get(
  "/division",
  //   verifyTokenWithRole(["normal", "management", "admin"]),
  getDivisionData
);

export default router;
