import express, {  Router } from "express";
import authMiddleware, { UserRole } from "../../middlewares/auth.middleware";
import { PostController } from "./post.controller";
const router = express.Router();

// get method
router.get("/", PostController.getAllPost)


// post method
router.post("/", authMiddleware(UserRole.USER), PostController.createPost);


export const postRouter: Router = router;
