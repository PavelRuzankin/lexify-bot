import { SCENARIO_CONFIGS } from "./config";
import { getSetup } from "./setup";
export { Scenario } from "./types";

export const setupScenarios = getSetup(SCENARIO_CONFIGS)