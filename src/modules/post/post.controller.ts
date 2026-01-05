import { Request, Response } from "express";
import { postService } from "./post.service";

const createPost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({
        error: "Unauthorized!",
      });
    }
    const result = await postService.createPost(req.body, user.id as string);
    res.status(201).json(result);
  } catch (e: any) {
    res.status(400).json({
      error: "Post creation failed",
      details: e.message,
    });
  }
};

const getAllPost = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const searchString = typeof search === "string" ? search : undefined;
    console.log(search);
    const tags = req.query.tags ? (req.query.tags as string).split(",") : [];
    const result = await postService.getALlPost({ search : searchString , tags});
    res.status(200).json(result);
  } catch (e: any) {
    res.status(400).json({
      error: "Post creation failed",
      details: e.message,
    });
  }
};

export const PostController = {
  createPost,
  getAllPost,
};
