import { prisma } from "../lib/prisma";
import { UserRole } from "../middlewares/auth.middleware";

async function seedAdmin() {
  try {
    const adminData = {
      name: "Admin Saheb",
      email: "admin1@admin.com",
      role: UserRole.ADMIN,
      password: "admin1234",
    };

    const existingUser = await prisma.user.findUnique({
      where: {
        email: adminData.email,
      },
    });

    if (existingUser) {
      console.log("user already exist");
      return;
    }

    const signUpAdmin = await fetch(
      "http://localhost:5000/api/auth/sign-up/email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: "http://localhost:5000",
        },
        body: JSON.stringify(adminData),
      }
    );

    if (signUpAdmin.ok) {
      await prisma.user.update({
        where: {
          email: adminData.email,
        },
        data: {
          emailVerified: true,
        },
      });
      console.log("user updated");
    }

    console.log("sign up info :", signUpAdmin);
  } catch (error) {
    console.error(error);
  }
}

seedAdmin();
