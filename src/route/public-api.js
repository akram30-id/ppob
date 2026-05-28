import express from "express";
import cors from "cors";
import userController from "../controller/user-controller.js";
import bannerController from "../controller/banner-controller.js";

const publicRouter = express.Router();

publicRouter.use(cors());

// publicRouter.post('/api/users', userController.register);
// publicRouter.post('/api/users/login', userController.login);

publicRouter.post('/registration', userController.register);
publicRouter.post('/login', userController.login);

publicRouter.get('/banner', bannerController.showBanner);

export {
    publicRouter
}