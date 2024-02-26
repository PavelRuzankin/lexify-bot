import { BotContext } from "../types"
import { ScenarioKind } from "./config"
import ScenarioStore from "./scenario-store"

export interface Scenario {
  start: (context: BotContext) => Promise<void> | void
  voice: (voice: string, context: BotContext) => Promise<void> | void
  action: (action: string, context: BotContext) => Promise<void> | void
  message: (message: string, context: BotContext ) => Promise<void> | void
}

export type ScenarioConfig = {
  kind: ScenarioKind,
  creator: (userId: string, store: ScenarioStore) => Scenario
}