import { OrganizationalUnit, Division, Employee } from "../models/models.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const createDivision = async (req, res) => {
  try {
    const { name, organizationalUnitId } = req.body;

    const existingDivision = await Division.findOne({ name });
    if (existingDivision) {
      return res.status(400).json({ message: "Division already exists" });
    }

    // check if referenced OU exists
    const ou = await OrganizationalUnit.findById(organizationalUnitId);
    if (!ou) {
      return res.status(400).json({ message: "Organizational Unit not found" });
    }

    const newDivision = new Division({
      name,
      organizationalUnit: organizationalUnitId,
    });
    await newDivision.save();

    // Add division reference to the OU if not already present
    if (!ou.divisions.includes(newDivision._id)) {
      ou.divisions.push(newDivision._id);
      await ou.save();
    }

    res.status(201).json(newDivision);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Find division by id and add new credential
export const addCredential = async (req, res) => {
  try {
    const { divisionId, siteName, username, password } = req.body;

    const division = await Division.findById(divisionId);
    if (!division) {
      return res.status(400).json({ message: "Division not found" });
    }

    const newCredential = {
      siteName: siteName,
      username: username,
      password: password,
    };

    division.credentials.push(newCredential);
    await division.save();
    return res.status(201).json(newCredential);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// get credentials for the user's division
export const getDivisionCredentials = async (req, res) => {
  try {
    // get auth header
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    // decode and verify
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.user.id;

    // find employee
    const employee = await Employee.findById(userId);

    // extract employee's division ids
    const divisionIds = employee.organizationalUnits.map((ou) => ou.divisionId);

    // find divisions with credentials + populate with OU
    const divisions = await Division.find({
      _id: { $in: divisionIds },
    }).populate("organizationalUnit", "name");

    if (!divisions.length) {
      return res
        .status(404)
        .json({ message: "No credentials available for this user." });
    }

    // Extract credentials
    const credentials = divisions.map((division) => ({
      organizationalUnit: division.organizationalUnit.name,
      divisionName: division.name,
      divisionId: division._id,
      credentials: division.credentials.map((cred) => ({
      siteName: cred.siteName,
      username: cred.username,
      password: cred.password,
      })),
    }));

    res.status(200).json({ credentials });
  } catch (err) {}
};
