import express from "express";
import {
  registerEmployee,
  loginUser,
  // getDivisionEmployees,
  getEmployeeOUs,
  getAllEmployees,
  updateEmployeeRole,
  deleteOUandDivisionFromEmployee,
  addOUAndDivision,
} from "../controllers/employeeController.js";
import { verifyTokenWithRole } from "../middleware/auth.js";

const router = express.Router();

// POST 
router.post("/register", verifyTokenWithRole(["admin"]), registerEmployee);
router.post("/login", loginUser);
router.post("/division", addOUAndDivision);


// GET 
router.get(
  "/personal",
  verifyTokenWithRole(["normal", "management", "admin"]),
  getEmployeeOUs
);
// router.get(
//   "/division",
//   verifyTokenWithRole(["normal", "management", "admin"]),
//   getDivisionEmployees
// );
router.get("/all", verifyTokenWithRole(["admin"]), getAllEmployees);

// PUT
router.put("/:id/role", updateEmployeeRole);


// DELETE
router.delete(
  "/:employeeId/organizational-unit/:ouId/division/:divisionId",
  deleteOUandDivisionFromEmployee
);

export default router;
