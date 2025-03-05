import { z } from "zod";

export const formSchema = z.object({
    id: z.number(),
    user_id: z.number(),
    name: z.string(),
    country: z.string().min(2),
    website: z.string().min(2),
    phone: z.string().min(6),
    nit: z.string().min(6),
    profile_image: z.string(),
    description: z.string().nullable()
})















