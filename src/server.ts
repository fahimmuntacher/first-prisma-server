import app from "./app";
import { prisma } from "./lib/prisma";
async function main() {
  const port = process.env.PORT || 5000;
  try {
    await prisma.$connect();
    console.log(`connected to db successfully on port ${port}`);

    app.listen(port);
  } catch (error) {
    console.log(error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
