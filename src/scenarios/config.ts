import CreateDictionaryScenario from "./create-dictionary-scenario";
import LearnScenario from "./learn-scenario";
import { ScenarioConfig } from "./types";

export enum ScenarioKind {
  CREATE_DICTIONAY = 'create',
  LEARN = 'learn',
  EXIT = 'exit',
  RESTART = 'restart'
}

export const AVAILABLE_COMMANDS: Record<ScenarioKind, string> = {
  [ScenarioKind.CREATE_DICTIONAY]: `Создане словаря`,
  [ScenarioKind.LEARN]: `Изучение словаря, чтение и прослушвание примеров использования слов`,
  [ScenarioKind.EXIT]: `Завершить текущий сценарий`,
  [ScenarioKind.RESTART]: `Запустить текущий сценарий заново`,
}

export const SCENARIO_CONFIGS: ScenarioConfig[] = [
  {
    kind: ScenarioKind.CREATE_DICTIONAY,
    creator: (userId, store) => new CreateDictionaryScenario(userId, store),
  },
  {
    kind: ScenarioKind.LEARN,
    creator: (userId, store) => new LearnScenario(userId, store),
  }
]