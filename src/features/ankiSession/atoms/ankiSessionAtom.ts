import { atom } from "jotai";
import type { Rating } from "ts-fsrs";
import type { AnkiSessionRoute } from "@/features/ankiSession/routes/server/ankiSession/ankiSession.controller";
import { atomWithQuery } from "jotai-tanstack-query";
import { hc } from "hono/client";

const client = hc<AnkiSessionRoute>("/");

export const isErrorResponse = (
  response: unknown,
): response is { error: string } => {
  if (
    typeof response === "object" &&
    response !== null &&
    "error" in response
  ) {
    return true;
  }
  return false;
};

export const resumeSessionAtom = atomWithQuery((get) => ({
  queryKey: ["resumeAnkiSession", get(idAtom)],
  queryFn: async () => {
    const data = await client.api.auth.verified.ankiSession.resume[":id"].$post(
      {
        param: { id: get(idAtom) },
      },
    );
    return await data.json();
  },
}));

export const idAtom = atom("");

export const targetCardNumAtom = atom(0);
type RatingInput = {
  rating: Rating;
  cardPublicId: string;
}[];

export const ratingAtomPrimitive = atom<RatingInput>([]);
export const ratingAtom = atom(
  (get) => get(ratingAtomPrimitive),
  (get, set, newRating: RatingInput[number]) =>
    set(
      ratingAtomPrimitive,
      get(ratingAtomPrimitive).map((item) =>
        item.cardPublicId === newRating.cardPublicId
          ? { ...item, rating: newRating.rating }
          : item,
      ),
    ),
);
