CREATE TABLE `UserBite` (
	`createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`userId` varchar(191) NOT NULL,
	`postId` varchar(191) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `follow` (
	`createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`followingId` varchar(191) NOT NULL,
	`followerId` varchar(191) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `UserLike` (
	`createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`userId` varchar(191) NOT NULL,
	`postId` varchar(191) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `Post` (
	`id` text NOT NULL,
	`createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`content` varchar(255) NOT NULL,
	`authorId` text NOT NULL,
	`likes` int NOT NULL DEFAULT 0,
	`originalAuthorId` varchar(191),
	`originalPostId` varchar(191),
	CONSTRAINT `Post_id` PRIMARY KEY(`id`)
);
