import dotenv from "dotenv";
dotenv.config();

import connectDB from "../src/db/index.js";
import {app} from "./app.js";

await connectDB();

export default app;