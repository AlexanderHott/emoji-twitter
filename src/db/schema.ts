import { relations } from "drizzle-orm";
import {
  datetime,
  int,
  mysqlTable,
  text,
  varchar,
} from "drizzle-orm/mysql-core";

export const post = mysqlTable("Post", {
  id: text("cuid").primaryKey().notNull(),
  createdAt: datetime("createdAt", { fsp: 3 }).$defaultFn(() => new Date())
    .notNull(),
  content: varchar("content", { length: 255 }).notNull(),
  authorId: text("cuid").notNull(),
  likes: int("likes").default(0),
  oritinalAuthorId: text("cuid"),
  originalPostId: text("cuid"),
});

export const postRelations = relations(post, ({ many }) => (
  { likes: many(like), bites: many(bite) }
));

export const like = mysqlTable("UserLike", {
  createdAt: datetime("createdAt", { fsp: 3 }).$defaultFn(() => new Date())
    .notNull(),
  userId: text("cuid").notNull(),
  postId: text("cuid").notNull(),
});

export const likeRelations = relations(like, ({ one }) => ({
  userLike: one(post, {
    fields: [like.postId],
    references: [post.id],
  }),
}));

export const bite = mysqlTable("UserBite", {
  createdAt: datetime("createdAt", { fsp: 3 }).$defaultFn(() => new Date())
    .notNull(),
  userId: text("cuid").notNull(),
  postId: text("cuid").notNull(),
});

export const biteRelations = relations(bite, ({ one }) => ({
  userBite: one(post, {
    fields: [bite.postId],
    references: [post.id],
  }),
}));

export const follow = mysqlTable("follow", {
  createdAt: datetime("createdAt", { fsp: 3 }).$defaultFn(() => new Date())
    .notNull(),
  followingId: text("cuid").notNull(),
  followerId: text("cuid").notNull(),
});
