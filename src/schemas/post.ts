import { z } from "zod"

export const postSchema = z.object({
    content: z
        .string()
        .emoji({ message: "Post must only contain emojis" })
        .min(1)
        .max(280),
})
