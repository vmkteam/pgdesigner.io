import { z, defineCollection } from 'astro:content';

const imageSchema = z.object({ src: z.string(), alt: z.string() });

const blogCollection = defineCollection({
  schema: z.object({
    draft: z.boolean(),
    title: z.string(),
    snippet: z.string(),
    image: imageSchema,
    thumb: imageSchema.optional(),
    thumbLight: imageSchema.optional(),
    publishDate: z.string().transform(str => new Date(str)),
    author: z.string().default('vmkteam'),
    category: z.string(),
    tags: z.array(z.string()),
  }),
});

export const collections = {
  'blog': blogCollection,
};
