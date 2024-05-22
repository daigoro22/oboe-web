import { Toaster } from "@/components/ui/toaster";
import { SignIn } from "@/features/auth/routes/client/signIn";
import { SignUp, signUpLoader } from "@/features/auth/routes/client/signUp";
import Index from "@/routes";
import { authConfigManager, SessionProvider } from "@hono/auth-js/react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

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
  { path: "/", element: <Index /> },
]);

const App = () => {
  return (
    <SessionProvider>
      <Toaster />
      <RouterProvider router={router} />
    </SessionProvider>
  );
};

const domNode = document.getElementById("root");
if (domNode) {
  const root = createRoot(domNode);
  root.render(<App />);
}
