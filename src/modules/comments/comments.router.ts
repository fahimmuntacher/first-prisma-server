import express, {  Router } from "express";
import { commentsController } from "./comments.controller";
import authMiddleware, { UserRole } from "../../middlewares/auth.middleware";
const router = express.Router();

router.post("/", authMiddleware(UserRole.USER, UserRole.ADMIN), commentsController.createComment);


export const commentRouter: Router = router;
