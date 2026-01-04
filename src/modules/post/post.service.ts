import { prisma } from "../../lib/prisma";

// post.service.ts
const createPost = async (data: any, userId: string) => {
  const result = await prisma.post.create({
    data: {
      title: data.title, // Explicitly map these
      content: data.content,
      tags: data.tags || [],
      authorId: userId,
      thumbnail: data.thumbnail,
      // isFeature is optional in schema, but good to include
      isFeature: data.isFeature ?? false,
    },
  });
  return result;
};


// get all post 
const getALlPost = async() => {
  const allPost = await prisma.post.findMany();
  return allPost;
}
export const postService = {
  createPost,
  getALlPost
};
