import { z } from "zod";

export const newSessionSchema = z.object({
  deckId: z.string().nanoid(),
});
