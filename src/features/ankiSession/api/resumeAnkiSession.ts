import type { AnkiSessionRoute } from "@/features/ankiSession/routes/server/ankiSession/ankiSession.controller";
import { useMutation } from "@tanstack/react-query";
import { hc } from "hono/client";

const client = hc<AnkiSessionRoute>("/");

export const useResumeSession = (
  id: string,
  onSuccess: Parameters<
    typeof useMutation<
      Awaited<
        ReturnType<
          (typeof client)["api"]["auth"]["verified"]["ankiSession"]["resume"][":id"]["$post"]
        >
      >
    >
  >[0]["onSuccess"],
) =>
  useMutation({
    mutationFn: async () =>
      await client.api.auth.verified.ankiSession.resume[":id"].$post({
        param: { id },
      }),
    onSuccess,
  });
