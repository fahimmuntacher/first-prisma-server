import "express";

declare module "express" {
  interface Request {
    user?: {
      id: string;
      email: string;
      emailVerified: boolean;
      role?: string;
    };
  }
}
