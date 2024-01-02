import postData from "./posts.json";
import userData from "./parsed-users.json";
import likesData from "./likes.json";
import bitesData from "./bites.json";
import followData from "./follows.json";

export const LIKES = likesData;
export const BITES = bitesData;
const FOLLOWS = followData;

export const USERS = userData.map((u) => ({
  ...u,
  following: FOLLOWS.filter((f) => f.followerId === u.id).length,
  followers: FOLLOWS.filter((f) => f.leaderId === u.id).length,
}));
export const USER_MAP = new Map(USERS.map((u) => [u.id, u]));

export type User = (typeof USERS)[number];
export const POSTS = [...postData].reverse().map((p) => ({
  ...p,
  likes: LIKES.filter((l) => l.postId === p.id).length,
  bites: BITES.filter((b) => b.postId === p.id).length,
  reposts: postData.filter((rp) => rp.originalPostId === p.id).length,
  author: USER_MAP.get(p.authorId) as User,
  originalAuthor: USER_MAP.get(p.originalAuthorId ?? ""),
}));
export const POST_MAP = new Map(POSTS.map((p) => [p.id, p]));

export type Post = (typeof POSTS)[number];
