import mongoose from "mongoose";

// Employee schema definition
const EmployeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String, // Must be hashed before storing
      required: true,
    },
    role: {
      type: String,
      enum: ["normal", "management", "admin", "superadmin"],
      default: "normal",
    },
    organizationalUnits: [
      {
        ouId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "OrganizationalUnit",
        },
        divisionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Division",
        },
      },
    ],
    credentials: [
      {
        siteName: { type: String, required: true },
        username: { type: String, required: true },
        password: { type: String, required: true }, // Must be hashed before storing
      },
    ],
  },
  { timestamps: true }
);

// Organizational Unit Schema
const OrganizationalUnitSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  divisions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Division",
    },
  ],
});

// Division Schema
const DivisionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  organizationalUnit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "OrganizationalUnit",
  },
});

// make sure that the division name is unique within an organizational unit
DivisionSchema.index({ name: 1, organizationalUnit: 1 }, { unique: true });

export const Employee = mongoose.model("Employee", EmployeeSchema);
export const OrganizationalUnit = mongoose.model(
  "OrganizationalUnit",
  OrganizationalUnitSchema
);
export const Division = mongoose.model("Division", DivisionSchema);
