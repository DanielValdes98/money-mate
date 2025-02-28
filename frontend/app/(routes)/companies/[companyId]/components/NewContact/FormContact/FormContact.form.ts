import { z } from 'zod';

export const formSchema = z.object({
    name: z.string().min(2).max(60).nonempty(),
    role: z.string(),
    email: z.string(),
    phone: z.string(),
})