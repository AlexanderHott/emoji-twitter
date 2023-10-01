import { relations, sql } from "drizzle-orm";
import {
  datetime,
  index,
  int,
  mysqlTable,
  primaryKey,
  unique,
  varchar,
} from "drizzle-orm/mysql-core";

export const post = mysqlTable("Post", {
  id: varchar("id", { length: 191 }).primaryKey().notNull(),
  createdAt: datetime("createdAt", { fsp: 3 }).default(
    sql`CURRENT_TIMESTAMP(3)`,
  )
    .notNull(),
  content: varchar("content", { length: 255 }).notNull(),
  authorId: varchar("authorId", { length: 191 }).notNull(),
  likes: int("likes").default(0).notNull(),
  originalAuthorId: varchar("originalAuthorId", { length: 191 }),
  originalPostId: varchar("originalPostId", { length: 191 }),
  repostCount: int("repostCount").notNull().default(0),
}, (t) => ({
  idx: index("Post_authorId_idx").on(t.authorId),
}));

export const postRelations = relations(post, ({ many }) => (
  { likes: many(like), bites: many(bite) }
));
//
export const like = mysqlTable("UserLikes", {
  createdAt: datetime("createdAt", { fsp: 3 }).default(
    sql`CURRENT_TIMESTAMP(3)`,
  )
    .notNull(),
  userId: varchar("userId", { length: 191 }).notNull(),
  postId: varchar("postId", { length: 191 }).notNull(),
}, (t) => ({
  uniq: unique("UserLikes_userId_postId_key").on(t.postId, t.userId),
  pk: primaryKey(t.postId, t.userId),
  postIdIdx: index("UserLikes_postId_idx").on(t.postId),
}));

export const likeRelations = relations(like, ({ one }) => ({
  userLike: one(post, {
    fields: [like.postId],
    references: [post.id],
  }),
}));

export const bite = mysqlTable("UserBites", {
  createdAt: datetime("createdAt", { fsp: 3 }).default(
    sql`CURRENT_TIMESTAMP(3)`,
  )
    .notNull(),
  userId: varchar("userId", { length: 191 }).notNull(),
  postId: varchar("postId", { length: 191 }).notNull(),
}, (t) => ({
  uniq: unique("UserBites_userId_postId_key").on(t.postId, t.userId),
  pk: primaryKey(t.userId, t.postId),
  postIdIdx: index("UserBites_postId_idx").on(t.postId),
}));

export const biteRelations = relations(bite, ({ one }) => ({
  userBite: one(post, {
    fields: [bite.postId],
    references: [post.id],
  }),
}));

export const follow = mysqlTable("UserFollows", {
  createdAt: datetime("createdAt", { fsp: 3 }).default(
    sql`CURRENT_TIMESTAMP(3)`,
  )
    .notNull(),
  followingId: varchar("leaderId", { length: 191 }).notNull(),
  followerId: varchar("followerId", { length: 191 }).notNull(),
}, (t) => ({
  uniq: unique("UserFollows_leaderId_followerId_key").on(
    t.followingId,
    t.followerId,
  ),
  pk: primaryKey(t.followingId, t.followerId),
  leaderIdIdx: index("UserFollows_leaderId_idx").on(t.followingId),
  followerIdIdx: index("UserFollows_followerId_idx").on(t.followerId),
}));
