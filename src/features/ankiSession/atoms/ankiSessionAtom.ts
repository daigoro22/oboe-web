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
    const json = await data.json();
    if (!data.ok) {
      throw new Error(isErrorResponse(json) ? json.error : "エラー");
    }
    return json;
  },
  enabled: !!get(idAtom).length && get(apiCallAllowedAtom),
  retry: false,
}));

export const getSessionAtom = atomWithQuery((get) => ({
  queryKey: ["getSession", get(idAtom)],
  queryFn: async () => {
    const data = await client.api.auth.verified.ankiSession[":id"].$get({
      param: { id: get(idAtom) },
    });
    const json = await data.json();
    if (!data.ok) {
      throw new Error(isErrorResponse(json) ? json.error : "エラー");
    }
    return json;
  },
}));

export const idAtom = atom("");
export const apiCallAllowedAtom = atom(false);

export const targetCardNumAtom = atom(0);
type GradeInput = {
  grade: Rating;
  cardPublicId: string;
}[];

export const gradeAtomPrimitive = atom<GradeInput>([]);
export const gradeAtom = atom(
  (get) => get(gradeAtomPrimitive),
  (get, set, newRating: GradeInput[number]) =>
    set(
      gradeAtomPrimitive,
      get(gradeAtomPrimitive).map((item) =>
        item.cardPublicId === newRating.cardPublicId
          ? { ...item, grade: newRating.grade }
          : item,
      ),
    ),
);
