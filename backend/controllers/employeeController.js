import { Employee } from "../models/models.js";
import { OrganizationalUnit, Division } from "../models/models.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Register a user
export const registerEmployee = async (req, res) => {
  try {
    const { name, username, password, role, organizationalUnits } = req.body;

    const existingUser = await Employee.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username is taken" });
    }

    // Hash the password for the employee's login
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Check if OUs and divisions exist
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

    // Create a new employee
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

// Login a user
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the user exists
    const user = await Employee.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Define payload
    const payload = {
      user: {
        id: user._id,
        role: user.role,
        organizationalUnits: user.organizationalUnits,
      },
    };

    // Generate a JWT token
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.send({ token });
    console.log(`User ${username} logged in`);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// get all employees in the logged in users division
export const getDivisionEmployees = async (req, res) => {
  try {
    // Ensure request has authorization header
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.user.id; // Extract user ID from token

    // Find the logged-in user and populate both OU and Division
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

    // Extract the user's assigned OUs and Divisions
    const userDivisions = user.organizationalUnits
      .map((unit) => unit.divisionId?.name)
      .filter(Boolean); // Remove null values

    const userOUs = user.organizationalUnits
      .map((unit) => unit.ouId?.name)
      .filter(Boolean);

    if (userDivisions.length === 0 || userOUs.length === 0) {
      return res
        .status(403)
        .json({ message: "Access denied: No assigned OU or Division" });
    }

    // Fetch employees that match the user's OU and Division
    const employees = await Employee.find({
      "organizationalUnits.ouId": {
        $in: user.organizationalUnits.map((unit) => unit.ouId),
      },
      "organizationalUnits.divisionId": {
        $in: user.organizationalUnits.map((unit) => unit.divisionId),
      },
    }).populate({
      path: "organizationalUnits",
      populate: [
        { path: "ouId", model: "OrganizationalUnit" },
        { path: "divisionId", model: "Division" },
      ],
    });

    if (!employees.length) {
      return res.status(403).json({
        message: "Access denied: No employees found in your OU and Division",
      });
    }

    const structuredData = {};

    employees.forEach((employee) => {
      employee.organizationalUnits.forEach((unit) => {
        const ouName = unit.ouId?.name || "Unknown OU";
        const divisionName = unit.divisionId?.name || "Unknown Division";

        // Ensure this employee belongs to the user's division & OU
        if (
          !userDivisions.includes(divisionName) ||
          !userOUs.includes(ouName)
        ) {
          return;
        }

        // Ensure the OU exists in the structure
        if (!structuredData[ouName]) {
          structuredData[ouName] = {};
        }

        // Ensure the Division exists within the OU
        if (!structuredData[ouName][divisionName]) {
          structuredData[ouName][divisionName] = [];
        }

        // Add employee details under the correct division
        structuredData[ouName][divisionName].push({
          name: employee.name,
          username: employee.username,
        });
      });
    });

    res.status(200).json({ data: structuredData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a users OUs and divisions
export const getEmployeeOUs = async (req, res) => {
  try {
    // Ensure request has authorization header
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Extract `userId` from request params
    const { userId } = req.params;

    if (!userId) {
      return res
        .status(400)
        .json({ message: "Bad request: No user ID provided" });
    }

    // Fetch the requested user (not the logged-in user)
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

    // Extract the user's assigned OUs and Divisions
    const userOUs = user.organizationalUnits
      .map((unit) => unit.ouId?.name)
      .filter(Boolean);
    const userDivisions = user.organizationalUnits
      .map((unit) => unit.divisionId?.name)
      .filter(Boolean);

    if (!userOUs.length || !userDivisions.length) {
      return res.status(403).json({ message: "No assigned OU or Division" });
    }

    // Return the structured OU & Division data
    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
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
