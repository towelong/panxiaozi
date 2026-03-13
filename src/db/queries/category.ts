import { count, eq, like } from "drizzle-orm";
import { db } from "@/db/index";
import { type Category, category } from "@/db/schema";
import type { PageResult } from "@/types";
// 获取所有分类
export async function getCategoryList(): Promise<Category[]> {
  return await db.select().from(category);
}

export async function getCategoryByKey(key: string): Promise<Category> {
  const result = await db.select().from(category).where(eq(category.key, key));
  if (result.length === 0) {
    throw new Error("Category not found");
  }
  return result[0];
}

export async function getCategoryPageList(
  page = 1,
  pageSize = 10,
  name = "",
): Promise<PageResult<Category>> {
  const list = await db
    .select()
    .from(category)
    .where(name !== "" ? like(category.name, `%${name}%`) : undefined)
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  const totalResult = await db
    .select({ value: count() })
    .from(category)
    .where(name !== "" ? like(category.name, `%${name}%`) : undefined);
  let total = 0;
  if (totalResult.length > 0) {
    total = totalResult[0].value;
  }

  return {
    list,
    total,
  };
}

export async function saveCategory(
  id: number | undefined,
  name: string,
  key: string,
) {
  if (id) {
    await db.update(category).set({ name, key }).where(eq(category.id, id));
  } else {
    await db.insert(category).values({ name, key });
  }
}

export async function deleteCategory(id: number) {
  await db.delete(category).where(eq(category.id, id));
}
