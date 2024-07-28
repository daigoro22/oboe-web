import { CardLayout } from "@/components/elements/CardLayout";
import { Grid } from "@/components/elements/Grid";
import { GridContainer } from "@/components/elements/GridContainer";
import { PurchaseList } from "@/features/purchase/components/PurchaseList";
import React from "react";

export const Purchase = () => {
  return (
    <Grid>
      <GridContainer>
        <CardLayout title="ポイント購入">
          <PurchaseList />
        </CardLayout>
      </GridContainer>
    </Grid>
  );
};
