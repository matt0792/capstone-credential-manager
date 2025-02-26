import { Employee } from "../models/models.js";
import { OrganizationalUnit, Division } from "../models/models.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// register a new user
export const registerEmployee = async (req, res) => {
  try {
    const { name, username, password, role, organizationalUnits } = req.body;

    const existingUser = await Employee.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username is taken" });
    }

    // hash login password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // validate if ou's and divisions exist
    const validatedOUs = [];
    for (const unit of organizationalUnits) {
      const ouExists = await OrganizationalUnit.findById(unit.ouId);
      const divisionExists = await Division.findById(unit.divisionId);

      if (!ouExists || !divisionExists) {
        return res
          .status(400)
          .json({ message: "Invalid Organizational Unit or Division" });
      }
      validatedOUs.push(unit);
    }

    // create the new employee
    const newEmployee = new Employee({
      name,
      username,
      password: hashedPassword,
      role,
      organizationalUnits: validatedOUs,
    });

    await newEmployee.save();
    res.status(201).json({ message: "Employee registered successfully" });
    console.log(`Employee ${username} registered`);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// login a user
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // verify that the user exists
    const user = await Employee.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // define the payload for the JWT
    const payload = {
      user: {
        id: user._id,
        role: user.role,
        organizationalUnits: user.organizationalUnits,
      },
    };

    // generate token
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.send({ token });
    console.log(`User ${username} logged in`);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// // get all employees in the logged in users division
// export const getDivisionEmployees = async (req, res) => {
//   try {
//     // check for auth header
//     const token = req.headers.authorization?.split(" ")[1];
//     if (!token) {
//       return res
//         .status(401)
//         .json({ message: "Unauthorized: No token provided" });
//     }

//     // verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const userId = decoded.user.id;

//     // find the user and populate ou adn division
//     const user = await Employee.findById(userId).populate({
//       path: "organizationalUnits",
//       populate: [
//         { path: "ouId", model: "OrganizationalUnit" },
//         { path: "divisionId", model: "Division" },
//       ],
//     });

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // extract user's ous and divisions
//     const userDivisions = user.organizationalUnits
//       .map((unit) => unit.divisionId?.name)
//       .filter(Boolean); // Remove null values

//     const userOUs = user.organizationalUnits
//       .map((unit) => unit.ouId?.name)
//       .filter(Boolean);

//     if (userDivisions.length === 0 || userOUs.length === 0) {
//       return res
//         .status(403)
//         .json({ message: "Access denied: No assigned OU or Division" });
//     }

//     // fetch all employees that match users division
//     const employees = await Employee.find({
//       "organizationalUnits.ouId": {
//         $in: user.organizationalUnits.map((unit) => unit.ouId),
//       },
//       "organizationalUnits.divisionId": {
//         $in: user.organizationalUnits.map((unit) => unit.divisionId),
//       },
//     }).populate({
//       path: "organizationalUnits",
//       populate: [
//         { path: "ouId", model: "OrganizationalUnit" },
//         { path: "divisionId", model: "Division" },
//       ],
//     });

//     if (!employees.length) {
//       return res.status(403).json({
//         message: "Access denied: No employees found in your OU and Division",
//       });
//     }

//     const structuredData = {};

//     employees.forEach((employee) => {
//       employee.organizationalUnits.forEach((unit) => {
//         const ouName = unit.ouId?.name || "Unknown OU";
//         const divisionName = unit.divisionId?.name || "Unknown Division";

//         // Ensure this employee belongs to the user's division & OU
//         if (
//           !userDivisions.includes(divisionName) ||
//           !userOUs.includes(ouName)
//         ) {
//           return;
//         }

//         // Ensure the OU exists in the structure
//         if (!structuredData[ouName]) {
//           structuredData[ouName] = {};
//         }

//         // Ensure the Division exists within the OU
//         if (!structuredData[ouName][divisionName]) {
//           structuredData[ouName][divisionName] = [];
//         }

//         // Add employee details under the correct division
//         structuredData[ouName][divisionName].push({
//           name: employee.name,
//           username: employee.username,
//         });
//       });
//     });

//     res.status(200).json({ data: structuredData });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// Get a users OUs and divisions
export const getEmployeeOUs = async (req, res) => {
  try {
    // check for auth header
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // extract userId from request params
    const userId = decoded.user.id;

    if (!userId) {
      return res
        .status(400)
        .json({ message: "Bad request: No user ID provided" });
    }

    // fetch requested user from params (not the logged in user)
    const user = await Employee.findById(userId).populate({
      path: "organizationalUnits",
      populate: [
        { path: "ouId", model: "OrganizationalUnit" },
        { path: "divisionId", model: "Division" },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // extract users assigned OUs and Divisions
    const userOUs = user.organizationalUnits
      .map((unit) => unit.ouId?.name)
      .filter(Boolean);
    const userDivisions = user.organizationalUnits
      .map((unit) => unit.divisionId?.name)
      .filter(Boolean);

    if (!userOUs.length || !userDivisions.length) {
      return res.status(403).json({ message: "No assigned OU or Division" });
    }

    // structure and return data
    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        role: user.role,
        organizationalUnits: user.organizationalUnits.map((unit) => ({
          ouName: unit.ouId?.name,
          divisionName: unit.divisionId?.name,
        })),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// get all employees 
export const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().populate({
      path: "organizationalUnits",
      populate: [
        { path: "ouId", model: "OrganizationalUnit" },
        { path: "divisionId", model: "Division" },
      ],
    });

    if (!employees.length) {
      return res.status(404).json({ message: "No employees found" });
    }

    // Format data
    const employeeList = employees.map((employee) => ({
      name: employee.name,
      username: employee.username,
      role: employee.role,
      id: employee._id,
      organizationalUnits: employee.organizationalUnits.map((unit) => ({
        ouName: unit.ouId?.name || "Unknown OU",
        ouId: unit.ouId._id,
        divisionId: unit.divisionId._id,
        divisionName: unit.divisionId?.name || "Unknown Division",
      })),
    }));

    res.status(200).json({ employees: employeeList });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// update an employee's role 
export const updateEmployeeRole = async (req, res) => {
  try {
    const { role } = req.body;
    const { id } = req.params;

    if (!role) {
      return res.status(400).json({ message: "Role is required" });
    }

    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    employee.role = role;
    await employee.save();

    res
      .status(200)
      .json({ message: "Employee role updated successfully", employee });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// export const updateEmployeeDivisions = async (req, res) => {
//   try {
//     const { organizationalUnits } = req.body; // List of OUs & Divisions
//     const { id } = req.params;

//     const employee = await Employee.findById(id);
//     if (!employee) {
//       return res.status(404).json({ message: "Employee not found" });
//     }

//     // Validate each Organizational Unit and Division
//     const validatedOUs = [];
//     for (const unit of organizationalUnits) {
//       const ouExists = await OrganizationalUnit.findById(unit.ouId);
//       const divisionExists = await Division.findById(unit.divisionId);

//       if (!ouExists || !divisionExists) {
//         return res.status(400).json({
//           message: `Invalid OU (${unit.ouId}) or Division (${unit.divisionId})`,
//         });
//       }
//       validatedOUs.push(unit);
//     }

//     // Assign the validated OUs & Divisions to the employee
//     employee.organizationalUnits = validatedOUs;
//     await employee.save();

//     res
//       .status(200)
//       .json({ message: "Employee divisions updated successfully", employee });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// Delete an OU and Division from an employee
// data passed in params due to delete route 
export const deleteOUandDivisionFromEmployee = async (req, res) => {
  try {
    const { employeeId, ouId, divisionId } = req.params;

    // fine employee by id
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // find index of ou and division to remove 
    const updatedOrganizationalUnits = employee.organizationalUnits.filter(
      (unit) =>
        unit.ouId.toString() !== ouId ||
        unit.divisionId.toString() !== divisionId
    );

    // check if ou and division exists in employee 
    if (
      updatedOrganizationalUnits.length === employee.organizationalUnits.length
    ) {
      return res
        .status(404)
        .json({ message: "OU and Division not found for this employee" });
    }

    // remove ou and division from employee ou array 
    employee.organizationalUnits = updatedOrganizationalUnits;
    await employee.save();

    res.status(200).json({ message: "OU and Division removed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// add a new ou and division to employee
export const addOUAndDivision = async (req, res) => {
  try {
    const { employeeId, ouId, divisionId } = req.body;

    // Validate input
    if (!employeeId || !ouId || !divisionId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // find employee
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // validate if ou and division exists (in database)
    const ouExists = await OrganizationalUnit.findById(ouId);
    const divisionExists = await Division.findById(divisionId);

    if (!ouExists || !divisionExists) {
      return res
        .status(400)
        .json({ message: "Invalid Organizational Unit or Division" });
    }

    // check if already assigned
    const isDuplicate = employee.organizationalUnits.some(
      (existingUnit) =>
        existingUnit.ouId.toString() === ouId &&
        existingUnit.divisionId.toString() === divisionId
    );

    if (isDuplicate) {
      return res.status(400).json({
        message: `Employee is already assigned to this Organizational Unit and Division`,
      });
    }

    // add new ou and division to employee 
    employee.organizationalUnits.push({ ouId, divisionId });
    await employee.save();

    res
      .status(200)
      .json({ message: "OU and Division added successfully", employee });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
