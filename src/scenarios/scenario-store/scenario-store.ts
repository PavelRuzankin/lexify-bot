import { Bot } from "../../types";
import { ScenarioKind } from "../config";
import { Scenario, ScenarioConfig } from "../types";

export default class ScenarioStore {
  private readonly _scenarios = new Map<string, Scenario>()

  constructor(
    private readonly _bot: Bot,
    private readonly _configs: ScenarioConfig[]
    ) {}

  get commands(): ScenarioKind[] {
    return this._configs.map(({ kind }) => kind)
  }

  createScene(userId: string, kind: string): Scenario | null {
    const config = this._configs.find(config => config.kind === kind)
    if(!config) {
      return null
    }

    const scene = config.creator(userId, this);
    this._scenarios.set(userId, scene)
    return scene
  }

  getScene(id: string): Scenario | null {
    return this._scenarios.get(id) ?? null
  }

  removeScene(id: string): void {
    this._scenarios.delete(id)
  }
}