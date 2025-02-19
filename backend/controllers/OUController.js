import { OrganizationalUnit } from "../models/models.js";

// Create a new OU
export const createOu = async (req, res) => {
  try {
    const { name } = req.body;

    const existingOU = await OrganizationalUnit.findOne({ name });
    if (existingOU) {
      return res
        .status(400)
        .json({ message: "Organizational Unit already exists" });
    }

    const newOU = new OrganizationalUnit({ name });
    await newOU.save();

    res.status(201).json(newOU);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// get all OUs and their divisions
export const getOUsAndDivisions = async (req, res) => {
  try {
    const organizationalUnits = await OrganizationalUnit.find().populate({
      path: "divisions",
      model: "Division",
    });

    if (!organizationalUnits || organizationalUnits.length === 0) {
      return res.status(404).json({ message: "No Organizational Units found" });
    }

    const structuredData = organizationalUnits.map((ou) => ({
      ouId: ou._id,
      ouName: ou.name,
      divisions: ou.divisions.map((division) => ({
        divisionId: division._id,
        divisionName: division.name,
      })),
    }));

    res.status(200).json({ organizationalUnits: structuredData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
