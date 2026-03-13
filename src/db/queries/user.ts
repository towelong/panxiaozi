import { eq } from "drizzle-orm";
import { db } from "..";
import { user } from "../schema";

export const findUserByUsername = async (username: string) => {
  const users = await db.select().from(user).where(eq(user.username, username));
  if (users.length === 0) {
    return null;
  }
  return users[0];
};

export const findUserById = async (id: number) => {
  const users = await db.select().from(user).where(eq(user.id, id));
  if (users.length === 0) {
    return null;
  }
  return users[0];
};
