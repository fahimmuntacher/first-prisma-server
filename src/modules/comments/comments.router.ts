import express, { Router } from "express";
import { commentsController } from "./comments.controller";
import authMiddleware, { UserRole } from "../../middlewares/auth.middleware";
const router = express.Router();

router.get("/:commentId", commentsController.getCommentById);
router.get("/author/:authorId", commentsController.getCommentByAuthorId);

router.delete(
  "/:commentId",
  authMiddleware(UserRole.USER, UserRole.ADMIN),
  commentsController.deleteComment
);

router.post(
  "/",
  authMiddleware(UserRole.USER, UserRole.ADMIN),
  commentsController.createComment
);

export const commentRouter: Router = router;
