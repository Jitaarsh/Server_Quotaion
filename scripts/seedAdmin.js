import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

const adminData = {
  companyName: "VISE Director",
  ownerName: "VISE Director",
  gstNo: "27AAAAA0000A1Z5", // Dummy GST
  website: "",
  address: "VISE Director Office",
  country: "India",
  state: "Maharashtra",
  city: "Mumbai",
  pincode: "400001",
  description: "Primary super administrator account for QuickQuote CRM.",
  phone: "9876543210",
  email: "visedirector@gmail.com",
  password: "Vise@2026!8qL#rT2", // Will be hashed by User model pre-save hook
  role: "superadmin",
  subscription: "premium",
  isActive: true,
};

const seedAdmin = async () => {
  try {
    if (!process.env.ADMIN_MONGO_URI) {
      console.error("❌ Error: ADMIN_MONGO_URI is not defined in .env file");
      process.exit(1);
    }
    await mongoose.connect(process.env.ADMIN_MONGO_URI);
    console.log("✅ Connected to MongoDB (Admin DB)");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    
    if (existingAdmin) {
      console.log("ℹ️ Admin already exists. Updating credentials...");
      // Update existing admin
      Object.assign(existingAdmin, adminData);
      await existingAdmin.save();
      console.log("✅ Admin updated successfully!");
    } else {
      // Create new admin
      await User.create(adminData);
      console.log("✅ New Demo Admin created successfully!");
    }

    console.log("\n-------------------------------------------");
    console.log("🔑 ADMIN CREDENTIALS");
    console.log(`📧 Email: ${adminData.email}`);
    console.log(`🔒 Password: ${adminData.password}`);
    console.log("-------------------------------------------\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

seedAdmin();
