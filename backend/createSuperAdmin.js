import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { Employee } from "./models/models.js";

dotenv.config();

const createSuperAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existingSuperAdmin = await Employee.findOne({
      username: "superadmin",
    });
    if (existingSuperAdmin) {
      console.log("Super admin already exists.");
      return;
    }

    const hashedPassword = await bcrypt.hash("SuperGoose", 10);

    const superAdmin = new Employee({
      name: "Super Admin",
      username: "superadmin",
      password: hashedPassword,
      role: "superadmin",
      organizationalUnits: [],
    });

    await superAdmin.save();
    console.log("Super admin created successfully.");
  } catch (err) {
    console.error("Error creating super admin:", error);
  } finally {
    mongoose.connection.close();
  }
};

createSuperAdmin();
