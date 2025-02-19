import mongoose from "mongoose";
import { Employee, OrganizationalUnit, Division } from "./models/models.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const placeholderServices = [
  "Email",
  "HR Portal",
  "Payroll System",
  "Internal Docs",
  "VPN",
];

async function generateEmployees() {
  let index = 41;
  await mongoose.connect(process.env.MONGO_URI);

  try {
    const organizationalUnits = await OrganizationalUnit.find();
    for (const ou of organizationalUnits) {
      const divisions = await Division.find({ organizationalUnit: ou._id });
      for (const division of divisions) {
        const username = `${division.name
          .toLowerCase()
          .replace(/\s+/g, "_")}_user${index}`;
        const password = "password123";

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate credentials
        const credentials = await Promise.all(
          placeholderServices.map(async (service) => {
            const servicePassword = "securePass123";
            const hashedServicePassword = await bcrypt.hash(
              servicePassword,
              salt
            );
            return {
              siteName: service,
              username,
              password: hashedServicePassword,
            };
          })
        );

        // Check if employee already exists
        const existingEmployee = await Employee.findOne({ username });
        if (!existingEmployee) {
          const newEmployee = new Employee({
            name: `${division.name} Employee${index}`,
            username,
            password: hashedPassword,
            role: "normal",
            organizationalUnits: [{ ouId: ou._id, divisionId: division._id }],
            credentials,
          });
          await newEmployee.save();
          console.log(`Created employee for ${division.name}`);
          index += 1;
        } else {
          console.log(`Employee for ${division.name} already exists`);
        }
      }
    }
  } catch (err) {
    console.error("Error generating employees:", err);
  } finally {
    mongoose.connection.close();
  }
}

generateEmployees();
