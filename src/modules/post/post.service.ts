import { serialize } from "node:v8";
import { prisma } from "../../lib/prisma";
import { PostWhereInput } from "../../../generated/prisma/models";

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
}: {
  search: string | undefined;
  tags: string[] | [];
  isFeature: boolean | undefined;
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

  if(typeof isFeature === "boolean"){
    andConditons.push({
      isFeature
    })
  }
  const allPost = await prisma.post.findMany({
    where: {
      AND: andConditons,
    },
  });
  return allPost;
};
export const postService = {
  createPost,
  getALlPost,
};
