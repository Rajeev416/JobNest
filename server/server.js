import './config/instrument.js'
import express from "express";
import cors from "cors";
import 'dotenv/config'
import connectDB from "./config/db.js";
import * as Sentry from "@sentry/node";
import { clerkWebhooks } from './controller/webhooks.js';
import companyRoutes from './routes/companyRoutes.js'
import connectCloudinary from './config/cloudinary.js';
import JobRoutes from './routes/jobRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { clerkMiddleware } from '@clerk/express';
import autoCreateUser from './middleware/autoCreateUser.js';
// Initialize Express
const app = express();

// Connect to MongoDB
await connectDB();
await connectCloudinary();

// Middleware
const allowedOrigins = [
  "https://job-nest-pi.vercel.app",
  "http://localhost:5173",
  "http://localhost:5174"
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Test if origin is local, specific whitelist, or dynamically any vercel.app preview URL
    const isAllowedOrigin = allowedOrigins.indexOf(origin) !== -1;
    const isVercelPreview = origin.endsWith('.vercel.app');
    
    if (isAllowedOrigin || isVercelPreview) {
      return callback(null, true);
    } else {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
  },
  credentials: true,
}));

// Webhooks must be parsed as raw text before express.json() is applied
app.post('/webhooks', express.raw({ type: 'application/json' }), clerkWebhooks);

app.use(express.json());

// Routes
app.get("/", (req, res) => res.send("API Working"));

Sentry.setupExpressErrorHandler(app);

app.use('/api/company',companyRoutes)
app.use('/api/jobs', JobRoutes)
app.use('/api/users', clerkMiddleware(), autoCreateUser, userRoutes)

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
