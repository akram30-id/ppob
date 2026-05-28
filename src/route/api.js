import express from "express";
import { authMiddleware } from "../middleware/auth-middleware.js";
import cors from "cors";
import userController from "../controller/user-controller.js";
import { upload } from "../middleware/upload-middleware.js";
import facilityController from "../controller/facility-controller.js";
import transactionController from "../controller/transaction-controller.js";

const userRouter = express.Router();

userRouter.use(cors());

userRouter.use(authMiddleware)

// // USER API
// userRouter.delete('/api/users/logout', userController.logout);
// userRouter.post('/api/users/update', userController.updatePassword);
// userRouter.post('/api/users/update/reset', adminMiddleware, userController.resetPassword);
// userRouter.post('/api/users/update/super', superadminMiddleware, userController.resetPassword);

userRouter.get('/profile', userController.getProfile);
userRouter.put('/profile/update', userController.updateProfile);
userRouter.put('/profile/image', upload.single('file'), userController.updateImage);

userRouter.get('/services', facilityController.showServices);

userRouter.get('/balance', userController.userBalance);

userRouter.post('/topup', transactionController.topupAccount);

userRouter.post('/transaction', transactionController.transactionAccount);

userRouter.get('/transaction/history', transactionController.transactionHistories);

export {
    userRouter
}