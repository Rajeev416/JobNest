import { clerkClient } from "@clerk/express";
import User from "../models/User.js";

/**
 * Middleware that auto-creates a user in MongoDB if they are authenticated
 * via Clerk but don't yet exist in the database.
 * 
 * This solves the problem where Clerk webhooks cannot reach localhost
 * during development, causing users to never be saved to MongoDB.
 */
const autoCreateUser = async (req, res, next) => {
  try {
    const userId = req.auth?.userId;

    // If the user is not authenticated via Clerk, skip
    if (!userId) {
      return next();
    }

    // Check if the user already exists in MongoDB
    const existingUser = await User.findById(userId);
    if (existingUser) {
      return next();
    }

    // User is authenticated but doesn't exist in DB — fetch their info from Clerk
    console.log(`Auto-creating user ${userId} in MongoDB (webhook may not have fired)`);
    const clerkUser = await clerkClient.users.getUser(userId);

    const userData = {
      _id: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress || "",
      name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "User",
      image: clerkUser.imageUrl || "https://via.placeholder.com/150",
      resume: "",
    };

    await User.create(userData);
    console.log(`User ${userId} auto-created successfully`);

    next();
  } catch (error) {
    // If user creation fails (e.g. duplicate key), just continue
    // The user might have been created between our check and create call
    console.error("Auto-create user error:", error.message);
    next();
  }
};

export default autoCreateUser;
