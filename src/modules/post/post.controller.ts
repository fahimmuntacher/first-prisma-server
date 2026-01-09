import { Request, Response } from "express";
import { postService } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";
import { paginationsSortingHelper } from "../../helpers/paginationsSortingHelper";
import { error } from "node:console";

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

    // page: 1, limit: 5, skip: 0, sortBy: 'title', sortOrder: 'desc'

    const { page, limit, skip, sortBy, sortOrder } = paginationsSortingHelper(
      req.query
    );

    // console.log("Options : ", option);
    // console.log(search);
    const tags = req.query.tags ? (req.query.tags as string).split(",") : [];

    const isFeature = req.query.isFeature
      ? req.query.isFeature === "true"
        ? true
        : req.query.isFeature === "false"
        ? false
        : undefined
      : undefined;
    console.log(isFeature);

    const status = req.query.status as PostStatus | undefined;
    console.log(status);
    const result = await postService.getALlPost({
      search: searchString,
      tags,
      isFeature,
      status,
      page,
      limit,
      skip,
      sortBy,
      sortOrder,
    });
    res.status(200).json(result);
  } catch (e: any) {
    res.status(400).json({
      error: "Post creation failed",
      details: e.message,
    });
  }
};

const getPostById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // console.log(id);
    if(!id){
      throw new Error("Post id is required")
    }
    const result = await postService.getPostById(id);
    res.status(200).json(result);
  } catch (e: any) {
    res.status(400).json({
      error: "Get Post ID not get",
      details: e.message,
    });
  }
};

export const PostController = {
  createPost,
  getAllPost,
  getPostById,
};
