import { CommentStatus } from "../../../generated/prisma/enums";
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

const updateComment = async (
  commentId: string,
  data: { status?: CommentStatus},
  authorId: string
) => {
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

  return await prisma.comment.update({
    where : {
      id : commentId,
      authorId
    },
    data : data
  })
};

const moderateComment = async (
  commentId: string,
  data: { status?: CommentStatus},
) => {
  const commentData = await prisma.comment.findFirst({
    where: {
      id: commentId,
    },
    select: {
      id: true,
      authorId: true,
      status: true
    },
  });
  if (!commentData) {
    return {
      message:
        "No comment found or you are not authorized to delete this comment",
    };
  }

  console.log(commentData);
  if(commentData.status === data.status){
    return {
      message: `Comment is already in ${data.status} status`,
    }
  }

  return await prisma.comment.update({
    where : {
      id : commentId,
    },
    data : data
  })
};


// DELTE COMMENT SERVICE
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
  updateComment,
  moderateComment
};
