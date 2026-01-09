import { Request, Response } from "express";
import { CommentService } from "./comments.service";

const createComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    req.body.authorId = user?.id;
    const result = await CommentService.createComment(req.body);
    res.status(201).json(result);
  } catch (e: any) {
    res.status(400).json({
      error: "Comment creation failed",
      details: e.message,
    });
  }
};

const getCommentById = async (req: Response, res: Response) => {
  try {
    const { commentId } = req.params;
    const result = await CommentService.getCommentsById(commentId as string);
    res.status(201).json(result);
  } catch (e: any) {
    res.status(400).json({
      error: "Comment creation failed",
      details: e.message,
    });
  }
};

const getCommentByAuthorId = async (req : Request, res : Response) => {
  try {
    const {authorId} = req.params;
    const result = await CommentService.getCommentByAuthorId(authorId as string);
    res.status(201).json(result);
  } catch (e: any) {
    res.status(400).json({
      error: "Comment creation failed",
      details: e.message,
    });
  }
}

const deleteComment = async (req : Request, res : Response) => {
  try {
    const user = req.user;
    const {commentId} = req.params;
    const result = await CommentService.deleteComment(commentId as string, user?.id as string);
    res.status(201).json(result);
  } catch (e: any) {
    res.status(400).json({
      error: "Comment delete failed",
      details: e.message,
    });
  }
}
const updateComment = async (req : Request, res : Response) => {
  try {
    const user = req.user;
    const {commentId} = req.params;
    const result = await CommentService.updateComment(commentId as string, req.body, user?.id as string);
    res.status(201).json(result);
  } catch (e: any) {
    res.status(400).json({
      error: "Comment delete failed",
      details: e.message,
    });
  }
}


export const commentsController = {
  createComment,
  getCommentById,
  getCommentByAuthorId,
  deleteComment,
  updateComment
};
