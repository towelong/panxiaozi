import { eq } from "drizzle-orm";
import { db } from "../index";
import { resourceDisk } from "../schema";

/**
 * 更新资源磁盘URL
 * @param id 资源磁盘ID
 * @param url 新的URL
 */
export async function updateResourceDiskUrl(id: number, url: string) {
  await db.update(resourceDisk).set({ url }).where(eq(resourceDisk.id, id));
}

/**
 * 获取资源磁盘URL
 * @param id 资源磁盘ID
 * @returns 资源磁盘URL
 */
export async function getResourceDiskUrl(id: number) {
  const result = await db
    .select()
    .from(resourceDisk)
    .where(eq(resourceDisk.id, id));
  if (result.length === 0) {
    return null;
  }
  return result[0].url;
}
