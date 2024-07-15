import { List } from "@/components/elements/List";
import {
  type AllProductsAndPricesResponse,
  getAllProductsAndPrices,
} from "@/features/purchase/api/purchase";
import * as React from "react";
import { useLoaderData } from "react-router-dom";

// biome-ignore lint/complexity/noBannedTypes: <explanation></explanation>
export type PurchaseListProps = {};

export const PurchaseLoader = async () => await getAllProductsAndPrices();

export const PurchaseList = (props: PurchaseListProps) => {
  // const allProductsAndPrices = useLoaderData() as AllProductsAndPricesResponse; //FIXME: as を使わず型付け

  // const rows = allProductsAndPrices.map(({ id: key }) => ({ key, cells: [] }));
  // console.log(rows);
  return (
    <List
      rows={[
        {
          key: "row1",
          cells: [
            { key: "cell1", content: "Cell 1" },
            { key: "cell2", content: "Cell 2" },
            { key: "cell3", content: "Cell 3" },
          ],
        },
        {
          key: "row2",
          cells: [
            { key: "cell3", content: "Cell 3" },
            { key: "cell4", content: "Cell 4" },
            { key: "cell5", content: "Cell 5" },
          ],
        },
      ]}
    />
  );
};
