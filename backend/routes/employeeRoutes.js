import express from "express";
import {
  registerEmployee,
  loginUser,
  getDivisionEmployees,
  getEmployeeOUs,
} from "../controllers/employeeController.js";
import { verifyTokenWithRole } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", registerEmployee);

router.post("/login", loginUser);

router.get(
  "/division",
  //   verifyTokenWithRole(["normal", "management", "admin"]),
  getDivisionEmployees
);

router.get("/personal", getEmployeeOUs);

export default router;
