import { relations, sql } from "drizzle-orm";
import {
  datetime,
  int,
  mysqlTable,
  text,
  varchar,
} from "drizzle-orm/mysql-core";

export const post = mysqlTable("Post", {
  id: text("id").primaryKey().notNull(),
  createdAt: datetime("createdAt", { fsp: 3 }).default(
    sql`CURRENT_TIMESTAMP(3)`,
  )
    .notNull(),
  content: varchar("content", { length: 255 }).notNull(),
  authorId: text("authorId").notNull(),
  likes: int("likes").default(0).notNull(),
  originalAuthorId: varchar("originalAuthorId", { length: 191 }),
  originalPostId: varchar("originalPostId", { length: 191 }),
});

export const postRelations = relations(post, ({ many }) => (
  { likes: many(like), bites: many(bite) }
));

export const like = mysqlTable("UserLike", {
  createdAt: datetime("createdAt", { fsp: 3 }).default(sql`CURRENT_TIMESTAMP(3)`)
    .notNull(),
  userId: varchar("userId", { length: 191 }).notNull(),
  postId: varchar("postId", { length: 191 }).notNull(),
});

export const likeRelations = relations(like, ({ one }) => ({
  userLike: one(post, {
    fields: [like.postId],
    references: [post.id],
  }),
}));

export const bite = mysqlTable("UserBite", {
  createdAt: datetime("createdAt", { fsp: 3 }).default(sql`CURRENT_TIMESTAMP(3)`)
    .notNull(),
  userId: varchar("userId", { length: 191 }).notNull(),
  postId: varchar("postId", { length: 191 }).notNull(),
});

export const biteRelations = relations(bite, ({ one }) => ({
  userBite: one(post, {
    fields: [bite.postId],
    references: [post.id],
  }),
}));

export const follow = mysqlTable("follow", {
  createdAt: datetime("createdAt", { fsp: 3 }).default(sql`CURRENT_TIMESTAMP(3)`)
    .notNull(),
  followingId: varchar("followingId", { length: 191 }).notNull(),
  followerId: varchar("followerId", { length: 191 }).notNull(),
});
