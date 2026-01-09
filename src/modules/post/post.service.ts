import { prisma } from "../../lib/prisma";
import { PostWhereInput } from "../../../generated/prisma/models";
import { CommentStatus, PostStatus } from "../../../generated/prisma/enums";

// post.service.ts
const createPost = async (data: any, userId: string) => {
  const result = await prisma.post.create({
    data: {
      title: data.title,
      content: data.content,
      tags: data.tags || [],
      authorId: userId,
      thumbnail: data.thumbnail,
      isFeature: data.isFeature ?? false,
    },
  });

  return result;
};

// get all post
const getALlPost = async ({
  search,
  tags,
  isFeature,
  status,
  page,
  limit,
  skip,
  sortBy,
  sortOrder,
}: {
  search: string | undefined;
  tags: string[] | [];
  isFeature: boolean | undefined;
  status: PostStatus | undefined;
  page: number;
  limit: number;
  skip: number;
  sortBy: string | undefined;
  sortOrder: string | undefined;
}) => {
  const andConditons: PostWhereInput[] = [];
  console.log(typeof isFeature, isFeature);
  if (search) {
    andConditons.push({
      OR: [
        {
          title: {
            contains: search as string,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: search as string,
            mode: "insensitive",
          },
        },
        {
          tags: {
            has: search as string,
          },
        },
      ],
    });
  }

  if (tags.length > 0) {
    andConditons.push({
      tags: {
        hasEvery: tags as string[],
      },
    });
  }

  if (typeof isFeature === "boolean") {
    andConditons.push({
      isFeature,
    });
  }

  if (status) {
    andConditons.push({
      status,
    });
  }
  const allPost = await prisma.post.findMany({
    take: limit,
    skip,
    where: {
      AND: andConditons,
    },
    include: {
      _count: {
        select: { comments: true },
      },
    },
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : { createdAt: "desc" },
  });

  const total = await prisma.post.count({
    where: {
      AND: andConditons,
    },
  });
  return {
    allPost,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getPostById = async (id: string) => {
  return await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: {
        id: id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    const postData = await tx.post.findUnique({
      where: {
        id: id,
      },
      include: {
        comments: {
          where: {
            parentId: null,
            status: CommentStatus.APPROVED,
          },

          orderBy: { createdAt: "asc" },
          include: {
            replies: {
              where: {
                status: CommentStatus.APPROVED,
              },
              orderBy: { createdAt: "asc" },
              include: {
                replies: true,
              },
            },
          },
        },
        _count: {
          select: { comments: true },
        },
      },
    });
    return postData;
  });
};
export const postService = {
  createPost,
  getALlPost,
  getPostById,
};
