# Emoji Twitter

## Roadmap

- [x] likes / dislikes / unlike / undislike
- [c] repost
- [ ] reply
- [ ] profile banner
- [ ] bite (no un-bite)


```sql
SELECT 
    false as repost,
    id, 
    createdAt,
    content,
    authorId,
    likes,
    UserLikes.count_userLikes
FROM Post 
LEFT JOIN (
    SELECT 
        postId, 
        COUNT(*) AS count_userLikes 
    FROM UserLikes 
    WHERE 1=1 
    GROUP BY postId
) AS UserLikes 
ON (
   Post.id = UserLikes.postId
)
WHERE Post.authorId = 'user_2NQN036YRDdASJbRCOqAX7rMZf6' 
UNION ALL
SELECT 
    true as repost,
    p.id,
    r.createdAt, 
    p.content, 
    p.authorId, 
    p.likes,
    UserLikes.count_userLikes
FROM Post p 
JOIN Repost r on (
    p.id = r.PostId AND r.userId = 'user_2NQN036YRDdASJbRCOqAX7rMZf6' 
) 
LEFT JOIN (
    SELECT 
        postId, 
        COUNT(*) AS count_userLikes 
    FROM UserLikes 
    WHERE 1=1 
    GROUP BY postId
) AS UserLikes 
ON (
   p.id = UserLikes.postId
)
WHERE p.authorId = 'user_2NQN036YRDdASJbRCOqAX7rMZf6' 

ORDER BY createdAt DESC;
```

```sql
SELECT 
    `id`, 
    `createdAt`,
    `content`,
    `authorId`,
    `likes`,
    `UserLikes`.`count_userLikes`
FROM `Post` 
LEFT JOIN (
    SELECT 
        `postId`, 
        COUNT(*) AS `count_userLikes` 
    FROM `UserLikes` 
    WHERE 1=1 
    GROUP BY `postId`
) AS `UserLikes` 
ON (
   `Post`.`id` = `UserLikes`.`postId`
)
WHERE `Post`.`authorId` = 'user_2NQN036YRDdASJbRCOqAX7rMZf6' 
ORDER BY `Post`.`createdAt` DESC;
```

```sql
SELECT (
    `emoji-twitter`.`Post`.`id`, 
    `emoji-twitter`.`Post`.`createdAt`, 
    `emoji-twitter`.`Post`.`content`, 
    `emoji-twitter`.`Post`.`authorId`, 
    `emoji-twitter`.`Post`.`likes`, 
    `count_userLikes`.`userLikes`
)
FROM `emoji-twitter`.`Post`
LEFT JOIN (
    SELECT ( 
        `emoji-twitter`.`UserLikes`.`postId`, 
        COUNT(*) AS `userLikes` 
    )
    FROM `emoji-twitter`.`UserLikes` 
    WHERE 1=1 
    GROUP BY `emoji-twitter`.`UserLikes`.`postId`
) AS `count_userLikes` 
ON (`emoji-twitter`.`Post`.`id` = `count_userLikes`.`postId`) 
WHERE `emoji-twitter`.`Post`.`authorId` = 'user_2NQN036YRDdASJbRCOqAX7rMZf6' (
    `emoji-twitter`.`Post`.`id`, 
    `emoji-twitter`.`Post`.`createdAt`, 
    `emoji-twitter`.`Post`.`content`, 
    `emoji-twitter`.`Post`.`authorId`, 
    `emoji-twitter`.`Post`.`likes`, 
    `count_userLikes`.`userLikes` 
)
FROM `emoji-twitter`.`Post`
LEFT JOIN (
    SELECT 
        `emoji-twitter`.`UserLikes`.`postId`, 
        COUNT(*) AS `userLikes` 
    FROM `emoji-twitter`.`UserLikes` 
    WHERE 1=1 
    GROUP BY `emoji-twitter`.`UserLikes`.`postId`
) AS `count_userLikes` 
ON (`emoji-twitter`.`Post`.`id` = `count_userLikes`.`postId`) 
WHERE `emoji-twitter`.`Post`.`authorId` = 'user_2NQN036YRDdASJbRCOqAX7rMZf6' 
ORDER BY `emoji-twitter`.`Post`.`createdAt` DESC;
```


beep boop beep boop alex cant tie upside down that sounds kind of like a skill issue. the pits are clean and part is around and doing things and rhea is signing a flag and alex is presumably reading this upside downb and parth is watching me type thinking that i am an epic typer and i can definitely feel the impact of the long nails on my typing speed this is honestly a burden but they are sparkly. i miss aimee. sid and the drive team are hard at work. gordon is slaying on the field. parth and rhea are talking about something. this is actually a warriorblog brought by yours truly (not alex ott) i am actually a huge contributor to emoji twitter so alex should give me some credit. rhea is on her phone doing somthing. i am actually taking back the thing i ai about the nails because i have realized the difficulty in typing actully came from the awkward position i was in earlier. anyways, now alex and rhea are both on their phones like screenagers. i miss parth (parth is no longer behind me) rhea has put her phone down and she said that she was thinking about cs students anbd their nails. now josh is here and he is also presumably watching me type. rhea is leaving. :( she is coming back though :) she said she is going to check on her golden envelope (that she got from being dean's list (she is very cool)) do you know who i miss? sanjana and esha. i wish they were here in houston with us; this is the first time that i have been to a competition without sanjana and the first worlds without sanjana and esha. alex is still on his phone. i dont know what josh is doing but he opened a drawer. now he is watching me type again. alex is saying that "this is a lot of writing" but like. gordon is here for wagos, alex pulled them from his pocket and gave it to gordon and gordon was surprised that alex (parth came back!!! YIPPEEEEE) had them in his pocket. part is opening drawers too. i wonder what the field is like right now. parth asked about the wagos but alex said that he already gave them to michael (technically true) now allison is here too and parth is next to me too this is so crazy. the pit is a lot cleaner now and there is table space (yippee!!!) i dont know what to say now, not a lot is going on. parth left :( alex is watching a rocket explode allison and josh are talking and rhea is not back :( very sad. i am hungry already even though i ate breakfat and it's 9:49AM. alex's laptop says it's 7:49AM so i have a sneaking suspicion that this computer does not connect to the internet or something or maybe a(YIPPEEEEEE RHEA IS BACK)lex just was too lazy to connect it to wifi for now. gordon is back :) ok he left again after collecting some parts :( allison gave me a bracelet :) 
