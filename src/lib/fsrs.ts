import { generatorParameters, fsrs } from "ts-fsrs";

export const params = generatorParameters({ enable_fuzz: true });
export const f = fsrs(params);
