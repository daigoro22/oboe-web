import apiGenerator from "./generators/api/index.js";
import componentGenerator from "./generators/component/index.js";

/**
 *
 * @param {import('plop').NodePlopAPI} plop
 */
export default function (plop) {
	plop.setGenerator("component", componentGenerator);
	plop.setGenerator("api", apiGenerator);
}
