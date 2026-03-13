import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { env } from "#/env";

// 创建 MySQL 连接池
const connection = mysql.createPool({
	host: env.DATABASE_HOST,
	port: Number(env.DATABASE_PORT),
	user: env.DATABASE_USERNAME,
	password: env.DATABASE_PASSWORD,
	database: env.DATABASE_NAME,
});

// 初始化 Drizzle ORM
export const db = drizzle({ client: connection });
