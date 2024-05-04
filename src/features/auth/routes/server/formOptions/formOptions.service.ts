import {
	getObjectives,
	getOccupations,
} from "@/features/auth/routes/server/formOptions/formOptions.repository";

export const getOptions = async (db: D1Database) => {
	const occupations = await getOccupations(db);
	const objectives = await getObjectives(db);
	return { occupations, objectives };
};
