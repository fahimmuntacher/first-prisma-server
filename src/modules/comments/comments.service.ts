import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";

const createComment = async (payload: {
  content: string;
  authorId: string;
  postId: string;
  parentId?: string;
}) => {
  await prisma.post.findFirstOrThrow({
    where: {
      id: payload.postId,
    },
  });
  if (payload.parentId) {
    await prisma.comment.findUniqueOrThrow({
      where: {
        id: payload.parentId,
      },
    });
  }

  return await prisma.comment.create({
    data: payload,
  });
};

const getCommentsById = async (commentId: string) => {
  return await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
    include: {
      post: {
        select: {
          id: true,
          title: true,
        },
      },
      replies: {
        select: {
          id: true,
          content: true,
          authorId: true,
          createdAt: true,
        },
      },
    },
  });
};

const getCommentByAuthorId = async (authorId: string) => {
  return await prisma.comment.findMany({
    where: {
      authorId: authorId,
    },
    orderBy: {
      createdAt: "asc",
    },
    include: {
      post: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
};

const deleteComment = async (commentId: string, authorId: string) => {
  const commentData = await prisma.comment.findFirst({
    where: {
      id: commentId,
      authorId,
    },
    select: {
      id: true,
      authorId: true,
    },
  });
  if (!commentData) {
    return {
      message:
        "No comment found or you are not authorized to delete this comment",
    };
  }

  return await prisma.comment.delete({
    where: {
      id: commentId,
      authorId,
    },
  });
};

export const CommentService = {
  createComment,
  getCommentsById,
  getCommentByAuthorId,
  deleteComment,
};
