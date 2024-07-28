import { Toaster } from "@/components/ui/toaster";
import { AnkiSession } from "@/features/ankiSession/routes/client/ankiSession";
import { SignIn } from "@/features/auth/routes/client/signIn";
import { SignUp, signUpLoader } from "@/features/auth/routes/client/signUp";
import Index from "@/features/misc/routes/client";
import { authConfigManager, SessionProvider } from "@hono/auth-js/react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Purchase } from "@/features/purchase/routes/client/purchase";
import { purchaseLoader } from "@/features/purchase/components/PurchaseList";
import {
  CheckOut,
  checkoutLoader,
} from "@/features/purchase/routes/client/checkout";

authConfigManager.setConfig({
  basePath: "/api/oauth",
});

const router = createBrowserRouter([
  {
    path: "/signin",
    element: <SignIn />,
  },
  {
    path: "/register",
    element: <SignIn register />,
  },
  {
    path: "/signup",
    element: <SignUp />,
    loader: signUpLoader,
  },
  { path: "/purchase", element: <Purchase />, loader: purchaseLoader },
  {
    path: "/purchase/checkout/:sessionId",
    element: <CheckOut />,
    loader: checkoutLoader,
  },
  { path: "/", element: <Index /> },
  { path: "/anki-sessions/:id", element: <AnkiSession /> },
]);

const queryClient = new QueryClient();

const App = () => {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <Toaster />
        <RouterProvider router={router} />
      </QueryClientProvider>
    </SessionProvider>
  );
};

const domNode = document.getElementById("root");
if (domNode) {
  const root = createRoot(domNode);
  root.render(<App />);
}
