import { Rating } from "ts-fsrs";
import { z } from "zod";

export const newSessionSchema = z.object({
  deckId: z.string().nanoid(),
});

export const endSessionSchema = z.object({
  deckPublicId: z.string().nanoid(),
  cards: z.array(
    z.object({
      cardPublicId: z.string().nanoid(),
      grade: z.nativeEnum(Rating).refine((value) => value !== Rating.Manual),
    }),
  ),
});
