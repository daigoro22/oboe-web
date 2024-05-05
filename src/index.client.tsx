import { SignIn } from "@/features/auth/routes/client/signIn";
import { SignUp } from "@/features/auth/routes/client/signUp";
import { SessionProvider } from "@hono/auth-js/react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const App = () => {
	return (
		<SessionProvider>
			<BrowserRouter>
				<Routes>
					<Route path="/signin" element={<SignIn />} />
					<Route path="/register" element={<SignIn register />} />
					<Route path="/signup" element={<SignUp />} />
				</Routes>
			</BrowserRouter>
		</SessionProvider>
	);
};

const domNode = document.getElementById("root");
if (domNode) {
	const root = createRoot(domNode);
	root.render(<App />);
}
