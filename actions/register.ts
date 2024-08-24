"use server";
import * as z from "zod";
import bcrypt from "bcrypt";
import { db } from "@/lib/db";
import { RegisterSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, name, password } = validatedFields.data;
  const hashedPassowrd = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "Invalid credentials!" };
  }

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassowrd,
    },
  });

  return { success: "User created!" };
};
