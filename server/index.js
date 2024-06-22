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

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors({
    origin: ["https://collab-family-client.vercel.app/"],
    method: ["GET","POST","PUT","DELETE"],
    credentials: true,
})
)

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api", routes);

app.use(routeNotFound);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`) );