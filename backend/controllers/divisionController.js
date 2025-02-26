// logic for division management

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

    // check if the ou exists in the db
    const ou = await OrganizationalUnit.findById(organizationalUnitId);
    if (!ou) {
      return res.status(400).json({ message: "Organizational Unit not found" });
    }

    const newDivision = new Division({
      name,
      organizationalUnit: organizationalUnitId,
    });
    await newDivision.save();

    // check if division ref is present, and if not, add it
    if (!ou.divisions.includes(newDivision._id)) {
      ou.divisions.push(newDivision._id);
      await ou.save();
    }

    res.status(201).json(newDivision);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// add credential to division by id
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

// update division credentials
export const updateCredential = async (req, res) => {
  try {
    const { divisionId, credentialId, siteName, username, password } = req.body;

    // validate fields
    if (!divisionId || !credentialId || !siteName || !username || !password) {
      return res.status(400).json({
        message:
          "All fields (divisionId, credentialId, siteName, username, password) are required",
      });
    }

    const division = await Division.findById(divisionId);
    if (!division) {
      return res.status(400).json({ message: "Division not found" });
    }

    // use subdocument id method to find credential
    const credential = division.credentials.id(credentialId);
    if (!credential) {
      return res.status(400).json({ message: "Credential not found" });
    }

    // update fields
    credential.siteName = siteName;
    credential.username = username;
    credential.password = password;

    await division.save();

    return res.status(200).json(credential);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// get all credentials for the user's division
export const getDivisionCredentials = async (req, res) => {
  try {
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

    // format credentials
    const credentials = divisions.map((division) => ({
      organizationalUnit: division.organizationalUnit.name,
      divisionName: division.name,
      divisionId: division._id,
      credentials: division.credentials.map((cred) => ({
        siteName: cred.siteName,
        username: cred.username,
        password: cred.password,
        credentialId: cred._id,
      })),
    }));

    res.status(200).json({ credentials });
  } catch (err) {}
};

// delete a credential
export const deleteCredential = async (req, res) => {
  try {
    const { divisionId, credentialId } = req.query;

    // validate fields
    if (!divisionId || !credentialId) {
      return res.status(400).json({
        message: "Both divisionId and credentialId are required",
      });
    }

    // find division
    const division = await Division.findById(divisionId);
    if (!division) {
      return res.status(400).json({ message: "Division not found" });
    }

    // find credential (subdocument method)
    const credential = division.credentials.id(credentialId);
    if (!credential) {
      return res.status(400).json({ message: "Credential not found" });
    }

    // remove cred from array
    division.credentials.pull(credentialId);

    await division.save();

    return res.status(200).json({ message: "Credential deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
