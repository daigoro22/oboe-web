import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { checkout } from "@/features/purchase/api/purchase";
import { isErrorResponse } from "@/features/ankiSession/atoms/ankiSessionAtom";

export type PurchaseModalProps = {
  triggerButton: React.ReactNode;
  priceId: string;
};

export const PurchaseModal = ({
  triggerButton,
  priceId,
}: PurchaseModalProps) => {
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

  const fetchClientSecret = React.useCallback(async () => {
    const data = await checkout(priceId);
    if (!isErrorResponse(data)) {
      return data.client_secret ?? "";
    }
    return "";
  }, [priceId]);

  return (
    <Dialog>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="p-0">
        <EmbeddedCheckoutProvider
          stripe={stripePromise}
          options={{ fetchClientSecret }}
        >
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      </DialogContent>
    </Dialog>
  );
};
