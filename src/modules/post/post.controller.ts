import { Request, Response } from "express";
import { postService } from "./post.service";

const createPost = async (req: Request, res: Response) => {
  try {
    const result = await postService.createPost(req.body);
    res.send(201).json(result);
    console.log({ req, res });
  } catch (error) {
    res.status(400).json({
      error: "Post creation failed",
      details: error,
    });
  }
};

export const postController = {
  createPost,
};
