import { sql } from "drizzle-orm";
import {
	datetime,
	index,
	int,
	mysqlTable,
	text,
	tinyint,
	unique,
	varchar,
} from "drizzle-orm/mysql-core";

// 分类表定义
export const category = mysqlTable("category", {
	id: int("id").autoincrement().primaryKey().notNull(),
	name: varchar("name", { length: 255 }).notNull(),
	key: varchar("key", { length: 100 }).notNull().unique(),
});

export const resource = mysqlTable(
	"resource",
	{
		id: int("id").autoincrement().primaryKey().notNull(),
		categoryKey: varchar("category_key", { length: 100 }).notNull(),
		pinyin: varchar("pinyin", { length: 2000 }).notNull().default(""),
		title: varchar("title", { length: 255 }).notNull(),
		desc: text("desc").notNull(),
		cover: varchar("cover", { length: 1000 }).notNull().default(""),
		diskType: varchar("disk_type", { length: 10 }).notNull(), // 网盘类型
		url: varchar("url", { length: 1000 }).notNull(), // 资源地址
		hotNum: int("hot_num").notNull().default(0), // 热度，添加索引
		isShowHome: tinyint("is_show_home").default(0),
		updatedAt: datetime("updated_at").default(sql`CURRENT_TIMESTAMP`),
	},
	(table) => [
		index("idx_hot_num").on(table.hotNum),
		unique("unique_title").on(table.title),
	],
);

export const user = mysqlTable("user", {
	id: int("id").autoincrement().primaryKey().notNull(),
	username: varchar("username", { length: 255 }).notNull(),
	password: varchar("password", { length: 255 }).notNull(),
	createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const resourceDisk = mysqlTable(
	"resource_disk",
	{
		id: int("id").autoincrement().primaryKey().notNull(),
		resourceId: int("resource_id").notNull(),
		diskType: varchar("disk_type", { length: 10 }).notNull(),
		externalUrl: varchar("external_url", { length: 1000 }).notNull(),
		url: varchar("url", { length: 1000 }).notNull().default(""),
		updatedAt: datetime("updated_at").default(sql`CURRENT_TIMESTAMP`),
	},
	(table) => [index("idx_resource_id").on(table.resourceId)],
);

// 导出类型定义，方便在应用中使用
export type Category = typeof category.$inferSelect;
export type NewCategory = typeof category.$inferInsert;

export type Resource = typeof resource.$inferSelect;
export type User = typeof user.$inferSelect;

export type ResourceDisk = typeof resourceDisk.$inferSelect;
export type NewResourceDisk = typeof resourceDisk.$inferInsert;
