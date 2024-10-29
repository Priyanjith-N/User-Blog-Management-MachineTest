import { config } from "dotenv";

config(); // enable environment variables to read form .env file

import app from "./framework/config/app"; // importing application
import connectDB from "./framework/config/db";

connectDB(); // connecting to db

const PORT: number | string = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`ByteBlog App is alive at PORT ${PORT}`));