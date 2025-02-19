import mongoose from "mongoose";
import dotenv from "dotenv";
import { Employee, OrganizationalUnit, Division } from "./models/models.js";

// Load environment variables from .env file
dotenv.config();

// The function to update the Organizational Units with divisions
async function updateOUsWithDivisions() {
  // Connect to MongoDB using the URI from the environment variable
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    // Fetch all divisions
    const divisions = await Division.find();

    // Check if we got divisions
    if (divisions.length === 0) {
      console.log("No divisions found in the database.");
      return;
    }

    // For each division, update the corresponding Organizational Unit
    for (let division of divisions) {
      if (!division.organizationalUnit) {
        console.log(`Division ${division._id} is missing an organizationalUnit reference.`);
        continue; // Skip divisions without a reference
      }

      // Log the current update attempt
      console.log(`Updating Organizational Unit for Division ${division._id}`);

      // Update the Organizational Unit with the division reference
      const updatedOU = await OrganizationalUnit.findByIdAndUpdate(
        division.organizationalUnit,
        {
          $addToSet: { divisions: division._id }, // Add the division to the OU's divisions array
        },
        { new: true }
      );

      if (updatedOU) {
        console.log(`Organizational Unit ${updatedOU._id} updated successfully.`);
      } else {
        console.log(`Failed to update Organizational Unit for Division ${division._id}.`);
      }
    }

    console.log("OUs updated with divisions.");
  } catch (err) {
    console.error("Error updating OUs:", err);
  } finally {
    // Close the database connection after the operation is complete
    mongoose.connection.close();
  }
}

// Run the function to update OUs with divisions
updateOUsWithDivisions();