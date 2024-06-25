import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import dbConnection from "../server/utils/index.js";
import { routeNotFound, errorHandler } from "../server/middlewares/errorMiddlewares.js";
import routes from "./routes/index.js";
import { startEmailScheduler } from "./controllers/notificationController.js";

dotenv.config();

dbConnection();

startEmailScheduler();

console.log("sent email start");

const PORT = process.env.PORT || 8800;

const app = express();

const corsOptions = {
    origin: ["https://collab-family-client.vercel.app", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  };
  
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Explicitly handling preflight requests

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api", routes);

app.use(routeNotFound);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`) );