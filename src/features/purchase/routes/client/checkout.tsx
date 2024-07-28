import { CardLayout } from "@/components/elements/CardLayout";
import { Grid } from "@/components/elements/Grid";
import { GridContainer } from "@/components/elements/GridContainer";
import { type LoaderFunctionArgs, useLoaderData } from "react-router-dom";
import React from "react";
import { getSession } from "@/features/purchase/api/purchase";
import { List } from "@/components/elements/List";
import { useAtomValue } from "jotai";
import { getUsersAtom } from "@/features/misc/atoms/usersAtom";

export const checkoutLoader = async ({ params }: LoaderFunctionArgs) =>
  await getSession(String(params.sessionId));

type CheckOutLoaderResponse = Awaited<ReturnType<typeof checkoutLoader>>;

export const CheckOut = () => {
  const session = useLoaderData() as CheckOutLoaderResponse;
  const { data } = useAtomValue(getUsersAtom);

  return (
    <Grid>
      <GridContainer>
        <CardLayout title="ポイント購入完了">
          <List
            rows={[
              {
                key: "awardedPoints",
                cells: [
                  {
                    key: "pointsLabel",
                    content: "付与ポイント数",
                  },
                  {
                    key: "pointsAwarded",
                    content: `${session[0].price?.unit_amount} pt`,
                  },
                ],
              },
              {
                key: "pointBalance",
                cells: [
                  {
                    key: "pointBalanceLabel",
                    content: "ポイント残高",
                  },
                  {
                    key: "pointBalance",
                    content: `${data?.point ?? 0} pt`,
                  },
                ],
              },
            ]}
          />
        </CardLayout>
      </GridContainer>
    </Grid>
  );
};
