import type { objectives, occupations } from "@/db/schema";

import { inject, injectable } from "tsyringe";

export interface IFormOptions {
	getOccupations: () => Promise<(typeof occupations.$inferSelect)[]>;
	getObjectives: () => Promise<(typeof objectives.$inferSelect)[]>;
}

@injectable()
export default class FormOptionsService {
	constructor(@inject("IFormOptions") private formOptions: IFormOptions) {}

	async getOptions() {
		const occupations = await this.formOptions.getOccupations();
		const objectives = await this.formOptions.getObjectives();
		return { occupations, objectives };
	}
}
