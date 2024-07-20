import { List } from "@/components/elements/List";
import { Button } from "@/components/ui/button";
import {
  type AllProductsAndPricesResponse,
  getAllProductsAndPrices,
} from "@/features/purchase/api/purchase";
import { Coins, JapaneseYen } from "lucide-react";
import type { ComponentProps } from "react";
import { useLoaderData } from "react-router-dom";

// biome-ignore lint/complexity/noBannedTypes: <explanation></explanation>
export type PurchaseListProps = {};
export const purchaseLoader = async () => await getAllProductsAndPrices();

export const PurchaseList = (props: PurchaseListProps) => {
  const allProductsAndPrices = useLoaderData() as AllProductsAndPricesResponse; //FIXME: as を使わず型付け

  const rows = allProductsAndPrices.reduce(
    (
      acc: ComponentProps<typeof List>["rows"],
      { product, id, unit_amount },
    ) => {
      if (typeof product !== "string" && (product.deleted || !product.name)) {
        return acc;
      }
      acc.push({
        key: id,
        cells: [
          { key: "icon", content: <Coins /> },
          {
            key: "point",
            content: typeof product === "string" ? product : product.name ?? "",
          },
          {
            key: "button",
            content: (
              <Button>
                <>
                  <JapaneseYen />
                  {unit_amount}
                </>
              </Button>
            ),
          },
        ],
      });
      return acc;
    },
    [],
  );

  return <List rows={rows} />;
};
