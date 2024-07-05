import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import dbConnection from "../server/utils/index.js";
import { routeNotFound, errorHandler } from "../server/middlewares/errorMiddlewares.js";
import routes from "./routes/index.js";
import { startEmailScheduler } from "./controllers/notificationController.js";
import path from "path";

dotenv.config();

dbConnection();

startEmailScheduler();

console.log("sent email start");

const PORT = process.env.PORT || 8800;

const app = express();

app.use(express.static('dist'));

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
)

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api", routes);

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.resolve('dist', 'index.html'));
});

app.use(routeNotFound);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`) );