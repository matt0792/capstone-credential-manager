import mongoose from "mongoose";
import dotenv from "dotenv";
import { Division, OrganizationalUnit } from "./models/models.js";

dotenv.config();

const OUList = [
  "News Management",
  "Software Reviews",
  "Hardware Reviews",
  "Opinion Publishing",
];

const createOUs = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    for (const ouName of OUList) {
      const existingOU = await OrganizationalUnit.findOne({
        name: ouName,
      });
      if (!existingOU) {
        const newOU = new OrganizationalUnit({
          name: ouName,
        });

        await newOU.save();
        console.log(`OU ${ouName} saved`);
      } else {
        console.log(`OU ${ouName} already exists`);
      }
    }
  } catch (err) {
    console.error("Error creating OU", err);
  } finally {
    mongoose.connection.close();
    console.log("Database connection closed");
  }
};

createOUs();
