import mongoose from "mongoose";
import dotenv from "dotenv";
import { Division, OrganizationalUnit } from "./models/models.js";

dotenv.config();

const divisionsList = [
  "Finance",
  "Human Resources",
  "Development",
  "Marketing",
  "Sales",
  "Operations",
  "Writing/Content",
  "Customer Support",
  "Legal",
  "Research & Development",
];

const createDivisions = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const organizationalUnits = await OrganizationalUnit.find();
    if (!organizationalUnits.length) {
      console.log("No Organizational Units found.");
      return;
    }

    for (const ou of organizationalUnits) {
      let ouUpdated = false;

      for (const divisionName of divisionsList) {
        let division = await Division.findOne({
          name: divisionName,
          organizationalUnit: ou._id,
        });

        if (!division) {
          division = new Division({
            name: divisionName,
            organizationalUnit: ou._id,
          });
          await division.save();
          console.log(`Created division: ${divisionName} for ${ou.name}`);
        }

        // Add division reference to the OU if not already present
        if (!ou.divisions.includes(division._id)) {
          ou.divisions.push(division._id);
          ouUpdated = true;
        }
      }

      // Save the OU **only if it was updated**
      if (ouUpdated) {
        await ou.save();
        console.log(`Updated Organizational Unit: ${ou.name}`);
      }
    }
  } catch (err) {
    console.error("Error creating divisions:", err);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed");
  }
};

createDivisions();
