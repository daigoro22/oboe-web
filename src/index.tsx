import { Hono } from "hono";
import { Button } from "./components/ui/button";
import { renderer } from "./renderer";
const app = new Hono();

app.use(renderer);

app.get("/", (c) => {
	return c.render(
		<div>
			<Button>aaa</Button>
			<h1>Hello!</h1>
		</div>,
	);
});

export default app;
