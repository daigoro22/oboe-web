import { SignIn } from "@/features/auth/routes/client/signIn";
import { SignUp, signUpLoader } from "@/features/auth/routes/client/signUp";
import { SessionProvider } from "@hono/auth-js/react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

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
]);

const App = () => {
  return (
    <SessionProvider>
      <RouterProvider router={router} />
    </SessionProvider>
  );
};

const domNode = document.getElementById("root");
if (domNode) {
  const root = createRoot(domNode);
  root.render(<App />);
}
