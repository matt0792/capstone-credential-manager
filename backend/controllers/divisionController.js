import { OrganizationalUnit, Division } from "../models/models.js";

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

    res.status(201).json(newDivision);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
