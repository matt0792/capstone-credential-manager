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
      for (const divisionName of divisionsList) {
        const existingDivision = await Division.findOne({
          name: divisionName,
          organizationalUnit: ou._id,
        });
        if (!existingDivision) {
          const newDivision = new Division({
            name: divisionName,
            organizationalUnit: ou._id,
          });
          await newDivision.save();
          console.log(`Division ${divisionName} created for ${ou.name}`);
        }
      }
    }
  } catch (err) {
    console.error("Error creating divisions:", err);
  } finally {
    mongoose.connection.close();
    console.log("Database connection closed");
  }
};

createDivisions();
