import fs from "node:fs";
import path from "node:path";

const featuresDir = path.join(process.cwd(), "src/features");
const features = fs.readdirSync(featuresDir);

/**
 *
 * @type {import('plop').PlopGenerator}
 */
const apiGenerator = {
	description: "API Generator",
	prompts: [
		{
			type: "input",
			name: "name",
			message: "api name",
		},
		{
			type: "list",
			name: "feature",
			message: "Which feature does this api belong to?",
			choices: ["ROOT", ...features],
			when: () => features.length > 0,
		},
	],
	actions: (answers) => {
		const apiGeneratePath = "src/features/{{feature}}/routes/server/{{name}}";
		return [
			{
				type: "add",
				path: `${apiGeneratePath}/{{name}}.controller.ts`,
				templateFile: "generators/api/controller.ts.hbs",
			},
			{
				type: "add",
				path: `${apiGeneratePath}/{{name}}.controller.test.ts`,
				templateFile: "generators/api/controller.test.ts.hbs",
			},
			{
				type: "add",
				path: `${apiGeneratePath}/{{name}}.repository.ts`,
				templateFile: "generators/api/repository.ts.hbs",
			},
			{
				type: "add",
				path: `${apiGeneratePath}/{{name}}.repository.test.ts`,
				templateFile: "generators/api/repository.test.ts.hbs",
			},
			{
				type: "add",
				path: `${apiGeneratePath}/{{name}}.service.ts`,
				templateFile: "generators/api/service.ts.hbs",
			},
			{
				type: "add",
				path: `${apiGeneratePath}/{{name}}.service.test.ts`,
				templateFile: "generators/api/service.test.ts.hbs",
			},
		];
	},
	runPrompts: (bypassArr) => {
		throw new Error("Function not implemented.");
	},
	runActions: (answers, hooks) => {
		throw new Error("Function not implemented.");
	},
};

export default apiGenerator;
