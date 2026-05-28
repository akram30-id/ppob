import express from "express";
import path from "path"
import { fileURLToPath } from "url";
import { errorMiddleware } from "../middleware/error-middleware.js";
import { publicRouter } from "../route/public-api.js";
import { userRouter } from "../route/api.js";

export const web = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

web.use('/public', express.static(path.join(__dirname, '../../public')));

web.use(express.json());

web.use(publicRouter)
web.use(userRouter);

web.use(errorMiddleware);